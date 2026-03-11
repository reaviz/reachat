import '../src/index.css';

import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import { theme, ThemeProvider } from 'reablocks';
import React from 'react';

import sbTheme from './theme';

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
    withThemeByClassName({
      themes: {
        light: 'theme-light',
        dark: 'theme-dark'
      },
      defaultTheme: 'dark'
    })
  ],
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
    docs: {
      theme: sbTheme
    },
    options: {
      storySort: {
        order: [
          'Docs',
          [
            'Intro',
            'Getting Started',
            'Themeing',
            'Customization',
            'Markdown Plugins',
            'API',
            'Changelog',
            'Support'
          ],
          'Demos',
          '*'
        ]
      }
    }
  }
};

export default preview;
