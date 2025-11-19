import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { validateTOI } from '../FUNCTIONS/validateTOI.js';

const projectRoot = path.resolve(process.cwd());

function loadFixture(relativePath: string) {
  const filePath = path.join(projectRoot, 'TESTS', 'fixtures', relativePath);
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

const validTOI = loadFixture(path.join('valid_toi', 'research_facilitator.json'));
const invalidTOI = loadFixture(path.join('invalid_toi', 'missing_fields.json'));

const validResult = validateTOI(validTOI);
assert.equal(validResult.valid, true, `Expected valid fixture to pass: ${JSON.stringify(validResult.errors)}`);

const invalidResult = validateTOI(invalidTOI);
assert.equal(invalidResult.valid, false, 'Invalid fixture should fail validation.');
assert.ok(invalidResult.errors.length > 0, 'Invalid fixture should expose errors.');

console.log('toi_validation.test.ts passed');
