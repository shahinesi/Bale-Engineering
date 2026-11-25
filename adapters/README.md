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

## Codex
Install the skill with the Skills CLI or copy it to the project's .agents/skills directory. For local MCP, build the package and add the command shown in ../packages/mcp-server/README.md.

## Claude Code
Install the skill with the Skills CLI or copy it to the project's .claude/skills directory. Add the local MCP server using the command in ../packages/mcp-server/README.md.

## Cursor and other agents
Use the Skills CLI if the agent is supported. Otherwise copy the selected skill folder to the agent's documented skills/rules directory. Keep the skill content canonical in this repository.

Agent configuration formats change. Check the target agent's current documentation before committing a generated config file.

[Persian adapter guide](README.fa.md)
