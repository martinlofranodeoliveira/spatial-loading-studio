import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
function preserveDirectionComment(): Plugin {
  const source = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
  const comment = /<body>\s*(<!--[\s\S]*?-->)/.exec(source)?.[1];
  if (!comment) throw new Error('Missing opening body comment');
  return {
    name: 'preserve-opening-direction-comment',
    enforce: 'post',
    generateBundle(_options, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type === 'asset' && item.fileName.endsWith('.html') && typeof item.source === 'string') {
          item.source = item.source.replace(comment, '').replace('<body>', `<body>\n${comment}`);
        }
      }
    }
  };
}
export default defineConfig({ base: process.env.APP_BASE || './', plugins: [react(), preserveDirectionComment()], build: { target: 'es2022' } });
