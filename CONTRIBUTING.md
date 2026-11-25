<p align="right"><a href="CONTRIBUTING.fa.md">فارسی</a> · <strong>English</strong></p>

# Contributing

1. Open the official Bale documentation before changing a platform fact.
2. Update the relevant knowledge reference, skill and sources.json together.
3. Add validator tests when a rule can be checked deterministically.
4. Record uncertainty instead of turning assumptions into facts.
5. Use fake values only; never commit credentials, OTPs or customer data.
6. Keep the English and Persian README and architecture guides aligned.
7. When changing a diagram, edit the Mermaid source file and its language pair.
8. When changing an architecture illustration, keep the SVG accessible and clearly label conceptual content.

A useful PR explains the engineering problem, evidence, decision, alternatives rejected, verification and known limitations. Keep changes focused.

## Visual documentation

- Mermaid files are the editable source of truth; do not replace them with screenshots.
- GitHub renders Mermaid in Markdown and supported .mmd files. Validate the result in the repository UI.
- SVG assets must include a title, description and meaningful alt text in the Markdown that embeds them.
- Do not present an illustrative SVG as a real screenshot or a verified production deployment.
- Keep Persian and English diagrams semantically equivalent, even when labels differ.
