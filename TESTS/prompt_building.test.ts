import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSystemPromptFromTOI } from '../FUNCTIONS/buildSystemPromptFromTOI';
import { TOI } from '../FUNCTIONS/types';

const sampleTOI: TOI = {
  toi_version: 'v1.0',
  agent: {
    identity: {
      name: 'Prompt Builder',
      role: 'observer',
      description: 'Ensures prompts include governance metadata.'
    },
    capabilities: ['Log changes', 'Flag violations'],
    constraints: ['No editing human content'],
    initiation_rights: {
      can_initiate: false,
      requires_human_review: true,
      allowed_channels: ['observer_log'],
      escalation_paths: ['moderator']
    }
  },
  interaction_contract: {
    accessibility: {
      reading_level: 'college',
      max_tokens_per_turn: 200,
      formatting_preferences: ['tables'],
      neurodivergent_considerations: ['timestamp transitions']
    },
    memory_management: {
      scope: 'session',
      persistence: 'short_term',
      access_control: ['observer']
    }
  }
};

test('buildSystemPromptFromTOI emits capabilities, constraints, and accessibility', () => {
  const prompt = buildSystemPromptFromTOI(sampleTOI, { includeMemorySummary: true });
  assert.match(prompt, /Prompt Builder/);
  assert.match(prompt, /Capabilities/);
  assert.match(prompt, /Constraints/);
  assert.match(prompt, /Memory Management/);
  assert.match(prompt, /Max tokens per turn: 200/);
  assert.match(prompt, /Honor the TOI version: v1.0/);
});
