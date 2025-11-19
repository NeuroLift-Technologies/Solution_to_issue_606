import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { AgentJoinPayload, AgentStore } from './firebaseTypes.js';
import { TOI } from './types.js';
import { validateTOI } from './validateTOI.js';

const roleToFileMap: Record<string, string> = {
  debate_moderator: 'debate_moderator.v1.json',
  participant: 'participant.v1.json',
  observer: 'observer.v1.json',
  facilitator: 'facilitator.v1.json',
  neurodivergent_support: 'neurodivergent_support.v1.json',
};

const toiDirectory = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../TOI');

async function loadTOIForRole(role: string): Promise<TOI> {
  const fileName = roleToFileMap[role];
  if (!fileName) {
    throw new Error(`No TOI definition found for role: ${role}`);
  }
  const filePath = path.join(toiDirectory, fileName);
  const fileContents = await readFile(filePath, 'utf-8');
  return JSON.parse(fileContents) as TOI;
}

export interface AttachTOIOptions {
  store: AgentStore;
  logger?: (message: string) => void;
}

export async function attachTOIOnAgentJoin(payload: AgentJoinPayload, options: AttachTOIOptions): Promise<void> {
  const { sessionId, agentId, role } = payload;
  const { store, logger } = options;
  logger?.(`Attaching TOI for agent ${agentId} with role ${role}`);

  let toi: TOI | undefined;
  try {
    toi = await loadTOIForRole(role);
  } catch (error) {
    logger?.(`Failed to load TOI for role ${role}: ${(error as Error).message}`);
    await store.updateAgent(sessionId, agentId, {
      toi_status: 'invalid',
      toi_errors: [`TOI load failure: ${(error as Error).message}`],
    });
    return;
  }

  const validation = await validateTOI(toi);
  if (!validation.valid) {
    logger?.(`Validation failed for agent ${agentId}`);
    await store.updateAgent(sessionId, agentId, {
      toi_status: 'invalid',
      toi_errors: validation.errors?.map((err) => `${err.instancePath ?? '/'} ${err.message}`) ?? ['Unknown validation error'],
    });
    return;
  }

  await store.updateAgent(sessionId, agentId, {
    toi,
    toi_status: 'validated',
    toi_errors: [],
  });
  logger?.(`TOI attached for agent ${agentId}`);
}
