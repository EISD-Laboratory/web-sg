// Build-time only (Node). Never imported by client code.
//
// Reads the plaintext roster from src/data/certificates/index.ts, encrypts
// each record with a per-record key derived via PBKDF2-SHA256(NIM, salt),
// and writes public/certificate-data.json as:
//
//   { "<sha256-hex(normalized NIM)>": { salt, iv, data } }   (base64 values)
//
// Crypto contract (must match src/lib/certificateCrypto.ts):
//   - password  = UTF-8 bytes of the normalized NIM (trimmed)
//   - KDF       = PBKDF2-SHA256, ITERATIONS iterations, 16-byte random salt,
//                 32-byte key
//   - cipher    = AES-256-GCM, 12-byte random IV, no AAD
//   - plaintext = UTF-8 bytes of JSON.stringify(record)
//   - data      = base64(ciphertext || 16-byte auth tag) — the combined form
//                 WebCrypto's AES-GCM decrypt expects
//   - index key = hex(SHA-256(UTF-8(normalized NIM)))
//
// Every build regenerates fresh salts/IVs (`prebuild` hook), so the blob
// never carries stable ciphertext across deploys.

import { createCipheriv, createHash, pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Slows offline NIM-guessing attacks AND legitimate lookups linearly.
// Keep in sync with src/lib/certificateCrypto.ts.
const ITERATIONS = 100_000;
const SALT_LEN = 16;
const IV_LEN = 12;

const normalizeNim = (nim) => String(nim).trim();

function sha256Hex(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

async function loadPlaintextRoster() {
  // NOTE: we deliberately do NOT `import ... from "@/data/certificates"`.
  // Native Node ESM cannot resolve the extensionless `./types` import inside
  // index.ts, so instead we extract the plain-data array literal (valid JS)
  // and load it via a temp .mjs module. Single source of truth stays in
  // src/data/certificates/index.ts.
  const srcPath = new URL("../src/data/certificates/index.ts", import.meta.url);
  const src = readFileSync(srcPath, "utf8");

  const marker = "export const CERTIFICATES";
  const markerIdx = src.indexOf(marker);
  if (markerIdx === -1) throw new Error("CERTIFICATES export not found in source");
  const arrayStart = src.indexOf("[", markerIdx);
  const arrayEnd = src.lastIndexOf("];");
  if (arrayStart === -1 || arrayEnd === -1 || arrayEnd <= arrayStart) {
    throw new Error("Could not locate CERTIFICATES array literal");
  }
  const literal = src.slice(arrayStart, arrayEnd + 1);

  const dir = mkdtempSync(join(tmpdir(), "cert-blob-"));
  try {
    const tmpFile = join(dir, "roster.mjs");
    writeFileSync(tmpFile, `export default ${literal};\n`, "utf8");
    const mod = await import(pathToFileURL(tmpFile).href);
    return mod.default;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function encryptRecord(record, nim) {
  const salt = randomBytes(SALT_LEN);
  const iv = randomBytes(IV_LEN);
  const key = pbkdf2Sync(Buffer.from(nim, "utf8"), salt, ITERATIONS, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(record), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag(); // 16 bytes
  return {
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    data: Buffer.concat([ciphertext, tag]).toString("base64"),
  };
}

const roster = await loadPlaintextRoster();

if (!Array.isArray(roster) || roster.length === 0) {
  throw new Error("Refusing to write blob: roster is empty or invalid");
}

const out = {};
const seen = new Set();
for (const record of roster) {
  const nim = normalizeNim(record?.nim ?? "");
  if (!nim) throw new Error("Refusing to write blob: record with missing NIM");
  if (seen.has(nim)) throw new Error(`Refusing to write blob: duplicate NIM ${nim}`);
  seen.add(nim);
  out[sha256Hex(nim)] = encryptRecord(record, nim);
}

const outPath = new URL("../public/certificate-data.json", import.meta.url);
writeFileSync(outPath, JSON.stringify(out), "utf8");
console.log(`certificate-data.json: encrypted ${seen.size} records (iterations=${ITERATIONS})`);
