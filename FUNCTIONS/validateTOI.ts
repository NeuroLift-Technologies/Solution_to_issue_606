import toiSchema from '../SCHEMAS/toi.schema.json' with { type: 'json' };
import {
  Capability,
  Constraint,
  InitiationRights,
  InteractionContract,
  TOIContract,
  ValidationIssue,
  ValidationResult
} from './types.js';

const schemaMetadata = toiSchema;

type LooseTOI = Partial<TOIContract> & Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateCapabilities(value: unknown, basePath: string, errors: ValidationIssue[]): value is Capability[] {
  const initialErrorCount = errors.length;

  if (!Array.isArray(value) || value.length === 0) {
    errors.push({ path: basePath, message: 'Capabilities array is required and must contain at least one entry.' });
    return false;
  }

  value.forEach((capability, index) => {
    if (!isRecord(capability)) {
      errors.push({ path: `${basePath}[${index}]`, message: 'Capability must be an object.' });
      return;
    }

    if (typeof capability.name !== 'string' || capability.name.length === 0) {
      errors.push({ path: `${basePath}[${index}].name`, message: 'Capability name must be a non-empty string.' });
    }

    if (typeof capability.description !== 'string' || capability.description.length === 0) {
      errors.push({ path: `${basePath}[${index}].description`, message: 'Capability description must be provided.' });
    }

    if (capability.tools && (!Array.isArray(capability.tools) || capability.tools.some(tool => typeof tool !== 'string'))) {
      errors.push({ path: `${basePath}[${index}].tools`, message: 'Tools must be an array of strings.' });
    }
  });

  return errors.length === initialErrorCount;
}

function validateConstraints(value: unknown, basePath: string, errors: ValidationIssue[]): value is Constraint[] {
  const initialErrorCount = errors.length;

  if (!Array.isArray(value)) {
    errors.push({ path: basePath, message: 'Constraints array is required.' });
    return false;
  }

  value.forEach((constraint, index) => {
    if (!isRecord(constraint)) {
      errors.push({ path: `${basePath}[${index}]`, message: 'Constraint must be an object.' });
      return;
    }

    if (typeof constraint.name !== 'string' || constraint.name.length === 0) {
      errors.push({ path: `${basePath}[${index}].name`, message: 'Constraint name must be a non-empty string.' });
    }

    if (typeof constraint.description !== 'string' || constraint.description.length === 0) {
      errors.push({ path: `${basePath}[${index}].description`, message: 'Constraint description must be provided.' });
    }
  });

  return errors.length === initialErrorCount;
}

function validateInitiationRights(value: unknown, basePath: string, errors: ValidationIssue[]): value is InitiationRights {
  const initialErrorCount = errors.length;

  if (!isRecord(value)) {
    errors.push({ path: basePath, message: 'Initiation rights must be an object.' });
    return false;
  }

  if (typeof value.can_initiate !== 'boolean') {
    errors.push({ path: `${basePath}.can_initiate`, message: 'can_initiate must be a boolean.' });
  }

  if (!Array.isArray(value.escalation_paths) || value.escalation_paths.some(item => typeof item !== 'string')) {
    errors.push({ path: `${basePath}.escalation_paths`, message: 'escalation_paths must be an array of strings.' });
  }

  if (value.rate_limits) {
    if (!isRecord(value.rate_limits) || typeof value.rate_limits.max_initiations_per_hour !== 'number' || value.rate_limits.max_initiations_per_hour <= 0) {
      errors.push({ path: `${basePath}.rate_limits`, message: 'rate_limits must declare a positive max_initiations_per_hour.' });
    }
  }

  return errors.length === initialErrorCount;
}

function validateInteractionContract(value: unknown, basePath: string, errors: ValidationIssue[]): value is InteractionContract {
  const initialErrorCount = errors.length;

  if (!isRecord(value)) {
    errors.push({ path: basePath, message: 'Interaction contract must be an object.' });
    return false;
  }

  const accessibility = value.accessibility;
  if (!isRecord(accessibility)) {
    errors.push({ path: `${basePath}.accessibility`, message: 'accessibility must be an object.' });
  } else {
    if (!['elementary', 'middle_school', 'high_school', 'college'].includes(accessibility.reading_level as string)) {
      errors.push({ path: `${basePath}.accessibility.reading_level`, message: 'reading_level must match schema enum.' });
    }
    if (typeof accessibility.max_tokens_per_turn !== 'number' || accessibility.max_tokens_per_turn <= 0) {
      errors.push({ path: `${basePath}.accessibility.max_tokens_per_turn`, message: 'max_tokens_per_turn must be a positive number.' });
    }
    if (!Array.isArray(accessibility.formatting_preferences) || accessibility.formatting_preferences.some(item => typeof item !== 'string')) {
      errors.push({ path: `${basePath}.accessibility.formatting_preferences`, message: 'formatting_preferences must be an array of strings.' });
    }
  }

  const memory = value.memory_management;
  if (!isRecord(memory)) {
    errors.push({ path: `${basePath}.memory_management`, message: 'memory_management must be an object.' });
  } else {
    if (!['session', 'experiment', 'global'].includes(memory.scope as string)) {
      errors.push({ path: `${basePath}.memory_management.scope`, message: 'scope must match schema enum.' });
    }
    if (!['transient', 'durable'].includes(memory.persistence as string)) {
      errors.push({ path: `${basePath}.memory_management.persistence`, message: 'persistence must match schema enum.' });
    }
    if (typeof memory.access_control !== 'string' || memory.access_control.length === 0) {
      errors.push({ path: `${basePath}.memory_management.access_control`, message: 'access_control must be a non-empty string.' });
    }
  }

  return errors.length === initialErrorCount;
}

/**
 * Validates a TOI object using a lightweight structural checker. The JSON schema
 * is referenced for documentation, but we avoid bringing in an external schema
 * runtime to keep the repository dependency-free for quick prototyping.
 */
export function validateTOI(candidate: unknown): ValidationResult {
  const errors: ValidationIssue[] = [];

  if (!isRecord(candidate)) {
    errors.push({ path: '$', message: 'TOI payload must be an object.' });
    return { valid: false, errors };
  }

  const toi = candidate as LooseTOI;

  if (typeof toi.toi_version !== 'string') {
    errors.push({ path: 'toi_version', message: 'toi_version must be a semantic string such as v1.0.' });
  }

  if (!isRecord(toi.agent)) {
    errors.push({ path: 'agent', message: 'agent block is required.' });
  } else {
    const identity = toi.agent.identity;
    if (!isRecord(identity)) {
      errors.push({ path: 'agent.identity', message: 'identity block is required.' });
    } else {
      if (typeof identity.name !== 'string' || identity.name.length === 0) {
        errors.push({ path: 'agent.identity.name', message: 'name must be a non-empty string.' });
      }
      if (typeof identity.description !== 'string' || identity.description.length === 0) {
        errors.push({ path: 'agent.identity.description', message: 'description must be a non-empty string.' });
      }
      if (typeof identity.role !== 'string' || identity.role.length === 0) {
        errors.push({ path: 'agent.identity.role', message: 'role must be a non-empty string.' });
      }
    }

    validateCapabilities(toi.agent.capabilities, 'agent.capabilities', errors);
    validateConstraints(toi.agent.constraints, 'agent.constraints', errors);
    validateInitiationRights(toi.agent.initiation_rights, 'agent.initiation_rights', errors);
  }

  validateInteractionContract(toi.interaction_contract, 'interaction_contract', errors);

  return {
    valid: errors.length === 0,
    errors
  };
}

export { schemaMetadata };
