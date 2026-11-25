import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tempRoot = await mkdtemp(join(tmpdir(), "bale-engineering-package-test-"));
const packDirectory = join(tempRoot, "pack");
const installDirectory = join(tempRoot, "consumer");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runNpm(args, cwd) {
  const result = spawnSync(npmCommand, args, {
    cwd,
    encoding: "utf8",
    stdio: "pipe",
    env: { ...process.env, npm_config_audit: "false", npm_config_fund: "false" }
  });
  if (result.status !== 0) {
    throw new Error([
      "Command failed: npm " + args.join(" "),
      result.stdout,
      result.stderr
    ].join("\n"));
  }
  return result.stdout;
}

let client;
try {
  await mkdir(packDirectory, { recursive: true });
  await mkdir(installDirectory, { recursive: true });

  const packOutput = runNpm(["pack", "--json", "--pack-destination", packDirectory], packageRoot);
  const packMetadata = JSON.parse(packOutput);
  assert.equal(packMetadata.length, 1, "npm pack should produce exactly one tarball");

  const tarballPath = join(packDirectory, packMetadata[0].filename);
  assert.ok(existsSync(tarballPath), "npm tarball should exist");

  runNpm([
    "install",
    "--prefix",
    installDirectory,
    "--no-audit",
    "--no-fund",
    "--ignore-scripts",
    tarballPath
  ], packageRoot);

  const serverEntry = resolve(
    installDirectory,
    "node_modules/@bale-engineering/mcp-server/dist/index.js"
  );
  assert.ok(existsSync(serverEntry), "compiled MCP server entry must be present in the npm package");

  client = new Client({ name: "bale-engineering-package-smoke", version: "1.0.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntry],
    cwd: installDirectory
  });

  await client.connect(transport);

  const { tools } = await client.listTools();
  const toolNames = tools.map(tool => tool.name);
  assert.ok(toolNames.includes("bale_list_skills"), "server must expose bale_list_skills");
  assert.ok(toolNames.includes("bale_get_skill"), "server must expose bale_get_skill");
  assert.ok(toolNames.includes("bale_get_reference"), "server must expose bale_get_reference");
  assert.ok(toolNames.includes("bale_validate_safir_payload"), "server must expose the Safir validator");

  const skillResult = await client.callTool({
    name: "bale_get_skill",
    arguments: { skill_id: "bale-engineering" }
  });
  const skillText = skillResult.content
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("\n");
  assert.ok(skillText.includes("Bale Engineering"), "packaged server must read canonical skill files");

  const referenceResult = await client.callTool({
    name: "bale_get_reference",
    arguments: { reference_id: "architecture-overview-fa" }
  });
  const referenceText = referenceResult.content
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("\n");
  assert.ok(referenceText.includes("معماری"), "packaged server must read Persian architecture references");

  const { contents } = await client.readResource({ uri: "bale://catalog" });
  assert.ok(contents.some(item => item.text?.includes("bale-engineering")), "catalog resource must be readable");

  const prompt = await client.getPrompt({
    name: "bale-engineering",
    arguments: { task: "Build a small Bale bot", mode: "lite" }
  });
  assert.ok(
    prompt.messages.some(message => message.content.type === "text" && message.content.text.includes("Build a small Bale bot")),
    "engineering prompt must be callable"
  );

  console.log(JSON.stringify({
    package: "@bale-engineering/mcp-server",
    version: packMetadata[0].version,
    transport: "stdio",
    toolsDiscovered: toolNames.length,
    checks: ["npm pack", "install tarball", "MCP initialize", "tools/list", "tool call", "Persian reference", "resource read", "prompt read"]
  }, null, 2));
} finally {
  if (client) {
    await client.close();
  }
  await rm(tempRoot, { recursive: true, force: true });
}
