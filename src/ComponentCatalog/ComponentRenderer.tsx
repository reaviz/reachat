import React, { FC, useContext, useMemo } from 'react';
import { ChatContext } from '@/ChatContext';
import { ChartError } from '@/Markdown/charts/ChartError';
import { validateSpec } from './validateSpec';
import type {
  ComponentDefinitions,
  ComponentSpec,
  ComponentCatalogOptions,
  ComponentCatalogError
} from './types';

export interface ComponentRendererProps {
  /**
   * The raw JSON string from the ```component code block.
   */
  raw: string;

  /**
   * The component definitions from the catalog.
   */
  definitions: ComponentDefinitions;

  /**
   * Optional catalog options (for onError callback).
   */
  options?: ComponentCatalogOptions;
}

export const ComponentRenderer: FC<ComponentRendererProps> = ({
  raw,
  definitions,
  options
}) => {
  const { theme, sendMessage } = useContext(ChatContext);
  const result = useMemo(
    () => validateSpec(raw, definitions),
    [raw, definitions]
  );

  if (!result.ok) {
    const error = (result as { ok: false; error: ComponentCatalogError }).error;
    const custom = options?.onError?.(error);
    if (custom !== undefined) {
      return <>{custom}</>;
    }
    return (
      <ChartError
        title={errorTitle(error.type)}
        message={error.message}
        code={error.raw}
      />
    );
  }

  const { specs } = result as { ok: true; specs: ComponentSpec[] };

  return (
    <div className={theme.component?.base}>
      {specs.map((spec, i) => (
        <SpecRenderer
          key={`${spec.type}-${i}`}
          spec={spec}
          definitions={definitions}
          options={options}
          sendMessage={sendMessage}
        />
      ))}
    </div>
  );
};

interface SpecRendererProps {
  spec: ComponentSpec;
  definitions: ComponentDefinitions;
  options?: ComponentCatalogOptions;
  sendMessage?: (message: string) => void;
}

const SpecRenderer: FC<SpecRendererProps> = ({
  spec,
  definitions,
  options,
  sendMessage
}) => {
  const definition = definitions[spec.type];

  if (!definition) {
    const error: ComponentCatalogError = {
      type: 'unknown_component',
      message: `Unknown component "${spec.type}"`,
      raw: JSON.stringify(spec),
      componentType: spec.type
    };
    const custom = options?.onError?.(error);
    if (custom !== undefined) {
      return <>{custom}</>;
    }
    return (
      <ChartError title={errorTitle(error.type)} message={error.message} />
    );
  }

  const Component = definition.component;

  // Render children recursively
  const children = spec.children?.map((child, i) => (
    <SpecRenderer
      key={`${child.type}-${i}`}
      spec={child}
      definitions={definitions}
      options={options}
      sendMessage={sendMessage}
    />
  ));

  try {
    return (
      <Component {...spec.props} sendMessage={sendMessage}>
        {children}
      </Component>
    );
  } catch (err) {
    const error: ComponentCatalogError = {
      type: 'render_error',
      message: `Error rendering "${spec.type}": ${String(err)}`,
      raw: JSON.stringify(spec),
      componentType: spec.type
    };
    const custom = options?.onError?.(error);
    if (custom !== undefined) {
      return <>{custom}</>;
    }
    return (
      <ChartError title={errorTitle(error.type)} message={error.message} />
    );
  }
};

function errorTitle(type: ComponentCatalogError['type']): string {
  switch (type) {
    case 'unknown_component':
      return 'Unknown Component';
    case 'invalid_props':
      return 'Invalid Props';
    case 'render_error':
      return 'Render Error';
    default:
      return 'Invalid Component';
  }
}
