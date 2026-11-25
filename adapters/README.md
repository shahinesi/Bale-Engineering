<p align="right"><a href="README.fa.md">فارسی</a> · <strong>English</strong></p>

# Agent adapters

The canonical skills live under ../skills. Install skill folders directly or connect the MCP server. Do not maintain separate forks of the knowledge.

## Skills CLI

~~~bash
npx skills add shahinesi/Bale-Engineering --skill bale-engineering
~~~

Focused skills can be installed individually:
- bale-bot-api
- bale-business-api
- bale-miniapp
- bale-safir
- bale-wallet-payments
- bale-message-formatting
- bale-links
- bale-engineering-review

Example:

~~~bash
npx skills add shahinesi/Bale-Engineering --skill bale-business-api
npx skills add shahinesi/Bale-Engineering --skill bale-wallet-payments
~~~

## Codex desktop app
Install the skill with the Skills CLI or copy it to the project's `.agents/skills` directory. To connect the published local MCP server without Codex CLI:

1. Open Codex → Settings → Configuration → Open config.toml.
2. Add the following to the existing file:

~~~toml
[mcp_servers.bale_engineering]
command = "npx"
args = ["-y", "@bale-engineering/mcp-server@0.1.0"]
~~~

3. Save and restart Codex. The default macOS config path is `~/.codex/config.toml`.

See the [complete MCP guide](../packages/mcp-server/README.md) for details.

## Claude Code
Install the skill with the Skills CLI or copy it to the project's .claude/skills directory. Add the local MCP server using the command in ../packages/mcp-server/README.md.

## Cursor and other agents
Use the Skills CLI if the agent is supported. Otherwise copy the selected skill folder to the agent's documented skills/rules directory. Keep the skill content canonical in this repository.

Agent configuration formats change. Check the target agent's current documentation before committing a generated config file.

[Persian adapter guide](README.fa.md)
