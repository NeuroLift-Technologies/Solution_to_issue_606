import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { TOI } from './types.js';
import { roleToFileMap } from './roleRegistry.js';

const toiDirectory = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../TOI');

export async function loadTOIForRole(role: string): Promise<TOI> {
  const fileName = roleToFileMap[role];
  if (!fileName) {
    throw new Error(`No TOI definition found for role: ${role}`);
  }
  const filePath = path.join(toiDirectory, fileName);
  const fileContents = await readFile(filePath, 'utf-8');
  return JSON.parse(fileContents) as TOI;
}
