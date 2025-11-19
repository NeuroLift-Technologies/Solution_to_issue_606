import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { TOIContract, ValidationIssue } from './types.js';
import { validateTOI } from './validateTOI.js';

export interface AgentRecord {
  sessionId: string;
  agentId: string;
  role: string;
  displayName: string;
  toi?: TOIContract;
  toi_status?: 'pending' | 'validated' | 'invalid';
  validation_errors?: ValidationIssue[];
}

export interface AgentWriter {
  updateAgent(agent: AgentRecord): Promise<void>;
}

export interface TOIRepository {
  getTOIForRole(role: string): Promise<TOIContract>;
}

export class FileSystemTOIRepository implements TOIRepository {
  constructor(
    private readonly directory: string = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'TOI'),
    private readonly fileResolver: (role: string) => string = role => `${role}.v1.json`
  ) {}

  async getTOIForRole(role: string): Promise<TOIContract> {
    const resolvedFile = path.join(this.directory, this.fileResolver(role));
    const file = await readFile(resolvedFile, 'utf-8');
    return JSON.parse(file) as TOIContract;
  }
}

export class InMemoryAgentWriter implements AgentWriter {
  public updates: AgentRecord[] = [];

  async updateAgent(agent: AgentRecord): Promise<void> {
    this.updates.push(agent);
  }
}

export interface AttachTOIParams {
  agent: AgentRecord;
  repository: TOIRepository;
  writer: AgentWriter;
}

/**
 * Attaches a validated TOI contract to a joining agent. This function mirrors a
 * Firebase RTDB/Firestore trigger without binding to the runtime so the module
 * stays portable for local testing.
 */
export async function attachTOIOnAgentJoin({ agent, repository, writer }: AttachTOIParams): Promise<AgentRecord> {
  const toi = await repository.getTOIForRole(agent.role);
  const validation = validateTOI(toi);
  const updated: AgentRecord = {
    ...agent,
    toi,
    toi_status: validation.valid ? 'validated' : 'invalid',
    validation_errors: validation.errors
  };

  await writer.updateAgent(updated);
  return updated;
}

export function createFileSystemRepositoryFromRoot(rootDir: string, resolver?: (role: string) => string): TOIRepository {
  return new FileSystemTOIRepository(rootDir, resolver);
}

export function resolveRepositoryFromRelative(relativePath: string, resolver?: (role: string) => string): TOIRepository {
  const absolute = path.resolve(relativePath);
  return new FileSystemTOIRepository(absolute, resolver);
}
