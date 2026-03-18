import { Preview } from 'storybook/preview-api';
import { ThemeProvider, theme } from 'reablocks';
import { withThemeByClassName } from '@storybook/addon-themes';
import sbTheme from './theme';
import '../src/index.css';

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
        dark: 'theme-dark',
      },
      defaultTheme: 'dark',
    }),
  ],
  parameters: {
    layout: 'centered',
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
