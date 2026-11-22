// Fails when a Tauri config is broken: invalid JSON, a key the Tauri v2 schema
// rejects, versions that drifted apart, or a file the config points at that is
// gone. Run with `pnpm check:tauri-config` (needs network and npm for the
// schema and Ajv, both fetched into a temp dir; no workspace install).
//
// Each tauri.prod-*.json is merged over tauri.conf.json with RFC 7396 JSON
// Merge Patch, which is what `tauri build -c` does, and the result is validated.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const root = new URL("../", import.meta.url).pathname;
const tauriDir = join(root, "src-tauri");
const problems = [];
const seen = new Set();
const fail = (file, message) => {
  problems.push({ file, message });
  console.log(`::error file=${file}::${message}`);
};

function readJson(file) {
  try {
    return JSON.parse(readFileSync(join(root, file), "utf8"));
  } catch (e) {
    fail(file, `invalid JSON: ${e.message}`);
    return null;
  }
}

// RFC 7396: objects merge recursively, null deletes, anything else replaces.
function mergePatch(target, patch) {
  if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
    return patch;
  }
  const out =
    target && typeof target === "object" && !Array.isArray(target)
      ? { ...target }
      : {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) delete out[key];
    else out[key] = mergePatch(out[key], value);
  }
  return out;
}

const files = readdirSync(tauriDir)
  .filter((n) => /^tauri.*\.json$/.test(n))
  .sort()
  .map((n) => `src-tauri/${n}`);
const configs = Object.fromEntries(files.map((f) => [f, readJson(f)]));
const base = configs["src-tauri/tauri.conf.json"];
const overlays = files.filter((f) => /\/tauri\.prod-/.test(f) && configs[f]);

// Schema and Ajv.
const cliVersion = readFileSync(join(root, "pnpm-lock.yaml"), "utf8").match(
  /'@tauri-apps\/cli@(\d+\.\d+\.\d+)'/,
)?.[1];
if (!cliVersion) {
  fail("pnpm-lock.yaml", "cannot find the @tauri-apps/cli version");
}

const work = mkdtempSync(join(tmpdir(), "tauri-config-"));
try {
  if (cliVersion && base) {
    const run = (cmd, args, cwd) =>
      execFileSync(cmd, args, { cwd, stdio: ["ignore", "pipe", "inherit"] });
    const schemaDir = join(work, "schema");
    const ajvDir = join(work, "ajv");
    for (const d of [schemaDir, ajvDir]) run("mkdir", ["-p", d]);
    run("npm", ["pack", `@tauri-apps/cli@${cliVersion}`, "--silent"], schemaDir);
    run("tar", ["xzf", `tauri-apps-cli-${cliVersion}.tgz`], schemaDir);
    const schema = JSON.parse(
      readFileSync(join(schemaDir, "package", "config.schema.json"), "utf8"),
    );
    run("npm", ["init", "-y", "--silent"], ajvDir);
    run("npm", ["i", "--no-save", "--silent", "ajv", "ajv-formats"], ajvDir);
    const req = createRequire(join(ajvDir, "x.js"));
    const Ajv = req("ajv").default ?? req("ajv");
    const addFormats = req("ajv-formats").default ?? req("ajv-formats");
    const ajv = new Ajv({ allErrors: true, strict: false, unicodeRegExp: false, logger: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);

    const check = (file, config) => {
      // `$schema` is an editor hint that the Tauri schema itself does not list.
      const { $schema, ...rest } = config;
      if (!validate(rest)) {
        for (const e of validate.errors) {
          const extra = e.params?.additionalProperty
            ? ` (${e.params.additionalProperty})`
            : "";
          const message = `schema: ${e.instancePath || "/"} ${e.message}${extra}`;
          // A base error repeats in every merged overlay; report it once.
          if (seen.has(message)) continue;
          seen.add(message);
          fail(file, message);
        }
      }
    };
    check("src-tauri/tauri.conf.json", base);
    for (const f of overlays) {
      check(f, mergePatch(base, configs[f]));
    }
  }
} catch (e) {
  fail("scripts/check-tauri-config.mjs", `schema validation could not run: ${e.message}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}

// Invariants.
// NotWalletApp is the Apple store bundle id; the other channels use NotWallet.
const identifiers = new Set(["xyz.notwallet.NotWallet", "xyz.notwallet.NotWalletApp"]);
const semver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
if (base) {
  if (!base.identifier?.endsWith("-Debug")) {
    fail("src-tauri/tauri.conf.json", `identifier ${base.identifier} must end in -Debug`);
  }
}
for (const f of overlays) {
  const c = configs[f];
  if (typeof c.version !== "string" || !semver.test(c.version)) {
    fail(f, `version ${JSON.stringify(c.version)} is not valid semver`);
  }
  if (!identifiers.has(c.identifier)) {
    fail(f, `identifier must be one of ${[...identifiers].join(", ")}, got ${JSON.stringify(c.identifier)}`);
  }
}

// The direct-download channel ships one app-v<version> release from the macOS,
// Linux and Windows overlays, so their versions must agree. The store overlays
// version independently.
{
  const direct = [
    "src-tauri/tauri.prod-macos.conf.json",
    "src-tauri/tauri.prod-linux.conf.json",
    "src-tauri/tauri.prod-windows.conf.json",
  ];
  const versions = direct.map((f) => configs[f]?.version);
  if (new Set(versions).size > 1) {
    const list = direct.map((f, i) => `${f.split("/").pop()} ${versions[i]}`).join(", ");
    fail(direct[0], `direct-download versions must match (they share one release): ${list}`);
  }
}

// Files the merged configs reference, relative to src-tauri.
if (base) {
  for (const f of ["src-tauri/tauri.conf.json", ...overlays]) {
    const merged = f.endsWith("tauri.conf.json") && !f.includes("prod-")
      ? base
      : mergePatch(base, configs[f]);
    const refs = [
      ...(merged.bundle?.icon ?? []),
      merged.bundle?.macOS?.entitlements,
      merged.bundle?.macOS?.infoPlist,
      ...Object.values(merged.bundle?.macOS?.files ?? {}),
    ].filter((p) => typeof p === "string");
    for (const ref of refs) {
      // Absolute paths point at the release machine (provisioning profile).
      if (ref.startsWith("/")) continue;
      if (!existsSync(join(tauriDir, ref))) {
        fail(f, `referenced file does not exist: src-tauri/${ref.replace(/^\.\//, "")}`);
      }
    }
  }
}

if (problems.length) {
  console.error(`\n${problems.length} Tauri config problem(s).`);
  process.exit(1);
}
console.log(`Tauri config ok (${files.length} files, schema ${cliVersion}).`);
