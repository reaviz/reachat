/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
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
        tsconfigPaths(),
        cssInjectedByJsPlugin(),
        react(),
        dts({
          insertTypesEntry: true,
          include: ['src']
        }),
        checker({
          typescript: true
        }),
        viteStaticCopy({
          targets: [
            {
              src: 'stories/*',
              dest: 'stories/'
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
        alias: {
          '@': path.resolve(__dirname, './src')
        }
      },
      build: {
        minify: false,
        sourcemap: true,
        copyPublicDir: false,
        lib: {
          entry: resolve('src', 'index.ts'),
          name: 'reachat',
          fileName: 'index'
        },
        rollupOptions: {
          plugins: [
            external({
              includeDependencies: true
            })
          ]
        }
      }
    }
    : {
      plugins: [
        svgrPlugin(),
        tsconfigPaths(),
        react(),
        checker({
          typescript: true
        })
      ],
      test: {
        globals: true,
        environment: 'jsdom',
        exclude: ['node_modules', 'dist']
      }
    }
);
