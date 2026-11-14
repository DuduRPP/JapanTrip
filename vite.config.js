import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';

export default defineConfig({
  base: './',
  plugins: [react(), {
    name: 'diary-offline',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const publicDir = new URL('./public/', import.meta.url);
      const assets = readdirSync(publicDir, { recursive: true }).filter(path =>
        /\.(?:webmanifest|png|jpg|jpeg|webp|svg|woff2|ttf)$/i.test(path)
      ).map(path => path.replaceAll('\\', '/')).sort();
      const files = [...new Set(['index.html', ...Object.keys(bundle), ...assets])].sort();
      const source = readFileSync(new URL('./src/service-worker.js', import.meta.url), 'utf8');
      const hash = createHash('sha256').update(source);
      for (const file of files) {
        const output = bundle[file];
        hash.update(file).update(output?.type === 'chunk' ? output.code
          : output?.source ?? readFileSync(new URL(file, file === 'index.html' ? import.meta.url : publicDir)));
      }
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: source.replace('__PRECACHE_FILES__', JSON.stringify(files))
          .replace('__BUILD_VERSION__', hash.digest('hex').slice(0, 16)),
      });
    },
  }],
});
