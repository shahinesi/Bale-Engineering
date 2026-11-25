# npm release guide

[فارسی](releasing.fa.md) · **English**

Package: <code>@bale-engineering/mcp-server</code>

Repository: https://github.com/shahinesi/Bale-Engineering

## Current release state

- **Published release:** <code>0.1.0</code>. The maintainer's local <code>npm publish</code> command completed successfully.
- **Next source candidate:** <code>0.1.1</code>. This version is prepared in the repository for the first successful OIDC staged release.
- **Staging placeholder:** <code>0.0.0-stage</code>. This is npm's package-name reservation/placeholder, not the Bale Engineering application release.
- **Staged versions:** the maintainer checked <code>npm stage list</code>; it returned no staged versions at that time.

The command <code>npm view @bale-engineering/mcp-server version</code> reads the version behind the <code>latest</code> dist-tag. It does not list every published version. To verify a specific release, query it directly:

~~~bash
npm view @bale-engineering/mcp-server@0.1.0 version
npm view @bale-engineering/mcp-server versions --json
npm view @bale-engineering/mcp-server dist-tags
~~~

The initial <code>npm view ... version</code> check was run immediately after publishing, while npm reported that the package was still being processed. Allow registry propagation, then verify the exact version and dist-tags before diagnosing a missing release.

## What the package contains

- The executable local MCP server.
- Canonical skills and source-backed knowledge references.
- Templates, architecture documentation, Mermaid diagrams and brand assets.
- Complete English and Persian package READMEs.
- Read-only MCP tools, resources and prompts.

The package runs over STDIO. It does not host an HTTP endpoint or call Bale/Safir production APIs.

## npm Trusted Publisher configuration

The package's Trusted Publisher is configured as follows:

| Field | Value |
|---|---|
| Provider | GitHub Actions |
| Organization or user | <code>shahinesi</code> |
| Repository | <code>Bale-Engineering</code> |
| Workflow filename | <code>publish.yml</code> |
| Environment | Empty |

The workflow uses GitHub OIDC with <code>id-token: write</code> and does not use <code>NPM_TOKEN</code> or <code>NODE_AUTH_TOKEN</code>.

For least privilege, allow **npm stage publish** and disable direct **npm publish** for this Trusted Publisher. Staging lets CI submit a candidate; a maintainer reviews and approves the exact package with 2FA before it becomes an ordinary release.

A newly created Trusted Publisher must complete its first successful OIDC publish within the validation window shown by npm. The current workflow is designed to perform that first OIDC action using <code>npm stage publish</code>.

## Preparing the next release

The current source candidate is <code>0.1.1</code>.

1. Keep <code>packages/mcp-server/package.json</code> as the single source of truth for the package version.
2. The MCP server reads its reported version from that manifest at runtime; do not hardcode a second version in <code>src/index.ts</code>.
3. Check the npm registry before staging. The workflow checks that the requested version matches <code>package.json</code> and that it is not already published.
4. Update both package READMEs and the release notes when installation, behavior or package contents change.
5. Review dependency security findings. Do not use <code>npm audit fix --force</code> without reviewing breaking changes and rerunning tests.

## Stage a release from GitHub Actions

The workflow is <code>.github/workflows/publish.yml</code>. It is **manual-only**: a normal push or tag does not publish or stage anything.

It performs these steps:

1. Requires an explicit <code>release_version</code> input matching <code>packages/mcp-server/package.json</code>.
2. Requires <code>confirm_stage = true</code>; otherwise the job is skipped.
3. Installs Node.js 24 and npm CLI 11.15.0.
4. Checks the requested version against the public npm versions list.
5. Runs typecheck, unit tests, build and the packaged MCP STDIO smoke test.
6. Calls <code>npm stage publish --access public</code> using GitHub OIDC.

### Run the workflow

1. Open [GitHub Actions — Stage MCP package](https://github.com/shahinesi/Bale-Engineering/actions/workflows/publish.yml).
2. Select **Run workflow** on the <code>main</code> branch.
3. Enter <code>0.1.1</code> in <code>release_version</code>.
4. Set <code>confirm_stage</code> to <code>true</code>.
5. Start the workflow and inspect every step.

Do not change the input to a different version unless <code>packages/mcp-server/package.json</code> has been updated and the new version has been checked first.

## Review and approve the staged package

After the OIDC workflow succeeds:

1. Open npm → your account → **Staged Packages**, or use:

~~~bash
npm stage list @bale-engineering/mcp-server
~~~

2. Inspect the stage:

~~~bash
npm stage view <stage-id>
npm stage download <stage-id>
~~~

3. Review the package name, version, contents, bilingual READMEs, publisher and provenance.
4. Approve the exact candidate with 2FA in npmjs.com, or use:

~~~bash
npm stage approve <stage-id>
~~~

Only after approval does the staged version become a normal installable npm release.

## Verify the release and the latest tag

After approval, verify the exact version first:

~~~bash
npm view @bale-engineering/mcp-server@0.1.1 version
npm view @bale-engineering/mcp-server versions --json
npm view @bale-engineering/mcp-server dist-tags
~~~

The <code>latest</code> dist-tag controls what an unpinned install such as <code>npx @bale-engineering/mcp-server</code> resolves to. If <code>latest</code> still points to <code>0.0.0-stage</code>, do not use <code>@latest</code>; pin the approved version. A maintainer can correct the tag after checking the exact published version.

For a reproducible installation, use an exact version:

~~~bash
npx -y @bale-engineering/mcp-server@0.1.1
~~~

## Package verification in CI

The package smoke test checks:

- The packed tarball version matches <code>package.json</code>.
- Both complete language READMEs are included.
- The Codex Desktop TOML setup is present in both READMEs.
- The tarball installs into a clean temporary consumer.
- MCP initialize, tool discovery, a tool call, a Persian reference, a resource and a prompt work over STDIO.

The normal CI workflow runs typecheck, unit tests, build and this package smoke test on pushes and pull requests to <code>main</code>.

## Security notes

- Do not add an <code>NPM_TOKEN</code> secret to GitHub Actions for this workflow.
- Do not restore <code>NODE_AUTH_TOKEN</code> to the staging step.
- Keep the npm Trusted Publisher restricted to this exact repository and <code>publish.yml</code> workflow.
- Prefer stage-only permission. Do not grant direct OIDC publishing unless there is a deliberate reason to bypass maintainer approval.
- Never stage or publish a version that already exists.

## Related guides

- [Complete MCP installation and usage guide](../packages/mcp-server/README.md)
- [Persian MCP installation and usage guide](../packages/mcp-server/README.fa.md)
- [Main repository README](../README.md)
