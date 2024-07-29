import { Preview } from '@storybook/react';
import { ThemeProvider, theme } from 'reablocks';
import { withThemeByClassName } from '@storybook/addon-themes';
import sbTheme from './theme';
import './index.css';

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'dark',
    }),
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
            'Support',
          ],
          'Demos',
          '*'
        ]
      }
    }
  }
};

export default preview;
