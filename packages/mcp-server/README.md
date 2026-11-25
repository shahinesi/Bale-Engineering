<p align="right"><a href="README.fa.md">فارسی</a> · <strong>English</strong></p>

# Bale Engineering MCP Server

A read-only MCP server that gives compatible AI coding agents access to the canonical Bale Engineering skills, source-backed references, templates and diagrams.

## Requirements

- Node.js 20+
- An MCP-compatible host

## Run from npm

After the first public release:

~~~bash
npx -y @bale-engineering/mcp-server
~~~

The command starts the local MCP server over **STDIO**. It does not open a network port and does not call Bale or Safir APIs.

### Codex

~~~bash
codex mcp add bale-engineering -- npx -y @bale-engineering/mcp-server
~~~

### Claude Code

~~~bash
claude mcp add bale-engineering -- npx -y @bale-engineering/mcp-server
~~~

### Cursor

Add this entry to the MCP configuration used by your Cursor version:

~~~json
{
  "mcpServers": {
    "bale-engineering": {
      "command": "npx",
      "args": ["-y", "@bale-engineering/mcp-server"]
    }
  }
}
~~~

## Build from source

From the repository root:

~~~bash
cd packages/mcp-server
npm install
npm run typecheck
npm test
npm run build
node dist/index.js
~~~

For a workspace-level install, the repository root also supports pnpm scripts.

## Verify the npm package before publishing

~~~bash
npm run test:package
~~~

This creates the npm tarball, installs it into a temporary consumer directory, starts the installed server through the official MCP client over STDIO, and checks tools, a Persian reference, a resource and a prompt.

## MCP capabilities

### Tools
- <code>bale_list_skills</code>
- <code>bale_get_skill</code>
- <code>bale_get_reference</code>
- <code>bale_search_knowledge</code>
- <code>bale_route_task</code>
- <code>bale_validate_inline_keyboard</code>
- <code>bale_validate_safir_payload</code>
- <code>bale_validate_business_api_request</code>

### Resources
- <code>bale://catalog</code>
- <code>bale://skills/{id}</code>
- <code>bale://knowledge/{id}</code>
- <code>bale://sources</code>

### Prompts
- <code>bale-engineering</code>
- <code>bale-engineering-review</code>

## Security boundary

- Read-only: no messages are sent and no bot settings are changed.
- No production API calls to Bale or Safir.
- No bot tokens, Safir keys or OTPs are accepted.
- Content is loaded only from the bundled package data or the repository workspace.
- STDIO stdout is reserved for MCP protocol messages.

The local validators check payload shape; they do not prove live provider acceptance or replace application-side authorization.

## Publishing

The npm package is prepared as <code>@bale-engineering/mcp-server</code>. The GitHub Actions publish workflow verifies typechecking, unit tests, the build and an installed-tarball STDIO smoke test before publishing. Initial npm scope ownership and authentication must be configured by a package owner; see [the release guide](../../docs/releasing.md).

[Persian setup guide](README.fa.md) · [Repository](https://github.com/shahinesi/Bale-Engineering)
