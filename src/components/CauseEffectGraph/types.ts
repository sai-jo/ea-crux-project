// Types for CauseEffectGraph

// Color override for nodes - allows explicit color customization
export interface NodeColors {
  bg?: string;
  border?: string;
  text?: string;
  accent?: string;
}

export interface CauseEffectNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  type?: 'leaf' | 'cause' | 'effect' | 'intermediate';
  subgroup?: string;
  order?: number;  // Manual ordering within layer (0 = leftmost)
  nodeColors?: NodeColors;  // Optional color override for this specific node
  subItems?: Array<{
    label: string;
    probability?: string;
    href?: string;
    description?: string;
    scope?: string;
    ratings?: {
      changeability?: number;
      xriskImpact?: number;
      trajectoryImpact?: number;
      uncertainty?: number;
    };
    keyDebates?: Array<{ topic: string; description: string }>;
  }>;
  confidence?: number;
  confidenceLabel?: string;
  details?: string;
  sources?: string[];
  relatedConcepts?: string[];
  href?: string;  // URL to navigate to when node is clicked
}

export interface CauseEffectEdgeData extends Record<string, unknown> {
  label?: string;
  impact?: number;
  strength?: 'strong' | 'medium' | 'weak';
  confidence?: 'high' | 'medium' | 'low';
  effect?: 'increases' | 'decreases' | 'mixed';
}

// Layout configuration options (all optional, with sensible defaults)
export interface LayoutOptions {
  containerWidth?: number;      // Fixed width for group containers
  centerX?: number;             // Center point for layout
  layerGap?: number;            // Vertical gap between layers
  causeSpacing?: number;        // Extra horizontal spacing for cause nodes
  intermediateSpacing?: number; // Extra horizontal spacing for intermediate nodes
  effectSpacing?: number;       // Extra horizontal spacing for effect nodes
}

// Type labels for customizing group/legend names
export interface TypeLabels {
  cause?: string;
  intermediate?: string;
  effect?: string;
  leaf?: string;
}

// Subgroup configuration (for nested groupings within layers)
export interface SubgroupConfig {
  label: string;
  bgColor: string;
  borderColor: string;
}

// Custom legend item
export interface LegendItem {
  type: string;
  label: string;
  color: string;
  borderColor: string;
}

// ELK layout algorithm options
export interface ElkLayoutOptions {
  edgeRouting?: 'POLYLINE' | 'SPLINES' | 'ORTHOGONAL';
  nodeSpacing?: number;
  layerSpacing?: number;
}

// Layout algorithm type
export type LayoutAlgorithm = 'dagre' | 'grouped' | 'elk';

// Complete graph configuration (combines all customization options)
export interface GraphConfig {
  layout?: LayoutOptions;
  typeLabels?: TypeLabels;
  subgroups?: Record<string, SubgroupConfig>;
  legendItems?: LegendItem[];
  elkOptions?: ElkLayoutOptions;
  // Visual options
  hideGroupBackgrounds?: boolean;  // Don't show section backgrounds (CAUSES, INTERMEDIATE, EFFECTS)
  hideGroupLabels?: boolean;       // Don't show section labels
  // Layout algorithm
  useDagre?: boolean;              // Use Dagre instead of ELK for simpler, cleaner layouts (deprecated - use layoutAlgorithm)
  layoutAlgorithm?: LayoutAlgorithm; // Layout algorithm to use: 'dagre' (hierarchical), 'grouped' (category sections), 'elk' (layered)
}
