/**
 * DiagramViewer - Standalone viewer for causeEffectGraph diagrams
 *
 * Usage: /diagrams?entity=tmc-compute
 */

import React, { useState, useEffect } from 'react';
import { getEntityById, entities } from '../data';
import CauseEffectGraph from './CauseEffectGraph';

// Get all entities that have causeEffectGraph diagrams
function getEntitiesWithDiagrams(): Array<{ id: string; title: string; graphTitle?: string; nodeCount: number }> {
  return entities
    .filter((e: any) => e.causeEffectGraph?.nodes?.length > 0)
    .map((e: any) => ({
      id: e.id,
      title: e.title,
      graphTitle: e.causeEffectGraph?.title,
      nodeCount: e.causeEffectGraph?.nodes?.length || 0,
    }));
}

interface DiagramViewerProps {
  entityId?: string;
}

// Entity type with causeEffectGraph
interface EntityWithGraph {
  id: string;
  title: string;
  causeEffectGraph?: {
    title?: string;
    description?: string;
    primaryNodeId?: string;
    nodes: Array<{
      id: string;
      label: string;
      description?: string;
      type: 'leaf' | 'cause' | 'intermediate' | 'effect';
      confidence?: number;
      details?: string;
      sources?: string[];
      relatedConcepts?: string[];
    }>;
    edges: Array<{
      id?: string;
      source: string;
      target: string;
      strength?: 'weak' | 'medium' | 'strong';
      confidence?: 'low' | 'medium' | 'high';
      effect?: 'increases' | 'decreases' | 'mixed';
      label?: string;
    }>;
  };
}

export default function DiagramViewer({ entityId: propEntityId }: DiagramViewerProps) {
  // Read entity ID from URL client-side (Astro props may not have query params in dev)
  const [entityId, setEntityId] = useState(propEntityId || '');

  useEffect(() => {
    // If no entity ID from props, read from URL
    if (!propEntityId) {
      const params = new URLSearchParams(window.location.search);
      const urlEntityId = params.get('entity') || '';
      setEntityId(urlEntityId);
    }
  }, [propEntityId]);

  // No entity ID provided - show index of all diagrams
  if (!entityId) {
    const availableDiagrams = getEntitiesWithDiagrams();

    return (
      <div style={styles.container}>
        <div style={styles.indexCard}>
          <h1 style={styles.title}>Cause-Effect Diagrams</h1>
          <p style={styles.text}>
            Interactive diagrams showing causal relationships in the AI Transition Model.
          </p>

          {availableDiagrams.length === 0 ? (
            <p style={styles.text}>No diagrams available yet.</p>
          ) : (
            <div style={styles.diagramList}>
              {availableDiagrams.map((diagram) => (
                <a
                  key={diagram.id}
                  href={`/diagrams?entity=${diagram.id}`}
                  style={styles.diagramCard}
                >
                  <div style={styles.diagramTitle}>
                    {diagram.graphTitle || diagram.title}
                  </div>
                  <div style={styles.diagramMeta}>
                    <span style={styles.entityId}>{diagram.id}</span>
                    <span style={styles.nodeCount}>{diagram.nodeCount} nodes</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Load entity
  const rawEntity = getEntityById(entityId);

  if (!rawEntity) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h1 style={styles.title}>Entity Not Found</h1>
          <p style={styles.text}>
            No entity found with ID: <code style={styles.code}>{entityId}</code>
          </p>
          <a href="/diagrams" style={styles.link}>Back to Diagram Viewer</a>
        </div>
      </div>
    );
  }

  const entity = rawEntity as unknown as EntityWithGraph;

  if (!entity.causeEffectGraph || !entity.causeEffectGraph.nodes.length) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h1 style={styles.title}>No Diagram Available</h1>
          <p style={styles.text}>
            Entity <code style={styles.code}>{entityId}</code> ({entity.title}) does not have a cause-effect diagram.
          </p>
          <a href="/diagrams" style={styles.link}>Back to Diagram Viewer</a>
        </div>
      </div>
    );
  }

  const graph = entity.causeEffectGraph;

  return (
    <div style={styles.fullscreen}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.graphTitle}>{graph.title || entity.title}</h1>
          {graph.description && (
            <p style={styles.graphDescription}>{graph.description}</p>
          )}
        </div>
        <a href={`/ai-transition-model/factors/ai-capabilities/compute/`} style={styles.backLink}>
          Back to Page
        </a>
      </div>

      {/* Graph */}
      <div style={styles.graphContainer}>
        <CauseEffectGraph
          height="100%"
          hideListView={true}
          selectedNodeId={graph.primaryNodeId}
          graphConfig={{
            hideGroupBackgrounds: true,
            useDagre: true,
            typeLabels: {
              leaf: 'Root Causes',
              cause: 'Derived',
              intermediate: 'Direct Factors',
              effect: 'Target',
            },
          }}
          initialNodes={graph.nodes.map((node) => ({
            id: node.id,
            type: 'causeEffect' as const,
            position: { x: 0, y: 0 },
            data: {
              label: node.label,
              description: node.description || '',
              type: node.type,
              ...(node.confidence !== undefined && { confidence: node.confidence }),
              details: node.details || '',
              sources: node.sources || [],
              relatedConcepts: node.relatedConcepts || [],
            },
          }))}
          initialEdges={graph.edges.map((edge) => ({
            id: edge.id || `e-${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            data: {
              strength: edge.strength || 'medium',
              confidence: edge.confidence || 'medium',
              effect: edge.effect || 'increases',
            },
            label: edge.label,
          }))}
        />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  indexCard: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
  },
  diagramList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  diagramCard: {
    display: 'block',
    background: '#334155',
    borderRadius: '8px',
    padding: '1rem 1.25rem',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'background 0.15s, transform 0.15s',
    border: '1px solid transparent',
  },
  diagramTitle: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#f1f5f9',
    marginBottom: '0.5rem',
  },
  diagramMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
  },
  entityId: {
    color: '#60a5fa',
    fontFamily: 'monospace',
  },
  nodeCount: {
    color: '#94a3b8',
  },
  errorCard: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    borderLeft: '4px solid #ef4444',
  },
  title: {
    margin: '0 0 1rem 0',
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  text: {
    margin: '0 0 1rem 0',
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  usage: {
    marginBottom: '1rem',
  },
  examples: {
    marginTop: '1.5rem',
  },
  list: {
    margin: '0.5rem 0 0 1.5rem',
    padding: 0,
  },
  code: {
    background: '#334155',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontFamily: 'monospace',
  },
  link: {
    color: '#60a5fa',
    textDecoration: 'none',
  },
  fullscreen: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #334155',
    background: '#1e293b',
  },
  graphTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  graphDescription: {
    margin: '0.5rem 0 0 0',
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
  backLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: '0.9rem',
    padding: '0.5rem 1rem',
    background: '#334155',
    borderRadius: '6px',
  },
  graphContainer: {
    flex: 1,
    minHeight: 0,
  },
};
