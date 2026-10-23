import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const cli = resolve("dist/index.js");
test("local mode requires staged files and never commits without --apply", () => {
  const cwd = mkdtempSync(join(tmpdir(), "our-commit-"));
  try {
    const git = (...args) => spawnSync("git", args, { cwd, encoding: "utf8" });
    assert.equal(git("init").status, 0);
    writeFileSync(join(cwd, "README.md"), "Hello\n");
    assert.equal(git("add", "README.md").status, 0);
    const result = spawnSync(process.execPath, [cli, "--local"], { cwd, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /docs: atualiza documentação/);
    assert.equal(git("rev-list", "--count", "HEAD").status, 128);
  } finally { rmSync(cwd, { recursive: true, force: true }); }
});
test("unknown option is rejected", () => {
  const result = spawnSync(process.execPath, [cli, "--unknown"], { encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Opção desconhecida/);
});
