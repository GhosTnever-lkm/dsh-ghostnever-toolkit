import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const packageRoot = join(root, 'packages');
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const names = readdirSync(packageRoot).filter((name) => statSync(join(packageRoot, name)).isDirectory()).sort();
const errors = [];

if (names.length !== 20) errors.push(`Expected 20 packages, found ${names.length}.`);
for (const name of names) {
  const dir = join(packageRoot, name);
  for (const required of ['index.js', 'package.json', 'README.md', 'LICENSE', 'cordis.patch.yml']) {
    try { statSync(join(dir, required)); } catch { errors.push(`${name}: missing ${required}.`); }
  }
  let pkg;
  try { pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')); }
  catch { errors.push(`${name}: invalid package.json.`); continue; }
  if (!pkg.name || !pkg.version || !pkg.license) errors.push(`${name}: package.json needs name, version, and license.`);
  if (!readme.includes(`packages/${name}`) && !readme.includes(`\`${name}\``)) errors.push(`${name}: missing from README catalog or install instructions.`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${names.length} plugin packages: required files, JSON metadata, and README discovery entries are present.`);
}
