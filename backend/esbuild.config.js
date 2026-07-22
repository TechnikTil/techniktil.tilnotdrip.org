import { build } from "esbuild";
import { copy } from 'esbuild-plugin-copy';

await build({
  entryPoints: ['src/index.ts'],
  tsconfig: "tsconfig.json",
  format: 'esm',
  bundle: true,
  platform: "node",
  target: 'node24',
  outdir: "dist",
  external: ['@prisma/client'],

  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
  plugins: [
    copy({
      assets: {
          from: ['./assets/**/*'],
          to: ['./assets'],
        },
    })
  ]
});
