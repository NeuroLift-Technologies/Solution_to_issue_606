import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { buildSystemPromptFromTOI } from '../FUNCTIONS/buildSystemPromptFromTOI.js';
import { TOI } from '../FUNCTIONS/types.js';

const SAMPLE_PATH = path.resolve(process.cwd(), 'TESTS', 'fixtures', 'valid_toi', 'basic.json');

async function loadSampleTOI(): Promise<TOI> {
  const contents = await readFile(SAMPLE_PATH, 'utf-8');
  return JSON.parse(contents);
}

export async function runPromptBuildingTests() {
  const toi = await loadSampleTOI();
  const prompt = buildSystemPromptFromTOI(toi, { includeMetadata: true });

  assert.ok(prompt.includes('Test Agent'), 'Prompt should include agent role');
  assert.ok(prompt.includes('Example capability'), 'Prompt should include capabilities');
  assert.ok(prompt.includes('Max tokens per turn'), 'Prompt should include accessibility data');
  assert.ok(prompt.includes('Metadata'), 'Prompt should include metadata when requested');
}
