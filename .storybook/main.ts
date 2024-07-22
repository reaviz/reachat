import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.tsx',
    '../src/**/*.stories.tsx'
  ],

  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-essentials',
    '@storybook/addon-themes'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },

  core: {
    disableWhatsNewNotifications: true
  }
};

export default config;
