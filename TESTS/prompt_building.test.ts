import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { buildSystemPromptFromTOI } from '../FUNCTIONS/buildSystemPromptFromTOI.js';
import { validateTOI } from '../FUNCTIONS/validateTOI.js';

async function loadValidTOI() {
  const absolute = path.resolve(process.cwd(), 'TESTS/fixtures/valid_toi/participant.json');
  const contents = await readFile(absolute, 'utf-8');
  const candidate = JSON.parse(contents);
  const result = await validateTOI(candidate);
  if (!result.valid || !result.toi) {
    throw new Error('Fixture failed validation');
  }
  return result.toi;
}

describe('buildSystemPromptFromTOI', () => {
  it('includes key sections from the TOI', async () => {
    const toi = await loadValidTOI();
    const prompt = buildSystemPromptFromTOI(toi);
    expect(prompt).toContain('You are');
    expect(prompt).toContain('Authorized capabilities');
    expect(prompt).toContain('Constraints you must respect');
    expect(prompt).toContain('Initiation rights');
    expect(prompt).toContain(String(toi.interaction_contract.accessibility.maxTokensPerTurn));
  });
});
