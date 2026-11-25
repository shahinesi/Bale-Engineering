<p align="right"><a href="README.fa.md">فارسی</a> · <strong>English</strong></p>

# Bale Engineering MCP Server

[![npm version](https://img.shields.io/npm/v/%40bale-engineering%2Fmcp-server)](https://www.npmjs.com/package/@bale-engineering/mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/%40bale-engineering%2Fmcp-server)](https://www.npmjs.com/package/@bale-engineering/mcp-server)
[![CI](https://github.com/shahinesi/Bale-Engineering/actions/workflows/ci.yml/badge.svg)](https://github.com/shahinesi/Bale-Engineering/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

A local, read-only [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for the Bale Engineering knowledge base. It gives compatible AI coding agents structured access to Bale skills, source-backed references, templates, validators and engineering prompts.

**npm package:** [@bale-engineering/mcp-server](https://www.npmjs.com/package/@bale-engineering/mcp-server) · **Published release:** <code>0.1.0</code> · **Next source candidate:** <code>0.1.1</code>

## What it does

- Helps an AI agent choose between Bale Bot API, Business API, Mini App, Safir and wallet-payment flows.
- Exposes the repository's canonical skills and technical references.
- Searches the bundled knowledge base using deterministic keyword matching.
- Validates the local shape of Inline Keyboard, Safir and Business API payloads.
- Provides reusable engineering and implementation-review prompts.
- Runs locally through **STDIO**; it does not expose an HTTP port.

The package is read-only. It does not send messages, change bot settings, call Bale/Safir APIs or access your production systems.

## Requirements

- Node.js 20 or newer.
- npm (included with Node.js; provides <code>npx</code>).
- An MCP-compatible client such as Codex, Claude Code or Cursor.
- Network access to the npm registry for the initial package download.

No npm login, Bale bot token, Safir API key or production credential is needed to install or use this package.

## Quick start

Choose your MCP client and register the server. The client starts the process when it needs it; **do not run the STDIO command as a standalone background service**.

### Codex desktop app

No Codex CLI is required. In the Codex desktop app on macOS:

1. Open **Codex → Settings → Configuration → Open config.toml**.
2. Add this block to the existing file. Keep your other settings intact:

~~~toml
[mcp_servers.bale_engineering]
command = "npx"
args = ["-y", "@bale-engineering/mcp-server@0.1.0"]
~~~

3. Save the file and restart Codex.

The app reads the user configuration from `~/.codex/config.toml`. Here, `npx` only launches the local MCP package; it does not mean you need Codex CLI.

### Claude Code

~~~bash
claude mcp add bale-engineering -- npx -y @bale-engineering/mcp-server@0.1.0
~~~

Verify the registration:

~~~bash
claude mcp list
~~~

### Cursor

Add the following server entry in Cursor's MCP settings, or place it in your project's <code>.cursor/mcp.json</code>:

~~~json
{
  "mcpServers": {
    "bale-engineering": {
      "command": "npx",
      "args": ["-y", "@bale-engineering/mcp-server@0.1.0"]
    }
  }
}
~~~

### Other MCP clients

Use the same command and arguments in the client's MCP server configuration:

- **Command:** <code>npx</code>
- **Arguments:** <code>-y</code>, <code>@bale-engineering/mcp-server@0.1.0</code>
- **Transport:** <code>stdio</code>

Restart or reload the client after changing its MCP configuration. The exact settings screen depends on the client and its version.

### Pin an exact version

For reproducible team environments, replace <code>@latest</code> with a tested version, for example:

~~~text
@bale-engineering/mcp-server@0.1.0
~~~

Using <code>@latest</code> opts into the newest published release when the client launches the package through npx.

## Verify the installation

Check the published package version:

~~~bash
npm view @bale-engineering/mcp-server version
~~~

Then check the MCP server list in your client:

- **Codex desktop app:** restart Codex and ask it to list the tools exposed by `bale_engineering`.
- Claude Code: <code>claude mcp list</code>
- Cursor: open the MCP settings and confirm that <code>bale-engineering</code> is enabled and connected.

When connected, ask the agent to list the Bale Engineering MCP tools or use one of the example requests below.

## How to use it

You do not normally call the server from a terminal. Ask your AI coding agent to use the connected MCP tools as part of your task.

Example requests:

- "Use Bale Engineering to decide whether this workflow should use Bot API, Business API or Mini App. Explain the trade-offs and cite the relevant reference."
- "Find the Bale documentation about Mini App identity and explain how the backend must verify initData."
- "Review this Inline Keyboard payload with the Bale validator. Fix errors but do not assume disabled buttons provide authorization."
- "Check this Safir payload's structure and explain every warning."
- "Review this implementation with the bale-engineering-review prompt and produce a prioritized test matrix."

For a substantial implementation, start with the <code>bale-engineering</code> prompt. For an existing implementation or pull request, use <code>bale-engineering-review</code>.

## MCP tools

The server exposes eight tools.

| Tool | Input | Purpose |
|---|---|---|
| <code>bale_list_skills</code> | <code>area?</code> | List canonical skills; optionally filter by area such as <code>bot-api</code> or <code>miniapp</code>. |
| <code>bale_get_skill</code> | <code>skill_id</code> | Read the complete content of a known skill. |
| <code>bale_get_reference</code> | <code>reference_id</code> | Read a complete technical reference. |
| <code>bale_search_knowledge</code> | <code>query</code>, <code>limit?</code> | Search skills, references and templates by keywords. Default limit is 5; maximum is 20. |
| <code>bale_route_task</code> | <code>task</code> | Suggest relevant specialist skills using explicit keyword rules. |
| <code>bale_validate_inline_keyboard</code> | <code>reply_markup</code> | Validate a Bot API Inline Keyboard payload. |
| <code>bale_validate_safir_payload</code> | <code>payload</code> | Validate the documented shape of a Safir send payload. |
| <code>bale_validate_business_api_request</code> | <code>method</code>, <code>payload</code>, <code>chat_type?</code> | Validate a documented Business API method and payload. |

### Example: search the knowledge base

Tool: <code>bale_search_knowledge</code>

~~~json
{
  "query": "Mini App initData authentication",
  "limit": 5
}
~~~

### Example: route a task

Tool: <code>bale_route_task</code>

~~~json
{
  "task": "Build a Mini App with a secure user profile and order history"
}
~~~

The router is a deterministic keyword-based first pass, not an AI reasoning engine. Treat its output as a hint and let the main engineering skill make the final platform decision.

### Example: validate an Inline Keyboard

Tool: <code>bale_validate_inline_keyboard</code>

~~~json
{
  "reply_markup": {
    "inline_keyboard": [
      [
        { "text": "Confirm", "callback_data": "confirm", "style": "success" },
        { "text": "Cancel", "callback_data": "cancel", "style": "danger" }
      ],
      [
        { "text": "Unavailable", "disabled": {} }
      ]
    ]
  }
}
~~~

The validator checks the keyboard structure, supported styles (<code>primary</code>, <code>success</code>, <code>danger</code>), action fields and the 1–64 **UTF-8 byte** limit for <code>callback_data</code>. A disabled button is only a UI state; the application backend must still enforce authorization.

### Example: validate a Safir payload

Tool: <code>bale_validate_safir_payload</code>

~~~json
{
  "payload": {
    "bot_id": 123456,
    "phone_number": "+989121234567",
    "request_id": "order-1001-otp",
    "message_data": {
      "otp_message": {
        "otp": "123456"
      }
    }
  }
}
~~~

The values above are illustrative placeholders, not real credentials or a request to Safir. The validator checks local payload shape and may return warnings where the official documentation is incomplete or recommends extra safeguards.

### Example: validate a Business API request

Tool: <code>bale_validate_business_api_request</code>

~~~json
{
  "method": "sendMessage",
  "chat_type": "private",
  "payload": {
    "chat_id": 123456789,
    "text": "Your order is ready."
  }
}
~~~

The validator checks the documented method allowlist, recipient identifier and method-specific fields. It does not send the message.

## MCP resources

| URI | Content |
|---|---|
| <code>bale://catalog</code> | JSON catalog of skill, reference and template IDs. |
| <code>bale://skills/{id}</code> | Complete Markdown content for a known skill ID. |
| <code>bale://knowledge/{id}</code> | Complete Markdown content for a known reference ID. |
| <code>bale://sources</code> | Official platform sources and engineering references. |

Useful skill IDs include:

- <code>bale-engineering</code>
- <code>bale-bot-api</code>
- <code>bale-business-api</code>
- <code>bale-miniapp</code>
- <code>bale-safir</code>
- <code>bale-wallet-payments</code>
- <code>bale-message-formatting</code>
- <code>bale-links</code>
- <code>bale-engineering-review</code>

Use <code>bale_list_skills</code> or <code>bale://catalog</code> to discover the current IDs rather than guessing them.

## MCP prompts

| Prompt | Arguments | Use |
|---|---|---|
| <code>bale-engineering</code> | <code>task</code> (required), <code>mode?</code>, <code>stack?</code> | Plan and solve a Bale engineering task. |
| <code>bale-engineering-review</code> | <code>target</code>, <code>change_summary</code> (required), <code>evidence?</code> | Review an implementation for correctness, security, reliability and operational readiness. |

The engineering prompt supports three modes:

- <code>lite</code>: the smallest complete recommendation and one working example.
- <code>full</code>: the default; user journey, platform choice, architecture, security, failure modes and tests.
- <code>ultra</code>: challenge unnecessary requirements, compare alternatives and inspect cross-boundary risks.

## Transport and architecture

The MCP client launches the package as a local child process:

~~~mermaid
flowchart LR
    A["Codex / Claude Code / Cursor"] <-->|"MCP JSON-RPC over STDIO"| B["Local Bale Engineering MCP"]
    B --> C["Bundled skills and references"]
    B --> D["Local keyword search and validators"]
    B -.-> E["No Bale/Safir API or production access"]
~~~

- **STDIO** carries MCP messages between the client and the local process.
- No TCP port, public endpoint, reverse proxy or hosted MCP service is created.
- The published npm package includes the runtime and its canonical knowledge files.
- The server reads local package data; it does not fetch Bale documentation at runtime.

## Limitations and security boundaries

- **Read-only:** no messages are sent, bots are not modified and no production APIs are called.
- **No credentials:** the server does not accept or store bot tokens, Safir API keys, OTPs or production secrets.
- **Keyword search:** <code>bale_search_knowledge</code> is deterministic keyword search, not semantic search and not web search.
- **Keyword routing:** <code>bale_route_task</code> is a first-pass hint, not a final engineering decision.
- **Local validation only:** validators check payload shape against the rules encoded in this package. They do not guarantee that Bale or Safir will accept a request.
- **Authorization remains in your backend:** callback data, a disabled button or a successful local validation never replaces server-side authentication and authorization.
- **No remote transport:** this release does not provide Streamable HTTP hosting or a remote MCP endpoint.

## Troubleshooting

### The client cannot find npx

Confirm Node.js and npm are installed:

~~~bash
node --version
npm --version
npx --version
~~~

Node.js must be version 20 or newer. Restart the MCP client after installing Node.js or changing PATH.

### The server is not listed or its tools do not appear

1. Check the MCP configuration syntax.
2. In Codex Desktop, restart the app and ask the agent to list the tools from <code>bale_engineering</code>; in Claude Code, run <code>claude mcp list</code>.
3. Confirm the command is <code>npx</code> and the arguments are <code>-y</code> and <code>@bale-engineering/mcp-server@0.1.0</code>.
4. Restart or reload the client.
5. Inspect the MCP client's logs for process-startup errors.

The first npx launch needs access to the npm registry. If your environment uses a proxy or restricted network, allow access to <code>registry.npmjs.org</code>.

### A tool reports an unknown skill or reference ID

Call <code>bale_list_skills</code> or read <code>bale://catalog</code> to discover valid IDs. Do not invent IDs.

## Build and test from source

~~~bash
git clone https://github.com/shahinesi/Bale-Engineering.git
cd Bale-Engineering/packages/mcp-server
npm install
npm run typecheck
npm test
npm run build
npm run test:package
~~~

<code>test:package</code> creates the npm tarball, installs it in a temporary consumer directory, starts the installed server through the official MCP client over STDIO, and checks tool discovery, a tool call, a Persian reference, a resource and a prompt.

To run a source checkout through an MCP client, build it and use this configuration instead of the npm command:

~~~json
{
  "mcpServers": {
    "bale-engineering-local": {
      "command": "node",
      "args": ["/absolute/path/to/Bale-Engineering/packages/mcp-server/dist/index.js"]
    }
  }
}
~~~

## Versioning and publishing

- **Published npm release:** `0.1.0` (published manually by the maintainer).
- **Next source candidate:** `0.1.1` (prepared in this repository for OIDC staged publishing).
- The MCP server reads its reported version directly from the package manifest, so the package and MCP initialize metadata stay aligned.
- `0.0.0-stage` is npm's staging placeholder, not the Bale Engineering release. Do not pin installations to it.
- Until `0.1.1` is staged, reviewed and approved, use the known published version explicitly: `@bale-engineering/mcp-server@0.1.0`.
- `npm view @bale-engineering/mcp-server version` resolves the `latest` dist-tag. To verify a specific release, use `npm view @bale-engineering/mcp-server@0.1.0 version`.

For maintainers preparing the next release, see the [release guide](../../docs/releasing.md).

## Related documentation

- [Main repository README](../../README.md)
- [Persian main README](../../README.fa.md)
- [Architecture guide](../../docs/architecture.md)
- [Persian architecture guide](../../docs/architecture.fa.md)
- [Agent adapters](../../adapters/README.md)
- [Official Bale documentation](https://docs.bale.ai/)
- [MCP specification](https://modelcontextprotocol.io/)
- [npm package](https://www.npmjs.com/package/@bale-engineering/mcp-server)

[Persian guide](README.fa.md) · [Repository](https://github.com/shahinesi/Bale-Engineering)
