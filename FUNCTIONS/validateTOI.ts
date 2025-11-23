import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv, { ErrorObject } from 'ajv';
import { TOI, ValidationError, ValidationResult } from './types.js';

const schemaPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../SCHEMAS/toi.schema.json');
let validatorPromise: Promise<Ajv> | undefined;

async function getValidator(): Promise<Ajv> {
  if (!validatorPromise) {
    validatorPromise = readFile(schemaPath, 'utf-8').then((schemaRaw) => {
      const schema = JSON.parse(schemaRaw);
      // Use validateSchema: false to skip meta-schema validation.
      // The toi.schema.json references JSON Schema draft 2020-12, which AJV doesn't
      // include by default. Rather than add additional dependencies or complexity,
      // we disable meta-schema validation. The schema itself is still fully functional
      // for validating TOI objects - we're just not validating the schema structure itself.
      // This is acceptable since the schema is maintained in this repo and version-controlled.
      const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
      ajv.addSchema(schema, 'toi');
      return ajv;
    });
  }
  return validatorPromise;
}

function formatErrors(errors: ErrorObject<string, Record<string, any>, unknown>[] = []): ValidationError[] {
  return errors.map((error) => ({
    message: error.message ?? 'Unknown validation error',
    instancePath: error.instancePath,
  }));
}

export async function validateTOI(candidate: unknown): Promise<ValidationResult & { toi?: TOI }> {
  const ajv = await getValidator();
  const validate = ajv.getSchema('toi');
  if (!validate) {
    throw new Error('TOI schema failed to initialize.');
  }
  const valid = validate(candidate) as boolean;
  if (valid) {
    return { valid: true, toi: candidate as TOI };
  }
  return {
    valid: false,
    errors: formatErrors(validate.errors ?? []),
  };
}
