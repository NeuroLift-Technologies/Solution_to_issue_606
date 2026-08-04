import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import {
  enforceCrossAgentRules,
  loadOtoiForSession,
  OtoiParticipant,
} from '../FUNCTIONS/otoiLoader.js';
import { loadTOIForRole } from '../FUNCTIONS/loadTOI.js';

async function loadOtoiSchema() {
  const schemaRaw = await readFile(path.resolve(process.cwd(), 'SCHEMAS/otoi.schema.json'), 'utf-8');
  return JSON.parse(schemaRaw);
}

function participant(agentId: string, role: string) {
  return { agentId, role };
}

describe('enforceCrossAgentRules', () => {
  it('accepts a well-formed session', async () => {
    const tois = await Promise.all(['participant', 'debate_moderator'].map(loadTOIForRole));
    const agents: OtoiParticipant[] = [
      { agent_id: 'p1', role: 'participant', toi: tois[0] },
      { agent_id: 'm1', role: 'debate_moderator', toi: tois[1] },
    ];
    const { rules, errors } = enforceCrossAgentRules(agents);
    expect(errors).toEqual([]);
    expect(rules.length).toBeGreaterThanOrEqual(3);
  });

  it('rejects an unknown role', async () => {
    const tois = await Promise.all(['participant'].map(loadTOIForRole));
    const agents: OtoiParticipant[] = [
      { agent_id: 'x1', role: 'bystander', toi: tois[0] },
    ];
    const { errors } = enforceCrossAgentRules(agents);
    expect(errors.join(' ')).toContain('Unknown role');
  });

  it('rejects duplicate singular roles', async () => {
    const tois = await Promise.all(['debate_moderator', 'participant'].map(loadTOIForRole));
    const agents: OtoiParticipant[] = [
      { agent_id: 'm1', role: 'debate_moderator', toi: tois[0] },
      { agent_id: 'm2', role: 'debate_moderator', toi: tois[0] },
      { agent_id: 'p1', role: 'participant', toi: tois[1] },
    ];
    const { errors } = enforceCrossAgentRules(agents);
    expect(errors.join(' ')).toContain("may appear at most once");
  });

  it('rejects a session without a required role', async () => {
    const tois = await Promise.all(['debate_moderator'].map(loadTOIForRole));
    const agents: OtoiParticipant[] = [
      { agent_id: 'm1', role: 'debate_moderator', toi: tois[0] },
    ];
    const { errors } = enforceCrossAgentRules(agents);
    expect(errors.join(' ')).toContain("requires at least one agent with role 'participant'");
  });

  it('accepts multiple participants of a plural role', async () => {
    const tois = await Promise.all(['participant', 'debate_moderator'].map(loadTOIForRole));
    const agents: OtoiParticipant[] = [
      { agent_id: 'p1', role: 'participant', toi: tois[0] },
      { agent_id: 'p2', role: 'participant', toi: tois[0] },
      { agent_id: 'm1', role: 'debate_moderator', toi: tois[1] },
    ];
    const { errors } = enforceCrossAgentRules(agents);
    expect(errors).toEqual([]);
  });
});

describe('loadOtoiForSession', () => {
  it('builds a valid session OTOI for participant + moderator', async () => {
    const result = await loadOtoiForSession('debate-001', [
      participant('p1', 'participant'),
      participant('m1', 'debate_moderator'),
    ]);
    expect(result.valid).toBe(true);
    expect(result.otoi?.session_id).toBe('debate-001');
    expect(result.otoi?.participants).toHaveLength(2);
    expect(result.otoi?.rules.length).toBeGreaterThanOrEqual(3);
  });

  it('accepts external escalation references while enforcing in-session ones', async () => {
    const result = await loadOtoiForSession('debate-002', [
      participant('p1', 'participant'),
      participant('m1', 'debate_moderator'),
      participant('o1', 'observer'),
    ]);
    expect(result.valid).toBe(true);
  });

  it('rejects a session whose escalation target role is absent', async () => {
    const result = await loadOtoiForSession('debate-003', [
      participant('p1', 'participant'),
    ]);
    expect(result.valid).toBe(false);
    expect(result.errors?.join(' ')).toContain("escalates to 'debate_moderator'");
  });

  it('rejects unknown roles with a clear error', async () => {
    const result = await loadOtoiForSession('debate-004', [
      participant('x1', 'ghost'),
    ]);
    expect(result.valid).toBe(false);
    expect(result.errors?.join(' ')).toContain('No TOI definition found for role: ghost');
  });

  it('builds a valid session OTOI for multiple participants', async () => {
    const result = await loadOtoiForSession('debate-006', [
      participant('p1', 'participant'),
      participant('p2', 'participant'),
      participant('m1', 'debate_moderator'),
    ]);
    expect(result.valid).toBe(true);
    expect(result.otoi?.participants).toHaveLength(3);
  });

  it('rejects an empty session', async () => {
    const result = await loadOtoiForSession('debate-007', []);
    expect(result.valid).toBe(false);
    expect(result.errors?.join(' ')).toContain("requires at least one agent with role 'participant'");
  });

  it('emits an OTOI document conformant with SCHEMAS/otoi.schema.json', async () => {
    const result = await loadOtoiForSession('debate-005', [
      participant('p1', 'participant'),
      participant('m1', 'debate_moderator'),
      participant('o1', 'observer'),
    ]);
    expect(result.valid).toBe(true);

    const schema = await loadOtoiSchema();
    const ajv = new Ajv({ strict: false, validateSchema: false });
    const validate = ajv.compile(schema);
    const valid = validate(result.otoi);
    expect(valid).toBe(true);
  });
});
