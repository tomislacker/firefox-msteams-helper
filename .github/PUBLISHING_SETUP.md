# Publishing Setup Guide

This document explains how to configure GitHub Actions secrets for publishing to Firefox Add-ons and Chrome Web Store.

## Overview

The GitHub Actions workflow automatically:

- **Lints & tests** on all pull requests and pushes to `main`
- **Builds artifacts** for both Firefox and Chrome
- **Publishes to registries** when you create a new git tag (e.g., `v0.1.0`)

## Required Secrets

Set these secrets in your GitHub repository settings under **Settings → Secrets and variables → Actions**.

### Firefox Add-ons Secrets

#### 1. `FIREFOX_API_KEY`

Get this from [addons.mozilla.org](https://addons.mozilla.org):

1. Sign in to your developer account
2. Go to **Settings → API Keys**
3. Create a new key with permissions for:
   - `Submit New Add-on`
   - `Edit Add-on`
4. Copy the "Issuer" value

#### 2. `FIREFOX_API_SECRET`

From the same **API Keys** page:

1. Copy the "Secret" value

### Chrome Web Store Secrets

The Chrome Web Store uses OAuth 2.0. You have two options:

#### Option A: Using Refresh Token (Recommended)

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the "Chrome Web Store API"

2. **Create OAuth 2.0 Credentials:**
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth 2.0 Client ID**
   - Select "Desktop application"
   - Download the JSON credentials file

3. **Get the Refresh Token:**
   - Install `google-auth-oauthlib`:
     ```bash
     pip install google-auth-oauthlib
     ```
   - Run the OAuth flow to get a refresh token
   - Or use the [Chrome Web Store token generator](https://github.com/DrewML/chrome-webstore-upload#tokens)

4. **Set These Secrets:**
   - `CHROME_CLIENT_ID`: OAuth client ID from step 2
   - `CHROME_CLIENT_SECRET`: OAuth client secret from step 2
   - `CHROME_REFRESH_TOKEN`: The refresh token from step 3
   - `CHROME_EXTENSION_ID`: Your Chrome extension ID (found in [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) after publishing once)

#### Option B: Using Access Token (Service Account)

1. Create a service account in Google Cloud Console
2. Generate a private key and download the JSON
3. Use the service account credentials instead of OAuth

## First-Time Publishing

### 1. Publish to Firefox Add-ons Manually

The first time, you may need to publish manually:

1. Go to [addons.mozilla.org developer hub](https://addons.mozilla.org/developers/)
2. Click **Submit a New Add-on**
3. Choose **Distribute on addons.mozilla.org**
4. Upload your extension zip file
5. Fill in metadata:
   - Use content from `STORE_DESCRIPTION.md`
   - Add screenshots
   - Accept the policies
6. Submit for review

Once approved, subsequent versions can be published via the API.

### 2. Publish to Chrome Web Store Manually

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **Create New Item**
3. Upload your extension zip file
4. Fill in metadata:
   - Use content from `STORE_DESCRIPTION.md`
   - Add screenshots (1280x800 recommended)
   - Add category and language
5. Pay the $5 developer fee if required
6. Click **Publish**

Your extension ID will appear after publishing. Save this as the `CHROME_EXTENSION_ID` secret.

## Creating a Release

Once everything is set up, publishing is simple:

```bash
# Create a tag (e.g., v0.1.0)
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin v0.1.0
```

The workflow will:

1. Update `manifest.json` with the version from the tag
2. Build signed artifacts for Firefox
3. Build and upload to Chrome Web Store
4. Create a GitHub Release with both artifacts

## Workflow Triggers

| Trigger        | Action                                                |
| -------------- | ----------------------------------------------------- |
| Push to `main` | Builds development artifacts (linting + packaging)    |
| Pull request   | Linting, secrets detection, validation                |
| Push tag `v*`  | Publishes to both registries + creates GitHub release |

## Troubleshooting

### Firefox Publishing Fails

- Verify `web-ext` is installed: `npm install -g web-ext`
- Check API credentials are correct
- Ensure your extension has been manually approved at least once

### Chrome Publishing Fails

- Verify the refresh token is still valid (they expire)
- Check the extension ID matches
- Ensure the Chrome Web Store API is enabled in Google Cloud

### Version Mismatch

The workflow automatically updates `manifest.json` version from the git tag. Don't manually edit the version before tagging.

## Development Builds

When you push to `main`, artifacts are automatically built and stored for 30 days. You can download them from the **Actions** tab to manually test in development:

1. Go to **Actions → Latest run**
2. Click **extension-artifacts**
3. Download the Firefox or Chrome zip
4. Extract and load as an unpacked extension in your browser

## Notes

- Secrets should never be committed to the repository
- The `manifest.json` version is automatically updated from git tags
- Both Firefox and Chrome signing/publishing can take a few hours to show in production
- Consider using semantic versioning for tags (v1.0.0, v1.0.1, etc.)
