# GhosTnever DSH Toolkit

20 small, local-first plugins for DeepSeek Harness (DSH/Cordis). Each package is independently installable from this monorepo. Utilities only process the arguments sent to them; they do not read files, make network requests, or need API keys.

## Install one plugin

```sh
dsh plugin --profile web add "github:GhosTnever-lkm/dsh-ghostnever-toolkit#path:/packages/json-inspector"
```

Replace `json-inspector` with a folder from the catalog below. Start or restart the selected profile to load the bundle.

## Catalog

| Package | What it does |
|---|---|
| `json-inspector` | Parse, validate and summarize JSON safely. |
| `markdown-outline` | Build a heading outline and table of contents from Markdown. |
| `text-metrics` | Count characters, words, lines and estimate tokens. |
| `csv-profiler` | Inspect a CSV sample: dimensions, headers and empty cells. |
| `url-inspector` | Parse a URL into scheme, host, path and query parameters. |
| `timestamp-converter` | Convert Unix seconds or milliseconds to ISO date and back. |
| `base64-codec` | Encode UTF-8 text to Base64 or decode Base64 to UTF-8. |
| `text-hash` | Calculate SHA-256, SHA-384 or SHA-512 for supplied text. |
| `uuid-batch` | Generate up to 20 random UUID v4 identifiers. |
| `contrast-checker` | Check WCAG contrast ratio between two hex colors. |
| `html-entities` | Escape or unescape HTML special characters. |
| `case-converter` | Convert text between camel, Pascal, snake, kebab and title case. |
| `byte-size` | Convert bytes into readable binary and decimal size units. |
| `changelog-entry` | Format release notes using Keep a Changelog sections. |
| `branch-name` | Create a clean Git branch slug from a short description. |
| `commit-message` | Format a Conventional Commit subject from type and summary. |
| `secret-redactor` | Mask common API token patterns in supplied text. |
| `line-diff-summary` | Summarize added and removed lines between two text versions. |
| `semver-bump` | Increment major, minor or patch in a strict semantic version. |
| `checklist-builder` | Turn a list of tasks into a Markdown checklist. |

## Packages
- `json-inspector` - JSON Inspector
- `markdown-outline` - Markdown Outline
- `text-metrics` - Text Metrics
- `csv-profiler` - CSV Profiler
- `url-inspector` - URL Inspector
- `timestamp-converter` - Timestamp Converter
- `base64-codec` - Base64 Codec
- `text-hash` - Text Hash
- `uuid-batch` - UUID Batch
- `contrast-checker` - Contrast Checker
- `html-entities` - HTML Entities
- `case-converter` - Case Converter
- `byte-size` - Byte Size
- `changelog-entry` - Changelog Entry
- `branch-name` - Branch Name
- `commit-message` - Commit Message
- `secret-redactor` - Secret Redactor
- `line-diff-summary` - Line Diff Summary
- `semver-bump` - SemVer Bump
- `checklist-builder` - Checklist Builder

