# Bale Engineering

**The engineering knowledge system for building reliable Bale bots, Business API notifications, Mini Apps, Safir integrations and wallet-payment flows.**

Bale Engineering is an open-source collection of agent skills, verified platform knowledge, engineering decision guides, reusable templates and a read-only MCP server.

این پروژه قرار نیست فقط مستندات API بله را به Markdown تبدیل کند. هدف آن کمک به Agent برای تصمیم‌گیری مهندسی است: چه چیزی بسازد، چرا آن مسیر را انتخاب کند، چه زمانی از هر قابلیت استفاده کند، چگونه آن را امن پیاده‌سازی کند و با چه شواهدی صحت کار را بررسی کند.

## What it provides

- **Skills:** a main engineering orchestrator and focused skills for Bot API, Business API, Mini Apps, Safir, wallet payments, message formatting and deep links.
- **Knowledge:** source-backed reference documents with examples, constraints, failure modes and implementation guidance.
- **MCP:** read-only tools, prompts and resources so an MCP-compatible agent can discover and retrieve the same canonical knowledge.
- **Templates:** PRD, architecture decision record (ADR), API contract and test matrix.
- **Adapters:** installation guidance for Codex, Claude Code, Cursor and other skill-capable agents.

## Engineering principles

1. **Bale is not Telegram.** The Bot API is based on Telegram's API, but every capability must be checked against Bale's own documentation before use.
2. **Choose the correct delivery surface.** Bot API, Business API, Mini App and Safir have different recipient identities, quotas, security models and constraints.
3. **Documented facts and engineering recommendations stay distinct.** Each reference identifies what Bale documents, what this project recommends, and what is not documented.
4. **Every important rule explains why, when and how.** Examples include valid JSON, rejected alternatives, edge cases and verification steps.
5. **Security is not optional.** Mini App initData is verified server-side; client-supplied identity and contact data are not trusted.
6. **The MCP server is read-only.** It never sends messages, changes a bot, deploys code, accesses a user's database or handles production credentials.
7. **One source of truth.** Skills and MCP resources read the same files; the project does not maintain duplicated copies of the same guidance.

## Repository layout

~~~text
skills/                 Agent skills (canonical instructions)
knowledge/              Detailed, source-backed Bale references
packages/mcp-server/    Read-only MCP server (stdio in v0.1)
templates/              Engineering artifact templates
adapters/               Agent-specific installation guidance
sources.json            Official documentation and upstream provenance
AGENTS.md               Rules for contributors and coding agents
~~~

## Use the skills

Install the main skill into a supported agent project with the Skills CLI:

~~~bash
npx skills add shahinesi/Bale-Engineering --skill bale-engineering
~~~

Focused skills can be installed individually:

~~~bash
npx skills add shahinesi/Bale-Engineering --skill bale-bot-api
npx skills add shahinesi/Bale-Engineering --skill bale-business-api
npx skills add shahinesi/Bale-Engineering --skill bale-miniapp
npx skills add shahinesi/Bale-Engineering --skill bale-safir
npx skills add shahinesi/Bale-Engineering --skill bale-wallet-payments
~~~

The exact installation options depend on the installed version of the Skills CLI and the target agent. See [adapters](adapters/README.md).

## Run the MCP server locally

Requirements: Node.js 20 or newer and pnpm.

~~~bash
pnpm install
pnpm --filter @bale-engineering/mcp-server build
node packages/mcp-server/dist/index.js
~~~

The first release uses **stdio** for local MCP clients. It exposes read-only knowledge and deterministic validators. Remote Streamable HTTP, authentication and hosted deployment are deliberately out of scope for this foundation release.

See [MCP server setup](packages/mcp-server/README.md) for client configuration examples.

## What the MCP exposes

| Capability | Purpose |
|---|---|
| Prompts | Start an engineering task or a focused review with the right workflow |
| Resources | Read the skill catalog, complete skills and reference documents |
| Tools | List, retrieve, search and validate Bale-related artifacts |

Initial tools include:
- bale_list_skills
- bale_get_skill
- bale_get_reference
- bale_search_knowledge
- bale_route_task
- bale_validate_inline_keyboard
- bale_validate_safir_payload
- bale_validate_business_api_request

## Important knowledge already covered

- Inline and reply keyboards, including primary, success, danger button styles and disabled buttons.
- Callback payload limits, callback handling, answerCallbackQuery and server-side authorization.
- Bot API and Business API differences, method catalog and file constraints.
- Mini App entry points, start versus startapp, SDK integration, theme behavior and server-side initData verification.
- requestContact trust boundary and contact.user_id comparison.
- Safir phone format, request_id idempotency, OTP, templates, secure messages, file upload and error codes.
- Wallet invoice, pre-checkout and SuccessfulPayment lifecycle.
- Bale's Markdown-like formatting, نمایش آنی, checklists and unsupported Markdown assumptions.
- Bale deep links for bots, messages, invitations, Mini Apps and sharing.

## Sources and attribution

Platform behavior is grounded in the official [Bale documentation](https://docs.bale.ai/). See [sources.json](sources.json) and the source links inside each knowledge document.

The engineering structure takes inspiration from:
- [Ponytail](https://github.com/DietrichGebert/ponytail) — one canonical skill distributed through agent adapters.
- [Product Engineering](https://github.com/phuryn/product-engineering) — focused skills, workflows, quality gates and source-aware maintenance.

This project does not copy their skill content or implementation.

## Project status

**Foundation release — v0.1.0.** The repository structure, canonical skills, core references and local read-only MCP are being established. The npm package is not published yet; use the repository checkout for now.

## License

MIT. See [LICENSE](LICENSE). Bale's names, APIs and official documentation remain the property of their respective owners.
