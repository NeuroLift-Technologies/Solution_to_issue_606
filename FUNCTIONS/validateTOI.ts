import { readFileSync } from 'fs';
import path from 'path';
import { TOI, ValidationError, ValidationResult } from './types';

interface TOISchema {
  required: string[];
}

const schemaPath = path.join(process.cwd(), 'SCHEMAS', 'toi.schema.json');
const schema: TOISchema & Record<string, unknown> = JSON.parse(
  readFileSync(schemaPath, 'utf-8')
);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const ensureArrayOfStrings = (value: unknown, pathLabel: string, errors: ValidationError[]) => {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string' && item.trim().length > 0)) {
    errors.push({ path: pathLabel, message: 'must be a non-empty array of strings' });
  }
};

const ensureString = (value: unknown, pathLabel: string, errors: ValidationError[]) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push({ path: pathLabel, message: 'must be a non-empty string' });
  }
};

const ensureBoolean = (value: unknown, pathLabel: string, errors: ValidationError[]) => {
  if (typeof value !== 'boolean') {
    errors.push({ path: pathLabel, message: 'must be a boolean' });
  }
};

export const validateTOI = (candidate: unknown): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!isRecord(candidate)) {
    return { valid: false, errors: [{ path: 'root', message: 'TOI must be an object' }] };
  }

  if (schema.required?.includes('toi_version')) {
    ensureString(candidate['toi_version'], 'toi_version', errors);
  }

  if (schema.required?.includes('agent')) {
    if (!isRecord(candidate['agent'])) {
      errors.push({ path: 'agent', message: 'agent must be an object' });
    } else {
      const agent = candidate['agent'];
      ensureArrayOfStrings(agent['capabilities'], 'agent.capabilities', errors);
      ensureArrayOfStrings(agent['constraints'], 'agent.constraints', errors);

      if (!isRecord(agent['identity'])) {
        errors.push({ path: 'agent.identity', message: 'identity must be an object' });
      } else {
        ensureString(agent['identity']['name'], 'agent.identity.name', errors);
        ensureString(agent['identity']['role'], 'agent.identity.role', errors);
        ensureString(agent['identity']['description'], 'agent.identity.description', errors);
      }

      if (!isRecord(agent['initiation_rights'])) {
        errors.push({ path: 'agent.initiation_rights', message: 'initiation_rights must be an object' });
      } else {
        const rights = agent['initiation_rights'];
        ensureBoolean(rights['can_initiate'], 'agent.initiation_rights.can_initiate', errors);
        ensureBoolean(rights['requires_human_review'], 'agent.initiation_rights.requires_human_review', errors);
        ensureArrayOfStrings(rights['allowed_channels'], 'agent.initiation_rights.allowed_channels', errors);
        ensureArrayOfStrings(rights['escalation_paths'], 'agent.initiation_rights.escalation_paths', errors);
      }
    }
  }

  if (schema.required?.includes('interaction_contract')) {
    if (!isRecord(candidate['interaction_contract'])) {
      errors.push({ path: 'interaction_contract', message: 'interaction_contract must be an object' });
    } else {
      const contract = candidate['interaction_contract'];
      if (!isRecord(contract['accessibility'])) {
        errors.push({ path: 'interaction_contract.accessibility', message: 'accessibility must be an object' });
      } else {
        const accessibility = contract['accessibility'];
        ensureString(accessibility['reading_level'], 'interaction_contract.accessibility.reading_level', errors);
        if (typeof accessibility['max_tokens_per_turn'] !== 'number' || accessibility['max_tokens_per_turn'] <= 0) {
          errors.push({
            path: 'interaction_contract.accessibility.max_tokens_per_turn',
            message: 'must be a positive number'
          });
        }
        ensureArrayOfStrings(
          accessibility['formatting_preferences'],
          'interaction_contract.accessibility.formatting_preferences',
          errors
        );
        if (accessibility['neurodivergent_considerations']) {
          ensureArrayOfStrings(
            accessibility['neurodivergent_considerations'],
            'interaction_contract.accessibility.neurodivergent_considerations',
            errors
          );
        }
      }

      if (!isRecord(contract['memory_management'])) {
        errors.push({ path: 'interaction_contract.memory_management', message: 'memory_management must be an object' });
      } else {
        const memory = contract['memory_management'];
        ensureString(memory['scope'] as string, 'interaction_contract.memory_management.scope', errors);
        ensureString(memory['persistence'] as string, 'interaction_contract.memory_management.persistence', errors);
        ensureArrayOfStrings(
          memory['access_control'],
          'interaction_contract.memory_management.access_control',
          errors
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
};

export const assertValidTOI = (candidate: unknown): TOI => {
  const result = validateTOI(candidate);
  if (!result.valid) {
    const details = result.errors.map((err) => `${err.path}: ${err.message}`).join('; ');
    throw new Error(`TOI validation failed: ${details}`);
  }
  return candidate as TOI;
};
