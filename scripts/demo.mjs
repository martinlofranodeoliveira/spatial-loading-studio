import { build } from 'vite';
import { spawnSync } from 'node:child_process';
await build({ configFile: false, envDir: false, logLevel: 'error', build: { ssr: 'src/cli.ts', target: 'node22', outDir: 'build/cli', emptyOutDir: true, minify: false, rollupOptions: { output: { format: 'es', entryFileNames: 'demo.mjs' } } } });
const result = spawnSync(process.execPath, ['build/cli/demo.mjs', ...process.argv.slice(2)], { stdio: 'inherit', timeout: 30000 });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
