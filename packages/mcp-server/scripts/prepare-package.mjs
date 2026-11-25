import { cp, copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(packageRoot, "../..");
const dataRoot = resolve(packageRoot, "package-data");

await rm(dataRoot, { recursive: true, force: true });
await mkdir(dataRoot, { recursive: true });

for (const directory of ["skills", "knowledge", "templates", "docs", "assets/brand"]) {
  await cp(resolve(repositoryRoot, directory), resolve(dataRoot, directory), {
    recursive: true,
    filter: source => !source.includes("/node_modules/") && !source.includes("/.git/")
  });
}

await copyFile(resolve(repositoryRoot, "sources.json"), resolve(dataRoot, "sources.json"));
await copyFile(resolve(repositoryRoot, "LICENSE"), resolve(packageRoot, "LICENSE"));

console.log("Prepared canonical skills, knowledge, templates, docs, assets and sources for npm packaging.");
