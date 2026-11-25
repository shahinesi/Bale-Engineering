import { readFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { references, skills, templates } from "./catalog.js";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

export async function readCatalogFile(relativePath: string): Promise<string> {
  const absolutePath = resolve(repositoryRoot, relativePath);
  if (!absolutePath.startsWith(repositoryRoot + sep)) {
    throw new Error("Requested content is outside the repository.");
  }
  return readFile(absolutePath, "utf8");
}

type SearchItem = {
  id: string;
  title: string;
  kind: "skill" | "reference" | "template";
  path: string;
};

export async function searchCatalog(query: string, limit = 5) {
  const tokens = query.toLocaleLowerCase().split(/\s+/).filter(token => token.length > 1);
  if (tokens.length === 0) return [];

  const items: SearchItem[] = [
    ...skills.map(item => ({ id: item.id, title: item.name, kind: "skill" as const, path: item.path })),
    ...references.map(item => ({ id: item.id, title: item.title, kind: "reference" as const, path: item.path })),
    ...templates.map(item => ({ id: item.id, title: item.title, kind: "template" as const, path: item.path }))
  ];

  const matches = await Promise.all(items.map(async item => {
    const content = await readCatalogFile(item.path);
    const normalized = (item.title + " " + content).toLocaleLowerCase();
    const score = tokens.reduce((total, token) => total + (normalized.includes(token) ? 1 : 0), 0);
    if (score === 0) return null;

    const firstToken = tokens.find(token => normalized.includes(token));
    const position = firstToken ? normalized.indexOf(firstToken) : 0;
    const start = Math.max(0, position - 180);
    const excerpt = content.slice(start, Math.min(content.length, start + 520)).replace(/\s+/g, " ").trim();

    return { ...item, score, excerpt };
  }));

  return matches
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, Math.max(1, Math.min(limit, 20)));
}
