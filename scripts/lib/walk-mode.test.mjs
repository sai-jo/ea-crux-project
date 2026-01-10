#!/usr/bin/env node
/**
 * Unit Tests for Walk Mode Logic
 *
 * Tests the core algorithms used in CauseEffectGraph walk mode:
 * - computeNeighborhood: BFS to find N-hop neighbors
 * - Node filtering logic
 * - Position centering logic
 *
 * Run: node scripts/lib/walk-mode.test.mjs
 */

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`✗ ${name}`);
    console.log(`  ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertSetEquals(actual, expected, message) {
  const actualArr = [...actual].sort();
  const expectedArr = [...expected].sort();
  if (actualArr.length !== expectedArr.length || !actualArr.every((v, i) => v === expectedArr[i])) {
    throw new Error(message || `Expected [${expectedArr}], got [${actualArr}]`);
  }
}

// =============================================================================
// computeNeighborhood - Core BFS Algorithm
// =============================================================================

/**
 * Compute N-hop neighborhood around a center node (BFS both directions)
 * This is the same algorithm used in CauseEffectGraph/index.tsx
 */
function computeNeighborhood(centerNodeId, edges, depth) {
  const nodeIds = new Set([centerNodeId]);
  const edgeIds = new Set();

  // Build bidirectional adjacency map
  const neighbors = new Map();

  for (const edge of edges) {
    // Forward direction: source -> target
    if (!neighbors.has(edge.source)) neighbors.set(edge.source, []);
    neighbors.get(edge.source).push({ nodeId: edge.target, edgeId: edge.id });

    // Reverse direction: target -> source
    if (!neighbors.has(edge.target)) neighbors.set(edge.target, []);
    neighbors.get(edge.target).push({ nodeId: edge.source, edgeId: edge.id });
  }

  // BFS from center
  let frontier = new Set([centerNodeId]);
  for (let d = 0; d < depth && frontier.size > 0; d++) {
    const nextFrontier = new Set();
    for (const nodeId of frontier) {
      for (const { nodeId: nextId, edgeId } of neighbors.get(nodeId) || []) {
        edgeIds.add(edgeId);
        if (!nodeIds.has(nextId)) {
          nodeIds.add(nextId);
          nextFrontier.add(nextId);
        }
      }
    }
    frontier = nextFrontier;
  }

  return { nodeIds, edgeIds };
}

/**
 * Filter nodes for walk mode (exclude group/container nodes)
 */
function filterWalkNodes(nodes, neighborhoodNodeIds) {
  return nodes.filter((node) => {
    if (node.type === 'group' || node.type === 'subgroup' || node.type === 'clusterContainer') {
      return false;
    }
    return neighborhoodNodeIds.has(node.id);
  });
}

/**
 * Center nodes around a specific node
 */
function centerNodesAround(nodes, centerNodeId) {
  const centerNode = nodes.find((n) => n.id === centerNodeId);
  if (!centerNode) return nodes;

  const centerX = centerNode.position?.x || 0;
  const centerY = centerNode.position?.y || 0;

  return nodes.map((node) => ({
    ...node,
    position: {
      x: (node.position?.x || 0) - centerX,
      y: (node.position?.y || 0) - centerY,
    },
  }));
}

// =============================================================================
// Test Data
// =============================================================================

// Linear chain: A -> B -> C -> D -> E
const linearChainNodes = [
  { id: 'A', type: 'causeEffect', data: { label: 'Node A' }, position: { x: 0, y: 0 } },
  { id: 'B', type: 'causeEffect', data: { label: 'Node B' }, position: { x: 100, y: 0 } },
  { id: 'C', type: 'causeEffect', data: { label: 'Node C' }, position: { x: 200, y: 0 } },
  { id: 'D', type: 'causeEffect', data: { label: 'Node D' }, position: { x: 300, y: 0 } },
  { id: 'E', type: 'causeEffect', data: { label: 'Node E' }, position: { x: 400, y: 0 } },
];

const linearChainEdges = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'B-C', source: 'B', target: 'C' },
  { id: 'C-D', source: 'C', target: 'D' },
  { id: 'D-E', source: 'D', target: 'E' },
];

// Star topology: Center connected to A, B, C, D
const starNodes = [
  { id: 'center', type: 'causeEffect', data: { label: 'Center' }, position: { x: 200, y: 200 } },
  { id: 'A', type: 'causeEffect', data: { label: 'A' }, position: { x: 100, y: 100 } },
  { id: 'B', type: 'causeEffect', data: { label: 'B' }, position: { x: 300, y: 100 } },
  { id: 'C', type: 'causeEffect', data: { label: 'C' }, position: { x: 100, y: 300 } },
  { id: 'D', type: 'causeEffect', data: { label: 'D' }, position: { x: 300, y: 300 } },
];

const starEdges = [
  { id: 'center-A', source: 'center', target: 'A' },
  { id: 'center-B', source: 'center', target: 'B' },
  { id: 'center-C', source: 'center', target: 'C' },
  { id: 'center-D', source: 'center', target: 'D' },
];

// Graph with group nodes (should be filtered)
const mixedTypeNodes = [
  { id: 'A', type: 'causeEffect', data: { label: 'A' }, position: { x: 0, y: 0 } },
  { id: 'B', type: 'causeEffect', data: { label: 'B' }, position: { x: 100, y: 0 } },
  { id: 'G1', type: 'group', data: { label: 'Group 1' }, position: { x: 0, y: 0 } },
  { id: 'C', type: 'causeEffect', data: { label: 'C' }, position: { x: 200, y: 0 } },
  { id: 'S1', type: 'subgroup', data: { label: 'Subgroup 1' }, position: { x: 0, y: 0 } },
  { id: 'D', type: 'causeEffect', data: { label: 'D' }, position: { x: 300, y: 0 } },
  { id: 'CC1', type: 'clusterContainer', data: { label: 'Container 1' }, position: { x: 0, y: 0 } },
];

const mixedTypeEdges = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'B-C', source: 'B', target: 'C' },
  { id: 'C-D', source: 'C', target: 'D' },
];

// Disconnected graph
const disconnectedNodes = [
  { id: 'A', type: 'causeEffect', data: { label: 'A' }, position: { x: 0, y: 0 } },
  { id: 'B', type: 'causeEffect', data: { label: 'B' }, position: { x: 100, y: 0 } },
  { id: 'X', type: 'causeEffect', data: { label: 'X' }, position: { x: 500, y: 0 } },
  { id: 'Y', type: 'causeEffect', data: { label: 'Y' }, position: { x: 600, y: 0 } },
];

const disconnectedEdges = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'X-Y', source: 'X', target: 'Y' },
];

// =============================================================================
// Tests: computeNeighborhood
// =============================================================================

console.log('\n🔍 computeNeighborhood - Linear Chain');

test('depth=1 from middle node C returns B, C, D', () => {
  const result = computeNeighborhood('C', linearChainEdges, 1);
  assertSetEquals(result.nodeIds, new Set(['B', 'C', 'D']));
  assertSetEquals(result.edgeIds, new Set(['B-C', 'C-D']));
});

test('depth=2 from middle node C returns A, B, C, D, E', () => {
  const result = computeNeighborhood('C', linearChainEdges, 2);
  assertSetEquals(result.nodeIds, new Set(['A', 'B', 'C', 'D', 'E']));
  assertSetEquals(result.edgeIds, new Set(['A-B', 'B-C', 'C-D', 'D-E']));
});

test('depth=1 from end node A returns A, B', () => {
  const result = computeNeighborhood('A', linearChainEdges, 1);
  assertSetEquals(result.nodeIds, new Set(['A', 'B']));
  assertSetEquals(result.edgeIds, new Set(['A-B']));
});

test('depth=0 returns only center node', () => {
  const result = computeNeighborhood('C', linearChainEdges, 0);
  assertSetEquals(result.nodeIds, new Set(['C']));
  assertEqual(result.edgeIds.size, 0);
});

console.log('\n🔍 computeNeighborhood - Star Topology');

test('depth=1 from center returns all nodes', () => {
  const result = computeNeighborhood('center', starEdges, 1);
  assertSetEquals(result.nodeIds, new Set(['center', 'A', 'B', 'C', 'D']));
  assertEqual(result.edgeIds.size, 4);
});

test('depth=1 from leaf A returns A and center only', () => {
  const result = computeNeighborhood('A', starEdges, 1);
  assertSetEquals(result.nodeIds, new Set(['A', 'center']));
  assertSetEquals(result.edgeIds, new Set(['center-A']));
});

test('depth=2 from leaf A returns all nodes (via center)', () => {
  const result = computeNeighborhood('A', starEdges, 2);
  assertSetEquals(result.nodeIds, new Set(['A', 'center', 'B', 'C', 'D']));
  assertEqual(result.edgeIds.size, 4);
});

console.log('\n🔍 computeNeighborhood - Edge Cases');

test('non-existent node returns only that node', () => {
  const result = computeNeighborhood('NONEXISTENT', linearChainEdges, 2);
  assertSetEquals(result.nodeIds, new Set(['NONEXISTENT']));
  assertEqual(result.edgeIds.size, 0);
});

test('empty edges returns only center node', () => {
  const result = computeNeighborhood('A', [], 2);
  assertSetEquals(result.nodeIds, new Set(['A']));
  assertEqual(result.edgeIds.size, 0);
});

test('disconnected graph - cannot reach other component', () => {
  const result = computeNeighborhood('A', disconnectedEdges, 10);
  assertSetEquals(result.nodeIds, new Set(['A', 'B']));
  assertSetEquals(result.edgeIds, new Set(['A-B']));
  // X and Y are not reachable
  assert(!result.nodeIds.has('X'));
  assert(!result.nodeIds.has('Y'));
});

// =============================================================================
// Tests: filterWalkNodes
// =============================================================================

console.log('\n🔍 filterWalkNodes');

test('filters out group nodes', () => {
  const neighborhood = computeNeighborhood('B', mixedTypeEdges, 2);
  const filtered = filterWalkNodes(mixedTypeNodes, neighborhood.nodeIds);

  // Should include A, B, C, D but not G1, S1, CC1
  const ids = new Set(filtered.map(n => n.id));
  assert(ids.has('A'), 'Should include A');
  assert(ids.has('B'), 'Should include B');
  assert(ids.has('C'), 'Should include C');
  assert(ids.has('D'), 'Should include D');
  assert(!ids.has('G1'), 'Should NOT include group node G1');
  assert(!ids.has('S1'), 'Should NOT include subgroup node S1');
  assert(!ids.has('CC1'), 'Should NOT include clusterContainer node CC1');
});

test('returns empty array when no nodes match', () => {
  const emptyNeighborhood = new Set(['NONEXISTENT']);
  const filtered = filterWalkNodes(mixedTypeNodes, emptyNeighborhood);
  assertEqual(filtered.length, 0);
});

test('preserves node properties', () => {
  const neighborhood = computeNeighborhood('A', linearChainEdges, 1);
  const filtered = filterWalkNodes(linearChainNodes, neighborhood.nodeIds);

  const nodeA = filtered.find(n => n.id === 'A');
  assert(nodeA, 'Should find node A');
  assertEqual(nodeA.type, 'causeEffect', 'Should preserve type');
  assertEqual(nodeA.data.label, 'Node A', 'Should preserve data');
  assertEqual(nodeA.position.x, 0, 'Should preserve position');
});

// =============================================================================
// Tests: centerNodesAround
// =============================================================================

console.log('\n🔍 centerNodesAround');

test('centers nodes around specified node', () => {
  const centered = centerNodesAround(linearChainNodes, 'C');

  const nodeC = centered.find(n => n.id === 'C');
  assertEqual(nodeC.position.x, 0, 'Center node should be at x=0');
  assertEqual(nodeC.position.y, 0, 'Center node should be at y=0');

  const nodeA = centered.find(n => n.id === 'A');
  assertEqual(nodeA.position.x, -200, 'Node A should be offset correctly');

  const nodeE = centered.find(n => n.id === 'E');
  assertEqual(nodeE.position.x, 200, 'Node E should be offset correctly');
});

test('handles non-existent center node gracefully', () => {
  const centered = centerNodesAround(linearChainNodes, 'NONEXISTENT');
  // Should return nodes unchanged
  assertEqual(centered.length, linearChainNodes.length);
  const nodeA = centered.find(n => n.id === 'A');
  assertEqual(nodeA.position.x, 0, 'Position should be unchanged');
});

test('preserves other node properties', () => {
  const centered = centerNodesAround(linearChainNodes, 'C');

  const nodeA = centered.find(n => n.id === 'A');
  assertEqual(nodeA.type, 'causeEffect', 'Should preserve type');
  assertEqual(nodeA.data.label, 'Node A', 'Should preserve data');
});

// =============================================================================
// Tests: Integration - Full Walk Mode Flow
// =============================================================================

console.log('\n🔍 Integration - Full Walk Mode Flow');

test('full flow: compute neighborhood, filter, center', () => {
  // 1. Compute neighborhood
  const neighborhood = computeNeighborhood('B', mixedTypeEdges, 1);

  // 2. Filter nodes
  const filtered = filterWalkNodes(mixedTypeNodes, neighborhood.nodeIds);

  // 3. Center around B
  const centered = centerNodesAround(filtered, 'B');

  // Verify results
  assertEqual(centered.length, 3, 'Should have 3 nodes (A, B, C)');

  const nodeB = centered.find(n => n.id === 'B');
  assertEqual(nodeB.position.x, 0, 'Center node B should be at origin');

  // No group/subgroup/container nodes
  assert(!centered.find(n => n.type === 'group'));
  assert(!centered.find(n => n.type === 'subgroup'));
  assert(!centered.find(n => n.type === 'clusterContainer'));
});

test('walk mode handles single isolated node', () => {
  const singleNode = [{ id: 'X', type: 'causeEffect', data: { label: 'X' }, position: { x: 50, y: 50 } }];

  const neighborhood = computeNeighborhood('X', [], 2);
  const filtered = filterWalkNodes(singleNode, neighborhood.nodeIds);
  const centered = centerNodesAround(filtered, 'X');

  assertEqual(centered.length, 1, 'Should have 1 node');
  assertEqual(centered[0].position.x, 0, 'Should be centered at origin');
  assertEqual(centered[0].position.y, 0, 'Should be centered at origin');
});

// =============================================================================
// Summary
// =============================================================================

console.log('\n' + '─'.repeat(50));
console.log(`\n✅ Passed: ${passed}`);
if (failed > 0) {
  console.log(`❌ Failed: ${failed}`);
  process.exit(1);
} else {
  console.log('\n🎉 All walk mode tests passed!');
}
