/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import { resolve } from 'path';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) =>
  mode === 'library'
    ? {
      plugins: [
        tailwindcss(),
        svgrPlugin(),
        cssInjectedByJsPlugin(),
        react(),
        dts({
          // vite-plugin-dts 5 (unplugin-dts): entryRoot + rootDir keep
          // declarations flat at dist/ (TS 6 otherwise roots them at the
          // project dir, emitting dist/src/** with no usable types entry)
          include: ['src/**/*'],
          entryRoot: 'src',
          compilerOptions: { rootDir: 'src' }
        }),
        checker({
          typescript: true
        }),
        viteStaticCopy({
          targets: [
            {
              // static-copy v4: globs match files only ('stories/*' drops the
              // assets subdirectory) and matches keep their full path under
              // dest — so dest must be '' to land at dist/stories/**
              src: 'stories/**/*',
              dest: ''
            },
          ]
        })
      ],
      test: {
        globals: true,
        environment: 'jsdom',
        exclude: ['node_modules', 'dist']
      },
      resolve: {
        // Vite 8 resolves tsconfig "paths" natively (replaces the
        // vite-tsconfig-paths plugin); covers the '@/*' -> './src/*' alias
        tsconfigPaths: true
      },
      build: {
        minify: false,
        sourcemap: true,
        copyPublicDir: false,
        lib: {
          entry: resolve('src', 'index.ts'),
          // ESM-only — no UMD/CJS build
          formats: ['es'],
          fileName: 'index'
        },
        rollupOptions: {
          plugins: [
            external({
              includeDependencies: true
            })
          ],
          checks: {
            // Rolldown profiling note, not a defect: svgr/checker/dts are
            // JS plugins doing necessary work (SVG compile, tsc, d.ts emit)
            pluginTimings: false
          }
        }
      }
    }
    : {
      plugins: [
        svgrPlugin(),
        react(),
        checker({
          typescript: true
        })
      ],
      resolve: {
        tsconfigPaths: true
      },
      test: {
        globals: true,
        environment: 'jsdom',
        exclude: ['node_modules', 'dist'],
        coverage: {
          // vitest 4 removed coverage.all (whole-project reporting);
          // restore it by including all source files explicitly
          include: ['src/**']
        }
      }
    }
);
