import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { references, skills, templates } from "./catalog.js";
import { readCatalogFile, searchCatalog } from "./content.js";
import { validateInlineKeyboard, validateSafirPayload } from "./validators.js";

function textResult(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

function createServer() {
  const server = new McpServer({ name: "bale-engineering", version: "0.1.0" });

  server.registerTool(
    "bale_list_skills",
    {
      title: "List Bale Engineering skills",
      description: "List the canonical Bale Engineering skills. This is a read-only catalog lookup.",
      inputSchema: z.object({ area: z.string().optional() })
    },
    async ({ area }) => textResult(skills.filter(item => !area || item.area === area))
  );

  server.registerTool(
    "bale_get_skill",
    {
      title: "Read a Bale Engineering skill",
      description: "Read the complete canonical SKILL.md for one known skill id.",
      inputSchema: z.object({ skill_id: z.string().min(1) })
    },
    async ({ skill_id }) => {
      const skill = skills.find(item => item.id === skill_id);
      if (!skill) return errorResult("Unknown skill_id. Call bale_list_skills to discover valid ids.");
      return { content: [{ type: "text" as const, text: await readCatalogFile(skill.path) }] };
    }
  );

  server.registerTool(
    "bale_get_reference",
    {
      title: "Read Bale platform knowledge",
      description: "Read a complete source-backed knowledge reference by its known id.",
      inputSchema: z.object({ reference_id: z.string().min(1) })
    },
    async ({ reference_id }) => {
      const reference = references.find(item => item.id === reference_id);
      if (!reference) return errorResult("Unknown reference_id. Use bale_search_knowledge or the bale://catalog resource.");
      return { content: [{ type: "text" as const, text: await readCatalogFile(reference.path) }] };
    }
  );

  server.registerTool(
    "bale_search_knowledge",
    {
      title: "Search Bale Engineering knowledge",
      description: "Deterministic keyword search over canonical skills, references and templates. This is not semantic or web search.",
      inputSchema: z.object({
        query: z.string().min(2),
        limit: z.number().int().min(1).max(20).optional()
      })
    },
    async ({ query, limit }) => textResult(await searchCatalog(query, limit ?? 5))
  );

  server.registerTool(
    "bale_route_task",
    {
      title: "Route a task to Bale skills",
      description: "Suggest relevant skills using explicit keyword rules. This is a deterministic first-pass router, not an AI judgment; use the main engineering skill for the final platform decision.",
      inputSchema: z.object({ task: z.string().min(2) })
    },
    async ({ task }) => {
      const normalized = task.toLocaleLowerCase();
      const rules = [
        { skill_id: "bale-bot-api", terms: ["bot", "callback", "keyboard", "webhook", "polling", "دکمه", "کالبک", "وبهوک", "بازو"] },
        { skill_id: "bale-miniapp", terms: ["mini app", "miniapp", "webapp", "initdata", "startapp", "مینی اپ", "مینی‌اپ"] },
        { skill_id: "bale-safir", terms: ["safir", "otp", "request_id", "سفیر", "رمز یکبار مصرف"] },
        { skill_id: "bale-message-formatting", terms: ["markdown", "format", "formatting", "مرمید", "قالب‌بندی", "قالب بندی"] },
        { skill_id: "bale-links", terms: ["deep link", "startapp", "ble.ir", "لینک", "پیوند"] },
        { skill_id: "bale-engineering-review", terms: ["review", "audit", "security", "test", "بازبینی", "ممیزی", "امنیت", "تست"] }
      ];
      const matched = rules
        .map(rule => ({ skill_id: rule.skill_id, matched_terms: rule.terms.filter(term => normalized.includes(term)) }))
        .filter(rule => rule.matched_terms.length > 0);
      return textResult({
        primary_skill: "bale-engineering",
        suggested_skills: matched,
        note: matched.length === 0
          ? "No specialist matched by the deterministic keyword rules. Start with bale-engineering and inspect the task."
          : "Keyword routing is a hint only. The main engineering skill must still decide whether Bot API, Mini App, Safir or a hybrid is appropriate."
      });
    }
  );

  server.registerTool(
    "bale_validate_inline_keyboard",
    {
      title: "Validate a Bale inline keyboard",
      description: "Check documented Bot API inline keyboard shape, button style values, one action field, disabled object shape and callback_data UTF-8 byte length. This does not prove server-side authorization.",
      inputSchema: z.object({ reply_markup: z.record(z.string(), z.unknown()) })
    },
    async ({ reply_markup }) => textResult(validateInlineKeyboard(reply_markup))
  );

  server.registerTool(
    "bale_validate_safir_payload",
    {
      title: "Validate a Safir send payload",
      description: "Check Safir send_message fields, 98/+98 phone format, numeric OTP, template shape, request_id recommendation and Safir-specific button fields. Flags the summary-table omission for template_message; does not call Safir.",
      inputSchema: z.object({ payload: z.record(z.string(), z.unknown()) })
    },
    async ({ payload }) => textResult(validateSafirPayload(payload))
  );

  server.registerPrompt(
    "bale-engineering",
    {
      title: "Bale Engineering Task",
      description: "Start a Bale engineering task with platform selection, security, failure handling and verification.",
      argsSchema: z.object({
        task: z.string().min(5).describe("The feature or engineering problem to solve"),
        mode: z.enum(["lite", "full", "ultra"]).optional(),
        stack: z.string().optional().describe("Existing application stack and constraints, if known")
      })
    },
    async ({ task, mode, stack }) => {
      const skill = await readCatalogFile("skills/bale-engineering/SKILL.md");
      const prompt = [
        skill,
        "",
        "## Current task",
        task,
        "## Requested mode",
        mode ?? "full",
        "## Existing stack and constraints",
        stack ?? "Not provided. Inspect the repository or state assumptions."
      ].join("\n");
      return { messages: [{ role: "user" as const, content: { type: "text" as const, text: prompt } }] };
    }
  );

  server.registerPrompt(
    "bale-engineering-review",
    {
      title: "Review a Bale implementation",
      description: "Review a Bale bot, Mini App or Safir implementation against platform facts, security and operational readiness.",
      argsSchema: z.object({
        target: z.string().min(2).describe("Bot API, Mini App, Safir or hybrid"),
        change_summary: z.string().min(5),
        evidence: z.string().optional().describe("Relevant code, diff, logs or test results")
      })
    },
    async ({ target, change_summary, evidence }) => {
      const skill = await readCatalogFile("skills/bale-engineering-review/SKILL.md");
      const prompt = [
        skill,
        "",
        "## Review target",
        target,
        "## Change summary",
        change_summary,
        "## Evidence supplied",
        evidence ?? "No implementation evidence supplied. Do not invent findings; state what is missing."
      ].join("\n");
      return { messages: [{ role: "user" as const, content: { type: "text" as const, text: prompt } }] };
    }
  );

  server.registerResource(
    "bale-catalog",
    "bale://catalog",
    { title: "Bale Engineering catalog", description: "Canonical skill, reference and template ids.", mimeType: "application/json" },
    async uri => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({ skills, references, templates }, null, 2)
      }]
    })
  );

  server.registerResource(
    "bale-skill",
    new ResourceTemplate("bale://skills/{id}", { list: undefined }),
    { title: "Bale Engineering skill", description: "Complete canonical skill content.", mimeType: "text/markdown" },
    async (uri, variables) => {
      const skill = skills.find(item => item.id === String(variables.id));
      if (!skill) throw new Error("Unknown Bale skill resource.");
      return { contents: [{ uri: uri.href, mimeType: "text/markdown", text: await readCatalogFile(skill.path) }] };
    }
  );

  server.registerResource(
    "bale-reference",
    new ResourceTemplate("bale://knowledge/{id}", { list: undefined }),
    { title: "Bale Engineering reference", description: "Complete source-backed platform reference.", mimeType: "text/markdown" },
    async (uri, variables) => {
      const reference = references.find(item => item.id === String(variables.id));
      if (!reference) throw new Error("Unknown Bale knowledge resource.");
      return { contents: [{ uri: uri.href, mimeType: "text/markdown", text: await readCatalogFile(reference.path) }] };
    }
  );

  server.registerResource(
    "bale-sources",
    "bale://sources",
    { title: "Bale Engineering sources", description: "Official platform sources and upstream engineering references.", mimeType: "application/json" },
    async uri => ({
      contents: [{ uri: uri.href, mimeType: "application/json", text: await readCatalogFile("sources.json") }]
    })
  );

  return server;
}

const handle = serveStdio(createServer);
process.on("SIGINT", () => { void handle.close(); });
process.on("SIGTERM", () => { void handle.close(); });
