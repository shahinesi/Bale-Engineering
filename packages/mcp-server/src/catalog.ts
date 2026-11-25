export type SkillEntry = {
  id: string;
  name: string;
  description: string;
  area: string;
  path: string;
  tags: string[];
};

export type ReferenceEntry = {
  id: string;
  title: string;
  area: string;
  path: string;
  source: string;
};

export const skills: SkillEntry[] = [
  {
    id: "bale-engineering",
    name: "Bale Engineering",
    description: "Main engineering orchestrator for requirements, platform selection, architecture and verification.",
    area: "orchestration",
    path: "skills/bale-engineering/SKILL.md",
    tags: ["architecture", "planning", "decision", "orchestration"]
  },
  {
    id: "bale-bot-api",
    name: "Bale Bot API",
    description: "Bot API methods, updates, webhooks, long polling, messages, keyboards and callbacks.",
    area: "bot-api",
    path: "skills/bale-bot-api/SKILL.md",
    tags: ["bot", "keyboard", "callback", "webhook", "polling"]
  },
  {
    id: "bale-business-api",
    name: "Bale Business API",
    description: "Higher-quota, credit-funded outbound notifications to existing private Bale chats.",
    area: "business-api",
    path: "skills/bale-business-api/SKILL.md",
    tags: ["business", "bulk", "notification", "outbound", "credit"]
  },
  {
    id: "bale-miniapp",
    name: "Bale Mini App",
    description: "Mini App entry points, SDK, navigation, UX and client security.",
    area: "miniapp",
    path: "skills/bale-miniapp/SKILL.md",
    tags: ["miniapp", "webapp", "initdata", "theme", "navigation"]
  },
  {
    id: "bale-safir",
    name: "Bale Safir",
    description: "Safir REST messaging, OTP, templates, secure messages and idempotent retries.",
    area: "safir",
    path: "skills/bale-safir/SKILL.md",
    tags: ["safir", "otp", "message", "idempotency", "template"]
  },
  {
    id: "bale-wallet-payments",
    name: "Bale Wallet Payments",
    description: "Wallet invoices, Mini App invoice links, pre-checkout validation and payment reconciliation.",
    area: "payments",
    path: "skills/bale-wallet-payments/SKILL.md",
    tags: ["wallet", "payment", "invoice", "checkout", "transaction"]
  },
  {
    id: "bale-message-formatting",
    name: "Bale Message Formatting",
    description: "Bale-specific Markdown-like syntax and rendering limitations.",
    area: "messaging",
    path: "skills/bale-message-formatting/SKILL.md",
    tags: ["markdown", "formatting", "message", "rendering"]
  },
  {
    id: "bale-links",
    name: "Bale Deep Links",
    description: "Bot, Mini App, message, invitation and share links.",
    area: "links",
    path: "skills/bale-links/SKILL.md",
    tags: ["links", "start", "startapp", "deep-link"]
  },
  {
    id: "bale-engineering-review",
    name: "Bale Engineering Review",
    description: "Review correctness, security, reliability, tests and operational readiness.",
    area: "quality",
    path: "skills/bale-engineering-review/SKILL.md",
    tags: ["review", "security", "quality", "testing"]
  }
];

export const references: ReferenceEntry[] = [
  { id: "bot-api-overview", title: "Bot API protocol and update delivery", area: "bot-api", path: "knowledge/bot-api/overview.md", source: "https://docs.bale.ai/" },
  { id: "bot-api-methods", title: "Bot API supported methods and object catalog", area: "bot-api", path: "knowledge/bot-api/methods-catalog.md", source: "https://docs.bale.ai/" },
  { id: "business-api", title: "Business API outbound messaging", area: "business-api", path: "knowledge/bot-api/business-api.md", source: "https://docs.bale.ai/" },
  { id: "payments-and-wallet", title: "Wallet invoices and payment verification", area: "payments", path: "knowledge/bot-api/payments-and-wallet.md", source: "https://docs.bale.ai/" },
  { id: "keyboards-and-callbacks", title: "Keyboards, styles and callbacks", area: "bot-api", path: "knowledge/bot-api/keyboards-and-callbacks.md", source: "https://docs.bale.ai/" },
  { id: "miniapp-overview", title: "Mini App entry points, SDK and UX", area: "miniapp", path: "knowledge/miniapp/overview-and-navigation.md", source: "https://docs.bale.ai/miniapp" },
  { id: "miniapp-security", title: "Mini App identity and trust boundaries", area: "miniapp", path: "knowledge/miniapp/security-and-identity.md", source: "https://docs.bale.ai/miniapp" },
  { id: "safir-overview", title: "Safir delivery and idempotency", area: "safir", path: "knowledge/safir/overview-idempotency-and-errors.md", source: "https://docs.bale.ai/safir" },
  { id: "message-formatting", title: "Bale message formatting", area: "messaging", path: "knowledge/messaging/markdown-formatting.md", source: "https://docs.bale.ai/markdown-formatting" },
  { id: "deep-links", title: "Bale deep links", area: "links", path: "knowledge/links/deep-links.md", source: "https://docs.bale.ai/links" },
  { id: "platform-selection", title: "Bot API, Business API, Mini App and Safir selection", area: "engineering", path: "knowledge/engineering/platform-selection.md", source: "https://docs.bale.ai/" },
  { id: "glossary", title: "Bale Engineering glossary", area: "engineering", path: "knowledge/engineering/glossary.md", source: "https://docs.bale.ai/" }
];

export const templates = [
  { id: "prd", title: "Product / Feature Brief", path: "templates/PRD.md" },
  { id: "adr", title: "Architecture Decision Record", path: "templates/ADR.md" },
  { id: "api-contract", title: "API Contract", path: "templates/API-CONTRACT.md" },
  { id: "test-matrix", title: "Test Matrix", path: "templates/TEST-MATRIX.md" }
];
