import '../src/index.css';

import { DocsContainer } from '@storybook/addon-docs/blocks';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import { theme, ThemeProvider, themeUnify } from 'reablocks';
import React from 'react';

import { chatTheme, ChatThemeContext, unifyChatTheme } from '../src';
import sbTheme from './theme';

type ThemeVariant = 'default' | 'unify';

const getTheme = (variant: ThemeVariant) =>
  variant === 'unify' ? themeUnify : theme;

const getChatTheme = (variant: ThemeVariant) =>
  variant === 'unify' ? unifyChatTheme : chatTheme;

const WithVariant = (Story, context) => {
  const variant = (context.globals?.themeVariant as ThemeVariant) || 'unify';

  return (
    <ThemeProvider theme={getTheme(variant)}>
      <ChatThemeContext.Provider value={getChatTheme(variant)}>
        <Story />
      </ChatThemeContext.Provider>
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [
    WithVariant,
    withThemeByClassName({
      themes: {
        light: 'theme-light',
        dark: 'theme-dark'
      },
      defaultTheme: 'dark'
    })
  ],
  globalTypes: {
    themeVariant: {
      name: 'Theme Variant',
      description: 'Reablocks theme variant'
    }
  },
  initialGlobals: {
    themeVariant: 'unify'
  },
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
    docs: {
      theme: sbTheme,
      container: ({ children, context, ...props }) => {
        const DocsThemeWrapper: React.FC = () => {
          const isLight = context?.store?.globals?.globals?.theme === 'light';
          const variant =
            (context?.store?.globals?.globals?.themeVariant as ThemeVariant) ||
            'unify';

          return (
            <DocsContainer {...props} context={context}>
              <ThemeProvider theme={getTheme(variant)}>
                <ChatThemeContext.Provider value={getChatTheme(variant)}>
                  <div className={isLight ? 'theme-light' : 'theme-dark'}>
                    {children}
                  </div>
                </ChatThemeContext.Provider>
              </ThemeProvider>
            </DocsContainer>
          );
        };

        return <DocsThemeWrapper />;
      }
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
