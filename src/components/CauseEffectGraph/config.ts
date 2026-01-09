// Configuration and constants for CauseEffectGraph

// Node dimensions for layout calculation
export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 80;
export const NODE_HEIGHT_WITH_SUBITEMS = 160; // Nodes with 3 subItems are ~160px tall

// Group container padding and spacing
export const GROUP_PADDING = 20;
export const GROUP_HEADER_HEIGHT = 28;

// Subgroup padding and spacing
export const SUBGROUP_PADDING = 12;
export const SUBGROUP_HEADER_HEIGHT = 20;
export const SUBGROUP_GAP = 15;

// Unified configuration for all node types
export interface NodeTypeConfig {
  label: string;
  // Container (group) styling
  groupBg: string;
  groupBorder: string;
  // Node styling
  nodeBg: string;
  nodeBorder: string;
  nodeText: string;
  nodeAccent: string;
  // Legend
  showInLegend: boolean;
  legendOrder: number;
}

// Default labels (generic) - can be overridden via GraphConfig.typeLabels
export const DEFAULT_TYPE_LABELS: Record<string, string> = {
  leaf: 'Leaf Nodes',
  cause: 'Causes',
  intermediate: 'Intermediate',
  effect: 'Effects',
};

export const NODE_TYPE_CONFIG: Record<string, NodeTypeConfig> = {
  // Root inputs - Light teal/cyan (exogenous factors we take as given)
  leaf: {
    label: DEFAULT_TYPE_LABELS.leaf,
    groupBg: 'rgba(204, 251, 241, 0.3)',
    groupBorder: 'transparent',
    nodeBg: '#ccfbf1',
    nodeBorder: 'rgba(20, 184, 166, 0.35)',  // teal-500
    nodeText: '#0f766e',  // teal-700
    nodeAccent: '#14b8a6',
    showInLegend: true,
    legendOrder: 0,
  },
  // Derived factors - Light slate/gray (first processing layer)
  cause: {
    label: DEFAULT_TYPE_LABELS.cause,
    groupBg: 'rgba(226, 232, 240, 0.3)',
    groupBorder: 'transparent',
    nodeBg: '#e2e8f0',  // slate-200
    nodeBorder: 'rgba(100, 116, 139, 0.35)',  // slate-500
    nodeText: '#334155',  // slate-700
    nodeAccent: '#64748b',
    showInLegend: true,
    legendOrder: 1,
  },
  // Direct factors - Light blue-gray (second processing layer)
  intermediate: {
    label: DEFAULT_TYPE_LABELS.intermediate,
    groupBg: 'rgba(203, 213, 225, 0.3)',
    groupBorder: 'transparent',
    nodeBg: '#cbd5e1',  // slate-300
    nodeBorder: 'rgba(71, 85, 105, 0.35)',  // slate-600
    nodeText: '#1e293b',  // slate-800
    nodeAccent: '#475569',
    showInLegend: true,
    legendOrder: 2,
  },
  // Target - Amber/yellow (the output we care about - stands out)
  effect: {
    label: DEFAULT_TYPE_LABELS.effect,
    groupBg: 'rgba(254, 243, 199, 0.3)',
    groupBorder: 'transparent',
    nodeBg: '#fef3c7',  // amber-100
    nodeBorder: 'rgba(217, 119, 6, 0.4)',  // amber-600
    nodeText: '#92400e',  // amber-800
    nodeAccent: '#f59e0b',
    showInLegend: true,
    legendOrder: 3,
  },
};

// Special colors for individual outcome nodes (tier-based: differentiate by valence)
export const OUTCOME_COLORS: Record<string, Partial<NodeTypeConfig>> = {
  'existential-catastrophe': {
    nodeBg: '#fee2e2',
    nodeBorder: 'rgba(220, 38, 38, 0.3)',  // #dc2626 at 30% opacity
    nodeText: '#991b1b',
    nodeAccent: '#ef4444',
  },
  'long-term-trajectory': {
    nodeBg: '#fef3c7',
    nodeBorder: 'rgba(245, 158, 11, 0.3)',  // #f59e0b at 30% opacity
    nodeText: '#92400e',
    nodeAccent: '#fbbf24',
  },
};

// Border radius by node type (shapes encode node function)
export const NODE_BORDER_RADIUS: Record<string, string> = {
  leaf: '12px',
  cause: '12px',           // Standard rectangles for factors
  intermediate: '20px',    // More rounded for scenarios (mechanisms)
  effect: '40px',          // Stadium/pill shape for outcomes (terminals)
};

// Derived groupConfig for layout code
export const groupConfig: Record<string, { label: string; bgColor: string; borderColor: string }> =
  Object.fromEntries(
    Object.entries(NODE_TYPE_CONFIG).map(([key, config]) => [
      key,
      { label: config.label, bgColor: config.groupBg, borderColor: config.groupBorder }
    ])
  );

// Default subgroup configuration (empty - graphs provide their own via GraphConfig)
export const DEFAULT_SUBGROUP_CONFIG: Record<string, { label: string; bgColor: string; borderColor: string }> = {};

// Default subgroup order (empty - graphs provide their own)
export const DEFAULT_SUBGROUP_ORDER: string[] = [];

// ELK layout options - compact spacing for cleaner graphs
export const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '25',          // Reduced from 40
  'elk.spacing.edgeEdge': '15',          // Reduced from 20
  'elk.spacing.edgeNode': '20',          // Reduced from 25
  'elk.layered.spacing.nodeNodeBetweenLayers': '50',  // Reduced from 80
  'elk.layered.spacing.edgeNodeBetweenLayers': '20',  // Reduced from 30
  'elk.layered.spacing.edgeEdgeBetweenLayers': '15',  // Reduced from 20
  'elk.edgeRouting': 'SPLINES',
  'elk.layered.mergeEdges': 'false',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
};
