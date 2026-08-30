#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildExpected } from "./build-expected.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const E2E_BASE = path.resolve(__dirname, "..");
const ROOT = path.resolve(E2E_BASE, "..");
const TEMPLATE = path.join(E2E_BASE, "check-certificates.template.js");
const BUILD_DIR = path.join(E2E_BASE, "build");
const BUNDLED = path.join(BUILD_DIR, "check-certificates.js");

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:3000";
const SESSION = process.env.E2E_SESSION || "e2e";
const args = process.argv.slice(2);
const autoStart = args.includes("--start");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const cli = process.platform === "win32" ? "npx.cmd" : "npx";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function serverUp() {
  try {
    const res = await fetch(BASE_URL + "/", { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}

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

async function startServer() {
  console.log(`[e2e] Building production bundle ...`);
  const build = spawnSync("npm", ["run", "build"], { cwd: ROOT, stdio: "inherit", env: process.env });
  if (build.status !== 0) {
    console.error(`${RED}build failed — aborting${RESET}`);
    process.exit(1);
  }
  console.log(`[e2e] Starting server at ${BASE_URL} ...`);
  const child = spawn("npm", ["run", "start"], { cwd: ROOT, stdio: "inherit", env: process.env, detached: true });
  for (let i = 0; i < 60; i++) {
    if (await serverUp()) return child;
    await sleep(500);
  }
  child.kill("SIGTERM");
  console.error(`${RED}server did not become ready${RESET}`);
  process.exit(1);
}

async function main() {
  let serverChild = null;
  try {
    if (!(await serverUp())) {
      if (autoStart) {
        serverChild = await startServer();
      } else {
        console.error(`${RED}No server at ${BASE_URL}${RESET}`);
        console.error(`  start one first:  ${YELLOW}npm run build && npm start${RESET}`);
        console.error(`  or auto-start:    ${YELLOW}npm run e2e:check -- --start${RESET}`);
        process.exit(1);
      }
    }

    const data = buildExpected();
    console.log(`[e2e] derived ${data.length} students from src/data/certificates/index.ts`);

  const template = fs.readFileSync(TEMPLATE, "utf8");
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  const code = template.replace("__CERT_DATA__", JSON.stringify(data)).trim().replace(/;$/, "");
  fs.writeFileSync(BUNDLED, code);

  await run(cli, ["playwright-cli", "-s=" + SESSION, "open", BASE_URL]);
  const res = await run(cli, ["playwright-cli", "-s=" + SESSION, "run-code", "--filename=" + BUNDLED], true);
  await run(cli, ["playwright-cli", "-s=" + SESSION, "close"]);

  const rawLine = (res.out.match(/^"(SUMMARY[\s\S]*)"$/m) || [])[1];
  if (!rawLine) {
    console.error(YELLOW + (res.out.match(/### Result\s+([\s\S]*)/)?.[1]?.trim() || res.out.slice(-2000)) + RESET);
    console.error(`${RED}[e2e] no result returned — run-code may have failed (see output above)${RESET}`);
    process.exit(1);
  }

  const summaryText = JSON.parse('"' + rawLine + '"');
  const totals = summaryText.match(/total=(\d+) passed=(\d+) failed=(\d+)/);
  const edgeMatch = summaryText.match(/edge=(\[.*\]) FAILURES=/);
  const failuresMatch = summaryText.match(/FAILURES=(\[.*\]|null)$/);

  const total = parseInt(totals?.[1] || "0", 10);
  const passed = parseInt(totals?.[2] || "0", 10);
  const failedEdges = edgeMatch ? JSON.parse(edgeMatch[1]).filter((e) => !e.ok) : [];
  const failures = failuresMatch && failuresMatch[1] !== "null" ? JSON.parse(failuresMatch[1]) : [];

  const ok = failures.length === 0 && failedEdges.length === 0;
  console.log(`\n[${ok ? GREEN + "PASS" : RED + "FAIL"}${RESET}] e2e certificate check for ${total} students`);
  console.log(`  students        ${ok ? GREEN : RED}${passed}/${total} passed${RESET}`);
  if (failures.length) {
    console.log(`${RED}  failures:${RESET}`);
    for (const f of failures) {
      console.log(`    ${f.nim}${f.fail ? " — " + f.fail : ""}${f.bad?.length ? " [bad: " + f.bad.join(", ") + "]" : ""}`);
    }
  }
  console.log(`  edge cases      ${failedEdges.length ? RED + "FAIL" : GREEN + "PASS" + RESET}`);
  for (const e of edgeMatch ? JSON.parse(edgeMatch[1]) : []) {
    console.log(`    ${e.ok ? GREEN + "●" : RED + "●"}${RESET} ${e.n}${e.ok ? "" : RED + " — " + (e.err || "") + RESET}`);
  }

  process.exit(ok ? 0 : 1);
  } finally {
    if (serverChild?.pid) {
      try {
        process.kill(-serverChild.pid, "SIGTERM");
      } catch {
        /* already gone */
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});