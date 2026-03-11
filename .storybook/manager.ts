import { PaintBrushIcon } from '@storybook/icons';
import React from 'react';
import { IconButton } from 'storybook/internal/components';
import { addons, types, useGlobals } from 'storybook/manager-api';

import sbTheme from './theme';

addons.setConfig({ theme: sbTheme });

const VariantToggle = React.memo(function VariantToggle() {
  const [globals, updateGlobals] = useGlobals();
  const current = globals.themeVariant || 'unify';
  const isUnify = current === 'unify';

  return React.createElement(
    IconButton,
    {
      key: 'variant-toggle',
      active: true,
      title: `Switch to ${isUnify ? 'Default' : 'Unify'} theme`,
      onClick: () =>
        updateGlobals({ themeVariant: isUnify ? 'default' : 'unify' })
    },
    React.createElement(PaintBrushIcon, null),
    React.createElement(
      'span',
      { style: { fontSize: 11, marginLeft: 4 } },
      isUnify ? 'Unify' : 'Default'
    )
  );
});

addons.register('variant-toggle', () => {
  addons.add('variant-toggle/tool', {
    type: types.TOOL,
    title: 'Theme Variant',
    match: ({ viewMode, tabId }) =>
      !!(viewMode && viewMode.match(/^(story|docs)$/)) && !tabId,
    render: () => React.createElement(VariantToggle)
  });
});
