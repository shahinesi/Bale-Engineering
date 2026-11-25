# Agent adapters

The canonical skills live under ../skills. Install skill folders directly or connect the MCP server. Do not maintain separate forks of the knowledge.

## Skills CLI

~~~bash
npx skills add shahinesi/Bale-Engineering --skill bale-engineering
~~~

To install a focused skill, replace the name with bale-bot-api, bale-miniapp, bale-safir, bale-message-formatting, bale-links or bale-engineering-review.

## Codex
Install the skill with the Skills CLI or copy it to the project's .agents/skills directory. For local MCP, build the package and add the command shown in ../packages/mcp-server/README.md.

## Claude Code
Install the skill with the Skills CLI or copy it to the project's .claude/skills directory. Add the local MCP server using the command in ../packages/mcp-server/README.md.

## Cursor and other agents
Use the Skills CLI if the agent is supported. Otherwise copy the selected skill folder to the agent's documented skills/rules directory. Keep the skill content canonical in this repository.

Agent configuration formats change. Check the target agent's current documentation before committing a generated config file.
