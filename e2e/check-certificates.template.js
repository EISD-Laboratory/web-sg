async page => {
  const CERTIFICATES = __CERT_DATA__;
  const BASE = 'http://localhost:3000';
  const results = [];

  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.setItem('welcome-modal-dismissed', '1'));

  for (const stu of CERTIFICATES) {
    const row = { nim: stu.nim, checks: [], fail: null };
    try {
      await page.goto(BASE + '/#certificate', { waitUntil: 'domcontentloaded' });
      const nimInput = page.getByRole('textbox', { name: 'NIM' });
      await nimInput.waitFor({ state: 'visible', timeout: 10000 });
      await nimInput.fill(stu.nim);
      await page.getByRole('button', { name: 'Search Certificate' }).click();
      await page.waitForURL(new RegExp('announcement\\?nim=' + stu.nim + '$'), { timeout: 15000 });
      await page.getByRole('heading', { level: 1 }).waitFor({ timeout: 10000 });

      const h1 = (await page.getByRole('heading', { level: 1 }).textContent()).replace(/\s+/g, ' ').trim();
      row.checks.push({ c: 'name', ok: h1 === 'Congratulations' + stu.name + '!' });

      const params = await page.locator('main p').allTextContents();
      const nimText = params.find(p => p.includes('NIM:'));
      row.checks.push({ c: 'nim', ok: (nimText || '').trim() === 'NIM: ' + stu.nim });

      const teamText = params.find(p => p.includes('division, team'));
      const teamExpected = 'from the ' + stu.division + ' division, team ' + stu.team_name + '.';
      row.checks.push({ c: 'division/team', ok: (teamText || '').includes(teamExpected) });

      const certsSection = page.locator('p').filter({ hasText: /^Your Certificate(s)?$/ }).locator('..');
      const anchors = certsSection.locator('a');
      const count = await anchors.count();
      row.checks.push({ c: 'certificate-count', ok: count === stu.certificates.length });

      for (let i = 0; i < stu.certificates.length && i < count; i++) {
        const cert = stu.certificates[i];
        const anchor = anchors.nth(i);
        const title = (await anchor.textContent()).trim();
        const href = await anchor.getAttribute('href');
        row.checks.push({ c: 'cert#' + i, ok: title === cert.title && href === cert.notion_link });
      }
    } catch (err) {
      row.fail = String(err).split('\n')[0];
    }
    results.push(row);
  }

  const edge = [];
  try {
    await page.goto(BASE + '/announcement?nim=000000000000', { waitUntil: 'domcontentloaded' });
    const nf = (await page.getByRole('heading', { level: 1 }).textContent()).trim();
    edge.push({ n: 'announcement-not-found', ok: nf === 'Certificate Not Found' });
  } catch (e) { edge.push({ n: 'announcement-not-found', ok: false, err: String(e).split('\n')[0] }); }

  try {
    await page.goto(BASE + '/#certificate', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => sessionStorage.setItem('welcome-modal-dismissed', '1'));
    await page.getByRole('textbox', { name: 'NIM' }).fill('999999999999');
    await page.getByRole('button', { name: 'Search Certificate' }).click();
    await page.waitForTimeout(600);
    const txt = await page.locator('main').innerText();
    edge.push({ n: 'form-invalid-nim', ok: txt.includes('Certificate not found. Please double-check your NIM.') });
  } catch (e) { edge.push({ n: 'form-invalid-nim', ok: false, err: String(e).split('\n')[0] }); }

  try {
    await page.goto(BASE + '/announcement', { waitUntil: 'domcontentloaded' });
    const txt = await page.locator('main').innerText();
    edge.push({ n: 'announcement-no-nim', ok: txt.includes('No search parameters provided.') });
  } catch (e) { edge.push({ n: 'announcement-no-nim', ok: false, err: String(e).split('\n')[0] }); }

  const bad = results.filter(r => r.fail || r.checks.some(ch => !ch.ok));
  return 'SUMMARY total=' + results.length + ' passed=' + (results.length - bad.length) +
    ' failed=' + bad.length + ' edge=' + JSON.stringify(edge) +
    ' FAILURES=' + JSON.stringify(bad.map(r => ({ nim: r.nim, fail: r.fail, bad: r.checks.filter(ch => !ch.ok).map(ch => ch.c) })));
};