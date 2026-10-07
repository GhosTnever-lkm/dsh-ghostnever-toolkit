# GhosTnever DSH Toolkit

A local-first toolkit of 21 independently installable plugins for DeepSeek Harness (DSH/Cordis). Utilities only process the arguments sent to them; they do not read files, make network requests, or need API keys.

## Install one plugin

```sh
dsh plugin --profile web add "github:GhosTnever-lkm/dsh-ghostnever-toolkit#path:/packages/<package-name>"
```

Replace `<package-name>` with a package name from the catalog. For example, install the JSON Inspector with `#path:/packages/json-inspector`. Start or restart the selected profile to load the bundle. Each plugin is installed separately; there is no command that installs the entire toolkit at once.

## Find a plugin

| I need to… | Package |
|---|---|
| Inspect JSON or CSV | `json-inspector`, `csv-profiler` |
| Format or measure text | `markdown-outline`, `text-metrics`, `case-converter`, `checklist-builder` |
| Work with URLs, dates, encoding or hashes | `url-inspector`, `timestamp-converter`, `base64-codec`, `text-hash`, `uuid-batch` |
| Prepare code changes and releases | `branch-name`, `commit-message`, `line-diff-summary`, `changelog-entry`, `semver-bump` |
| Check or clean supplied content | `secret-redactor`, `html-entities`, `contrast-checker`, `byte-size` |
| Set up a new repository | `gitignore-builder` |

## Verify before enabling

This repository is community-maintained and is not an official DeepSeek product. Check the current DSH/Cordis documentation for compatibility before installing. To inspect a package without activating it, download or clone this repository, review that package's `index.js` and `cordis.patch.yml`, and install only after you trust the code. The tools are intended to process only the arguments passed to them; they do not need file access, network access, credentials, or an API key. Do not pass secrets to any plugin.

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
| `gitignore-builder` | Generate a deduplicated `.gitignore` for selected languages, tools, and operating systems. |

## License

The toolkit and its plugins are available under the MIT License. See [LICENSE](LICENSE).

## ☕ Support / Pro Version

All plugins in this toolkit are free and open source under MIT. Optional support helps fund maintenance and new tools: [Buy Me a Coffee](https://buymeacoffee.com/azizazimov8) · [Boosty](https://boosty.to/azizazimov). There is no paid version required to use the plugins.

<details>
<summary>Public crypto addresses</summary>

Send only assets on the matching network.

| Network | Address |
|:--|:--|
| Bitcoin | `bc1qn75pj4n7gyl2k5kf2f97elvyenz52q6nn2g30u` |
| TRON | `TCBSy38X57hA6w2onJcxom24x1febc1mP1` |
| BNB Smart Chain | `0xD431a917961E0b086B96D9F72b5C8fF19b19068a` |

</details>

