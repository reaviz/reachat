import type {
  ComponentSpec,
  ComponentDefinitions,
  ComponentCatalogError
} from './types';

/**
 * Attempts to parse a raw string (from a ```component code block)
 * into one or more ComponentSpec objects.
 *
 * Returns either a validated spec array or an error descriptor.
 */
export function validateSpec(
  raw: string,
  definitions: ComponentDefinitions
):
  | { ok: true; specs: ComponentSpec[] }
  | { ok: false; error: ComponentCatalogError } {
  // 1. Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      error: {
        type: 'invalid_json',
        message: 'Failed to parse component JSON',
        raw
      }
    };
  }

  // Normalise to array
  const specArray: unknown[] = Array.isArray(parsed) ? parsed : [parsed];

  const validated: ComponentSpec[] = [];

  for (const item of specArray) {
    const result = validateSingleSpec(item, raw, definitions);
    if (!result.ok) {
      const err = (result as { ok: false; error: ComponentCatalogError }).error;
      return { ok: false as const, error: err };
    }
    validated.push((result as { ok: true; spec: ComponentSpec }).spec);
  }

  return { ok: true, specs: validated };
}

function validateSingleSpec(
  item: unknown,
  raw: string,
  definitions: ComponentDefinitions
):
  | { ok: true; spec: ComponentSpec }
  | { ok: false; error: ComponentCatalogError } {
  if (!item || typeof item !== 'object' || !('type' in item)) {
    return {
      ok: false,
      error: {
        type: 'invalid_json',
        message: 'Component spec must be an object with a "type" field',
        raw
      }
    };
  }

  const spec = item as { type: unknown; props?: unknown; children?: unknown };

  if (typeof spec.type !== 'string') {
    return {
      ok: false,
      error: {
        type: 'invalid_json',
        message: '"type" must be a string',
        raw
      }
    };
  }

  const componentType = spec.type;

  // 2. Check component exists in catalog
  const definition = definitions[componentType];
  if (!definition) {
    return {
      ok: false,
      error: {
        type: 'unknown_component',
        message: `Unknown component "${componentType}". Available: ${Object.keys(definitions).join(', ')}`,
        raw,
        componentType
      }
    };
  }

  // 3. Validate props via Zod schema
  const props =
    spec.props && typeof spec.props === 'object' && !Array.isArray(spec.props)
      ? spec.props
      : {};
  const parseResult = definition.props.safeParse(props);

  if (!parseResult.success) {
    return {
      ok: false,
      error: {
        type: 'invalid_props',
        message: `Invalid props for "${componentType}": ${parseResult.error.issues.map(i => i.message).join(', ')}`,
        raw,
        componentType,
        issues: parseResult.error.issues.map(i => ({
          message: i.message,
          path: i.path as (string | number)[]
        }))
      }
    };
  }

  // 4. Recursively validate children
  let validatedChildren: ComponentSpec[] | undefined;
  if (spec.children) {
    if (!Array.isArray(spec.children)) {
      return {
        ok: false,
        error: {
          type: 'invalid_json',
          message: '"children" must be an array',
          raw,
          componentType
        }
      };
    }

    validatedChildren = [];
    for (const child of spec.children) {
      const childResult = validateSingleSpec(child, raw, definitions);
      if (!childResult.ok) {
        return childResult;
      }
      validatedChildren.push(childResult.spec);
    }
  }

  return {
    ok: true,
    spec: {
      type: componentType,
      props: (parseResult as { success: true; data: any }).data,
      ...(validatedChildren ? { children: validatedChildren } : {})
    }
  };
}
