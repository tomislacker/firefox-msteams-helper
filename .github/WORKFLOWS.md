# GitHub Actions Workflows

This project uses GitHub Actions to automate building, testing, and publishing the extension to Firefox Add-ons and Chrome Web Store.

## Workflow: Build & Publish

**File**: `.github/workflows/build-and-publish.yml`

### Jobs

#### 1. `lint-and-check` (All triggers)

Runs on every push and pull request.

**Steps:**

- **Lint JavaScript**: ESLint checks for code quality issues
- **Check formatting**: Prettier ensures consistent code style
- **Detect secrets**: TruffleHog scans for accidentally committed API keys
- **Validate manifest**: Ensures `manifest.json` is valid JSON

**Status**: ✅ Must pass for publication (but continues on error for visibility)

#### 2. `build-artifacts` (Push to main, Pull requests)

Runs when code is pushed to `main` or a pull request is opened.

**Steps:**

- Extracts version from `manifest.json`
- Creates Firefox artifact (zip file)
- Creates Chrome artifact (zip file)
- Uploads both as GitHub artifacts (30-day retention)

**Downloads location**: Actions tab → Latest run → "extension-artifacts"

#### 3. `publish-firefox` (Tags only)

Only runs when you create a git tag (e.g., `git tag v1.0.0`).

**Steps:**

- Extracts version from tag
- Updates `manifest.json` with the version
- Builds Firefox extension
- Signs with Mozilla API credentials
- Uploads signed `.xpi` file

**Requirements:**

- `FIREFOX_API_KEY` secret
- `FIREFOX_API_SECRET` secret
- Extension pre-approved on [addons.mozilla.org](https://addons.mozilla.org)

#### 4. `publish-chrome` (Tags only)

Only runs when you create a git tag.

**Steps:**

- Extracts version from tag
- Updates `manifest.json` with the version
- Builds Chrome extension (zip file)
- Uploads to Chrome Web Store via API

**Requirements:**

- `CHROME_EXTENSION_ID` secret
- `CHROME_CLIENT_ID` secret
- `CHROME_CLIENT_SECRET` secret
- `CHROME_REFRESH_TOKEN` secret

#### 5. `create-release` (Tags only)

Runs after both Firefox and Chrome publishing succeed.

**Steps:**

- Downloads all artifacts
- Creates a GitHub Release with:
  - Signed Firefox `.xpi` file
  - Chrome `.zip` file
  - Links to both app stores
  - Commit history

## How to Use

### Development Workflow

1. **Make changes** and push to a branch (or `main`)

   ```bash
   git checkout -b feature/my-improvement
   # ... make changes ...
   git push origin feature/my-improvement
   ```

2. **Create a pull request** to `main`
   - The workflow runs automatically
   - Check that linting and checks pass

3. **Test the artifacts:**
   - Go to **Actions → Latest run**
   - Download "extension-artifacts"
   - Extract and load in your browser for testing

### Release Workflow

1. **Create a tag** with semantic versioning:

   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **Wait for the workflow** to complete:
   - Check Actions tab for build status
   - Usually takes 5-10 minutes

3. **Verify publishing:**
   - Firefox: Check [addons.mozilla.org/firefox/addon/teams-hotkey-helper/](https://addons.mozilla.org/firefox/addon/teams-hotkey-helper/) (may take a few hours)
   - Chrome: Check [Chrome Web Store](https://chromewebstore.google.com/) (usually faster)

4. **GitHub Release:**
   - A new release appears in the Releases tab
   - Contains both `.xpi` and `.zip` files

## Configuration Files

### `.eslintrc.json`

ESLint configuration for JavaScript linting:

- Uses `eslint:recommended` rules
- Configured for WebExtensions API
- Warns on unused variables and console logs

### `.prettierrc`

Code formatting rules:

- 2-space indentation
- 80-character line width
- Single quotes for consistency
- Trailing commas for ES5 compatibility

### `package.json`

Node.js dependencies and scripts:

```bash
npm run lint          # Run ESLint
npm run format        # Auto-format code
npm run format:check  # Check formatting without changes
npm run secrets       # Run TruffleHog secret detection
npm run validate      # Run all checks
```

## Secrets Setup

See [PUBLISHING_SETUP.md](./PUBLISHING_SETUP.md) for detailed instructions on:

- Getting Firefox API credentials
- Setting up Chrome Web Store API access
- Configuring GitHub secrets

## Troubleshooting

### Linting Fails

```bash
# Fix formatting automatically
npm run format
git add -A
git commit -m "style: fix formatting"
git push
```

### Version Mismatch

The workflow automatically updates `manifest.json` from the git tag. Don't manually change the version before tagging.

### Publishing Fails

1. Check the Actions log for detailed error messages
2. Verify all required secrets are set in repository settings
3. For Firefox: ensure the extension has been manually approved once
4. For Chrome: verify the refresh token hasn't expired

### Secrets Detection Blocks Commit

If TruffleHog finds something:

1. Remove the secret from the code
2. Regenerate the secret (if it was exposed)
3. Update GitHub secrets
4. Retry the workflow

## Local Development

You can run checks locally before pushing:

```bash
# Install dependencies
npm install

# Run all checks
npm run validate

# Or run individual checks
npm run lint
npm run format:check
npm run secrets
```

## Artifact Retention

- **Development artifacts** (main branch builds): 30 days
- **Release artifacts** (tags): Stored indefinitely in GitHub Releases

Old development artifacts are automatically deleted after 30 days to save storage.

## GitHub Release Template

When you create a release with a tag, the workflow automatically generates:

```markdown
## Installation

- **Firefox**: [addons.mozilla.org](link)
- **Chrome**: [Chrome Web Store](link)

### Changes in this release

[Link to commit history]
```

You can edit the release afterward to add more details, screenshots, or breaking changes.
