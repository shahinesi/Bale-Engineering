# Repository instructions

Bale Engineering is a public, source-backed engineering knowledge system for Bale bots, Mini Apps and Safir integrations. It is not a production bot platform.

## Evidence rules
1. Use https://docs.bale.ai/ as the primary source for platform behavior.
2. Never assume Telegram compatibility means a method, field, limit or behavior is supported by Bale.
3. Label statements as Documented, Engineering recommendation, or Not documented / verify.
4. Add source URLs and a last-verified date to every platform reference.
5. Record ambiguity or contradictions instead of silently inventing a resolution.
6. Do not copy large sections of official documentation; write original explanations and small examples.

## Skill authoring
Every skill needs YAML frontmatter with `name` and a trigger-oriented `description`, purpose, when to use, when not to use, a decision workflow, why/when/how guidance, positive and rejected examples, failure modes, verification and canonical references.

Lead with a clear rule, then explain why and how. Write for both the agent and the engineer reviewing it. A skill should remain understandable when installed alone.

## Documentation and visual assets
- Keep `README.md` in English and `README.fa.md` in Persian; both must link to each other near the top.
- Keep architecture guides in `docs/architecture.md` and `docs/architecture.fa.md`.
- When architecture or behavior changes, update both language versions in the same change.
- Mermaid source files are the editable source of truth. Use `.mmd` for English and `.fa.mmd` for Persian.
- Embed Mermaid in GitHub Markdown using fenced `mermaid` blocks; standalone `.mmd` files should also render on GitHub.
- Use SVG for crisp diagrams and brand illustrations. Add meaningful `title`, `desc` and Markdown alt text.
- Mark architecture images as conceptual when they do not depict a verified deployment.
- Never present generated illustrations as real Bale client screenshots or production UI.
- Keep visual assets free of scripts, external dependencies and embedded secrets.
- Check links and GitHub rendering for both language variants before a documentation release.

## Safety
- Never include real bot tokens, Safir API keys, OTPs, phone numbers or production secrets.
- Treat callback payloads and Mini App client data as untrusted.
- Verify Mini App initData on the server before trusting identity.
- requestContact callback data alone is not proof of a verified phone number.
- A disabled button is not authorization.
- Preserve idempotency for outbound delivery and state-changing operations.
- Do not claim standard Markdown tables or Mermaid render natively in Bale unless an official source establishes it.

## MCP boundaries
The MCP is read-only and local-first. Tools must be deterministic and bounded. Resource paths must come from an explicit allowlisted catalog. Never log protocol messages to stdout in stdio mode. Do not send messages, call production APIs, deploy code or access user databases.

## Change discipline
Update skills, references, sources, diagrams and tests together. Keep Persian and English documentation aligned. Add tests for non-trivial validation. Do not claim tests/builds/deployments ran unless they did. Do not publish npm packages or enable remote hosting without an explicit release decision.
