# npm release guide

[فارسی](releasing.fa.md) · **English**

Package: <code>@bale-engineering/mcp-server</code>

Repository: https://github.com/shahinesi/Bale-Engineering

## Published release

The first public release, <code>0.1.0</code>, was successfully published to npm on 2026-11-25.

- [npm package page](https://www.npmjs.com/package/@bale-engineering/mcp-server)
- [GitHub repository](https://github.com/shahinesi/Bale-Engineering)

Verify the registry version:

~~~bash
npm view @bale-engineering/mcp-server version
~~~

Do not try to publish version <code>0.1.0</code> again. npm versions are immutable; every release needs a new version.

## What the package contains

- The executable local MCP server.
- Canonical skills and source-backed knowledge references.
- Templates, architecture documentation, Mermaid diagrams and brand assets.
- English and Persian package READMEs.
- Read-only MCP tools, resources and prompts.

The package runs over STDIO. It does not host an HTTP endpoint or call Bale/Safir production APIs.

## Before preparing the next release

1. Update the package version in <code>packages/mcp-server/package.json</code> using semantic versioning.
2. Update the changelog/release notes and both language READMEs if behavior or setup changes.
3. Run the full local verification:

   ~~~bash
   cd packages/mcp-server
   npm install
   npm run typecheck
   npm test
   npm run build
   npm run test:package
   ~~~

4. Review dependency security findings. Do not use <code>npm audit fix --force</code> without reviewing the proposed major-version changes and rerunning tests.
5. Merge the verified changes to the default branch.

## Publish from GitHub Actions

The publish workflow is <code>.github/workflows/publish.yml</code>. It runs typecheck, unit tests, build and the installed-tarball MCP STDIO smoke test before publishing.

### GitHub Actions authentication

The current workflow passes the repository secret <code>NPM_TOKEN</code> as <code>NODE_AUTH_TOKEN</code>. If you use this workflow as currently written:

1. Create an npm granular access token with publish permission for this package.
2. Add it under **GitHub repository → Settings → Secrets and variables → Actions** as <code>NPM_TOKEN</code>.
3. Do not paste the token into source code, issues, chat or committed files.
4. Keep the secret until the workflow has been changed to use npm Trusted Publishing without a token and that OIDC path has been tested successfully.

The workflow also grants <code>id-token: write</code>. The presence of that permission alone does not prove that tokenless Trusted Publishing is configured or working.

### Configure npm Trusted Publishing

After the package exists, open its npm settings and configure a GitHub Actions trusted publisher:

| Field | Value |
|---|---|
| Provider | GitHub Actions |
| Organization or user | <code>shahinesi</code> |
| Repository | <code>Bale-Engineering</code> |
| Workflow filename | <code>publish.yml</code> |
| Environment | Leave empty unless the workflow explicitly uses one |

For a true OIDC-only release, the workflow must call <code>npm publish</code> without relying on a long-lived <code>NPM_TOKEN</code> secret. Make and verify that workflow change before removing the secret.

## Release using a version tag

The publish workflow accepts tags matching <code>v*</code> and checks that the tag matches the package version.

For example, after changing the package version to <code>0.1.1</code> and merging the change:

~~~bash
git tag v0.1.1
git push origin v0.1.1
~~~

GitHub Actions then verifies and publishes that version, provided npm authentication is configured.

A normal push does not publish a package. The workflow can also be started manually from **Actions → Publish MCP package**, but the <code>confirm_publish</code> input must be explicitly set to <code>true</code>.

## First publication (historical)

The initial <code>0.1.0</code> release was published manually from an authenticated developer machine:

~~~bash
npm login
npm whoami
npm publish --access public
~~~

These commands are included for reference only. Do not rerun the publish command without first incrementing the package version.

## Package verification

After each release, verify the published version:

~~~bash
npm view @bale-engineering/mcp-server version
npm view @bale-engineering/mcp-server dist-tags
~~~

Then install it in a clean MCP client configuration and verify tool discovery, one tool call, a resource and a prompt. The local <code>npm run test:package</code> check covers these package-level behaviors before publication.

## Related guides

- [Complete MCP installation and usage guide](../packages/mcp-server/README.md)
- [Persian MCP installation and usage guide](../packages/mcp-server/README.fa.md)
- [Main repository README](../README.md)
