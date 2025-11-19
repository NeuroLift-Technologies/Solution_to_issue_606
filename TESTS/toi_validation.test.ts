import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateTOI } from '../FUNCTIONS/validateTOI.js';

const FIXTURE_ROOT = path.resolve(process.cwd(), 'TESTS', 'fixtures');

async function loadFixture(relativePath: string) {
  const fixturePath = path.resolve(FIXTURE_ROOT, relativePath);
  const contents = await readFile(fixturePath, 'utf-8');
  return JSON.parse(contents);
}

export async function runTOIValidationTests() {
  const validTOI = await loadFixture(path.join('valid_toi', 'basic.json'));
  const validResult = validateTOI(validTOI);
  assert.equal(validResult.valid, true, 'Expected valid TOI to pass');

  const invalidTOI = await loadFixture(path.join('invalid_toi', 'missing_fields.json'));
  const invalidResult = validateTOI(invalidTOI);
  assert.equal(invalidResult.valid, false, 'Expected invalid TOI to fail');
  assert.ok(invalidResult.errors && invalidResult.errors.length > 0, 'Invalid result should contain errors');
}
