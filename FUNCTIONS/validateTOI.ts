import toiSchema from '../SCHEMAS/toi.schema.json' with { type: 'json' };
import { TOI, ValidationResult, ValidationErrorDetail } from './types.js';
import { validateAgainstSchema } from './simpleJsonValidator.js';

export function validateTOI(toi: unknown): ValidationResult {
  const { valid, errors } = validateAgainstSchema(toiSchema as any, toi);
  if (valid) {
    return { valid: true };
  }
  const details: ValidationErrorDetail[] = errors.map((error) => ({
    instancePath: error.instancePath,
    schemaPath: error.schemaPath,
    message: error.message,
  }));
  return { valid: false, errors: details };
}

export function assertValidTOI(toi: TOI): void {
  const result = validateTOI(toi);
  if (!result.valid) {
    const messages = (result.errors ?? []).map((error) => `${error.instancePath}: ${error.message}`).join('\n');
    throw new Error(`TOI failed validation:\n${messages}`);
  }
}
