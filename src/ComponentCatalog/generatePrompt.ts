import type { ComponentDefinitions } from './types';

/**
 * Converts a JSON Schema property into a concise, human-readable type string.
 * Handles objects, arrays, enums, nullable, primitives, and descriptions.
 */
function describeJsonSchemaProperty(
  prop: Record<string, any>,
  indent = ''
): string {
  const description = prop.description ? ` // ${prop.description}` : '';

  // Nullable (anyOf with null)
  if (prop.anyOf) {
    const nonNull = prop.anyOf.filter((s: any) => !(s.type === 'null'));
    const hasNull = prop.anyOf.some((s: any) => s.type === 'null');
    if (nonNull.length === 1 && hasNull) {
      return `${describeJsonSchemaProperty(nonNull[0], indent)} | null${description}`;
    }
    const parts = prop.anyOf.map((s: any) =>
      describeJsonSchemaProperty(s, indent)
    );
    return `${parts.join(' | ')}${description}`;
  }

  // Enum
  if (prop.enum) {
    return `${prop.enum.map((v: any) => `"${v}"`).join(' | ')}${description}`;
  }

  // Array
  if (prop.type === 'array') {
    const items = prop.items
      ? describeJsonSchemaProperty(prop.items, indent)
      : 'any';
    return `${items}[]${description}`;
  }

  // Object
  if (prop.type === 'object' && prop.properties) {
    const required = new Set(prop.required ?? []);
    const fields: string[] = [];
    for (const [key, value] of Object.entries(prop.properties)) {
      const opt = required.has(key) ? '' : '?';
      fields.push(
        `${indent}  ${key}: ${describeJsonSchemaProperty(value as Record<string, any>, indent + '  ')}${opt}`
      );
    }
    return `{\n${fields.join(',\n')}\n${indent}}${description}`;
  }

  // Primitives
  if (prop.type === 'string') return `string${description}`;
  if (prop.type === 'number' || prop.type === 'integer')
    return `number${description}`;
  if (prop.type === 'boolean') return `boolean${description}`;
  if (prop.type === 'null') return `null${description}`;

  return `any${description}`;
}

/**
 * Converts a Zod schema into a concise, human-readable props description
 * using Zod's public `z.toJSONSchema()` API.
 *
 * Zod is loaded lazily so that modules importing `generatePrompt` do not
 * crash at load time when zod is not installed.
 */
function describeProps(schema: { _def?: unknown }): string {
  try {
    const { z } = require('zod');
    const jsonSchema = z.toJSONSchema(schema) as Record<string, any>;
    if (jsonSchema.type === 'object' && jsonSchema.properties) {
      return describeJsonSchemaProperty(jsonSchema);
    }
    return 'Record<string, any>';
  } catch {
    return 'Record<string, any>';
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
      const propsDesc = describeProps(def.props);
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
