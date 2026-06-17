import { readFile } from 'node:fs/promises';
import Ajv from 'ajv';
import type { TOI, ValidationError, ValidationResult } from './types.js';

// Load the canonical JSON Schema from the @neurolift-technologies/toi package.
// The package ships schema/toi-1.0.0.schema.json as a stable artifact derived
// from its authoritative Zod schema. We bypass the package's exports map since
// the compiled JS is not yet included in the published tarball.
const schemaPath = new URL(
  '../node_modules/@neurolift-technologies/toi/schema/toi-1.0.0.schema.json',
  import.meta.url,
).pathname;

let validatorPromise: Promise<Ajv> | undefined;

async function getValidator(): Promise<Ajv> {
  if (!validatorPromise) {
    validatorPromise = readFile(schemaPath, 'utf-8').then((schemaRaw) => {
      const schema = JSON.parse(schemaRaw);
      const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
      ajv.addSchema(schema, 'toi');
      return ajv;
    });
  }
  return validatorPromise;
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
  const errors: ValidationError[] = (validate.errors ?? []).map((err) => ({
    message: err.message ?? 'Unknown validation error',
    instancePath: err.instancePath,
  }));
  return { valid: false, errors };
}
