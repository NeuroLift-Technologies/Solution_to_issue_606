import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import type { TOI, ValidationError, ValidationResult } from './types.js';

const CANONICAL_SCHEMA_RELATIVE = 'node_modules/@neurolift-technologies/toi/schema/toi-1.0.0.schema.json';

// Prefer resolving relative to this module so the validator works regardless of
// the process working directory; fall back to the project root for compiled dist/
// layouts where node_modules sits at the repository root.
function resolveCanonicalSchemaPath(): string {
  const candidates = [
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), `../${CANONICAL_SCHEMA_RELATIVE}`),
    path.join(process.cwd(), CANONICAL_SCHEMA_RELATIVE),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}

const schemaPath = resolveCanonicalSchemaPath();

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
