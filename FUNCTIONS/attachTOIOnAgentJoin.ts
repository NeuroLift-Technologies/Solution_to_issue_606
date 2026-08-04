import { AgentJoinPayload, AgentStore } from './firebaseTypes.js';
import { TOI } from './types.js';
import { loadTOIForRole } from './loadTOI.js';
import { validateTOI } from './validateTOI.js';

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
