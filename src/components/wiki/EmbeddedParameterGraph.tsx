// Embeddable version of the Parameter Graph that uses the canonical YAML data
// This is the single source of truth - all parameter graph visualizations should use this component
// Data is loaded from src/data/parameter-graph.yaml via parameter-graph-data.ts

import CauseEffectGraph, { type GraphConfig } from '../CauseEffectGraph';
import { parameterNodes, parameterEdges } from '../../data/parameter-graph-data';

// Default configuration matching the full-page version
const defaultConfig: GraphConfig = {
  layout: {
    containerWidth: 1200,
    centerX: 600,
    layerGap: 60,
    causeSpacing: 40,
    intermediateSpacing: 200,
    effectSpacing: 400,
  },
  typeLabels: {
    cause: 'Root Factors',
    intermediate: 'Ultimate Scenarios',
    effect: 'Ultimate Outcomes',
  },
  subgroups: {
    // Root Factor clusters - subtle tints to distinguish AI vs Societal within blue tier
    'ai': { label: 'AI System Factors', bgColor: 'rgba(219, 234, 254, 0.2)', borderColor: 'transparent' },
    'society': { label: 'Societal Factors', bgColor: 'rgba(209, 250, 229, 0.2)', borderColor: 'transparent' },
  },
};

interface EmbeddedParameterGraphProps {
  height?: string | number;
  config?: Partial<GraphConfig>;
}

/**
 * Embeddable parameter graph that uses the canonical data from parameter-graph.yaml
 *
 * Usage in MDX:
 * ```mdx
 * import { EmbeddedParameterGraph } from '../../../../components/wiki';
 *
 * <EmbeddedParameterGraph client:load height={500} />
 * ```
 *
 * For the full-page version, link to /parameter-graph/
 */
export function EmbeddedParameterGraph({
  height = 500,
  config,
}: EmbeddedParameterGraphProps) {
  const mergedConfig = config ? { ...defaultConfig, ...config } : defaultConfig;

  return (
    <CauseEffectGraph
      initialNodes={parameterNodes}
      initialEdges={parameterEdges}
      height={height}
      graphConfig={mergedConfig}
    />
  );
}

// Also export the raw data for components that need direct access
export { parameterNodes, parameterEdges } from '../../data/parameter-graph-data';
