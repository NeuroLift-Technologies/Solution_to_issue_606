interface JsonSchema {
  type?: 'object' | 'array' | 'string' | 'integer' | 'number' | 'boolean';
  required?: string[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  enum?: string[];
  pattern?: string;
  minimum?: number;
  minItems?: number;
  additionalProperties?: boolean;
  format?: 'date-time';
}

interface SchemaWithMeta extends JsonSchema {
  $schema?: string;
  title?: string;
}

export interface SchemaValidationError {
  instancePath: string;
  schemaPath: string;
  message: string;
}

export function validateAgainstSchema(
  schema: SchemaWithMeta,
  data: unknown
): { valid: boolean; errors: SchemaValidationError[] } {
  const errors: SchemaValidationError[] = [];
  validateValue(schema, data, '', '#', errors);
  return { valid: errors.length === 0, errors };
}

function validateValue(
  schema: JsonSchema,
  data: unknown,
  instancePath: string,
  schemaPath: string,
  errors: SchemaValidationError[]
) {
  if (schema.type) {
    if (!typeMatches(schema.type, data)) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/type`,
        message: `Expected type ${schema.type}`,
      });
      return;
    }
  }

  if (schema.enum && typeof data === 'string' && !schema.enum.includes(data)) {
    errors.push({
      instancePath,
      schemaPath: `${schemaPath}/enum`,
      message: `Expected one of: ${schema.enum.join(', ')}`,
    });
  }

  if (schema.pattern && typeof data === 'string') {
    const regex = new RegExp(schema.pattern);
    if (!regex.test(data)) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/pattern`,
        message: `Value does not match pattern ${schema.pattern}`,
      });
    }
  }

  if (typeof data === 'number' && schema.minimum !== undefined && data < schema.minimum) {
    errors.push({
      instancePath,
      schemaPath: `${schemaPath}/minimum`,
      message: `Value must be >= ${schema.minimum}`,
    });
  }

  if (schema.type === 'object' && typeof data === 'object' && data !== null) {
    validateObject(schema, data as Record<string, unknown>, instancePath, schemaPath, errors);
  }

  if (schema.type === 'array' && Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/minItems`,
        message: `Array must contain at least ${schema.minItems} items`,
      });
    }
    if (schema.items) {
      data.forEach((item, index) =>
        validateValue(schema.items as JsonSchema, item, `${instancePath}/${index}`, `${schemaPath}/items`, errors)
      );
    }
  }

  if (schema.format === 'date-time' && typeof data === 'string') {
    if (Number.isNaN(Date.parse(data))) {
      errors.push({
        instancePath,
        schemaPath: `${schemaPath}/format`,
        message: 'Value must be a valid date-time string',
      });
    }
  }
}

function validateObject(
  schema: JsonSchema,
  data: Record<string, unknown>,
  instancePath: string,
  schemaPath: string,
  errors: SchemaValidationError[]
) {
  const props = schema.properties ?? {};
  const required = schema.required ?? [];
  for (const prop of required) {
    if (!(prop in data)) {
      errors.push({
        instancePath: `${instancePath}/${prop}`,
        schemaPath: `${schemaPath}/required`,
        message: 'Missing required property',
      });
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (!(key in props)) {
      if (schema.additionalProperties === false) {
        errors.push({
          instancePath: `${instancePath}/${key}`,
          schemaPath: `${schemaPath}/additionalProperties`,
          message: 'Additional properties are not allowed',
        });
      }
      continue;
    }
    const childSchema = props[key];
    validateValue(childSchema, value, `${instancePath}/${key}`, `${schemaPath}/properties/${key}`, errors);
  }
}

function typeMatches(type: JsonSchema['type'], data: unknown): boolean {
  switch (type) {
    case 'object':
      return typeof data === 'object' && data !== null && !Array.isArray(data);
    case 'array':
      return Array.isArray(data);
    case 'string':
      return typeof data === 'string';
    case 'integer':
      return typeof data === 'number' && Number.isInteger(data);
    case 'number':
      return typeof data === 'number';
    case 'boolean':
      return typeof data === 'boolean';
    default:
      return true;
  }
}
