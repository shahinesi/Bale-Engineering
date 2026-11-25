<p align="right"><a href="README.fa.md">فارسی</a> · <strong>English</strong></p>

# Bale Engineering MCP Server

The MCP server exposes the repository's canonical skills and knowledge. It is deliberately read-only.

## Requirements

- Node.js 20+
- pnpm
- An MCP-compatible host

## Build and run

From the repository root:

~~~bash
pnpm install
pnpm --filter @bale-engineering/mcp-server build
node packages/mcp-server/dist/index.js
~~~

The server communicates over stdio. Keep stdout reserved for MCP protocol messages; do not add console.log debugging.

## Configure a client

Use an absolute path to the compiled entry point.

### Codex

~~~bash
codex mcp add bale-engineering -- node /absolute/path/Bale-Engineering/packages/mcp-server/dist/index.js
~~~

### Claude Code

~~~bash
claude mcp add bale-engineering -- node /absolute/path/Bale-Engineering/packages/mcp-server/dist/index.js
~~~

### Cursor

Add the following entry to the MCP configuration file used by your Cursor version:

~~~json
{
  "mcpServers": {
    "bale-engineering": {
      "command": "node",
      "args": [
        "/absolute/path/Bale-Engineering/packages/mcp-server/dist/index.js"
      ]
    }
  }
}
~~~

Client configuration formats can change. Confirm the current host documentation if the command is rejected.

## Prompts

- bale-engineering: starts a task with the main engineering skill and a requested lite/full/ultra mode.
- bale-engineering-review: starts a review using the canonical review skill.

## Tools

| Tool | Purpose |
|---|---|
| bale_list_skills | List skills, optionally filtered by area |
| bale_get_skill | Read one complete skill |
| bale_get_reference | Read one complete knowledge reference |
| bale_search_knowledge | Deterministic keyword search; not semantic search |
| bale_route_task | Keyword-based first-pass skill routing |
| bale_validate_inline_keyboard | Validate Bot API inline keyboard structure, styles, disabled and callback_data |
| bale_validate_safir_payload | Validate Safir send_message shape, phone format, template and button fields |
| bale_validate_business_api_request | Validate Business API method allowlist, private-chat metadata and file_id-only media |

## Resources

- bale://catalog
- bale://skills/{id}
- bale://knowledge/{id}
- bale://sources

## Security boundary

The server:
- Does not call Bale or Safir APIs.
- Does not send messages or trigger real actions.
- Does not accept bot tokens or Safir API keys.
- Reads only allowlisted files from this repository.
- Performs local validation and keyword search only.

The keyboard validator does not check application authorization. The Business API validator cannot prove the real chat type unless the caller supplies verified chat_type metadata. The Safir validator does not prove that a payload is accepted by the live provider. The keyword router is not semantic reasoning.

[Persian setup guide](README.fa.md)
