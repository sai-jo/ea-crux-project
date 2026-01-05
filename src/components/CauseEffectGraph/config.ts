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
  leaf: {
    label: DEFAULT_TYPE_LABELS.leaf,
    groupBg: 'rgba(236, 253, 245, 0.4)',
    groupBorder: 'transparent',
    nodeBg: '#ecfdf5',
    nodeBorder: 'rgba(5, 150, 105, 0.3)',  // #059669 at 30% opacity
    nodeText: '#047857',
    nodeAccent: '#10b981',
    showInLegend: false,
    legendOrder: 0,
  },
  // Root Factors - Blue family (tier-based: all inputs are blue)
  cause: {
    label: DEFAULT_TYPE_LABELS.cause,
    groupBg: 'rgba(219, 234, 254, 0.3)',
    groupBorder: 'transparent',
    nodeBg: '#dbeafe',
    nodeBorder: 'rgba(59, 130, 246, 0.3)',  // #3b82f6 at 30% opacity
    nodeText: '#1d4ed8',
    nodeAccent: '#60a5fa',
    showInLegend: true,
    legendOrder: 1,
  },
  // Scenarios - Purple (tier-based: mechanisms are purple)
  intermediate: {
    label: DEFAULT_TYPE_LABELS.intermediate,
    groupBg: 'rgba(237, 233, 254, 0.3)',
    groupBorder: 'transparent',
    nodeBg: '#ede9fe',
    nodeBorder: 'rgba(124, 58, 237, 0.3)',  // #7c3aed at 30% opacity
    nodeText: '#5b21b6',
    nodeAccent: '#8b5cf6',
    showInLegend: true,
    legendOrder: 2,
  },
  // Outcomes - Amber (default, individual nodes override via OUTCOME_COLORS)
  effect: {
    label: DEFAULT_TYPE_LABELS.effect,
    groupBg: 'rgba(254, 243, 199, 0.3)',
    groupBorder: 'transparent',
    nodeBg: '#fef3c7',
    nodeBorder: 'rgba(217, 119, 6, 0.3)',  // #d97706 at 30% opacity
    nodeText: '#92400e',
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

// ELK layout options
export const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '40',
  'elk.spacing.edgeEdge': '20',
  'elk.spacing.edgeNode': '25',
  'elk.layered.spacing.nodeNodeBetweenLayers': '80',
  'elk.layered.spacing.edgeNodeBetweenLayers': '30',
  'elk.layered.spacing.edgeEdgeBetweenLayers': '20',
  'elk.edgeRouting': 'SPLINES',
  'elk.layered.mergeEdges': 'false',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
};
