import type { ComponentDefinitions, ZodLike } from './types';

/**
 * Generates a human-readable description of a Zod schema's shape
 * by inspecting its internal `_def` structure.
 *
 * Falls back to `Record<string, any>` if the schema internals are
 * not accessible (non-Zod schema, or a version we don't recognise).
 */
function describeZodShape(schema: ZodLike): string {
  try {
    const def = schema._def;
    if (!def) {
      return 'Record<string, any>';
    }

    // ZodObject — the most common case
    if (def.shape || def.typeName === 'ZodObject') {
      const shape = typeof def.shape === 'function' ? def.shape() : def.shape;
      if (!shape || typeof shape !== 'object') {
        return 'Record<string, any>';
      }

      const fields: string[] = [];
      for (const [key, value] of Object.entries(shape)) {
        fields.push(`  ${key}: ${describeZodField(value as ZodLike)}`);
      }
      return `{\n${fields.join(',\n')}\n}`;
    }

    return 'Record<string, any>';
  } catch {
    return 'Record<string, any>';
  }
}

function describeZodField(field: ZodLike): string {
  try {
    const def = (field as any)?._def;
    if (!def) {
      return 'any';
    }

    const typeName: string = def.typeName ?? '';
    const description: string = def.description ?? '';
    const suffix = description ? ` // ${description}` : '';

    // Handle optional wrapper
    if (typeName === 'ZodOptional') {
      return `${describeZodField(def.innerType)}?${suffix}`;
    }

    // Handle nullable wrapper
    if (typeName === 'ZodNullable') {
      return `${describeZodField(def.innerType)} | null${suffix}`;
    }

    // Handle default wrapper
    if (typeName === 'ZodDefault') {
      return `${describeZodField(def.innerType)}${suffix}`;
    }

    // Primitives
    if (typeName === 'ZodString') return `string${suffix}`;
    if (typeName === 'ZodNumber') return `number${suffix}`;
    if (typeName === 'ZodBoolean') return `boolean${suffix}`;

    // Enum
    if (typeName === 'ZodEnum' && def.values) {
      return `${(def.values as string[]).map(v => `"${v}"`).join(' | ')}${suffix}`;
    }

    // Array
    if (typeName === 'ZodArray' && def.type) {
      return `${describeZodField(def.type)}[]${suffix}`;
    }

    // Object (nested)
    if (typeName === 'ZodObject') {
      return describeZodShape(field) + suffix;
    }

    return `any${suffix}`;
  } catch {
    return 'any';
  }
}

/**
 * Generates an LLM-friendly system prompt describing all available
 * components, their descriptions, and their prop schemas.
 *
 * @param definitions  The component definitions from the catalog.
 * @param language     The code block language tag (default: 'component').
 */
export function generatePrompt(
  definitions: ComponentDefinitions,
  language = 'component'
): string {
  const names = Object.keys(definitions);

  if (names.length === 0) {
    return '';
  }

  const componentDocs = names
    .map(name => {
      const def = definitions[name];
      const propsDesc = describeZodShape(def.props);
      return `- **${name}**: ${def.description}\n  Props: ${propsDesc}`;
    })
    .join('\n\n');

  return `When you need to render a dynamic UI component in your response, use a fenced code block with language \`${language}\` containing a JSON object:

\`\`\`${language}
{ "type": "ComponentName", "props": { ... } }
\`\`\`

For multiple components, use a JSON array:

\`\`\`${language}
[
  { "type": "ComponentA", "props": { ... } },
  { "type": "ComponentB", "props": { ... } }
]
\`\`\`

For nested/composed layouts, use the "children" field:

\`\`\`${language}
{
  "type": "Parent",
  "props": { ... },
  "children": [
    { "type": "Child", "props": { ... } }
  ]
}
\`\`\`

Available components:

${componentDocs}`;
}
