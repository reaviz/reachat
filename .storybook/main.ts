import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.tsx',
    '../stories/**/*.mdx',
    '../src/**/*.stories.tsx',
  ],

  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  core: {
    disableWhatsNewNotifications: true,
  },
};

export default config;
