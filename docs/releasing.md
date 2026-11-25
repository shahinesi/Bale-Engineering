# npm release guide

[فارسی](releasing.fa.md) · **English**

Package: <code>@bale-engineering/mcp-server</code>

Repository: https://github.com/shahinesi/Bale-Engineering

## Current publication state

The source package version is <code>0.1.0</code>. The npm package name is registered, but the visible <code>0.0.0-stage</code> version is only npm's placeholder for a newly staged package; it is not the functional MCP release. A staged candidate becomes installable only after a maintainer reviews and approves it with 2FA.

- [npm package page](https://www.npmjs.com/package/@bale-engineering/mcp-server)
- [GitHub repository](https://github.com/shahinesi/Bale-Engineering)

## What the package contains

- The executable local MCP server.
- Canonical skills and source-backed knowledge references.
- Templates, architecture documentation, Mermaid diagrams and brand assets.
- English and Persian package READMEs.
- Read-only MCP tools, resources and prompts.

The package runs over STDIO. It does not host an HTTP endpoint or call Bale/Safir production APIs.

## Requirements for release automation

- GitHub-hosted Actions runner.
- Node.js 22.14.0 or newer (workflow uses Node.js 24).
- npm CLI 11.15.0 or newer (workflow pins 11.15.0 for staged publishing).
- An npm Trusted Publisher configured for this exact repository and workflow.
- The trusted publisher must allow <code>npm stage publish</code>.

The workflow does not use an npm access token. OIDC authentication is provided by GitHub Actions through the <code>id-token: write</code> permission.

## npm Trusted Publisher configuration

In npm package settings → Trusted Publisher, use:

| Field | Value |
|---|---|
| Provider | GitHub Actions |
| Organization or user | <code>shahinesi</code> |
| Repository | <code>Bale-Engineering</code> |
| Workflow filename | <code>publish.yml</code> |
| Environment | Leave empty |

For least privilege, allow **npm stage publish** and disable direct **npm publish** for this trusted publisher. Staging lets CI submit a candidate, while a maintainer must still approve the exact package with 2FA before it becomes available to users.

A newly created trusted publisher must complete its first successful OIDC publish within two days. The current workflow uses <code>npm stage publish</code>, which is an OIDC-supported publishing action.

## Before preparing a release

1. Check the current package version in <code>packages/mcp-server/package.json</code>.
2. Check whether that version is already staged or published. Staged and published versions share the same version uniqueness rule.
3. If the version is unused, keep it. Otherwise choose the next unused semantic version; never try to stage the same version twice.
4. Update release notes and both language READMEs if behavior or setup changes.
5. Run local verification:

~~~bash
cd packages/mcp-server
npm install
npm run typecheck
npm test
npm run build
npm run test:package
~~~

6. Review dependency security findings. Do not use <code>npm audit fix --force</code> without reviewing breaking changes and rerunning tests.
7. Merge the verified changes to the default branch.

## Stage a release from GitHub Actions

The workflow is <code>.github/workflows/publish.yml</code>. It:

1. Runs on a version tag (<code>v*</code>) or a manually confirmed workflow dispatch.
2. Installs npm CLI 11.15.0, required for staged publishing.
3. Runs typecheck, unit tests, build and the packaged MCP STDIO smoke test.
4. Calls <code>npm stage publish --access public</code> using GitHub OIDC, without <code>NPM_TOKEN</code>.

### Option A — publish using a version tag

After confirming that the version in <code>package.json</code> is unused, create a matching tag. For example, for version <code>0.1.0</code>:

~~~bash
git tag v0.1.0
git push origin v0.1.0
~~~

The tag must exactly match the version in <code>packages/mcp-server/package.json</code>.

### Option B — run manually

1. Open **GitHub → Actions → Stage MCP package**.
2. Choose **Run workflow** on the <code>main</code> branch.
3. Set <code>confirm_stage</code> to <code>true</code>.
4. Start the workflow.

A normal push does not stage a package.

## Review and approve the staged package

After the OIDC workflow succeeds:

1. Open npm → your account → **Staged Packages**, or run:

~~~bash
npm stage list @bale-engineering/mcp-server
~~~

2. Inspect the stage details:

~~~bash
npm stage view <stage-id>
npm stage download <stage-id>
~~~

3. Review the package name, version, contents, publisher and provenance.
4. Approve the exact candidate with 2FA, either in npmjs.com or with:

~~~bash
npm stage approve <stage-id>
~~~

Only after approval does the staged version become a normal installable npm release.

## Verify the release

After approval:

~~~bash
npm view @bale-engineering/mcp-server version
npm view @bale-engineering/mcp-server dist-tags
~~~

Then install it in a clean MCP client configuration and verify tool discovery, one tool call, a resource and a prompt. The local <code>npm run test:package</code> check covers these package-level behaviors before staging.

## Security notes

- Do not add an <code>NPM_TOKEN</code> secret to GitHub Actions for this workflow.
- Do not restore <code>NODE_AUTH_TOKEN</code> to the publish step.
- Keep the npm trusted publisher restricted to the exact repository and <code>publish.yml</code> workflow.
- Prefer stage-only permission. Do not grant direct OIDC publishing unless there is a deliberate reason to bypass maintainer approval.
- After OIDC is validated, remove obsolete npm automation tokens that are no longer needed.

## Related guides

- [Complete MCP installation and usage guide](../packages/mcp-server/README.md)
- [Persian MCP installation and usage guide](../packages/mcp-server/README.fa.md)
- [Main repository README](../README.md)
