import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const packageRoot = join(root, 'packages');
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const names = readdirSync(packageRoot).filter((name) => statSync(join(packageRoot, name)).isDirectory()).sort();
const errors = [];

if (names.length < 1) errors.push('Expected at least one plugin package.');
const pluginIds = new Set();
for (const name of names) {
  const dir = join(packageRoot, name);
  for (const required of ['index.js', 'package.json', 'README.md', 'LICENSE', 'cordis.patch.yml']) {
    try { statSync(join(dir, required)); } catch { errors.push(`${name}: missing ${required}.`); }
  }
  let pkg;
  try { pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')); }
  catch { errors.push(`${name}: invalid package.json.`); continue; }
  if (!pkg.name || !pkg.version || !pkg.license) errors.push(`${name}: package.json needs name, version, and license.`);
  if (pkg.name !== `dsh-ghostnever-${name}`) errors.push(`${name}: expected package name dsh-ghostnever-${name}.`);
  if (!Array.isArray(pkg.keywords) || !pkg.keywords.includes('deepseek-harness') || !pkg.keywords.includes('cordis')) {
    errors.push(`${name}: package.json must include deepseek-harness and cordis keywords.`);
  }
  const source = readFileSync(join(dir, 'index.js'), 'utf8');
  const patch = readFileSync(join(dir, 'cordis.patch.yml'), 'utf8');
  const readmePath = join(dir, 'README.md');
  const packageReadme = readFileSync(readmePath, 'utf8');
  const pluginId = `dsh-ghostnever-${name}`;
  const expectedTool = {
    'case-converter': 'dsh_ghostnever_case_convert',
    'checklist-builder': 'dsh_ghostnever_checklist_build',
    'contrast-checker': 'dsh_ghostnever_contrast_check',
    'csv-profiler': 'dsh_ghostnever_csv_profile',
    'json-inspector': 'dsh_ghostnever_json_inspect',
    'secret-redactor': 'dsh_ghostnever_secret_redact',
    'timestamp-converter': 'dsh_ghostnever_timestamp_convert',
    'url-inspector': 'dsh_ghostnever_url_inspect',
  }[name] ?? `dsh_ghostnever_${name.replaceAll('-', '_')}`;
  if (!source.includes(`export const name = '${pluginId}'`)) errors.push(`${name}: index.js plugin name does not match package name.`);
  if (!source.includes(`name: '${expectedTool}'`)) errors.push(`${name}: index.js tool name does not match package name.`);
  if (!patch.includes(`id: ${pluginId}`) || !patch.includes(`name: ${pluginId}`)) errors.push(`${name}: Cordis patch does not register ${pluginId}.`);
  if (!packageReadme.includes(`packages/${name}`) && !packageReadme.includes(`#path:/packages/${name}`)) {
    errors.push(`${name}: README must document how to install this package.`);
  }
  if (!readme.includes(`packages/${name}`) && !readme.includes(`\`${name}\``)) errors.push(`${name}: missing from README catalog or install instructions.`);
  if (pluginIds.has(pluginId)) errors.push(`${name}: duplicate plugin id ${pluginId}.`);
  pluginIds.add(pluginId);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${names.length} plugin packages: required files, JSON metadata, and README discovery entries are present.`);
}
