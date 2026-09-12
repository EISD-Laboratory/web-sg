#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildExpected } from "./build-expected.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const E2E_BASE = path.resolve(__dirname, "..");
const ROOT = path.resolve(E2E_BASE, "..");
const TEMPLATE = path.join(E2E_BASE, "check-drive-links.template.js");
const BUILD_DIR = path.join(E2E_BASE, "build");
const BUNDLED = path.join(BUILD_DIR, "check-drive-links.js");
const OUTFILE = path.join(BUILD_DIR, "drive-check.json");

const SESSION = process.env.E2E_SESSION || "e2e-drive";
const DELAY_MS = parseInt(process.env.E2E_DELAY_MS || "1500", 10);
const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1], 10) : 0;
const nimFilterArg = args.find((a) => a.startsWith("--nim="));
const NIM_FILTER = nimFilterArg ? nimFilterArg.split("=")[1].split(",").map((s) => s.trim()).filter(Boolean) : [];

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const cli = process.platform === "win32" ? "npx.cmd" : "npx";

function run(command, argsArr, capture = false) {
  return new Promise((resolve) => {
    const child = spawn(command, argsArr, {
      cwd: ROOT,
      stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
      env: process.env,
    });
    let out = "";
    if (capture) child.stdout.on("data", (d) => (out += d));
    child.on("close", (code) => resolve({ code, out }));
  });
}

async function main() {
  let data = buildExpected();
  if (NIM_FILTER.length) {
    data = data.filter((s) => NIM_FILTER.includes(s.nim));
    if (!data.length) {
      console.error(`${RED}no students match --nim filter${RESET}`);
      process.exit(1);
    }
  }
  if (LIMIT > 0) data = data.slice(0, LIMIT);
  const totalLinks = data.reduce((n, s) => n + s.certificates.length, 0);
  console.log(`[e2e:drive] checking ${data.length} students / ${totalLinks} links (delay ${DELAY_MS}ms)`);

  const template = fs.readFileSync(TEMPLATE, "utf8");
  if (!template.includes("__CERT_DATA__") || !template.includes("__DELAY_MS__")) {
    console.error(`${RED}template missing __CERT_DATA__ or __DELAY_MS__ placeholder${RESET}`);
    process.exit(1);
  }
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  const code = template
    .replace("__CERT_DATA__", JSON.stringify(data))
    .replace("__DELAY_MS__", String(DELAY_MS))
    .trim()
    .replace(/;$/, "");
  fs.writeFileSync(BUNDLED, code);

  await run(cli, ["playwright-cli", "-s=" + SESSION, "open", "about:blank"]);
  const res = await run(cli, ["playwright-cli", "-s=" + SESSION, "run-code", "--filename=" + BUNDLED], true);
  await run(cli, ["playwright-cli", "-s=" + SESSION, "close"]);

  const rawLine = (res.out.match(/^"(SUMMARY[\s\S]*)"$/m) || [])[1];
  if (!rawLine) {
    console.error(YELLOW + (res.out.match(/### Result\s+([\s\S]*)/)?.[1]?.trim() || res.out.slice(-2000)) + RESET);
    console.error(`${RED}[e2e:drive] no result returned — run-code may have failed (see output above)${RESET}`);
    process.exit(1);
  }

  const summaryText = JSON.parse('"' + rawLine + '"');
  const totals = summaryText.match(/total=(\d+) pass=(\d+) failAccess=(\d+) failOwner=(\d+) needsManual=(\d+)/);
  const detailsMatch = summaryText.match(/DETAILS=(\[.*\]) FAILURES=/);
  const failuresMatch = summaryText.match(/FAILURES=(\[.*\])$/);
  const details = detailsMatch ? JSON.parse(detailsMatch[1]) : [];
  const failures = failuresMatch ? JSON.parse(failuresMatch[1]) : [];

  fs.writeFileSync(OUTFILE, JSON.stringify({ summary: summaryText.split(" DETAILS=")[0], details }, null, 2));
  console.log(`[e2e:drive] wrote ${path.relative(ROOT, OUTFILE)}`);

  const total = parseInt(totals?.[1] || "0", 10);
  const pass = parseInt(totals?.[2] || "0", 10);
  const failAccess = parseInt(totals?.[3] || "0", 10);
  const failOwner = parseInt(totals?.[4] || "0", 10);
  const needsManual = parseInt(totals?.[5] || "0", 10);

  const ok = failAccess === 0 && failOwner === 0;
  console.log(`\n[${ok ? GREEN + "PASS" : RED + "FAIL"}${RESET}] drive link check: ${pass}/${total} pass`);
  console.log(`  accessible failures : ${failAccess ? RED + failAccess + RESET : GREEN + "0" + RESET}`);
  console.log(`  ownership failures  : ${failOwner ? RED + failOwner + RESET : GREEN + "0" + RESET}`);
  console.log(`  needs-manual (bot)  : ${YELLOW}${needsManual}${RESET}`);
  if (failures.length) {
    console.log(`${RED}  failures:${RESET}`);
    for (const f of failures.slice(0, 30)) {
      console.log(`    ${f.nim} [${f.status}] ${f.title} — ${(f.note || "").slice(0, 140)}`);
    }
    if (failures.length > 30) console.log(`    ... +${failures.length - 30} more (see drive-check.json)`);
  }
  const manuals = details.filter((d) => d.status === "needs-manual").slice(0, 10);
  for (const m of manuals) {
    console.log(`  ${YELLOW}● needs-manual${RESET} ${m.nim} ${m.title}`);
  }

  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
