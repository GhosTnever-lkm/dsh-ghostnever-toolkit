import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const packages = readdirSync(new URL('../packages/', import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

async function getTool(packageName) {
  const module = await import(`../packages/${packageName}/index.js`)
  let definition
  module.apply({ tools: { register(tool) { definition = tool } } })
  assert.ok(definition, `${packageName} should register a tool`)
  return definition
}

const cases = [
  ['json-inspector', 'dsh_ghostnever_json_inspect', { input: '{"ok":true}' }, (v) => assert.equal(v.rootType, 'object')],
  ['markdown-outline', 'dsh_ghostnever_markdown_outline', { markdown: '# Title\n## Section' }, (v) => assert.equal(v.headings.length, 2)],
  ['text-metrics', 'dsh_ghostnever_text_metrics', { text: 'one two\nthree' }, (v) => assert.equal(v.words, 3)],
  ['csv-profiler', 'dsh_ghostnever_csv_profile', { csv: 'name,age\nAda,36\n' }, (v) => assert.equal(v.rows, 1)],
  ['url-inspector', 'dsh_ghostnever_url_inspect', { url: 'https://example.com/a?x=1' }, (v) => assert.equal(v.query.x, '1')],
  ['timestamp-converter', 'dsh_ghostnever_timestamp_convert', { value: '0' }, (v) => assert.equal(v.iso, '1970-01-01T00:00:00.000Z')],
  ['base64-codec', 'dsh_ghostnever_base64_codec', { text: 'hello', mode: 'encode' }, (v) => assert.equal(v.result, 'aGVsbG8=')],
  ['text-hash', 'dsh_ghostnever_text_hash', { text: 'abc', algorithm: 'sha256' }, (v) => assert.equal(v.hex.length, 64)],
  ['uuid-batch', 'dsh_ghostnever_uuid_batch', { count: 2 }, (v) => assert.equal(v.uuids.length, 2)],
  ['contrast-checker', 'dsh_ghostnever_contrast_check', { foreground: '#000', background: '#fff' }, (v) => assert.equal(v.aaNormal, true)],
  ['html-entities', 'dsh_ghostnever_html_entities', { text: '<b>', mode: 'escape' }, (v) => assert.equal(v.result, '&lt;b&gt;')],
  ['case-converter', 'dsh_ghostnever_case_convert', { text: 'hello world', style: 'snake' }, (v) => assert.equal(v.result, 'hello_world')],
  ['byte-size', 'dsh_ghostnever_byte_size', { bytes: 1024 }, (v) => assert.equal(v.binary, '1.00 KiB')],
  ['changelog-entry', 'dsh_ghostnever_changelog_entry', { version: '1.2.3', added: ['New feature'] }, (v) => assert.match(v.markdown, /### Added\n- New feature/)],
  ['branch-name', 'dsh_ghostnever_branch_name', { description: 'Add support' }, (v) => assert.equal(v.branch, 'feature/add-support')],
  ['commit-message', 'dsh_ghostnever_commit_message', { type: 'feat', summary: 'add support' }, (v) => assert.equal(v.message, 'feat: add support')],
  ['secret-redactor', 'dsh_ghostnever_secret_redact', { text: 'api_key=abc123' }, (v) => assert.match(v.redactedText, /REDACTED/)],
  ['line-diff-summary', 'dsh_ghostnever_line_diff_summary', { before: 'a', after: 'b' }, (v) => assert.equal(v.added + v.removed, 2)],
  ['semver-bump', 'dsh_ghostnever_semver_bump', { version: '1.2.3', part: 'minor' }, (v) => assert.equal(v.version, '1.3.0')],
  ['checklist-builder', 'dsh_ghostnever_checklist_build', { items: ['Task'] }, (v) => assert.match(v.markdown, /- \[ \] Task/)],
  ['gitignore-builder', 'dsh_ghostnever_gitignore_builder', { stacks: ['node', 'python'] }, (v) => assert.match(v.gitignore, /node_modules/)],
]

for (const [packageName, expectedName, args, verify] of cases) {
  test(`${packageName} registers and executes its documented example`, async () => {
    const tool = await getTool(packageName)
    assert.equal(tool.name, expectedName)
    verify(await tool.execute(args))
  })
}

test('changelog sections are optional in the model-facing schema', async () => {
  const tool = await getTool('changelog-entry')
  assert.deepEqual(tool.parameters.required, ['version'])
  assert.ok(Object.hasOwn(tool.parameters.properties, 'date'))
  assert.ok(Object.hasOwn(tool.parameters.properties, 'added'))
  assert.match((await tool.execute({ version: '1.0.0' })).markdown, /^## \[1\.0\.0\]/)
})

test('branch prefix, commit scope and checklist completion list are optional', async () => {
  const branch = await getTool('branch-name')
  const commit = await getTool('commit-message')
  const checklist = await getTool('checklist-builder')
  assert.deepEqual(branch.parameters.required, ['description'])
  assert.deepEqual(commit.parameters.required, ['type', 'summary'])
  assert.deepEqual(checklist.parameters.required, ['items'])
})

test('secret redaction preserves quoted JSON and masks common service credentials', async () => {
  const tool = await getTool('secret-redactor')
  const input = '{"apiKey": "secret value with spaces"}\napi_key=unquoted-secret\nAWS_ACCESS_KEY_ID=AKIA1234567890ABCDEF\nxoxb-123456789012-abcdefghij\nhttps://discord.com/api/webhooks/123456/abcDEF'
  const { redactedText, replacements } = await tool.execute({ text: input })
  assert.doesNotThrow(() => JSON.parse(redactedText.split('\n')[0]))
  assert.equal(replacements, 5)
  assert.doesNotMatch(redactedText, /secret value with spaces|unquoted-secret|AKIA1234567890ABCDEF|xoxb-123456789012|discord\.com\/api\/webhooks\/123456\/abcDEF/)
})

test('each package README uses a closed fenced shell block', () => {
  for (const packageName of packages) {
    const readme = readFileSync(new URL(`../packages/${packageName}/README.md`, import.meta.url), 'utf8')
    assert.match(readme, /```sh\r?\n[\s\S]*?\r?\n```/)
    assert.doesNotMatch(readme, /^`sh\r?$/m)
  }
})

test('root and all installable packages include the complete MIT license', () => {
  const licenseFiles = ['../LICENSE', ...packages.map((name) => `../packages/${name}/LICENSE`)]
  for (const file of licenseFiles) {
    const license = readFileSync(new URL(file, import.meta.url), 'utf8')
    assert.match(license, /Copyright \(c\) 2026 GhosTnever/, `${file} should use the public author name`)
    assert.match(license, /IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM/)
    assert.match(license.trimEnd(), /DEALINGS IN THE SOFTWARE\.$/)
  }
})
