import { Preview } from '@storybook/react';
import { ThemeProvider, theme } from 'reablocks';
import './index.css';

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    )
  ],
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' }
  }
};

export default preview;
