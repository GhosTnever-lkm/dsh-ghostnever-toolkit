# Gitignore Builder

Generate a `.gitignore` template from the languages, tools, and operating systems used by a project. The tool only returns text; it does not inspect or change repository files.

## Install

```sh
dsh plugin --profile web add "github:GhosTnever-lkm/dsh-ghostnever-toolkit#path:/packages/gitignore-builder"
```

Restart the selected profile after installing the bundle.

## Use

Ask the agent to build a `.gitignore` for your stack and provide one or more of these identifiers:

`node`, `python`, `dotnet`, `java`, `rust`, `go`, `vscode`, `jetbrains`, `macos`, `windows`, `linux`, `terraform`, `secrets`.

The generated patterns are deduplicated. Review them before adding them to your repository: build output is intentionally ignored for some stacks, and each project may have different tracking needs. Ignoring a secret file does not remove it from Git history if it was committed earlier.

License: MIT.
