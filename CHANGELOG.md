# Changelog

## [1.0.1] - 2026-10-08

### Fixed
- Repair changelog-entry validation and support optional release-note sections.
- Align optional branch prefix, commit scope, breaking flag, and checklist completion inputs with their schemas.
- Preserve valid JSON while redacting quoted credential values, including values with spaces; add Slack and Discord token patterns.
- Fix fenced shell instructions across package READMEs.

### Added
- Add automated execution checks for all 21 plugins using the pinned DSH tool-definition package.
- Run catalog, behavior, and entry-point syntax checks in GitHub Actions.
