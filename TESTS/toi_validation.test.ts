import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateTOI } from '../FUNCTIONS/validateTOI.js';

async function loadJson(relativePath: string) {
  const absolute = path.resolve(process.cwd(), relativePath);
  const contents = await readFile(absolute, 'utf-8');
  return JSON.parse(contents);
}

describe('TOI validation', () => {
  it('accepts a valid TOI', async () => {
    const candidate = await loadJson('TESTS/fixtures/valid_toi/participant.json');
    const result = await validateTOI(candidate);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('rejects invalid TOI input', async () => {
    const candidate = await loadJson('TESTS/fixtures/invalid_toi/missing_capabilities.json');
    const result = await validateTOI(candidate);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.some((error) => error.message.includes('required'))).toBe(true);
  });
});
