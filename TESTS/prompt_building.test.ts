import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { buildSystemPromptFromTOI } from '../FUNCTIONS/buildSystemPromptFromTOI.js';

const projectRoot = path.resolve(process.cwd());

function loadTOI(relativePath: string) {
  const filePath = path.join(projectRoot, 'TOI', relativePath);
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

const moderatorTOI = loadTOI('debate_moderator.v1.json');
const prompt = buildSystemPromptFromTOI(moderatorTOI);

assert.ok(prompt.includes('# Role: debate_moderator'), 'Prompt should contain the role header.');
assert.ok(prompt.includes('Agenda enforcement'), 'Prompt should list capabilities.');
assert.ok(prompt.includes('Accessibility Commitments'), 'Prompt should include accessibility info.');
assert.ok(prompt.includes('Memory Management'), 'Prompt should include memory contract.');

console.log('prompt_building.test.ts passed');
