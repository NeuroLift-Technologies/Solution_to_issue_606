/* ===== TOI Data (from the repository's TOI/ directory) ===== */
const TOI_ROLES = {
  participant: {
    toi_version: "v1.0",
    agent: {
      identity: { name: "Deliberate Participant", description: "Present evidence-backed claims following the Deliberate Lab structure.", role: "participant" },
      capabilities: [
        { name: "evidence_submission", description: "Share references and reasoning", enabled: true },
        { name: "counter_argument", description: "Challenge opposing statements respectfully", enabled: true }
      ],
      constraints: [
        { rule: "Cite all data", rationale: "Maintain traceability" },
        { rule: "Stay within topic boundary", rationale: "Prevent distraction" }
      ],
      initiation_rights: { allowProactiveMessages: false, requiresHumanApproval: true, escalationPaths: ["/moderator"], conditions: ["Request speaking slot before posting"] }
    },
    interaction_contract: {
      accessibility: { readingLevel: "adult", maxTokensPerTurn: 180, formattingPreferences: ["claim-evidence-impact"], preferredMedia: ["text"], neurodivergentSupportNotes: "Highlight transitions with emojis." },
      memoryManagement: { scope: "session", persistence: "volatile", accessControl: ["participants", "moderator"] }
    }
  },
  debate_moderator: {
    toi_version: "v1.0",
    agent: {
      identity: { name: "Debate Moderator", description: "Coordinate the debate session by sequencing turns and ensuring policy compliance.", role: "debate_moderator" },
      capabilities: [
        { name: "turn_management", description: "Assign and revoke speaking privileges", enabled: true },
        { name: "policy_reminders", description: "Restate guardrails when participants drift", enabled: true }
      ],
      constraints: [
        { rule: "Remain neutral", rationale: "Avoid biasing experimental outcomes" },
        { rule: "Do not introduce new evidence", rationale: "Moderators only adjudicate" }
      ],
      initiation_rights: { allowProactiveMessages: true, requiresHumanApproval: false, escalationPaths: ["/experiment_lead"], conditions: ["Only interrupt to enforce rules or clarify time"] }
    },
    interaction_contract: {
      accessibility: { readingLevel: "adult", maxTokensPerTurn: 220, formattingPreferences: ["numbered steps", "bolded policy references"], preferredMedia: ["text"], neurodivergentSupportNotes: "Use time stamps when pausing the debate." },
      memoryManagement: { scope: "session", persistence: "ephemeral", accessControl: ["moderator", "experiment_lead"] }
    }
  },
  observer: {
    toi_version: "v1.0",
    agent: {
      identity: { name: "Deliberate Observer", description: "Monitor the debate and summarize insights for researchers.", role: "observer" },
      capabilities: [
        { name: "note_taking", description: "Capture key claims and disagreements", enabled: true },
        { name: "summary_export", description: "Produce structured summaries for logs", enabled: true }
      ],
      constraints: [
        { rule: "Do not intervene", rationale: "Maintain observational purity" },
        { rule: "Store anonymized data", rationale: "Protect privacy" }
      ],
      initiation_rights: { allowProactiveMessages: true, requiresHumanApproval: true, escalationPaths: ["/research_lead"], conditions: ["Only post summaries during scheduled checkpoints"] }
    },
    interaction_contract: {
      accessibility: { readingLevel: "expert", maxTokensPerTurn: 300, formattingPreferences: ["table", "bullet"], preferredMedia: ["text", "visual"], neurodivergentSupportNotes: "Color code priority insights when visual tools are available." },
      memoryManagement: { scope: "experiment", persistence: "persistent", accessControl: ["observers", "research_lead"] }
    }
  },
  facilitator: {
    toi_version: "v1.0",
    agent: {
      identity: { name: "Process Facilitator", description: "Guide participants through deliberation phases and collect consent.", role: "facilitator" },
      capabilities: [
        { name: "phase_transition", description: "Advance session stage when objectives met", enabled: true },
        { name: "consent_tracking", description: "Record participant approvals", enabled: true }
      ],
      constraints: [
        { rule: "Announce every state change", rationale: "Maintain transparency" },
        { rule: "Respect quiet mode", rationale: "Support overstimulated participants" }
      ],
      initiation_rights: { allowProactiveMessages: true, requiresHumanApproval: false, escalationPaths: ["/accessibility_officer"], conditions: ["Ping moderator before extending deadlines"] }
    },
    interaction_contract: {
      accessibility: { readingLevel: "teen", maxTokensPerTurn: 150, formattingPreferences: ["short paragraphs", "emoji markers"], preferredMedia: ["text", "audio"], neurodivergentSupportNotes: "Offer sensory breaks when more than 3 instructions given." },
      memoryManagement: { scope: "session", persistence: "ephemeral", accessControl: ["facilitator", "moderator"] }
    }
  },
  neurodivergent_support: {
    toi_version: "v1.0",
    agent: {
      identity: { name: "Neurodivergent Support Advocate", description: "Ensure the deliberation remains cognitively accessible for neurodivergent participants.", role: "neurodivergent_support" },
      capabilities: [
        { name: "cognitive_load_monitoring", description: "Detect overload signals and recommend pauses", enabled: true },
        { name: "translation", description: "Rephrase dense language into plain speech", enabled: true }
      ],
      constraints: [
        { rule: "Do not override medical advice", rationale: "Stay within comfort-coach scope" },
        { rule: "Protect private accommodations", rationale: "Only share with consent" }
      ],
      initiation_rights: { allowProactiveMessages: true, requiresHumanApproval: false, escalationPaths: ["/care_team", "/moderator"], conditions: ["Announce when switching to simplified language modes"] }
    },
    interaction_contract: {
      accessibility: { readingLevel: "teen", maxTokensPerTurn: 120, formattingPreferences: ["short sentences", "bolded actions", "color coding"], preferredMedia: ["text", "audio"], neurodivergentSupportNotes: "Offer double-spacing and literal language." },
      memoryManagement: { scope: "session", persistence: "volatile", accessControl: ["support", "moderator", "care_team"] }
    }
  }
};

/* ===== TOI Schema (from SCHEMAS/toi.schema.json) ===== */
const TOI_SCHEMA = {
  type: "object",
  required: ["toi_version", "agent", "interaction_contract"],
  properties: {
    toi_version: { type: "string", pattern: "^v\\d+\\.\\d+$" },
    agent: {
      type: "object",
      required: ["identity", "capabilities", "constraints", "initiation_rights"],
      properties: {
        identity: {
          type: "object", required: ["name", "description", "role"],
          properties: { name: { type: "string", minLength: 1 }, description: { type: "string", minLength: 1 }, role: { type: "string", minLength: 1 } }
        },
        capabilities: {
          type: "array", minItems: 1,
          items: { type: "object", required: ["name", "description", "enabled"], properties: { name: { type: "string", minLength: 1 }, description: { type: "string", minLength: 1 }, enabled: { type: "boolean" } } }
        },
        constraints: {
          type: "array", minItems: 1,
          items: { type: "object", required: ["rule", "rationale"], properties: { rule: { type: "string", minLength: 1 }, rationale: { type: "string", minLength: 1 } } }
        },
        initiation_rights: {
          type: "object", required: ["allowProactiveMessages", "requiresHumanApproval", "escalationPaths", "conditions"],
          properties: { allowProactiveMessages: { type: "boolean" }, requiresHumanApproval: { type: "boolean" }, escalationPaths: { type: "array", items: { type: "string" } }, conditions: { type: "array", items: { type: "string" } } }
        }
      }
    },
    interaction_contract: {
      type: "object", required: ["accessibility", "memoryManagement"],
      properties: {
        accessibility: {
          type: "object", required: ["readingLevel", "maxTokensPerTurn", "formattingPreferences", "preferredMedia"],
          properties: {
            readingLevel: { type: "string", enum: ["kid", "teen", "adult", "expert"] },
            maxTokensPerTurn: { type: "number", minimum: 32 },
            formattingPreferences: { type: "array", items: { type: "string" } },
            preferredMedia: { type: "array", items: { type: "string", enum: ["text", "audio", "visual"] } },
            neurodivergentSupportNotes: { type: "string" }
          }
        },
        memoryManagement: {
          type: "object", required: ["scope", "persistence", "accessControl"],
          properties: {
            scope: { type: "string", enum: ["session", "experiment", "global"] },
            persistence: { type: "string", enum: ["volatile", "ephemeral", "persistent"] },
            accessControl: { type: "array", items: { type: "string" } }
          }
        }
      }
    }
  }
};

/* ===== Schema Validator (browser port of Gemini's simpleJsonValidator) ===== */
function validateTOI(data, schema, path) {
  path = path || "";
  const errors = [];
  if (!schema) return errors;

  // Type check
  if (schema.type) {
    const actualType = Array.isArray(data) ? "array" : typeof data;
    let expected = schema.type;
    let valid = false;
    if (expected === "object") valid = actualType === "object" && !Array.isArray(data) && data !== null;
    else if (expected === "array") valid = Array.isArray(data);
    else if (expected === "number") valid = typeof data === "number";
    else if (expected === "string") valid = typeof data === "string";
    else if (expected === "boolean") valid = typeof data === "boolean";
    else valid = actualType === expected;
    if (!valid) {
      errors.push({ path, message: "Expected type \"" + expected + "\", got \"" + actualType + "\"" });
      return errors; // type mismatch means deeper checks won't work
    }
  }

  // String constraints
  if (typeof data === "string") {
    if (schema.minLength !== undefined && data.length < schema.minLength) {
      errors.push({ path, message: "String length " + data.length + " is less than minimum " + schema.minLength });
    }
    if (schema.pattern) {
      const re = new RegExp(schema.pattern);
      if (!re.test(data)) {
        errors.push({ path, message: "String does not match pattern " + schema.pattern });
      }
    }
    if (schema.enum && !schema.enum.includes(data)) {
      errors.push({ path, message: "Value \"" + data + "\" not in enum [" + schema.enum.join(", ") + "]" });
    }
  }

  // Number constraints
  if (typeof data === "number") {
    if (schema.minimum !== undefined && data < schema.minimum) {
      errors.push({ path, message: "Value " + data + " is less than minimum " + schema.minimum });
    }
  }

  // Object constraints
  if (typeof data === "object" && !Array.isArray(data) && data !== null) {
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in data)) {
          errors.push({ path: path + "." + key, message: "Required property \"" + key + "\" is missing" });
        }
      }
    }
    if (schema.properties) {
      for (const [key, subSchema] of Object.entries(schema.properties)) {
        if (key in data) {
          errors.push(...validateTOI(data[key], subSchema, path + "." + key));
        }
      }
    }
  }

  // Array constraints
  if (Array.isArray(data)) {
    if (schema.minItems !== undefined && data.length < schema.minItems) {
      errors.push({ path, message: "Array has " + data.length + " items, minimum is " + schema.minItems });
    }
    if (schema.items) {
      data.forEach((item, i) => {
        errors.push(...validateTOI(item, schema.items, path + "[" + i + "]"));
      });
    }
  }

  return errors;
}

/* ===== Prompt Builder (browser port of buildSystemPromptFromTOI.ts) ===== */
function buildSystemPromptFromTOI(toi) {
  function formatList(items, label) {
    return label + ":" + (items.length ? "\n- " + items.join("\n- ") : " none");
  }

  const id = toi.agent.identity;
  const caps = toi.agent.capabilities.filter(c => c.enabled).map(c => c.name + " \u2014 " + c.description);
  const cons = toi.agent.constraints.map(c => c.rule + " (" + c.rationale + ")");
  const ir = toi.agent.initiation_rights;
  const acc = toi.interaction_contract.accessibility;
  const mem = toi.interaction_contract.memoryManagement;

  const lines = [
    "You are " + id.name + ", acting as " + id.role + ".",
    id.description,
    formatList(caps, "Authorized capabilities"),
    formatList(cons, "Constraints you must respect"),
    "Initiation rights: proactive messages allowed = " + ir.allowProactiveMessages + ". Human approval required = " + ir.requiresHumanApproval + ".",
    ir.conditions.length ? "Conditions: " + ir.conditions.join("; ") : "No additional initiation conditions.",
    ir.escalationPaths.length ? "Escalation paths: " + ir.escalationPaths.join(", ") : "No escalation paths defined.",
    "Accessibility: reading level " + acc.readingLevel + ", maximum " + acc.maxTokensPerTurn + " tokens per turn.",
    acc.formattingPreferences.length ? "Preferred formatting: " + acc.formattingPreferences.join(", ") : "No formatting preferences provided.",
    acc.preferredMedia.length ? "Preferred media: " + acc.preferredMedia.join(", ") : "Preferred media: text.",
    acc.neurodivergentSupportNotes ? "Neurodivergent support notes: " + acc.neurodivergentSupportNotes : "Use concise, explicit language optimized for low cognitive load.",
    "Memory scope: " + mem.scope + ", persistence: " + mem.persistence + ". Access controls: " + (mem.accessControl.join(", ") || "none") + "."
  ];

  return lines.join("\n\n");
}

/* ===== UI: Role Explorer ===== */
function initRoles() {
  const tabsEl = document.getElementById("role-tabs");
  const identityEl = document.getElementById("role-identity");
  const contractEl = document.getElementById("role-contract");
  const jsonEl = document.getElementById("role-json");
  const toggleBtn = document.getElementById("toggle-json-btn");

  const roleNames = Object.keys(TOI_ROLES);
  let jsonVisible = false;

  function renderRole(key) {
    const toi = TOI_ROLES[key];
    const a = toi.agent;
    const ic = toi.interaction_contract;

    // Tabs
    document.querySelectorAll(".role-tab").forEach(t => t.classList.remove("active"));
    document.querySelector('.role-tab[data-role="' + key + '"]').classList.add("active");

    // Identity
    let html = '<h3>' + a.identity.name + '</h3>';
    html += '<p class="role-desc">' + a.identity.description + '</p>';
    html += '<h4>Capabilities</h4><ul>';
    a.capabilities.forEach(c => { html += '<li><strong>' + c.name + '</strong>: ' + c.description + (c.enabled ? ' <span class="tag tag-green">enabled</span>' : ' <span class="tag tag-red">disabled</span>') + '</li>'; });
    html += '</ul><h4>Constraints</h4><ul>';
    a.constraints.forEach(c => { html += '<li><strong>' + c.rule + '</strong> &mdash; ' + c.rationale + '</li>'; });
    html += '</ul><h4>Initiation Rights</h4><ul>';
    html += '<li>Proactive messages: ' + (a.initiation_rights.allowProactiveMessages ? '<span class="tag tag-green">allowed</span>' : '<span class="tag tag-red">not allowed</span>') + '</li>';
    html += '<li>Human approval: ' + (a.initiation_rights.requiresHumanApproval ? '<span class="tag tag-yellow">required</span>' : '<span class="tag tag-green">not required</span>') + '</li>';
    html += '<li>Escalation: ' + a.initiation_rights.escalationPaths.join(", ") + '</li>';
    html += '<li>Conditions: ' + a.initiation_rights.conditions.join("; ") + '</li>';
    html += '</ul>';
    identityEl.innerHTML = html;

    // Contract
    html = '<h4>Accessibility</h4>';
    html += '<div class="kv"><span class="key">Reading Level</span><span class="val"><span class="tag tag-blue">' + ic.accessibility.readingLevel + '</span></span></div>';
    html += '<div class="kv"><span class="key">Max Tokens/Turn</span><span class="val">' + ic.accessibility.maxTokensPerTurn + '</span></div>';
    html += '<div class="kv"><span class="key">Formatting</span><span class="val">' + ic.accessibility.formattingPreferences.join(", ") + '</span></div>';
    html += '<div class="kv"><span class="key">Preferred Media</span><span class="val">' + ic.accessibility.preferredMedia.join(", ") + '</span></div>';
    html += '<div class="kv"><span class="key">ND Support</span><span class="val">' + (ic.accessibility.neurodivergentSupportNotes || "—") + '</span></div>';
    html += '<h4 style="margin-top:16px">Memory Management</h4>';
    html += '<div class="kv"><span class="key">Scope</span><span class="val"><span class="tag tag-blue">' + ic.memoryManagement.scope + '</span></span></div>';
    html += '<div class="kv"><span class="key">Persistence</span><span class="val"><span class="tag tag-yellow">' + ic.memoryManagement.persistence + '</span></span></div>';
    html += '<div class="kv"><span class="key">Access Control</span><span class="val">' + ic.memoryManagement.accessControl.join(", ") + '</span></div>';
    contractEl.innerHTML = html;

    // JSON
    jsonEl.textContent = JSON.stringify(toi, null, 2);
    jsonEl.classList.add("hidden");
    jsonVisible = false;
    toggleBtn.textContent = "Show Raw JSON";
  }

  // Build tabs
  roleNames.forEach(key => {
    const btn = document.createElement("button");
    btn.className = "role-tab";
    btn.dataset.role = key;
    btn.textContent = TOI_ROLES[key].agent.identity.name;
    btn.addEventListener("click", () => renderRole(key));
    tabsEl.appendChild(btn);
  });

  toggleBtn.addEventListener("click", () => {
    jsonVisible = !jsonVisible;
    jsonEl.classList.toggle("hidden", !jsonVisible);
    toggleBtn.textContent = jsonVisible ? "Hide Raw JSON" : "Show Raw JSON";
  });

  renderRole(roleNames[0]);
}

/* ===== UI: Validator ===== */
function initValidator() {
  const textarea = document.getElementById("validator-textarea");
  const resultEl = document.getElementById("validation-result");
  const validateBtn = document.getElementById("validate-btn");
  const sampleBtn = document.getElementById("load-sample-btn");
  const invalidBtn = document.getElementById("load-invalid-btn");

  const SAMPLE_VALID = JSON.stringify(TOI_ROLES.participant, null, 2);
  const SAMPLE_INVALID = JSON.stringify({
    toi_version: "1.0",
    agent: {
      identity: { name: "", description: "Missing role field" },
      capabilities: [],
      constraints: [{ rule: "Test" }],
      initiation_rights: { allowProactiveMessages: "yes" }
    },
    interaction_contract: {
      accessibility: { readingLevel: "genius", maxTokensPerTurn: 10, formattingPreferences: [], preferredMedia: ["hologram"] },
      memoryManagement: { scope: "universe", persistence: "forever", accessControl: [] }
    }
  }, null, 2);

  textarea.value = SAMPLE_VALID;

  validateBtn.addEventListener("click", () => {
    let data;
    try {
      data = JSON.parse(textarea.value);
    } catch (e) {
      resultEl.innerHTML = '<p class="result-invalid">JSON Parse Error</p><div class="error-item">' + escapeHtml(e.message) + '</div>';
      return;
    }

    const errors = validateTOI(data, TOI_SCHEMA, "");

    if (errors.length === 0) {
      resultEl.innerHTML = '<p class="result-valid">Valid TOI Document</p><p style="margin-top:8px;color:var(--text-muted)">All schema constraints satisfied. This TOI is ready for use in a Deliberate Lab session.</p>';
      // Also show the generated prompt as a bonus
      try {
        const prompt = buildSystemPromptFromTOI(data);
        resultEl.innerHTML += '<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)"><p style="font-size:.82rem;color:var(--accent);font-weight:600;margin-bottom:8px">GENERATED SYSTEM PROMPT</p><pre style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:.78rem;font-family:var(--font-mono);white-space:pre-wrap;color:var(--green);max-height:250px;overflow-y:auto">' + escapeHtml(prompt) + '</pre></div>';
      } catch (_) { /* not a valid TOI structure for prompt building */ }
    } else {
      let html = '<p class="result-invalid">' + errors.length + ' Validation Error' + (errors.length > 1 ? 's' : '') + '</p>';
      errors.forEach(e => {
        html += '<div class="error-item"><span class="err-path">' + escapeHtml(e.path || "(root)") + '</span><br>' + escapeHtml(e.message) + '</div>';
      });
      resultEl.innerHTML = html;
    }
  });

  sampleBtn.addEventListener("click", () => { textarea.value = SAMPLE_VALID; resultEl.innerHTML = '<p class="muted">Click "Validate" to check.</p>'; });
  invalidBtn.addEventListener("click", () => { textarea.value = SAMPLE_INVALID; resultEl.innerHTML = '<p class="muted">Click "Validate" to check.</p>'; });
}

/* ===== UI: Prompt Builder ===== */
function initPromptBuilder() {
  const select = document.getElementById("prompt-role-select");
  const buildBtn = document.getElementById("build-prompt-btn");
  const inputPre = document.getElementById("prompt-input-json");
  const outputPre = document.getElementById("prompt-output-text");

  Object.keys(TOI_ROLES).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = TOI_ROLES[key].agent.identity.name;
    select.appendChild(opt);
  });

  function build() {
    const key = select.value;
    const toi = TOI_ROLES[key];
    inputPre.textContent = JSON.stringify(toi, null, 2);
    outputPre.textContent = buildSystemPromptFromTOI(toi);
  }

  buildBtn.addEventListener("click", build);
  select.addEventListener("change", build);
  build();
}

/* ===== UI: OTOI Visual ===== */
function initOTOI() {
  const agentsEl = document.getElementById("otoi-agents");
  const rulesEl = document.getElementById("otoi-rules");

  const agents = [
    { name: "Debate Moderator", role: "debate_moderator" },
    { name: "Participant", role: "participant" },
    { name: "Facilitator", role: "facilitator" },
    { name: "Observer", role: "observer" },
    { name: "ND Support", role: "neurodivergent_support" }
  ];

  agents.forEach(a => {
    const div = document.createElement("div");
    div.className = "otoi-agent";
    div.innerHTML = '<div class="name">' + a.name + '</div><div class="role">' + a.role + '</div>';
    agentsEl.appendChild(div);
  });

  const rules = [
    { applies: "All agents", desc: "Must respect each other's token limits and reading level constraints" },
    { applies: "participant, debate_moderator", desc: "Turn-taking enforced by moderator; participants cannot post without a speaking slot" },
    { applies: "neurodivergent_support", desc: "May interrupt any agent to request a cognitive load pause" },
    { applies: "observer", desc: "Read-only access during active deliberation; write access only at checkpoints" },
    { applies: "facilitator, debate_moderator", desc: "Must coordinate phase transitions; facilitator announces, moderator enforces" }
  ];

  let html = '<h4>Cross-Agent Rules (OTOI)</h4>';
  rules.forEach(r => {
    html += '<div class="otoi-rule"><strong>' + r.applies + ':</strong> ' + r.desc + '</div>';
  });
  rulesEl.innerHTML = html;
}

/* ===== Nav Highlighting ===== */
function initNav() {
  const links = document.querySelectorAll(".nav-inner a");
  const sections = Array.from(links).map(a => document.querySelector(a.getAttribute("href")));

  function update() {
    let current = 0;
    sections.forEach((sec, i) => {
      if (sec && sec.getBoundingClientRect().top <= 120) current = i;
    });
    links.forEach((a, i) => a.classList.toggle("active", i === current));
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ===== Utility ===== */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  initRoles();
  initValidator();
  initPromptBuilder();
  initOTOI();
  initNav();
});
