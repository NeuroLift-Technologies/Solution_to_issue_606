import { promises as fs } from 'fs';
import path from 'path';
import { AgentDocument, AgentJoinEvent } from './firebaseTypes';
import { assertValidTOI, validateTOI } from './validateTOI';
import { TOI } from './types';

export interface AttachOptions {
  toiDirectory?: string;
  roleToFileName?: (role: string) => string;
}

const defaultRoleToFile = (role: string) => `${role}.v1.json`;

const loadTOIFile = async (filePath: string): Promise<TOI> => {
  const raw = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  return assertValidTOI(parsed);
};

export const attachTOIOnAgentJoin = async (
  event: AgentJoinEvent<AgentDocument>,
  options: AttachOptions = {}
): Promise<void> => {
  const snapshot = event.data();
  const agent = snapshot.data();
  const sessionId = event.context.params['sessionId'] ?? 'unknown-session';
  const agentId = event.context.params['agentId'] ?? snapshot.ref.id;

  const toiDir = options.toiDirectory ?? path.join(__dirname, '..', 'TOI');
  const roleToFile = options.roleToFileName ?? defaultRoleToFile;
  const normalizedRole = agent.role?.toLowerCase().replace(/\s+/g, '_');
  if (!normalizedRole) {
    throw new Error('Agent role missing on join event');
  }

  const fileName = roleToFile(normalizedRole);
  const toiPath = path.join(toiDir, fileName);

  let toi: TOI;
  try {
    toi = await loadTOIFile(toiPath);
  } catch (error) {
    await snapshot.ref.update({
      toi_status: 'invalid',
      toi_payload: null,
      toi_error: `Unable to load TOI for ${agent.role}: ${String(error)}`
    });
    throw error;
  }

  const validationResult = validateTOI(toi);
  if (!validationResult.valid) {
    const errorText = validationResult.errors.map((err) => `${err.path}: ${err.message}`).join('; ');
    await snapshot.ref.update({
      toi_status: 'invalid',
      toi_payload: toi,
      toi_error: errorText
    });
    throw new Error(`TOI file for ${agent.role} is invalid: ${errorText}`);
  }

  await snapshot.ref.update({
    toi_status: 'validated',
    toi_payload: toi,
    toi_source: fileName,
    last_toi_update: new Date().toISOString(),
    provenance: {
      session_id: sessionId,
      agent_id: agentId
    }
  });
};
