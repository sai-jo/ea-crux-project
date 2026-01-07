/**
 * Page Template Definitions
 *
 * Templates define the expected structure and components for different page types.
 *
 * DATA ARCHITECTURE:
 * - YAML (parameter-graph.yaml) is the single source of truth for AI Transition Model metadata
 *   (ratings, descriptions, scope, keyDebates, relatedContent)
 * - MDX files contain only: title (for SEO/sidebar) and custom prose content
 * - Components read from YAML via parameter-graph-data.ts functions
 *
 * Pages can optionally declare which template they follow via `template` frontmatter field.
 */

export type TemplateId =
  | 'ai-transition-model-factor'
  | 'ai-transition-model-scenario'
  | 'ai-transition-model-outcome'
  | 'ai-transition-model-sub-item'
  | 'knowledge-base-risk'
  | 'knowledge-base-response'
  | 'knowledge-base-model'
  | 'knowledge-base-organization'
  | 'knowledge-base-person';

export interface TemplateSection {
  id: string;
  label: string;
  required: boolean;
  description: string;
  /** Component that renders this section, if auto-generated */
  component?: string;
  /** Heading level if manual (h2, h3) */
  headingLevel?: 'h2' | 'h3';
}

export interface FrontmatterField {
  name: string;
  type: 'string' | 'number' | 'date' | 'object' | 'array';
  required: boolean;
  description: string;
}

export interface PageTemplate {
  id: TemplateId;
  name: string;
  description: string;
  /** Path pattern this template applies to */
  pathPattern: string;
  /** Required frontmatter fields */
  frontmatter: FrontmatterField[];
  /** Expected sections in order */
  sections: TemplateSection[];
  /** Component to use for auto-generated content */
  autoComponent?: string;
  /** Example page following this template */
  examplePage?: string;
}

export const PAGE_TEMPLATES: Record<TemplateId, PageTemplate> = {
  'ai-transition-model-factor': {
    id: 'ai-transition-model-factor',
    name: 'AI Transition Model - Root Factor',
    description: 'Top-level factor pages (e.g., AI Capabilities, Misalignment Potential)',
    pathPattern: '/ai-transition-model/factors/*/index.mdx',
    frontmatter: [
      { name: 'title', type: 'string', required: true, description: 'Factor name' },
      { name: 'description', type: 'string', required: true, description: 'Brief description for previews' },
      { name: 'template', type: 'string', required: true, description: 'Must be "ai-transition-model-factor"' },
      { name: 'lastEdited', type: 'date', required: true, description: 'Last edit date (YYYY-MM-DD)' },
    ],
    sections: [
      { id: 'overview', label: 'Overview', required: true, headingLevel: 'h2', description: '2-3 paragraphs introducing the factor' },
      { id: 'sub-factors', label: 'Sub-Factors', required: true, headingLevel: 'h2', description: 'List of sub-items with brief descriptions' },
      { id: 'scenarios-influenced', label: 'Scenarios Influenced', required: false, component: 'TransitionModelContent', description: 'Auto-generated from YAML relationships' },
      { id: 'related-content', label: 'Related Content', required: false, headingLevel: 'h2', description: 'Links to knowledge base' },
    ],
    autoComponent: 'TransitionModelContent',
    examplePage: '/ai-transition-model/factors/ai-capabilities/',
  },

  'ai-transition-model-scenario': {
    id: 'ai-transition-model-scenario',
    name: 'AI Transition Model - Scenario Category',
    description: 'Scenario category pages (e.g., AI Takeover, Long-term Lock-in)',
    pathPattern: '/ai-transition-model/scenarios/*/index.mdx',
    frontmatter: [
      { name: 'title', type: 'string', required: true, description: 'Scenario category name' },
      { name: 'description', type: 'string', required: true, description: 'Brief description for previews' },
      { name: 'template', type: 'string', required: true, description: 'Must be "ai-transition-model-scenario"' },
      { name: 'lastEdited', type: 'date', required: true, description: 'Last edit date (YYYY-MM-DD)' },
    ],
    sections: [
      { id: 'overview', label: 'Overview', required: true, headingLevel: 'h2', description: '2-3 paragraphs introducing the scenario category' },
      { id: 'variants', label: 'Variants', required: true, headingLevel: 'h2', description: 'List of specific scenario variants' },
      { id: 'factors', label: 'Influencing Factors', required: false, component: 'TransitionModelContent', description: 'Auto-generated from YAML relationships' },
      { id: 'outcomes', label: 'Outcomes Affected', required: false, component: 'TransitionModelContent', description: 'Auto-generated from YAML relationships' },
    ],
    autoComponent: 'TransitionModelContent',
    examplePage: '/ai-transition-model/scenarios/ai-takeover/',
  },

  'ai-transition-model-outcome': {
    id: 'ai-transition-model-outcome',
    name: 'AI Transition Model - Outcome',
    description: 'Ultimate outcome pages (Existential Catastrophe, Long-term Trajectory)',
    pathPattern: '/ai-transition-model/outcomes/*.mdx',
    frontmatter: [
      { name: 'title', type: 'string', required: true, description: 'Outcome name' },
      { name: 'description', type: 'string', required: true, description: 'Brief description for previews' },
      { name: 'template', type: 'string', required: true, description: 'Must be "ai-transition-model-outcome"' },
      { name: 'lastEdited', type: 'date', required: true, description: 'Last edit date (YYYY-MM-DD)' },
    ],
    sections: [
      { id: 'overview', label: 'Overview', required: true, headingLevel: 'h2', description: 'Definition and scope of this outcome' },
      { id: 'scenarios', label: 'Scenarios Leading Here', required: true, headingLevel: 'h2', description: 'Which scenarios can cause this outcome' },
      { id: 'measurement', label: 'Measurement', required: false, headingLevel: 'h2', description: 'How we might measure/detect this outcome' },
    ],
    autoComponent: 'TransitionModelContent',
    examplePage: '/ai-transition-model/outcomes/existential-catastrophe/',
  },

  'ai-transition-model-sub-item': {
    id: 'ai-transition-model-sub-item',
    name: 'AI Transition Model - Sub-Item',
    description: 'Specific factor sub-items or scenario variants (e.g., Compute, Rapid Takeover)',
    pathPattern: '/ai-transition-model/*/*.mdx',
    frontmatter: [
      { name: 'title', type: 'string', required: true, description: 'Sub-item name' },
      { name: 'description', type: 'string', required: true, description: 'Brief description for previews' },
      { name: 'template', type: 'string', required: true, description: 'Must be "ai-transition-model-sub-item"' },
      { name: 'lastEdited', type: 'date', required: true, description: 'Last edit date (YYYY-MM-DD)' },
      { name: 'ratings', type: 'object', required: true, description: 'Changeability, xriskImpact, trajectoryImpact, uncertainty (0-100)' },
    ],
    sections: [
      { id: 'overview', label: 'Overview', required: true, headingLevel: 'h2', description: '1-2 paragraphs introducing the sub-item' },
      { id: 'ratings', label: 'Ratings', required: true, component: 'TransitionModelContent', description: 'Auto-generated ratings table' },
      { id: 'custom', label: 'Custom Content', required: false, description: 'Page-specific content (mechanisms, debates, etc.)' },
      { id: 'related', label: 'Related Content', required: false, headingLevel: 'h2', description: 'Links to knowledge base pages' },
    ],
    autoComponent: 'TransitionModelContent',
    examplePage: '/ai-transition-model/factors/ai-capabilities/compute/',
  },

  'knowledge-base-risk': {
    id: 'knowledge-base-risk',
    name: 'Knowledge Base - Risk',
    description: 'Risk analysis pages in the knowledge base',
    pathPattern: '/knowledge-base/risks/**/*.mdx',
    frontmatter: [
      { name: 'title', type: 'string', required: true, description: 'Risk name' },
      { name: 'description', type: 'string', required: true, description: 'Brief description with key finding' },
      { name: 'template', type: 'string', required: false, description: '"knowledge-base-risk"' },
      { name: 'quality', type: 'number', required: true, description: 'Quality rating 1-5' },
      { name: 'lastEdited', type: 'date', required: true, description: 'Last edit date' },
    ],
    sections: [
      { id: 'overview', label: 'Overview', required: true, headingLevel: 'h2', description: '2-3 substantive paragraphs' },
      { id: 'risk-assessment', label: 'Risk Assessment', required: true, headingLevel: 'h2', description: 'Table with severity, likelihood, timeline' },
      { id: 'mechanisms', label: 'Mechanisms / How It Works', required: true, headingLevel: 'h2', description: 'How the risk manifests' },
      { id: 'responses', label: 'Responses That Address This', required: true, headingLevel: 'h2', description: 'Cross-links to interventions' },
      { id: 'uncertainties', label: 'Key Uncertainties', required: true, headingLevel: 'h2', description: 'What we don\'t know' },
    ],
    examplePage: '/knowledge-base/risks/misuse/bioweapons/',
  },

  'knowledge-base-response': {
    id: 'knowledge-base-response',
    name: 'Knowledge Base - Response/Intervention',
    description: 'Intervention and response pages',
    pathPattern: '/knowledge-base/responses/**/*.mdx',
    frontmatter: [
      { name: 'title', type: 'string', required: true, description: 'Response name' },
      { name: 'description', type: 'string', required: true, description: 'Brief description with assessment' },
      { name: 'template', type: 'string', required: false, description: '"knowledge-base-response"' },
      { name: 'quality', type: 'number', required: true, description: 'Quality rating 1-5' },
      { name: 'lastEdited', type: 'date', required: true, description: 'Last edit date' },
    ],
    sections: [
      { id: 'overview', label: 'Overview', required: true, headingLevel: 'h2', description: '2-3 paragraphs' },
      { id: 'quick-assessment', label: 'Quick Assessment', required: true, headingLevel: 'h2', description: 'Table with tractability grades' },
      { id: 'how-it-works', label: 'How It Works', required: true, headingLevel: 'h2', description: 'Mechanism of action' },
      { id: 'risks-addressed', label: 'Risks Addressed', required: true, headingLevel: 'h2', description: 'Cross-links to risks' },
      { id: 'limitations', label: 'Limitations', required: true, headingLevel: 'h2', description: 'What this doesn\'t solve' },
    ],
    examplePage: '/knowledge-base/responses/alignment/interpretability/',
  },

  'knowledge-base-model': {
    id: 'knowledge-base-model',
    name: 'Knowledge Base - Analytical Model',
    description: 'Quantitative or conceptual model pages',
    pathPattern: '/knowledge-base/models/**/*.mdx',
    frontmatter: [
      { name: 'title', type: 'string', required: true, description: 'Model name' },
      { name: 'description', type: 'string', required: true, description: 'Methodology AND key conclusion' },
      { name: 'template', type: 'string', required: false, description: '"knowledge-base-model"' },
      { name: 'quality', type: 'number', required: true, description: 'Quality rating 1-5' },
      { name: 'lastEdited', type: 'date', required: true, description: 'Last edit date' },
      { name: 'ratings', type: 'object', required: true, description: 'novelty, rigor, actionability, completeness' },
    ],
    sections: [
      { id: 'overview', label: 'Overview', required: true, headingLevel: 'h2', description: '2-3 paragraphs' },
      { id: 'framework', label: 'Conceptual Framework', required: true, headingLevel: 'h2', description: 'Diagram + explanation' },
      { id: 'analysis', label: 'Quantitative Analysis', required: true, headingLevel: 'h2', description: 'Tables with uncertainty ranges' },
      { id: 'importance', label: 'Strategic Importance', required: true, headingLevel: 'h2', description: 'Magnitude, ranking, implications' },
      { id: 'limitations', label: 'Limitations', required: true, headingLevel: 'h2', description: 'What the model doesn\'t capture' },
    ],
    examplePage: '/knowledge-base/models/risk-models/bioweapons-risk-decomposition/',
  },

  'knowledge-base-organization': {
    id: 'knowledge-base-organization',
    name: 'Knowledge Base - Organization',
    description: 'Organization profile pages',
    pathPattern: '/knowledge-base/organizations/**/*.mdx',
    frontmatter: [
      { name: 'title', type: 'string', required: true, description: 'Organization name' },
      { name: 'description', type: 'string', required: true, description: 'Brief description' },
      { name: 'template', type: 'string', required: false, description: '"knowledge-base-organization"' },
      { name: 'lastEdited', type: 'date', required: true, description: 'Last edit date' },
    ],
    sections: [
      { id: 'overview', label: 'Overview', required: true, headingLevel: 'h2', description: 'Organization description' },
      { id: 'key-work', label: 'Key Work', required: true, headingLevel: 'h2', description: 'Notable contributions' },
      { id: 'people', label: 'Key People', required: false, headingLevel: 'h2', description: 'Leadership and researchers' },
    ],
    examplePage: '/knowledge-base/organizations/labs/anthropic/',
  },

  'knowledge-base-person': {
    id: 'knowledge-base-person',
    name: 'Knowledge Base - Person',
    description: 'Person profile pages',
    pathPattern: '/knowledge-base/people/*.mdx',
    frontmatter: [
      { name: 'title', type: 'string', required: true, description: 'Person name' },
      { name: 'description', type: 'string', required: true, description: 'Brief bio' },
      { name: 'template', type: 'string', required: false, description: '"knowledge-base-person"' },
      { name: 'lastEdited', type: 'date', required: true, description: 'Last edit date' },
    ],
    sections: [
      { id: 'overview', label: 'Overview', required: true, headingLevel: 'h2', description: 'Bio and role' },
      { id: 'contributions', label: 'Key Contributions', required: true, headingLevel: 'h2', description: 'Notable work' },
      { id: 'positions', label: 'Key Positions', required: false, headingLevel: 'h2', description: 'Views on AI risk' },
    ],
    examplePage: '/knowledge-base/people/paul-christiano/',
  },
};

export function getTemplate(id: TemplateId): PageTemplate | undefined {
  return PAGE_TEMPLATES[id];
}

export function getTemplateForPath(path: string): PageTemplate | undefined {
  // Simple pattern matching - could be more sophisticated
  for (const template of Object.values(PAGE_TEMPLATES)) {
    const pattern = template.pathPattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]+');
    if (new RegExp(`^${pattern}$`).test(path)) {
      return template;
    }
  }
  return undefined;
}

export function getAllTemplates(): PageTemplate[] {
  return Object.values(PAGE_TEMPLATES);
}
