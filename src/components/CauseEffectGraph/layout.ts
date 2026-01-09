import ELK from 'elkjs/lib/elk.bundled.js';
import Dagre from '@dagrejs/dagre';
import { MarkerType, type Node, type Edge } from '@xyflow/react';
import type { CauseEffectNodeData, CauseEffectEdgeData, GraphConfig, SubgroupConfig, TypeLabels } from './types';
import {
  NODE_WIDTH,
  NODE_HEIGHT_WITH_SUBITEMS,
  GROUP_PADDING,
  GROUP_HEADER_HEIGHT,
  SUBGROUP_PADDING,
  SUBGROUP_HEADER_HEIGHT,
  SUBGROUP_GAP,
  DEFAULT_SUBGROUP_CONFIG,
  groupConfig,
  DEFAULT_TYPE_LABELS,
  elkOptions as defaultElkOptions,
} from './config';

// Use larger height for layout since most nodes have subItems
const LAYOUT_NODE_HEIGHT = NODE_HEIGHT_WITH_SUBITEMS;

// Estimate node width based on content (label and sub-items)
function estimateNodeWidth(node: { data: CauseEffectNodeData }): number {
  const CHAR_WIDTH = 8; // Approximate pixels per character
  const MIN_WIDTH = NODE_WIDTH; // Must match actual rendered node width
  const PADDING = 40; // Internal padding

  // Get the longest text (label or any sub-item)
  let maxTextLength = node.data.label?.length || 0;

  if (node.data.subItems) {
    for (const item of node.data.subItems) {
      const itemLength = item.label?.length || 0;
      if (itemLength > maxTextLength) {
        maxTextLength = itemLength;
      }
    }
  }

  const estimatedWidth = maxTextLength * CHAR_WIDTH + PADDING;
  return Math.max(MIN_WIDTH, estimatedWidth);
}

const elk = new ELK();

// Style edges - variable weight based on strength, color based on effect direction
export function getStyledEdges(edges: Edge<CauseEffectEdgeData>[]): Edge<CauseEffectEdgeData>[] {
  const strengthMap = { strong: 3, medium: 2, weak: 1.2 };  // Subtle but visible contrast
  const neutralGray = '#64748b';  // Darker gray for better visibility
  const decreaseColor = '#ef4444';  // Red for negative effects

  return edges.map((edge) => {
    const data = edge.data;
    const strokeWidth = data?.strength ? strengthMap[data.strength] : 2.5;
    const isDecrease = data?.effect === 'decreases';
    const strokeColor = isDecrease ? decreaseColor : neutralGray;
    const strokeDasharray = data?.effect === 'mixed' ? '5,5' : undefined;

    return {
      ...edge,
      label: data?.label,
      labelStyle: data?.label ? { fontSize: 11, fontWeight: 500, fill: '#64748b' } : undefined,
      labelBgStyle: data?.label ? { fill: '#f8fafc', fillOpacity: 0.9 } : undefined,
      labelBgPadding: data?.label ? [4, 6] as [number, number] : undefined,
      labelBgBorderRadius: data?.label ? 4 : undefined,
      style: { ...edge.style, stroke: strokeColor, strokeWidth, opacity: 0.7, strokeDasharray },
      markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor, width: 16 + strokeWidth, height: 16 + strokeWidth },
    };
  });
}

// Helper types
type LayoutedNode = Node<CauseEffectNodeData>;
type NodesByType = Record<string, LayoutedNode[]>;

// Helper to position a row of nodes evenly around a center point
function positionRow(nodes: LayoutedNode[], centerX: number, extraSpacing: number = 0) {
  if (nodes.length === 0) return;
  if (nodes.length === 1) {
    nodes[0].position.x = centerX - NODE_WIDTH / 2;
    return;
  }
  const spacing = NODE_WIDTH + 20 + extraSpacing;  // Reduced base gap from 30 to 20
  const totalWidth = (nodes.length - 1) * spacing;
  const startX = centerX - totalWidth / 2;
  nodes.forEach((node, i) => {
    node.position.x = startX + i * spacing;
  });
}

// Get barycenter (average X of connected nodes)
function getBarycenter(nodeId: string, connectedNodes: LayoutedNode[], edges: Edge<CauseEffectEdgeData>[]) {
  const connected = connectedNodes.filter(n =>
    edges.some(e => (e.source === nodeId && e.target === n.id) || (e.target === nodeId && e.source === n.id))
  );
  if (connected.length === 0) return 0;
  return connected.reduce((sum, n) => sum + n.position.x, 0) / connected.length;
}

// Sort nodes by barycenter
function sortByBarycenter(group: LayoutedNode[], neighbors: LayoutedNode[], edges: Edge<CauseEffectEdgeData>[]) {
  group.sort((a, b) => {
    const aBC = getBarycenter(a.id, neighbors, edges);
    const bBC = getBarycenter(b.id, neighbors, edges);
    if (aBC === bBC) return a.position.x - b.position.x;
    return aBC - bBC;
  });
}

// Group nodes by type
function groupNodesByType(nodes: LayoutedNode[]): NodesByType {
  const result: NodesByType = {};
  for (const node of nodes) {
    const type = node.data.type || 'intermediate';
    if (!result[type]) result[type] = [];
    result[type].push(node);
  }
  return result;
}

// Group nodes by subgroup (works for any node type)
function groupNodesBySubgroup(nodes: LayoutedNode[] | undefined): Record<string, LayoutedNode[]> {
  const result: Record<string, LayoutedNode[]> = {};
  if (!nodes) return result;

  for (const node of nodes) {
    const subgroup = node.data.subgroup || 'default';
    if (!result[subgroup]) result[subgroup] = [];
    result[subgroup].push(node);
  }
  return result;
}

// Create a group container node with fixed width
function createGroupContainer(
  type: string,
  nodesInGroup: LayoutedNode[],
  globalCenterX: number,
  containerWidth: number,
  typeLabels?: TypeLabels
): Node<CauseEffectNodeData> | null {
  if (nodesInGroup.length === 0) return null;

  const config = groupConfig[type];
  if (!config) return null;
  const minX = globalCenterX - containerWidth / 2;
  const minY = Math.min(...nodesInGroup.map(n => n.position.y)) - GROUP_PADDING - GROUP_HEADER_HEIGHT;
  let maxY = Math.max(...nodesInGroup.map(n => n.position.y + LAYOUT_NODE_HEIGHT)) + GROUP_PADDING;

  // Type-specific height adjustments
  if (type === 'intermediate') {
    maxY += 20; // Extra bottom padding for scenarios (nodes with many subitems)
  } else if (type === 'effect') {
    maxY -= 40; // Less padding for outcomes (simpler nodes)
  }

  // Use custom type labels if provided, otherwise fall back to default config label
  const label = typeLabels?.[type as keyof TypeLabels] || config.label;

  return {
    id: `group-${type}`,
    type: 'group',
    position: { x: minX, y: minY },
    data: { label, type: type as CauseEffectNodeData['type'] },
    style: {
      width: containerWidth,
      height: maxY - minY,
      backgroundColor: config.bgColor,
      border: `2px dashed ${config.borderColor}`,
      borderRadius: '12px',
      zIndex: -1,
    },
    selectable: false,
    draggable: false,
  };
}

// Default configuration - compact layout for smaller graphs
const DEFAULT_CONFIG: Required<GraphConfig> = {
  layout: {
    containerWidth: 900,       // Reduced from 1200
    centerX: 450,              // Reduced from 600
    layerGap: 30,              // Reduced from 60
    causeSpacing: 40,          // Reduced from 100
    intermediateSpacing: 60,   // Reduced from 150
    effectSpacing: 80,         // Reduced from 300
  },
  typeLabels: DEFAULT_TYPE_LABELS as TypeLabels,
  subgroups: DEFAULT_SUBGROUP_CONFIG,
  legendItems: [],
  elkOptions: {},
};

// Estimate node dimensions based on type and content
function estimateNodeDimensions(node: Node<CauseEffectNodeData>): { width: number; height: number } {
  const nodeType = node.type;
  const data = node.data;

  // ClusterContainer nodes - sized to contain expandable children
  if (nodeType === 'clusterContainer') {
    const childCount = (data as Record<string, unknown>).childCount as number || 3;
    // Width to fit children side by side with gaps
    const width = Math.min(800, 100 + childCount * 220);
    // Height for header + one row of children
    const height = 140;
    return { width, height };
  }

  // Cluster nodes are much larger (have header, description, preview items)
  if (nodeType === 'cluster') {
    const previewItems = (data as Record<string, unknown>).previewItems as string[] | undefined;
    const numPreviewItems = previewItems?.length || 0;
    const hasDescription = !!(data as Record<string, unknown>).description;

    // Width: account for long labels and preview items side by side
    const baseWidth = 280;
    const width = Math.min(400, baseWidth + numPreviewItems * 20);

    // Height: header + description + preview items
    let height = 60; // Header with label and count
    if (hasDescription) height += 30;
    if (numPreviewItems > 0) height += 50; // Preview items row

    return { width, height };
  }

  // Expandable nodes are medium-sized (have badges, counts)
  if (nodeType === 'expandable') {
    return { width: 200, height: 80 };
  }

  // CauseEffect nodes with subItems are taller
  if (data.subItems && data.subItems.length > 0) {
    const numSubItems = data.subItems.length;
    return {
      width: NODE_WIDTH + 40,
      height: 80 + numSubItems * 28,  // Base height + space per sub-item
    };
  }

  // Regular nodes
  return {
    width: NODE_WIDTH + 20,
    height: LAYOUT_NODE_HEIGHT * 0.7,
  };
}

// Layout algorithm type
export type LayoutAlgorithm = 'dagre' | 'grouped' | 'elk';

// Dagre layout function - simpler, often cleaner for hierarchical DAGs
function getDagreLayout(
  nodes: Node<CauseEffectNodeData>[],
  edges: Edge<CauseEffectEdgeData>[]
): { nodes: Node<CauseEffectNodeData>[]; edges: Edge<CauseEffectEdgeData>[] } {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  // Adjust spacing based on graph size
  const isLargeGraph = nodes.length > 50;
  const nodeSpacing = isLargeGraph ? 30 : 50;
  const rankSpacing = isLargeGraph ? 120 : 80;

  g.setGraph({
    rankdir: 'TB',        // Top to bottom
    nodesep: nodeSpacing, // Horizontal separation between nodes
    ranksep: rankSpacing, // Vertical separation between ranks
    marginx: 40,
    marginy: 40,
    ranker: 'tight-tree', // Better for large graphs with many cross-edges
    acyclicer: 'greedy',  // Handle cycles gracefully
    align: 'UL',          // Align nodes to reduce edge crossings
  });

  // Group nodes by type to assign ranks
  const causeNodes: string[] = [];
  const intermediateNodes: string[] = [];
  const effectNodes: string[] = [];

  nodes.forEach((node) => {
    const nodeType = node.data.type;
    if (nodeType === 'cause' || nodeType === 'leaf') {
      causeNodes.push(node.id);
    } else if (nodeType === 'intermediate') {
      intermediateNodes.push(node.id);
    } else if (nodeType === 'effect') {
      effectNodes.push(node.id);
    }
  });

  // Add nodes with dynamic dimensions based on type
  nodes.forEach((node) => {
    const dims = estimateNodeDimensions(node);
    g.setNode(node.id, {
      width: dims.width,
      height: dims.height,
    });
  });

  // Add edges
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Add invisible edges to enforce layering:
  // cause → intermediate → effect
  // This ensures proper vertical ordering even without direct connections

  // Create anchor nodes for each layer to enforce ordering
  if (causeNodes.length > 0 && intermediateNodes.length > 0) {
    // Add invisible edges from a cause to intermediates to push them down
    const firstCause = causeNodes[0];
    intermediateNodes.forEach(intNode => {
      if (!edges.some(e => e.source === firstCause && e.target === intNode)) {
        g.setEdge(firstCause, intNode, { weight: 0, minlen: 2 });
      }
    });
  }

  if (intermediateNodes.length > 0 && effectNodes.length > 0) {
    // Add invisible edges from intermediates to effects
    const firstIntermediate = intermediateNodes[0];
    effectNodes.forEach(effNode => {
      if (!edges.some(e => e.source === firstIntermediate && e.target === effNode)) {
        g.setEdge(firstIntermediate, effNode, { weight: 0, minlen: 2 });
      }
    });
  }

  // If no intermediates, connect causes directly to effects
  if (intermediateNodes.length === 0 && causeNodes.length > 0 && effectNodes.length > 0) {
    const firstCause = causeNodes[0];
    effectNodes.forEach(effNode => {
      if (!edges.some(e => e.source === firstCause && e.target === effNode)) {
        g.setEdge(firstCause, effNode, { weight: 0, minlen: 3 });
      }
    });
  }

  // Run the layout
  Dagre.layout(g);

  // Apply positions back to nodes, centering based on actual dimensions
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id);
    const dims = estimateNodeDimensions(node);
    return {
      ...node,
      position: {
        x: dagreNode.x - dims.width / 2,  // Center the node based on its actual width
        y: dagreNode.y - dims.height / 2,  // Center based on actual height
      },
    };
  });

  return { nodes: layoutedNodes, edges: getStyledEdges(edges) };
}

// Grouped layout - lays out each category separately, then uses a meta-graph
// to position clusters based on their inter-cluster edge weights
function getGroupedLayout(
  nodes: Node<CauseEffectNodeData>[],
  edges: Edge<CauseEffectEdgeData>[]
): { nodes: Node<CauseEffectNodeData>[]; edges: Edge<CauseEffectEdgeData>[] } {
  // Handle empty input
  if (nodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  // Build connectivity sets for determining node positions
  const nodesWithOutgoingEdges = new Set<string>();
  const nodesWithIncomingEdges = new Set<string>();
  edges.forEach((edge) => {
    nodesWithOutgoingEdges.add(edge.source);
    nodesWithIncomingEdges.add(edge.target);
  });

  // Terminal nodes are effect nodes with no outgoing edges (end points of causal chain)
  const terminalNodes = new Set<string>();
  nodes.forEach((node) => {
    if (node.data.type === 'effect' && !nodesWithOutgoingEdges.has(node.id)) {
      terminalNodes.add(node.id);
    }
  });

  // Root nodes are cause/leaf nodes with no incoming edges (starting points of causal chain)
  const rootNodes = new Set<string>();
  nodes.forEach((node) => {
    const nodeType = node.data.type;
    if ((nodeType === 'cause' || nodeType === 'leaf') && !nodesWithIncomingEdges.has(node.id)) {
      rootNodes.add(node.id);
    }
  });

  // Category styling
  const categoryColors: Record<string, { bg: string; border: string }> = {
    'misalignment-potential': { bg: 'rgba(252, 231, 243, 0.25)', border: 'rgba(236, 72, 153, 0.6)' },
    'ai-capabilities': { bg: 'rgba(219, 234, 254, 0.25)', border: 'rgba(59, 130, 246, 0.6)' },
    'ai-uses': { bg: 'rgba(209, 250, 229, 0.25)', border: 'rgba(16, 185, 129, 0.6)' },
    'ai-ownership': { bg: 'rgba(254, 243, 199, 0.25)', border: 'rgba(245, 158, 11, 0.6)' },
    'civilizational-competence': { bg: 'rgba(224, 231, 255, 0.25)', border: 'rgba(99, 102, 241, 0.6)' },
    'transition-turbulence': { bg: 'rgba(255, 237, 213, 0.25)', border: 'rgba(249, 115, 22, 0.6)' },
    'ai-takeover': { bg: 'rgba(237, 233, 254, 0.25)', border: 'rgba(139, 92, 246, 0.6)' },
    'human-caused-catastrophe': { bg: 'rgba(250, 232, 255, 0.25)', border: 'rgba(217, 70, 239, 0.6)' },
    'long-term-lockin': { bg: 'rgba(243, 232, 255, 0.25)', border: 'rgba(168, 85, 247, 0.6)' },
    'existential-catastrophe': { bg: 'rgba(254, 226, 226, 0.25)', border: 'rgba(239, 68, 68, 0.6)' },
    'lock-in': { bg: 'rgba(254, 249, 195, 0.25)', border: 'rgba(234, 179, 8, 0.6)' },
    'positive-transition': { bg: 'rgba(220, 252, 231, 0.25)', border: 'rgba(34, 197, 94, 0.6)' },
  };

  const categoryLabels: Record<string, string> = {
    'misalignment-potential': 'Misalignment Potential',
    'ai-capabilities': 'AI Capabilities',
    'ai-uses': 'AI Uses',
    'ai-ownership': 'AI Ownership',
    'civilizational-competence': 'Civilizational Competence',
    'transition-turbulence': 'Transition Turbulence',
    'ai-takeover': 'AI Takeover',
    'human-caused-catastrophe': 'Human-Caused Catastrophe',
    'long-term-lockin': 'Long-term Lock-in',
    'existential-catastrophe': 'Existential Catastrophe',
    'lock-in': 'Lock-in',
    'positive-transition': 'Positive Transition',
  };

  // Step 1: Group nodes by category+layer combination
  // This creates separate clusters based on node type and connectivity:
  // Layer 0: Root causes (no incoming edges) - starting points
  // Layer 1: Derived causes (have incoming edges)
  // Layer 2: Intermediate nodes (scenarios)
  // Layer 3: Effect nodes with outgoing edges (intermediate outcomes)
  // Layer 4: Terminal effect nodes (no outgoing edges) - end points
  const nodesByCluster = new Map<string, Node<CauseEffectNodeData>[]>();
  const nodeToCluster = new Map<string, string>();
  const clusterToLayer = new Map<string, number>();
  const clusterToCategory = new Map<string, string>(); // For color lookup

  // Layer names for cluster IDs
  const layerNames = ['root-causes', 'derived-causes', 'scenarios', 'outcomes', 'terminal'];

  nodes.forEach((node) => {
    if (node.type === 'group') return; // Skip existing group nodes
    const category = node.data.subgroup || 'default';

    // Determine layer based on node type and connectivity
    const nodeType = node.data.type;
    let layer = 2; // Default to scenarios
    if (nodeType === 'cause' || nodeType === 'leaf') {
      // Root causes (no incoming edges) go to layer 0, others to layer 1
      layer = rootNodes.has(node.id) ? 0 : 1;
    } else if (nodeType === 'intermediate') {
      layer = 2;
    } else if (nodeType === 'effect') {
      // Terminal effect nodes (no outgoing edges) go to layer 4
      // Non-terminal effect nodes go to layer 3
      layer = terminalNodes.has(node.id) ? 4 : 3;
    }

    // Create cluster ID combining category and layer
    const clusterId = `${category}:${layerNames[layer]}`;
    nodeToCluster.set(node.id, clusterId);
    clusterToLayer.set(clusterId, layer);
    clusterToCategory.set(clusterId, category);

    if (!nodesByCluster.has(clusterId)) {
      nodesByCluster.set(clusterId, []);
    }
    nodesByCluster.get(clusterId)!.push({ ...node });
  });

  // Step 2: Calculate inter-cluster edge weights
  const clusterEdgeWeights = new Map<string, Map<string, number>>();
  const strengthScore = { strong: 3, medium: 2, weak: 1 };

  edges.forEach((edge) => {
    const sourceCluster = nodeToCluster.get(edge.source);
    const targetCluster = nodeToCluster.get(edge.target);
    if (!sourceCluster || !targetCluster || sourceCluster === targetCluster) return;

    // Get weight based on edge strength
    const weight = edge.data?.strength ? strengthScore[edge.data.strength] : 1;

    if (!clusterEdgeWeights.has(sourceCluster)) {
      clusterEdgeWeights.set(sourceCluster, new Map());
    }
    const sourceMap = clusterEdgeWeights.get(sourceCluster)!;
    sourceMap.set(targetCluster, (sourceMap.get(targetCluster) || 0) + weight);
  });

  // Step 3: For each cluster, arrange nodes in a grid layout (narrow and tall)
  const clusterLayouts = new Map<string, {
    nodes: Node<CauseEffectNodeData>[];
    width: number;
    height: number;
  }>();

  // Grid layout settings - prefer tall narrow clusters with breathing room
  const GRID_NODE_GAP_X = 25; // Horizontal gap between nodes in grid
  const GRID_NODE_GAP_Y = 20; // Vertical gap between nodes in grid
  const MAX_NODES_PER_ROW = 3; // Force narrow clusters

  nodesByCluster.forEach((clusterNodes, clusterId) => {
    if (clusterNodes.length === 0) return;

    // Sort nodes alphabetically for consistent ordering
    const sortedNodes = [...clusterNodes].sort((a, b) =>
      (a.data.label || '').localeCompare(b.data.label || '')
    );

    // Calculate grid dimensions
    const numNodes = sortedNodes.length;
    const nodesPerRow = Math.min(MAX_NODES_PER_ROW, numNodes);
    const numRows = Math.ceil(numNodes / nodesPerRow);

    // Position nodes in a grid
    let maxWidth = 0;
    let maxHeight = 0;
    const positionedNodes = sortedNodes.map((node, index) => {
      const dims = estimateNodeDimensions(node);
      const col = index % nodesPerRow;
      const row = Math.floor(index / nodesPerRow);

      const x = col * (dims.width + GRID_NODE_GAP_X);
      const y = row * (dims.height + GRID_NODE_GAP_Y);

      maxWidth = Math.max(maxWidth, x + dims.width);
      maxHeight = Math.max(maxHeight, y + dims.height);

      return {
        ...node,
        position: { x, y },
      };
    });

    clusterLayouts.set(clusterId, {
      nodes: positionedNodes,
      width: maxWidth,
      height: maxHeight,
    });
  });

  // Step 4: Arrange clusters using improved Sugiyama-style crossing reduction
  const CLUSTER_PADDING = 25;
  const CLUSTER_HEADER = 35;
  const CLUSTER_GAP_X = 40; // Horizontal gap between clusters
  const CLUSTER_GAP_Y = 70; // Vertical gap between layers
  const ROW_GAP = 45; // Gap between rows within a layer
  const MAX_ROW_WIDTH = 4500; // Wide enough for multiple narrow clusters side-by-side

  // Group clusters by their pre-determined layer
  const clustersByLayer = new Map<number, string[]>();
  clusterLayouts.forEach((_, clusterId) => {
    const layer = clusterToLayer.get(clusterId) ?? 0;
    if (!clustersByLayer.has(layer)) {
      clustersByLayer.set(layer, []);
    }
    clustersByLayer.get(layer)!.push(clusterId);
  });

  const sortedLayers = Array.from(clustersByLayer.keys()).sort((a, b) => a - b);

  // Helper: Get median position of connected clusters (more robust than mean)
  function getMedianPosition(
    clusterId: string,
    neighborLayer: string[],
    getWeight: (neighbor: string) => number,
    orderMap: Map<string, number>
  ): number | null {
    const positions: number[] = [];
    for (const neighbor of neighborLayer) {
      const weight = getWeight(neighbor);
      if (weight > 0) {
        const pos = orderMap.get(neighbor) ?? 0;
        // Add position multiple times based on weight for weighted median
        for (let i = 0; i < weight; i++) {
          positions.push(pos);
        }
      }
    }
    if (positions.length === 0) return null;
    positions.sort((a, b) => a - b);
    const mid = Math.floor(positions.length / 2);
    return positions.length % 2 === 0
      ? (positions[mid - 1] + positions[mid]) / 2
      : positions[mid];
  }

  // Helper: Count edge crossings between two adjacent layers
  function countCrossings(
    upperLayer: string[],
    lowerLayer: string[],
    getEdgeWeight: (upper: string, lower: string) => number
  ): number {
    let crossings = 0;
    // For each pair of edges, check if they cross
    for (let i = 0; i < upperLayer.length; i++) {
      for (let j = i + 1; j < upperLayer.length; j++) {
        const u1 = upperLayer[i];
        const u2 = upperLayer[j];
        for (let k = 0; k < lowerLayer.length; k++) {
          for (let l = k + 1; l < lowerLayer.length; l++) {
            const v1 = lowerLayer[k];
            const v2 = lowerLayer[l];
            // Edge (u1, v2) and (u2, v1) cross if both exist
            const w1 = getEdgeWeight(u1, v2);
            const w2 = getEdgeWeight(u2, v1);
            if (w1 > 0 && w2 > 0) {
              crossings += w1 * w2; // Weight crossings by edge importance
            }
          }
        }
      }
    }
    return crossings;
  }

  // Helper: Get total crossings for current ordering
  function getTotalCrossings(): number {
    let total = 0;
    for (let i = 0; i < sortedLayers.length - 1; i++) {
      const upper = clustersByLayer.get(sortedLayers[i]) || [];
      const lower = clustersByLayer.get(sortedLayers[i + 1]) || [];
      total += countCrossings(upper, lower, (u, l) =>
        clusterEdgeWeights.get(u)?.get(l) || 0
      );
    }
    return total;
  }

  // First pass: assign initial positions based on edge density
  // Clusters with more total edges get central positions
  const clusterOrder = new Map<string, number>();
  for (const layerNum of sortedLayers) {
    const clusters = clustersByLayer.get(layerNum) || [];
    // Sort by total edge weight (most connected in center)
    const edgeCounts = clusters.map(c => {
      let edgeTotal = 0;
      clusterEdgeWeights.get(c)?.forEach(w => edgeTotal += w);
      clusterEdgeWeights.forEach(targets => edgeTotal += targets.get(c) || 0);
      return { id: c, count: edgeTotal };
    });
    edgeCounts.sort((a, b) => b.count - a.count);

    // Place most connected clusters in center positions
    const ordered: string[] = new Array(clusters.length);
    let left = Math.floor(clusters.length / 2);
    let right = left;
    let useLeft = true;
    for (const { id } of edgeCounts) {
      if (useLeft && left >= 0) {
        ordered[left--] = id;
      } else if (right < clusters.length) {
        ordered[right++] = id;
      }
      useLeft = !useLeft;
    }
    // Fill any gaps
    const result = ordered.filter(Boolean);
    result.forEach((id, idx) => clusterOrder.set(id, idx));
    clustersByLayer.set(layerNum, result);
  }

  // Median heuristic iterations with transpose optimization
  const NUM_ITERATIONS = 8;
  for (let iteration = 0; iteration < NUM_ITERATIONS; iteration++) {
    // Top-down pass using median
    for (let i = 1; i < sortedLayers.length; i++) {
      const layerNum = sortedLayers[i];
      const prevLayerNum = sortedLayers[i - 1];
      const clusters = clustersByLayer.get(layerNum) || [];
      const prevClusters = clustersByLayer.get(prevLayerNum) || [];

      // Calculate median position for each cluster
      const medians = new Map<string, number>();
      for (const clusterId of clusters) {
        const median = getMedianPosition(
          clusterId,
          prevClusters,
          (prev) => clusterEdgeWeights.get(prev)?.get(clusterId) || 0,
          clusterOrder
        );
        medians.set(clusterId, median ?? clusterOrder.get(clusterId) ?? 0);
      }

      // Sort by median
      clusters.sort((a, b) => (medians.get(a) ?? 0) - (medians.get(b) ?? 0));
      clusters.forEach((id, idx) => clusterOrder.set(id, idx));
    }

    // Bottom-up pass using median
    for (let i = sortedLayers.length - 2; i >= 0; i--) {
      const layerNum = sortedLayers[i];
      const nextLayerNum = sortedLayers[i + 1];
      const clusters = clustersByLayer.get(layerNum) || [];
      const nextClusters = clustersByLayer.get(nextLayerNum) || [];

      const medians = new Map<string, number>();
      for (const clusterId of clusters) {
        const targets = clusterEdgeWeights.get(clusterId);
        const median = getMedianPosition(
          clusterId,
          nextClusters,
          (next) => targets?.get(next) || 0,
          clusterOrder
        );
        medians.set(clusterId, median ?? clusterOrder.get(clusterId) ?? 0);
      }

      clusters.sort((a, b) => (medians.get(a) ?? 0) - (medians.get(b) ?? 0));
      clusters.forEach((id, idx) => clusterOrder.set(id, idx));
    }

    // Transpose optimization: try swapping adjacent clusters to reduce crossings
    const MAX_TRANSPOSE_PASSES = 3;
    for (const layerNum of sortedLayers) {
      const clusters = clustersByLayer.get(layerNum) || [];
      let passCount = 0;
      let improved = true;
      while (improved && passCount < MAX_TRANSPOSE_PASSES) {
        improved = false;
        passCount++;
        for (let j = 0; j < clusters.length - 1; j++) {
          const before = getTotalCrossings();
          // Swap adjacent clusters
          [clusters[j], clusters[j + 1]] = [clusters[j + 1], clusters[j]];
          clusters.forEach((id, idx) => clusterOrder.set(id, idx));
          const after = getTotalCrossings();

          if (after < before) {
            improved = true; // Keep the swap
          } else {
            // Revert the swap
            [clusters[j], clusters[j + 1]] = [clusters[j + 1], clusters[j]];
            clusters.forEach((id, idx) => clusterOrder.set(id, idx));
          }
        }
      }
    }
  }

  // Calculate cluster positions with row wrapping
  const clusterPositions = new Map<string, { x: number; y: number }>();

  // Organize clusters into rows within each layer (using barycenter order)
  type ClusterRow = { clusters: string[]; width: number; height: number };
  const layerRows = new Map<number, ClusterRow[]>();

  for (const layerNum of sortedLayers) {
    const clusters = clustersByLayer.get(layerNum) || [];
    const rows: ClusterRow[] = [];
    let currentRow: ClusterRow = { clusters: [], width: 0, height: 0 };

    for (const clusterId of clusters) {
      const layout = clusterLayouts.get(clusterId);
      if (!layout) continue;

      const clusterWidth = layout.width + CLUSTER_PADDING * 2;
      const clusterHeight = layout.height + CLUSTER_PADDING * 2 + CLUSTER_HEADER;

      // Check if adding this cluster would exceed max width
      const newWidth = currentRow.width + (currentRow.clusters.length > 0 ? CLUSTER_GAP_X : 0) + clusterWidth;

      // Start a new row only when we truly exceed max width
      if (currentRow.clusters.length > 0 && newWidth > MAX_ROW_WIDTH) {
        rows.push(currentRow);
        currentRow = { clusters: [clusterId], width: clusterWidth, height: clusterHeight };
      } else {
        currentRow.clusters.push(clusterId);
        currentRow.width = newWidth;
        currentRow.height = Math.max(currentRow.height, clusterHeight);
      }
    }

    // Don't forget the last row
    if (currentRow.clusters.length > 0) {
      rows.push(currentRow);
    }

    layerRows.set(layerNum, rows);
  }

  // Calculate total height for each layer (sum of row heights + gaps)
  const layerHeights = new Map<number, number>();
  for (const layerNum of sortedLayers) {
    const rows = layerRows.get(layerNum) || [];
    let totalHeight = 0;
    for (let i = 0; i < rows.length; i++) {
      totalHeight += rows[i].height;
      if (i < rows.length - 1) totalHeight += ROW_GAP;
    }
    layerHeights.set(layerNum, totalHeight);
  }

  // Find the widest row across all layers for centering
  let globalMaxWidth = 0;
  layerRows.forEach((rows) => {
    for (const row of rows) {
      globalMaxWidth = Math.max(globalMaxWidth, row.width);
    }
  });

  // Calculate Y positions for each layer
  const layerYPositions = new Map<number, number>();
  let currentY = 0;
  for (const layerNum of sortedLayers) {
    layerYPositions.set(layerNum, currentY);
    currentY += (layerHeights.get(layerNum) || 0) + CLUSTER_GAP_Y;
  }

  // Place clusters with smart horizontal positioning to minimize edge lengths
  // Multiple passes refine positions based on connected neighbors
  const clusterWidths = new Map<string, number>();

  // Calculate widths
  clusterLayouts.forEach((layout, clusterId) => {
    clusterWidths.set(clusterId, layout.width + CLUSTER_PADDING * 2);
  });

  // Process layers top-down to set initial positions, then refine
  for (let pass = 0; pass < 3; pass++) {
    for (const layerNum of sortedLayers) {
      const rows = layerRows.get(layerNum) || [];
      let rowY = layerYPositions.get(layerNum) || 0;

      for (const row of rows) {
        // Calculate target X for each cluster based on connected neighbors
        const targets: { id: string; targetX: number; width: number }[] = [];

        for (const clusterId of row.clusters) {
          const width = clusterWidths.get(clusterId) || 200;
          let sumX = 0;
          let totalWeight = 0;

          // Look at connected clusters in all layers (with distance decay)
          for (const otherLayerNum of sortedLayers) {
            if (otherLayerNum === layerNum) continue;
            const layerDistance = Math.abs(otherLayerNum - layerNum);
            // Linear decay gives balanced consideration to nearby layers
            const distanceWeight = 1 / layerDistance;

            const otherClusters = clustersByLayer.get(otherLayerNum) || [];
            for (const otherId of otherClusters) {
              const pos = clusterPositions.get(otherId);
              if (!pos) continue;

              const otherWidth = clusterWidths.get(otherId) || 200;
              const otherCenterX = pos.x + otherWidth / 2;

              // Weight by edge strength and distance
              let edgeWeight = clusterEdgeWeights.get(clusterId)?.get(otherId) || 0;
              edgeWeight += clusterEdgeWeights.get(otherId)?.get(clusterId) || 0;
              const weight = edgeWeight * distanceWeight;

              if (weight > 0) {
                sumX += otherCenterX * weight;
                totalWeight += weight;
              }
            }
          }

          // Position based on connected neighbors or center if none
          const centerX = (globalMaxWidth - width) / 2;
          const targetX = totalWeight > 0 ? sumX / totalWeight - width / 2 : centerX;

          targets.push({ id: clusterId, targetX, width });
        }

        // Sort targets by their desired X position
        targets.sort((a, b) => a.targetX - b.targetX);

        // Place clusters respecting order and avoiding overlaps
        // Start from the leftmost target and ensure minimum gaps
        let currentX = Math.max(0, targets[0]?.targetX ?? 0);

        // First, calculate the minimum required width
        let minRequiredWidth = 0;
        for (let i = 0; i < targets.length; i++) {
          minRequiredWidth += targets[i].width;
          if (i < targets.length - 1) minRequiredWidth += CLUSTER_GAP_X;
        }

        // Center the row if it's narrower than the global width
        const rowStartX = Math.max(0, (globalMaxWidth - minRequiredWidth) / 2);
        currentX = rowStartX;

        // Now place each cluster, trying to respect target but avoiding overlaps
        const placedPositions: { id: string; x: number; width: number }[] = [];
        for (let i = 0; i < targets.length; i++) {
          const { id, targetX, width } = targets[i];

          // Try to get close to target, but don't overlap previous cluster
          const desiredX = Math.max(currentX, targetX);

          // Don't let it go too far right either (leave room for remaining clusters)
          let remainingWidth = 0;
          for (let j = i + 1; j < targets.length; j++) {
            remainingWidth += targets[j].width + CLUSTER_GAP_X;
          }
          const maxX = globalMaxWidth - remainingWidth - width;
          const finalX = Math.min(desiredX, Math.max(currentX, maxX));

          placedPositions.push({ id, x: finalX, width });
          currentX = finalX + width + CLUSTER_GAP_X;
        }

        // Apply final positions
        for (const { id, x } of placedPositions) {
          clusterPositions.set(id, { x, y: rowY });
        }

        rowY += row.height + ROW_GAP;
      }
    }
  }

  // Step 5: Position clusters and their nodes based on computed positions
  const finalNodes: Node<CauseEffectNodeData>[] = [];
  const clusterContainers: Node<CauseEffectNodeData>[] = [];

  // Layer type labels for cluster names
  const layerTypeLabels = ['Root Causes', 'Derived Causes', 'Scenarios', 'Outcomes', 'Terminal Outcomes'];

  clusterLayouts.forEach((layout, clusterId) => {
    const layer = clusterToLayer.get(clusterId) ?? 0;
    const category = clusterToCategory.get(clusterId) ?? 'default';
    const position = clusterPositions.get(clusterId);
    if (!position) return;

    const containerWidth = layout.width + CLUSTER_PADDING * 2;
    const containerHeight = layout.height + CLUSTER_PADDING * 2 + CLUSTER_HEADER;

    // Cluster position (top-left corner)
    const clusterX = position.x;
    const clusterY = position.y;

    // Position all nodes in this cluster
    for (const node of layout.nodes) {
      finalNodes.push({
        ...node,
        position: {
          x: clusterX + CLUSTER_PADDING + node.position.x,
          y: clusterY + CLUSTER_PADDING + CLUSTER_HEADER + node.position.y,
        },
      });
    }

    // Create cluster container - use category color, but label with category + layer type
    const colors = categoryColors[category] || { bg: 'rgba(100, 116, 139, 0.2)', border: 'rgba(100, 116, 139, 0.5)' };
    const categoryLabel = categoryLabels[category] || category;
    const clusterLabel = `${categoryLabel} (${layerTypeLabels[layer]})`;

    clusterContainers.push({
      id: `cluster-${clusterId}`,
      type: 'group',
      position: { x: clusterX, y: clusterY },
      data: {
        label: clusterLabel,
        type: 'cause' as const,
      },
      style: {
        width: containerWidth,
        height: containerHeight,
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: '12px',
        zIndex: -1,
      },
      selectable: false,
      draggable: false,
    });
  });

  // Handle uncategorized nodes (if any)
  const defaultClusters = Array.from(clusterLayouts.keys()).filter(k => k.startsWith('default:'));
  if (defaultClusters.length > 0) {
    // Find the bottom of the positioned clusters
    let maxY = 0;
    clusterContainers.forEach((c) => {
      const bottom = c.position.y + ((c.style?.height as number) || 0);
      maxY = Math.max(maxY, bottom);
    });

    for (const clusterId of defaultClusters) {
      const layout = clusterLayouts.get(clusterId);
      if (!layout) continue;
      for (const node of layout.nodes) {
        finalNodes.push({
          ...node,
          position: {
            x: node.position.x,
            y: maxY + CLUSTER_GAP_Y + node.position.y,
          },
        });
      }
    }
  }

  return {
    nodes: [...clusterContainers, ...finalNodes],
    edges: getStyledEdges(edges),
  };
}

// Main layout function
export async function getLayoutedElements(
  nodes: Node<CauseEffectNodeData>[],
  edges: Edge<CauseEffectEdgeData>[],
  graphConfig?: GraphConfig
): Promise<{ nodes: Node<CauseEffectNodeData>[]; edges: Edge<CauseEffectEdgeData>[] }> {
  // Determine layout algorithm to use
  const layoutAlgorithm = graphConfig?.layoutAlgorithm || (graphConfig?.useDagre ? 'dagre' : 'elk');

  // Use Grouped layout for category-based section containers
  if (layoutAlgorithm === 'grouped') {
    return getGroupedLayout(nodes, edges);
  }

  // Use Dagre for simpler hierarchical layouts
  if (layoutAlgorithm === 'dagre') {
    return getDagreLayout(nodes, edges);
  }

  // Merge provided config with defaults
  const config = {
    ...DEFAULT_CONFIG,
    ...graphConfig,
    layout: { ...DEFAULT_CONFIG.layout, ...graphConfig?.layout },
    typeLabels: { ...DEFAULT_CONFIG.typeLabels, ...graphConfig?.typeLabels },
    subgroups: { ...DEFAULT_CONFIG.subgroups, ...graphConfig?.subgroups },
  };
  const layout = config.layout;
  // Build ELK graph with layer constraints
  const graph = {
    id: 'root',
    layoutOptions: defaultElkOptions,
    children: nodes.map((node) => {
      const layoutOptions: Record<string, string> = {};
      if (node.data.type === 'leaf' || node.data.type === 'cause') {
        layoutOptions['elk.layered.layerConstraint'] = 'FIRST';
      } else if (node.data.type === 'effect') {
        layoutOptions['elk.layered.layerConstraint'] = 'LAST';
      }
      return {
        id: node.id,
        width: NODE_WIDTH,
        height: LAYOUT_NODE_HEIGHT,
        layoutOptions: Object.keys(layoutOptions).length > 0 ? layoutOptions : undefined,
      };
    }),
    edges: edges.map((edge) => ({ id: edge.id, sources: [edge.source], targets: [edge.target] })),
  };

  const layoutedGraph = await elk.layout(graph);

  // Apply ELK positions
  let layoutedNodes = nodes.map((node) => {
    const elkNode = layoutedGraph.children?.find((n) => n.id === node.id);
    return { ...node, position: { x: elkNode?.x ?? 0, y: elkNode?.y ?? 0 } };
  });

  const nodesByType = groupNodesByType(layoutedNodes);
  const globalCenterX = layout.centerX;

  // Calculate Y positions for each layer
  const leafY = 0;
  if (nodesByType['leaf']) {
    for (const node of nodesByType['leaf']) node.position.y = leafY;
  }

  const leafContainerBottom = leafY + LAYOUT_NODE_HEIGHT + GROUP_PADDING;
  const causeContainerTop = leafContainerBottom + layout.layerGap;
  const causeRowY = causeContainerTop + GROUP_HEADER_HEIGHT + GROUP_PADDING;

  if (nodesByType['cause']) {
    for (const node of nodesByType['cause']) node.position.y = causeRowY;
  }

  const causeContainerBottom = causeRowY + LAYOUT_NODE_HEIGHT + GROUP_PADDING;
  const intermediateContainerTop = causeContainerBottom + layout.layerGap;
  const intermediateStartY = intermediateContainerTop + GROUP_HEADER_HEIGHT + GROUP_PADDING;

  // Position intermediate nodes by subgroup
  const intermediatesBySubgroup = groupNodesBySubgroup(nodesByType['intermediate']);
  const hasSubgroups = Object.keys(intermediatesBySubgroup).some(k => k !== 'default' && intermediatesBySubgroup[k]?.length > 0);

  let maxIntermediateY = intermediateStartY;
  const subgroupPositions: Record<string, { startX: number; minY: number; maxY: number; nodes: LayoutedNode[] }> = {};

  if (hasSubgroups) {
    const subgroupStartY = intermediateStartY + SUBGROUP_HEADER_HEIGHT + SUBGROUP_PADDING;

    // Get ordered active subgroups (use config.subgroups keys as order, then any remaining)
    const subgroupOrder = Object.keys(config.subgroups);
    const activeSubgroups = subgroupOrder.filter(sg => intermediatesBySubgroup[sg]?.length > 0);
    Object.keys(intermediatesBySubgroup).forEach(sg => {
      if (sg !== 'default' && !activeSubgroups.includes(sg)) activeSubgroups.push(sg);
    });
    if (intermediatesBySubgroup['default']?.length > 0) activeSubgroups.push('default');

    const columnWidth = NODE_WIDTH + SUBGROUP_PADDING * 2;
    const totalColumnsWidth = activeSubgroups.length * (columnWidth + SUBGROUP_GAP) - SUBGROUP_GAP;
    let currentX = globalCenterX - totalColumnsWidth / 2;

    for (const subgroupKey of activeSubgroups) {
      const subgroupNodes = intermediatesBySubgroup[subgroupKey] || [];
      if (subgroupNodes.length === 0) continue;

      let nodeY = subgroupStartY;
      for (const node of subgroupNodes) {
        node.position.x = currentX + SUBGROUP_PADDING;
        node.position.y = nodeY;
        nodeY += LAYOUT_NODE_HEIGHT + 15;
      }

      const subgroupMaxY = nodeY - 15 + LAYOUT_NODE_HEIGHT;
      maxIntermediateY = Math.max(maxIntermediateY, subgroupMaxY);

      subgroupPositions[subgroupKey] = {
        startX: currentX,
        minY: intermediateStartY,
        maxY: subgroupMaxY,
        nodes: subgroupNodes,
      };

      currentX += columnWidth + SUBGROUP_GAP;
    }
  } else {
    // Simple single-row layout for intermediates
    if (nodesByType['intermediate']) {
      for (const node of nodesByType['intermediate']) {
        node.position.y = intermediateStartY;
      }
      maxIntermediateY = intermediateStartY;
    }
  }

  // Position effect nodes
  const intermediateContainerBottom = maxIntermediateY + LAYOUT_NODE_HEIGHT + GROUP_PADDING;
  const effectContainerTop = intermediateContainerBottom + layout.layerGap;
  const effectRowY = effectContainerTop + GROUP_HEADER_HEIGHT + GROUP_PADDING;

  if (nodesByType['effect']) {
    for (const node of nodesByType['effect']) node.position.y = effectRowY;
  }

  // Sort and position nodes by manual order (if specified) or fall back to barycenter
  const allIntermediates = nodesByType['intermediate'] || [];

  // Helper to sort by manual order
  const sortByOrder = (nodes: LayoutedNode[]) => {
    nodes.sort((a, b) => {
      const orderA = a.data.order ?? 999;
      const orderB = b.data.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.position.x - b.position.x;  // Fall back to position
    });
  };

  // Check if any nodes have manual order
  const hasManualOrder = (nodes: LayoutedNode[]) => nodes.some(n => n.data.order !== undefined);

  // Position cause nodes (with horizontal subgroup support)
  const causesBySubgroup = groupNodesBySubgroup(nodesByType['cause']);
  const hasCauseSubgroups = Object.keys(causesBySubgroup).some(k => k !== 'default' && causesBySubgroup[k]?.length > 0);
  const causeSubgroupPositions: Record<string, { startX: number; endX: number; nodes: LayoutedNode[] }> = {};
  const CAUSE_SUBGROUP_GAP = 60; // Extra gap between subgroups

  if (nodesByType['cause']) {
    if (hasCauseSubgroups) {
      // Get ordered subgroups from config, then remaining
      const causeSubgroupOrder = Object.keys(config.subgroups);
      const activeCauseSubgroups = causeSubgroupOrder.filter(sg => causesBySubgroup[sg]?.length > 0);
      Object.keys(causesBySubgroup).forEach(sg => {
        if (sg !== 'default' && !activeCauseSubgroups.includes(sg)) activeCauseSubgroups.push(sg);
      });
      if (causesBySubgroup['default']?.length > 0) activeCauseSubgroups.push('default');

      // Sort nodes within each subgroup
      for (const sg of activeCauseSubgroups) {
        const nodes = causesBySubgroup[sg] || [];
        if (hasManualOrder(nodes)) {
          sortByOrder(nodes);
        } else {
          nodes.sort((a, b) => a.position.x - b.position.x);
        }
      }

      // Calculate total width needed using dynamic node widths
      let totalWidth = 0;
      for (const sg of activeCauseSubgroups) {
        const nodes = causesBySubgroup[sg] || [];
        for (const node of nodes) {
          totalWidth += estimateNodeWidth(node) + layout.causeSpacing;
        }
        if (nodes.length > 0) totalWidth -= layout.causeSpacing; // Remove trailing spacing
      }
      totalWidth += (activeCauseSubgroups.length - 1) * CAUSE_SUBGROUP_GAP;

      // Position each subgroup using dynamic node widths
      let currentX = globalCenterX - totalWidth / 2;
      for (const sg of activeCauseSubgroups) {
        const nodes = causesBySubgroup[sg] || [];
        if (nodes.length === 0) continue;

        const subgroupStartX = currentX;
        for (const node of nodes) {
          node.position.x = currentX;
          node.position.y = causeRowY;
          currentX += estimateNodeWidth(node) + layout.causeSpacing;
        }
        const subgroupEndX = currentX - layout.causeSpacing;

        causeSubgroupPositions[sg] = {
          startX: subgroupStartX,
          endX: subgroupEndX,
          nodes,
        };

        currentX += CAUSE_SUBGROUP_GAP - layout.causeSpacing; // Add extra gap between subgroups
      }
    } else {
      // Original single-row layout
      if (hasManualOrder(nodesByType['cause'])) {
        sortByOrder(nodesByType['cause']);
      } else {
        nodesByType['cause'].sort((a, b) => a.position.x - b.position.x);
      }
      positionRow(nodesByType['cause'], globalCenterX, layout.causeSpacing);
    }
  }

  // Position intermediate nodes
  if (!hasSubgroups && allIntermediates.length > 0) {
    if (hasManualOrder(allIntermediates)) {
      sortByOrder(allIntermediates);
    } else if (nodesByType['cause']) {
      sortByBarycenter(allIntermediates, nodesByType['cause'], edges);
    }
    positionRow(allIntermediates, globalCenterX, layout.intermediateSpacing);
  }

  // Position effect nodes
  if (nodesByType['effect']) {
    if (hasManualOrder(nodesByType['effect'])) {
      sortByOrder(nodesByType['effect']);
    } else {
      sortByBarycenter(nodesByType['effect'], allIntermediates, edges);
    }
    positionRow(nodesByType['effect'], globalCenterX, layout.effectSpacing);
  }

  // Position leaf nodes (if any)
  if (nodesByType['leaf']) {
    if (hasManualOrder(nodesByType['leaf'])) {
      sortByOrder(nodesByType['leaf']);
    } else if (nodesByType['cause']) {
      sortByBarycenter(nodesByType['leaf'], nodesByType['cause'], edges);
    }
    positionRow(nodesByType['leaf'], globalCenterX, 0);
  }

  // Create group containers with fixed width (unless hideGroupBackgrounds is set)
  const groupNodes: Node<CauseEffectNodeData>[] = [];
  const hideGroups = graphConfig?.hideGroupBackgrounds === true;

  // Create leaf container
  if (nodesByType['leaf'] && !hideGroups) {
    const container = createGroupContainer('leaf', nodesByType['leaf'], globalCenterX, layout.containerWidth, config.typeLabels);
    if (container) groupNodes.push(container);
  }

  // Create cause container only if no cause subgroups (to avoid overlapping boxes)
  if (nodesByType['cause'] && !hasCauseSubgroups && !hideGroups) {
    const container = createGroupContainer('cause', nodesByType['cause'], globalCenterX, layout.containerWidth, config.typeLabels);
    if (container) groupNodes.push(container);
  } else if (nodesByType['cause'] && hasCauseSubgroups && !hideGroups) {
    // Create a label-only container (no border) when subgroups handle the visual grouping
    const causeLabel = config.typeLabels?.cause || 'Root Factors';
    const minY = Math.min(...nodesByType['cause'].map(n => n.position.y)) - GROUP_PADDING - GROUP_HEADER_HEIGHT - SUBGROUP_HEADER_HEIGHT - SUBGROUP_PADDING;
    const maxY = Math.max(...nodesByType['cause'].map(n => n.position.y + LAYOUT_NODE_HEIGHT)) + GROUP_PADDING;
    groupNodes.push({
      id: 'group-cause',
      type: 'group',
      position: { x: globalCenterX - layout.containerWidth / 2, y: minY },
      data: { label: causeLabel, type: 'cause' },
      style: {
        width: layout.containerWidth,
        height: maxY - minY,
        backgroundColor: 'transparent',
        border: 'none',
        zIndex: -1,
      },
      selectable: false,
      draggable: false,
    });
  }

  if (allIntermediates.length > 0 && !hideGroups) {
    const container = createGroupContainer('intermediate', allIntermediates, globalCenterX, layout.containerWidth, config.typeLabels);
    if (container) groupNodes.push(container);
  }

  // Create subgroup containers for intermediate nodes
  if (hasSubgroups && !hideGroups) {
    for (const [subgroupKey, pos] of Object.entries(subgroupPositions)) {
      const subConfig = config.subgroups[subgroupKey];
      if (!subConfig || pos.nodes.length === 0) continue;

      groupNodes.push({
        id: `subgroup-${subgroupKey}`,
        type: 'subgroup',
        position: { x: pos.startX, y: pos.minY },
        data: { label: subConfig.label, type: 'intermediate' },
        style: {
          width: NODE_WIDTH + SUBGROUP_PADDING * 2,
          height: pos.maxY - pos.minY + SUBGROUP_PADDING,
          backgroundColor: subConfig.bgColor,
          border: `1.5px solid ${subConfig.borderColor}`,
          borderRadius: '8px',
          zIndex: -1,
          pointerEvents: 'none' as const,
        },
        selectable: false,
        draggable: false,
      });
    }
  }

  // Create subgroup containers for cause nodes (horizontal layout)
  if (hasCauseSubgroups && !hideGroups) {
    for (const [subgroupKey, pos] of Object.entries(causeSubgroupPositions)) {
      const subConfig = config.subgroups[subgroupKey];
      if (!subConfig || pos.nodes.length === 0) continue;

      const width = pos.endX - pos.startX + SUBGROUP_PADDING * 2;
      groupNodes.push({
        id: `cause-subgroup-${subgroupKey}`,
        type: 'subgroup',
        position: { x: pos.startX - SUBGROUP_PADDING, y: causeRowY - SUBGROUP_HEADER_HEIGHT - SUBGROUP_PADDING },
        data: { label: subConfig.label, type: 'cause' },
        style: {
          width,
          height: LAYOUT_NODE_HEIGHT + SUBGROUP_HEADER_HEIGHT + SUBGROUP_PADDING * 2,
          backgroundColor: subConfig.bgColor,
          border: `1.5px solid ${subConfig.borderColor}`,
          borderRadius: '8px',
          zIndex: -1,
          pointerEvents: 'none' as const,
        },
        selectable: false,
        draggable: false,
      });
    }
  }

  if (nodesByType['effect'] && !hideGroups) {
    const container = createGroupContainer('effect', nodesByType['effect'], globalCenterX, layout.containerWidth, config.typeLabels);
    if (container) groupNodes.push(container);
  }

  return { nodes: [...groupNodes, ...layoutedNodes], edges: getStyledEdges(edges) };
}

// Convert graph data to YAML format
export function toYaml(nodes: Node<CauseEffectNodeData>[], edges: Edge<CauseEffectEdgeData>[]): string {
  const lines: string[] = ['nodes:'];

  for (const node of nodes) {
    lines.push(`  - id: ${node.id}`);
    lines.push(`    label: "${node.data.label}"`);
    if (node.data.type) lines.push(`    type: ${node.data.type}`);
    if (node.data.confidence !== undefined) lines.push(`    confidence: ${node.data.confidence}`);
    if (node.data.confidenceLabel) lines.push(`    confidenceLabel: "${node.data.confidenceLabel}"`);
    if (node.data.description) lines.push(`    description: "${node.data.description.replace(/"/g, '\\"')}"`);
    if (node.data.details) lines.push(`    details: "${node.data.details.replace(/"/g, '\\"')}"`);
    if (node.data.relatedConcepts?.length) {
      lines.push(`    relatedConcepts:`);
      for (const concept of node.data.relatedConcepts) lines.push(`      - "${concept}"`);
    }
    if (node.data.sources?.length) {
      lines.push(`    sources:`);
      for (const source of node.data.sources) lines.push(`      - "${source}"`);
    }
    lines.push('');
  }

  lines.push('edges:');
  for (const edge of edges) {
    lines.push(`  - source: ${edge.source}`);
    lines.push(`    target: ${edge.target}`);
    if (edge.data?.strength) lines.push(`    strength: ${edge.data.strength}`);
    if (edge.data?.confidence) lines.push(`    confidence: ${edge.data.confidence}`);
    if (edge.data?.effect) lines.push(`    effect: ${edge.data.effect}`);
    if (edge.data?.label) lines.push(`    label: "${edge.data.label}"`);
    lines.push('');
  }

  return lines.join('\n');
}
