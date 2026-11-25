# Documentation

[فارسی](README.fa.md) · **English**

This directory contains the architecture guide and editable diagrams for Bale Engineering.

## Start here

- [System architecture](architecture.md)
- [Persian architecture guide](architecture.fa.md)
- [Diagram source files](diagrams/)

## Diagram catalogue

| Diagram | English source | Persian source |
|---|---|---|
| Platform selection | [platform-selection.mmd](diagrams/platform-selection.mmd) | [platform-selection.fa.mmd](diagrams/platform-selection.fa.mmd) |
| Bot update lifecycle | [bot-update-lifecycle.mmd](diagrams/bot-update-lifecycle.mmd) | [bot-update-lifecycle.fa.mmd](diagrams/bot-update-lifecycle.fa.mmd) |
| Mini App authentication | [miniapp-authentication.mmd](diagrams/miniapp-authentication.mmd) | [miniapp-authentication.fa.mmd](diagrams/miniapp-authentication.fa.mmd) |
| Wallet payment lifecycle | [wallet-payment-lifecycle.mmd](diagrams/wallet-payment-lifecycle.mmd) | [wallet-payment-lifecycle.fa.mmd](diagrams/wallet-payment-lifecycle.fa.mmd) |
| MCP architecture | [mcp-architecture.mmd](diagrams/mcp-architecture.mmd) | [mcp-architecture.fa.mmd](diagrams/mcp-architecture.fa.mmd) |

## Visual assets

- <code>../assets/brand/</code> — project mark and README hero artwork.
- <code>images/</code> — architecture overview illustrations in English and Persian.

## Contribution rules

- Keep Mermaid source files editable and commit them beside the documentation that uses them.
- Keep English and Persian versions in sync when behavior or architecture changes.
- Use SVG for small, crisp architecture illustrations; include a meaningful alt description wherever an image is embedded.
- Label conceptual diagrams as recommendations, not as verified production deployments.
- Never present a generated illustration as an actual screenshot of Bale or a production application.
- Validate Mermaid syntax in GitHub before merging. See the [official GitHub diagram guide](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams).
