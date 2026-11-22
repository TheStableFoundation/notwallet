// Fails when a skill under .agents/skills/ has frontmatter an agent would reject: missing or
// unclosed, not valid YAML (an unquoted `: ` in a description is the usual culprit), or a
// name/description outside Anthropic's skill limits. Run with `pnpm check:skills`.
import { readdir, readFile } from "node:fs/promises";
import { parse } from "yaml";

const root = new URL("../.agents/skills/", import.meta.url);
const problems = [];

let entries;
try {
  entries = await readdir(root, { withFileTypes: true });
} catch (error) {
  // A branch without any skills has nothing to check.
  if (error.code === "ENOENT") {
    console.log("No .agents/skills directory, nothing to check.");
    process.exit(0);
  }
  throw error;
}
const dirs = entries.filter((d) => d.isDirectory());

for (const dir of dirs) {
  const path = `.agents/skills/${dir.name}/SKILL.md`;
  const fail = (reason) => problems.push(`${path}: ${reason}`);

  let src;
  try {
    src = await readFile(new URL(`${dir.name}/SKILL.md`, root), "utf8");
  } catch {
    fail("SKILL.md is missing");
    continue;
  }

  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(src);
  if (!match) {
    fail(
      src.startsWith("---\n") || src.startsWith("---\r\n")
        ? "frontmatter has no closing ---"
        : "file does not start with --- frontmatter",
    );
    continue;
  }

  let meta;
  try {
    meta = parse(match[1], { strict: true, uniqueKeys: true });
  } catch (error) {
    fail(`frontmatter is not valid YAML: ${error.message.split("\n")[0]}`);
    continue;
  }
  if (meta === null || typeof meta !== "object" || Array.isArray(meta)) {
    fail("frontmatter is not a mapping");
    continue;
  }

  const { name, description } = meta;
  if (typeof name !== "string") fail("name must be a string");
  else {
    if (name !== dir.name) fail(`name "${name}" does not match directory "${dir.name}"`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) fail(`name "${name}" must be lowercase kebab-case`);
    if (name.length > 64) fail("name is longer than 64 characters");
  }

  if (typeof description !== "string" || !description.trim()) {
    fail("description must be a non-empty string");
  } else {
    if (description.length > 1024) fail("description is longer than 1024 characters");
    if (/[<>]/.test(description)) fail("description must not contain < or >");
  }
}

if (problems.length) {
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
console.log(`${dirs.length} skills have valid frontmatter.`);
