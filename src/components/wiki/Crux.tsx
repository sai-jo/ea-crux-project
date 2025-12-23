import React from 'react';
import './wiki.css';

interface Position {
  view: string;
  holders?: string[];
  probability?: string;
  implications: string;
}

interface CruxProps {
  id: string;
  question: string;
  domain: string;
  description?: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  resolvability: 'soon' | 'years' | 'decades' | 'unclear';
  currentState?: string;
  positions: Position[];
  relatedCruxes?: string[];
  wouldUpdateOn?: string[];
  relevantResearch?: { title: string; url?: string }[];
}

const importanceColors = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#65a30d',
};

const importanceLabels = {
  critical: '★★★',
  high: '★★☆',
  medium: '★☆☆',
  low: '☆☆☆',
};

const resolvabilityLabels = {
  soon: '< 2 years',
  years: '2-10 years',
  decades: '10+ years',
  unclear: 'Unclear',
};

export function Crux({
  id,
  question,
  domain,
  description,
  importance,
  resolvability,
  currentState,
  positions,
  relatedCruxes,
  wouldUpdateOn,
  relevantResearch,
}: CruxProps) {
  return (
    <div className="crux-card" id={id}>
      <div className="crux-header">
        <div className="crux-meta">
          <span className="crux-domain">{domain}</span>
          <span
            className="crux-importance"
            style={{ color: importanceColors[importance] }}
            title={`Importance: ${importance}`}
          >
            {importanceLabels[importance]}
          </span>
        </div>
        <h3 className="crux-question">{question}</h3>
      </div>

      {description && (
        <p className="crux-description">{description}</p>
      )}

      <div className="crux-info-row">
        <div className="crux-info-item">
          <span className="info-label">Resolvability:</span>
          <span className="info-value">{resolvabilityLabels[resolvability]}</span>
        </div>
        {currentState && (
          <div className="crux-info-item">
            <span className="info-label">Current state:</span>
            <span className="info-value">{currentState}</span>
          </div>
        )}
      </div>

      <div className="crux-positions">
        <h4 className="positions-header">Key Positions</h4>
        {positions.map((pos, i) => (
          <div key={i} className="crux-position">
            <div className="position-view">
              <strong>{pos.view}</strong>
              {pos.probability && (
                <span className="position-prob">({pos.probability})</span>
              )}
            </div>
            {pos.holders && pos.holders.length > 0 && (
              <div className="position-holders">
                Held by: {pos.holders.join(', ')}
              </div>
            )}
            <div className="position-implications">
              → {pos.implications}
            </div>
          </div>
        ))}
      </div>

      {wouldUpdateOn && wouldUpdateOn.length > 0 && (
        <div className="crux-updates">
          <h4 className="updates-header">Would Update On</h4>
          <ul className="updates-list">
            {wouldUpdateOn.map((update, i) => (
              <li key={i}>{update}</li>
            ))}
          </ul>
        </div>
      )}

      {relatedCruxes && relatedCruxes.length > 0 && (
        <div className="crux-related">
          <span className="related-label">Related cruxes:</span>
          {relatedCruxes.map((crux, i) => (
            <a key={i} href={`#${crux}`} className="related-crux-link">
              {crux}
            </a>
          ))}
        </div>
      )}

      {relevantResearch && relevantResearch.length > 0 && (
        <div className="crux-research">
          <span className="research-label">Research:</span>
          {relevantResearch.map((r, i) => (
            <span key={i}>
              {r.url ? (
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>
              ) : (
                r.title
              )}
              {i < relevantResearch.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Component for listing multiple cruxes in a domain
interface CruxListProps {
  domain: string;
  cruxes: Array<{
    id: string;
    question: string;
    importance: 'critical' | 'high' | 'medium' | 'low';
    summary: string;
    link?: string;
  }>;
}

export function CruxList({ domain, cruxes }: CruxListProps) {
  const sortedCruxes = [...cruxes].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.importance] - order[b.importance];
  });

  return (
    <div className="crux-list">
      <div className="crux-list-header">
        <span className="crux-list-icon">🔑</span>
        <span className="crux-list-title">Key Cruxes: {domain}</span>
      </div>

      <div className="crux-list-items">
        {sortedCruxes.map((crux) => (
          <div key={crux.id} className="crux-list-item">
            <div className="crux-list-row">
              <span
                className="crux-importance-badge"
                style={{ backgroundColor: importanceColors[crux.importance] }}
              >
                {crux.importance}
              </span>
              {crux.link ? (
                <a href={crux.link} className="crux-question-link">
                  {crux.question}
                </a>
              ) : (
                <span className="crux-question-text">{crux.question}</span>
              )}
            </div>
            <p className="crux-summary">{crux.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Crux;
