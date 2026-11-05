import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
function run(program, args, environment = {}) {
  const result = spawnSync(program, args, { stdio: 'inherit', timeout: 180000, env: { ...process.env, ...environment } });
  if (result.error) throw result.error;
  if (result.status !== 0) throw Error(`${program} failed with status ${result.status}`);
}
run(process.execPath, ['node_modules/typescript/bin/tsc', '--noEmit']);
await build();
const html = await readFile('dist/index.html', 'utf8');
const first = /<body>\s*(<!--[\s\S]*?-->)/.exec(html)?.[1];
if (!first || !first.includes('seed325ed87b') || !first.includes('THESIS') || !first.includes('OWN-WORLD') || !first.includes('STORY') || !first.includes('FIRSTVIEWPORT') || !first.includes('FORM') || !first.includes('FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md.')) throw Error('Opening body direction comment was not preserved');
for (const [entry, name] of [['tests/core.test.ts', 'core.test.mjs'], ['tests/scene.test.tsx', 'scene.test.mjs']]) {
  await build({ configFile: false, envDir: false, plugins: [react()], build: { ssr: entry, target: 'node22', outDir: 'build/tests', emptyOutDir: false, minify: false, rollupOptions: { output: { format: 'es', entryFileNames: name } } } });
}
await build({ configFile: false, envDir: false, plugins: [react()], define: { 'process.env.NODE_ENV': JSON.stringify('development'), 'process.env.RTL_SKIP_AUTO_CLEANUP': JSON.stringify('true') }, build: { target: 'es2022', outDir: 'build/dom', emptyOutDir: true, minify: false, lib: { entry: 'tests/dom.tsx', name: 'SpatialDOMTests', formats: ['iife'], fileName: () => 'dom.iife.js' } } });
// Vite sets NODE_ENV=production in this process; actual React act tests require development.
run(process.execPath, ['--test', 'build/tests/core.test.mjs', 'build/tests/scene.test.mjs'], { NODE_ENV: 'development' });
run(process.execPath, ['scripts/run-dom.mjs'], { NODE_ENV: 'development' });
