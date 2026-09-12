async page => {
  const CERTIFICATES = __CERT_DATA__;
  const DELAY_MS = __DELAY_MS__;
  const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const sleep = ms => page.waitForTimeout(ms);

  const BOT_RE = /consent\.google\.com|before you continue|verify you are|captcha|unusual traffic/i;
  const DENIED_RE = /request access|you need access|need access|file.*not found|folder.*not found|does not exist|has been trashed|quota exceeded|unable to access|we're sorry|access denied|not found/i;

  const details = [];

  for (const stu of CERTIFICATES) {
    const normName = norm(stu.name);
    const shortName = normName.replace(/^m\s+/, '');
    for (let i = 0; i < stu.certificates.length; i++) {
      const cert = stu.certificates[i];
      const link = cert.drive_link || '';
      const linkType = link.includes('/file/d/') ? 'file' : (link.includes('/drive/folders/') ? 'folder' : 'unknown');
      const row = { nim: stu.nim, name: stu.name, title: cert.title, linkType, link, accessible: false, ownerMatch: false, status: 'fail', titleSeen: '', note: '' };

      if (!link) {
        row.note = 'empty drive_link';
        row.status = 'fail-access';
        details.push(row);
        continue;
      }

      let attempt = 0;
      let loaded = false;
      let lastErr = '';
      while (attempt < 2 && !loaded) {
        attempt++;
        try {
          await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });
          loaded = true;
        } catch (e) {
          lastErr = String(e).split('\n')[0].slice(0, 200);
          if (attempt < 2) await sleep(2000);
        }
      }
      if (!loaded) {
        row.note = 'navigation failed: ' + lastErr;
        row.status = 'fail-access';
        details.push(row);
        await sleep(DELAY_MS);
        continue;
      }

      try {
        await sleep(1500);
        const urlAfter = page.url();
        let docTitle = '';
        try { docTitle = await page.title(); } catch (e) { docTitle = ''; }
        let bodyText = '';
        try { bodyText = await page.locator('body').innerText(); } catch (e) { bodyText = ''; }
        bodyText = (bodyText || '').slice(0, 4000);
        let ogTitle = '';
        try {
          const og = page.locator('meta[property="og:title"]');
          if (await og.count() > 0) ogTitle = await og.first().getAttribute('content') || '';
        } catch (e) { ogTitle = ''; }

        row.titleSeen = (docTitle || '').slice(0, 200);

        const combinedUrl = urlAfter + ' ' + docTitle;
        if (BOT_RE.test(combinedUrl) || BOT_RE.test(bodyText)) {
          row.note = 'bot/consent challenge at ' + urlAfter.slice(0, 120);
          row.status = 'needs-manual';
          details.push(row);
          await sleep(DELAY_MS);
          continue;
        }
        if (/accounts\.google\.com/.test(urlAfter) && DENIED_RE.test(bodyText)) {
          row.note = 'login/access wall: ' + bodyText.slice(0, 120).replace(/\s+/g, ' ');
          row.status = 'fail-access';
          details.push(row);
          await sleep(DELAY_MS);
          continue;
        }
        if (DENIED_RE.test(docTitle + ' ' + bodyText)) {
          const m = (docTitle + ' ' + bodyText).match(DENIED_RE);
          row.note = 'drive says: ' + (m ? m[0] : 'not accessible').slice(0, 160);
          row.status = 'fail-access';
          details.push(row);
          await sleep(DELAY_MS);
          continue;
        }

        row.accessible = true;

        const hay = norm(docTitle + ' ' + ogTitle + ' ' + bodyText);
        const direct = hay.includes(normName);
        const short = shortName && shortName !== normName ? hay.includes(shortName) : false;
        row.ownerMatch = direct || short;
        if (!row.ownerMatch) {
          row.note = 'name not found in drive title/body; saw: ' + (docTitle || '(no title)').slice(0, 140);
          row.status = 'fail-owner';
        } else {
          row.status = 'pass';
        }
      } catch (e) {
        row.note = 'check error: ' + String(e).split('\n')[0].slice(0, 200);
        row.status = 'fail-access';
      }
      details.push(row);
      await sleep(DELAY_MS);
    }
  }

  const total = details.length;
  const pass = details.filter(d => d.status === 'pass').length;
  const failAccess = details.filter(d => d.status === 'fail-access').length;
  const failOwner = details.filter(d => d.status === 'fail-owner').length;
  const needsManual = details.filter(d => d.status === 'needs-manual').length;
  const failures = details.filter(d => d.status === 'fail-access' || d.status === 'fail-owner');
  return 'SUMMARY total=' + total + ' pass=' + pass + ' failAccess=' + failAccess + ' failOwner=' + failOwner + ' needsManual=' + needsManual +
    ' DETAILS=' + JSON.stringify(details) +
    ' FAILURES=' + JSON.stringify(failures.map(f => ({ nim: f.nim, title: f.title, status: f.status, note: f.note })));
};
