import { readFileSync } from 'fs';
import path from 'path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTOI } from '../FUNCTIONS/validateTOI';

const loadFixture = (fixturePath: string) => {
  const absolutePath = path.join(process.cwd(), 'TESTS', 'fixtures', fixturePath);
  return JSON.parse(readFileSync(absolutePath, 'utf-8'));
};

test('valid TOI fixture passes validation', () => {
  const toi = loadFixture(path.join('valid_toi', 'participant.json'));
  const result = validateTOI(toi);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});

test('invalid TOI fixture fails validation and reports paths', () => {
  const toi = loadFixture(path.join('invalid_toi', 'missing_fields.json'));
  const result = validateTOI(toi);
  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 0);
  assert.ok(result.errors.some((err) => err.path.includes('toi_version')));
});
