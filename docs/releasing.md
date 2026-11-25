# npm release guide

[فارسی](releasing.fa.md) · **English**

Package: <code>@bale-engineering/mcp-server</code>

Repository: https://github.com/shahinesi/Bale-Engineering

## What is already prepared

- The MCP package is no longer marked private.
- Package metadata, executable CLI entry and public access configuration are present.
- The prepack step bundles the canonical <code>skills/</code>, <code>knowledge/</code>, <code>templates/</code>, <code>docs/</code>, <code>assets/brand/</code> and <code>sources.json</code> files.
- The runtime selects repository files during development and bundled package data after npm installation.
- The CI workflow runs typecheck, unit tests, build and a real installed-package MCP STDIO smoke test.
- The publish workflow uses npm Trusted Publishing (OIDC) when configured.

## Important: npm scope ownership

The package name uses the <code>@bale-engineering</code> npm scope. The person publishing must own that npm organization/scope or have publish permission for it. A GitHub repository name does not automatically grant npm scope ownership.

If that scope is not yours, stop before publishing and choose an npm scope you control or an available unscoped package name. Do not publish under another organization's scope.

## First publication

There are two options.

### Option A — publish once from an authenticated machine

1. Sign in to the npm account that owns the scope:

   ~~~bash
   npm login
   ~~~

2. From the repository:

   ~~~bash
   cd packages/mcp-server
   npm install
   npm run typecheck
   npm test
   npm run build
   npm run test:package
   npm publish --access public
   ~~~

3. Verify the package page and installed version on npm.

### Option B — bootstrap with GitHub Actions

1. Create a granular npm access token with publish permission for this package/scope.
2. Add it to the GitHub repository as an Actions secret named <code>NPM_TOKEN</code>.
3. Open **Actions → Publish MCP package → Run workflow**.
4. Set <code>confirm_publish</code> to <code>true</code>.
5. The workflow repeats typecheck, tests, build and the packaged STDIO smoke test before publishing.

Do not paste the npm token into chat, source code or a committed file.

## Configure Trusted Publishing after the first package exists

On npmjs.com, open the package settings and add a GitHub Actions trusted publisher:

| Field | Value |
|---|---|
| Provider | GitHub Actions |
| Organization or user | <code>shahinesi</code> |
| Repository | <code>Bale-Engineering</code> |
| Workflow filename | <code>publish.yml</code> |
| Allowed action | <code>npm publish</code> |

The workflow grants <code>id-token: write</code> and uses Node.js 24, which satisfies npm's current Trusted Publishing requirements. After a successful OIDC publish, remove the long-lived <code>NPM_TOKEN</code> secret if it was only used for bootstrap.

## Future releases

1. Update the version in <code>packages/mcp-server/package.json</code> using semantic versioning.
2. Commit and push the change.
3. Create a tag matching the package version, for example:

   ~~~bash
   git tag v0.1.1
   git push origin v0.1.1
   ~~~

4. GitHub Actions verifies the package and publishes the tarball.

The workflow is intentionally not triggered by ordinary pushes. Creating a version tag or explicitly confirming the manual workflow is the release action.

## Local package checks

~~~bash
cd packages/mcp-server
npm install
npm run typecheck
npm test
npm run build
npm run test:package
~~~

The package smoke test creates a tarball, installs it into a clean temporary consumer, starts the installed server through the official MCP client over STDIO, then checks tools, a Persian reference, a resource and a prompt.

## Current publication status

The repository contains the publishing configuration, but this does not mean the package is already on npm. The first publish still requires an npm account with permission for the <code>@bale-engineering</code> scope and one-time authentication/bootstrap.
