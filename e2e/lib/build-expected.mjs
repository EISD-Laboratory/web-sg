import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const E2E_BASE = path.resolve(__dirname, "..");
const ROOT = path.resolve(E2E_BASE, "..");
const DATA_FILE = path.join(ROOT, "src/data/certificates/index.ts");
const BUILD_DIR = path.join(E2E_BASE, "build");
const EXPECTED_FILE = path.join(BUILD_DIR, "expected.json");

/**
 * Converts src/data/certificates/index.ts into a plain JSON array.
 * Keeps the certificates file as the single source of truth — the committed
 * e2e test never duplicates student data by hand.
 */
export function buildExpected() {
  const source = fs.readFileSync(DATA_FILE, "utf8");

  const js = source
    .replace(/^export\s*\{\s*type\s+[^}]*\}\s*from\s*"[^"]*";\s*$/gm, "")
    .replace(/^import\s*\{[^}]*\}\s*from\s*"[^"]*";\s*$/gm, "")
    .replace(/^export\s+const\s+CERTIFICATES/m, "const CERTIFICATES");

  if (/from\s+"\.\/types"/.test(js)) {
    throw new Error(`build-expected: could not strip type-only imports from ${DATA_FILE}`);
  }

  const result = ts.transpileModule(js, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      isolatedModules: true,
    },
    reportDiagnostics: true,
  });

  if (result.diagnostics && result.diagnostics.length) {
    const diag = result.diagnostics
      .map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n"))
      .join("\n");
    throw new Error(`build-expected: transpile failed\n${diag}`);
  }

  const loader = new Function(
    "module",
    "exports",
    `${result.outputText}\nmodule.exports.CERTIFICATES = CERTIFICATES;`,
  );
  const mod = { exports: {} };
  loader(mod, mod.exports);

  const data = mod.exports.CERTIFICATES;
  if (!Array.isArray(data)) {
    throw new Error("build-expected: CERTIFICATES is not an array");
  }
  for (const stu of data) {
    if (!stu || typeof stu.nim !== "string" || typeof stu.name !== "string" ||
        typeof stu.division !== "string" || typeof stu.team_name !== "string" ||
        !Array.isArray(stu.certificates)) {
      throw new Error(`build-expected: malformed student record ${JSON.stringify(stu)?.slice(0, 80)}`);
    }
  }

  fs.mkdirSync(BUILD_DIR, { recursive: true });
  fs.writeFileSync(EXPECTED_FILE, JSON.stringify(data, null, 2));
  return data;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = buildExpected();
  console.log(`build-expected: wrote ${path.relative(ROOT, EXPECTED_FILE)} (${data.length} students)`);
}