# GhosTnever DSH Toolkit

**21 small, focused plugins for DeepSeek Harness (DSH / Cordis).** Install only the tools you need, directly from this repository. The toolkit is community-maintained and is not an official DeepSeek product.

[![Verify plugin catalog](https://github.com/GhosTnever-lkm/dsh-ghostnever-toolkit/actions/workflows/verify.yml/badge.svg)](https://github.com/GhosTnever-lkm/dsh-ghostnever-toolkit/actions/workflows/verify.yml) · [Download v1.0.0](https://github.com/GhosTnever-lkm/dsh-ghostnever-toolkit/releases/download/v1.0.0/GhosTnever-DSH-Toolkit-v1.0.0.zip) · [Release notes](https://github.com/GhosTnever-lkm/dsh-ghostnever-toolkit/releases/tag/v1.0.0)

## Quick start

In a DSH-enabled profile, install a package by its folder name:

```sh
dsh plugin --profile web add "github:GhosTnever-lkm/dsh-ghostnever-toolkit#path:/packages/json-inspector"
```

Replace `json-inspector` with any package listed below. Restart the selected profile if DSH asks. Each plugin is independently installable; this command adds just one package.

## Choose a plugin

| Need | Packages |
|---|---|
| Inspect JSON or CSV | `json-inspector`, `csv-profiler` |
| Read and transform text | `markdown-outline`, `text-metrics`, `case-converter`, `checklist-builder`, `html-entities` |
| Work with URLs, dates and encodings | `url-inspector`, `timestamp-converter`, `base64-codec`, `text-hash`, `uuid-batch` |
| Prepare code changes and releases | `branch-name`, `commit-message`, `line-diff-summary`, `changelog-entry`, `semver-bump` |
| Check colors or sizes | `contrast-checker`, `byte-size` |
| Protect or clean supplied text | `secret-redactor` |
| Generate a `.gitignore` | `gitignore-builder` |

## Full catalog

| Package | What it does |
|---|---|
| `json-inspector` | Parse JSON and summarize its structure. |
| `markdown-outline` | Build a heading outline and table of contents. |
| `text-metrics` | Count characters, words, lines and estimate tokens. |
| `csv-profiler` | Inspect CSV dimensions, headers and empty cells. |
| `url-inspector` | Parse URL scheme, host, path and query parameters. |
| `timestamp-converter` | Convert Unix seconds or milliseconds to ISO dates and back. |
| `base64-codec` | Encode UTF-8 text as Base64 or decode it. |
| `text-hash` | Calculate SHA-256, SHA-384 or SHA-512 for supplied text. |
| `uuid-batch` | Generate up to 20 UUID v4 identifiers. |
| `contrast-checker` | Calculate WCAG contrast ratio for two hex colors. |
| `html-entities` | Escape or unescape HTML special characters. |
| `case-converter` | Convert text between common naming cases. |
| `byte-size` | Format byte counts in binary and decimal units. |
| `changelog-entry` | Format release notes using Keep a Changelog sections. |
| `branch-name` | Create a clean Git branch slug from a description. |
| `commit-message` | Format a Conventional Commit subject. |
| `secret-redactor` | Mask common token patterns in supplied text. |
| `line-diff-summary` | Summarize added and removed lines between two versions. |
| `semver-bump` | Increment a strict semantic version. |
| `checklist-builder` | Turn task lines into a Markdown checklist. |
| `gitignore-builder` | Generate a deduplicated `.gitignore` for selected tools and platforms. |

## Privacy and safety

Plugins process only the arguments passed to them. They do not make network requests or require file-system access, credentials, or API keys. Avoid passing secrets or sensitive personal data. Review a package's `index.js` and `cordis.patch.yml` before installing if you want to inspect its behavior. Check current DSH/Cordis documentation for compatibility before enabling plugins.

## Verification

The repository includes a catalog and metadata check. Run it locally with Node.js:

```sh
node scripts/verify-catalog.mjs
```

GitHub Actions also syntax-checks all plugin entry points.

## License and support

The toolkit is MIT licensed; see [LICENSE](LICENSE). Optional support: [Buy Me a Coffee](https://buymeacoffee.com/azizazimov8) · [Boosty](https://boosty.to/azizazimov). All plugins remain free; there is no paid version required.

