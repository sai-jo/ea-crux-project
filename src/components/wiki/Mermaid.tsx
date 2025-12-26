import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

// Initialize mermaid with settings optimized for readability
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  themeVariables: {
    // Primary colors - good contrast
    primaryColor: '#e8f4fc',
    primaryTextColor: '#1a1a2e',
    primaryBorderColor: '#4a90d9',

    // Secondary colors
    secondaryColor: '#f0f7e6',
    secondaryTextColor: '#1a1a2e',
    secondaryBorderColor: '#6b8e23',

    // Tertiary colors
    tertiaryColor: '#fff3e0',
    tertiaryTextColor: '#1a1a2e',
    tertiaryBorderColor: '#e67e22',

    // Line and text colors
    lineColor: '#5c6370',
    textColor: '#1a1a2e',

    // Node defaults
    nodeBorder: '#4a90d9',
    nodeTextColor: '#1a1a2e',

    // Background
    mainBkg: '#f8f9fa',

    // Subgraph styling
    clusterBkg: '#f0f4f8',
    clusterBorder: '#8b9dc3',

    // State diagram colors
    labelColor: '#1a1a2e',

    // Flowchart specific
    edgeLabelBackground: '#ffffff',
  },
});

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="mermaid-error" style={{
        padding: '1rem',
        background: '#fee',
        borderRadius: '4px',
        color: '#c00'
      }}>
        <strong>Diagram Error:</strong> {error}
        <pre style={{ fontSize: '0.75rem', marginTop: '0.5rem', overflow: 'auto' }}>
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram"
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '1.5rem 0',
        padding: '1rem',
        background: 'var(--sl-color-bg-nav)',
        borderRadius: '8px',
        overflow: 'auto',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default Mermaid;
