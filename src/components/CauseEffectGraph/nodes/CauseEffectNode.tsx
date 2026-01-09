import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { CauseEffectNodeData } from '../types';
import { NODE_TYPE_CONFIG, OUTCOME_COLORS, NODE_BORDER_RADIUS } from '../config';

// Truncate description to reasonable length
function truncateDescription(text: string | undefined, maxLength: number = 350): string {
  if (!text) return '';
  // Strip markdown links and formatting
  const cleaned = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '');
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).trim() + '...';
}

// Get a very brief snippet for inline display (one sentence)
function getBriefDescription(text: string | undefined): string {
  if (!text) return '';
  const cleaned = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '');
  // Take first sentence or first 60 chars
  const firstSentence = cleaned.split(/[.!?]/)[0];
  if (firstSentence.length <= 60) return firstSentence + (cleaned.length > firstSentence.length ? '.' : '');
  return firstSentence.slice(0, 60).trim() + '...';
}

export function CauseEffectNode({ data, selected, id }: NodeProps<Node<CauseEffectNodeData>>) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const [hoveredSubItemIndex, setHoveredSubItemIndex] = useState<number | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const nodeType = data.type || 'intermediate';

  const config = NODE_TYPE_CONFIG[nodeType] || NODE_TYPE_CONFIG.intermediate;

  // Get base colors from config, then override for specific outcome nodes
  let colors = {
    bg: config.nodeBg,
    border: config.nodeBorder,
    text: config.nodeText,
    accent: config.nodeAccent,
  };

  // Apply special colors for individual outcome nodes (tier-based valence encoding)
  if (nodeType === 'effect' && id && OUTCOME_COLORS[id]) {
    const outcomeOverride = OUTCOME_COLORS[id];
    colors = {
      bg: outcomeOverride.nodeBg || colors.bg,
      border: outcomeOverride.nodeBorder || colors.border,
      text: outcomeOverride.nodeText || colors.text,
      accent: outcomeOverride.nodeAccent || colors.accent,
    };
  }

  // Apply explicit nodeColors override if provided (highest priority)
  if (data.nodeColors) {
    colors = {
      bg: data.nodeColors.bg || colors.bg,
      border: data.nodeColors.border || colors.border,
      text: data.nodeColors.text || colors.text,
      accent: data.nodeColors.accent || colors.accent,
    };
  }

  // Get border radius based on node type (shapes encode function)
  const borderRadius = NODE_BORDER_RADIUS[nodeType] || '12px';

  const hasSubItems = data.subItems && data.subItems.length > 0;
  const isClickable = !!data.href;

  const handleClick = () => {
    if (data.href) {
      window.location.href = data.href;
    }
  };

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true);
    if (nodeRef.current && data.description) {
      const rect = nodeRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.bottom + 12, // 12px gap below node
        left: rect.left + rect.width / 2, // centered
      });
    }
  }, [data.description]);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
    setTooltipPos(null);
  }, []);

  return (
    <div
      ref={nodeRef}
      className={`ceg-node ${hasSubItems ? 'ceg-node--with-subitems' : ''} ${selected ? 'ceg-node--selected' : ''} ${isClickable ? 'ceg-node--clickable' : ''} ${showTooltip ? 'ceg-node--tooltip-visible' : ''}`}
      style={{
        backgroundColor: colors.bg,
        borderColor: selected ? colors.text : colors.border,
        borderRadius: borderRadius,
        boxShadow: selected ? `0 8px 24px rgba(0,0,0,0.15), 0 0 0 2px ${colors.accent}` : undefined,
        cursor: isClickable ? 'pointer' : undefined,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={isClickable ? handleClick : undefined}
    >
      <Handle type="target" position={Position.Top} className="ceg-node__handle" />

      <div className="ceg-node__label" style={{ color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <span>{data.label}</span>
        {isClickable && (
          <svg
            className="ceg-node__link-icon"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.5, flexShrink: 0 }}
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        )}
      </div>

      {/* Brief description snippet - always visible if description exists */}
      {data.description && !hasSubItems && (
        <div className="ceg-node__snippet" style={{ color: `${colors.text}99` }}>
          {getBriefDescription(data.description)}
        </div>
      )}

      {hasSubItems && (
        <div className="ceg-node__subitems" style={{ borderTopColor: `${colors.border}40` }}>
          {data.subItems!.map((item, i) => {
            const isHovered = hoveredSubItemIndex === i;
            return (
            <div
              key={i}
              className={`ceg-node__subitem ${item.href ? 'ceg-node__subitem--clickable' : ''}`}
              style={{
                backgroundColor: isHovered ? `${colors.border}30` : colors.bg,
                borderColor: `${colors.border}60`,
                color: colors.text,
                cursor: item.href ? 'pointer' : (item.description ? 'help' : 'pointer'),
                position: 'relative',
                transition: 'background-color 0.15s ease',
              }}
              onClick={item.href ? (e) => { e.stopPropagation(); window.location.href = item.href!; } : undefined}
              onMouseEnter={() => setHoveredSubItemIndex(i)}
              onMouseLeave={() => setHoveredSubItemIndex(null)}
            >
              <span className="ceg-node__subitem-label">{item.label}</span>
              {item.probability && (
                <span className="ceg-node__subitem-prob">{item.probability}</span>
              )}
              {isHovered && item.description && (
                <div className="ceg-node__tooltip ceg-node__tooltip--subitem">
                  {truncateDescription(item.description)}
                  <div className="ceg-node__tooltip-arrow" />
                </div>
              )}
            </div>
          );
          })}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="ceg-node__handle" />

      {/* Portal tooltip - renders outside ReactFlow's stacking context */}
      {showTooltip && hoveredSubItemIndex === null && tooltipPos && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="ceg-node__tooltip ceg-node__tooltip--fixed ceg-node__tooltip--rich"
            style={{
              position: 'fixed',
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: 'translateX(-50%)',
              zIndex: 99999,
            }}
          >
            {/* Description */}
            {data.description && (
              <div className="ceg-tooltip__description">
                {truncateDescription(data.description, 280)}
              </div>
            )}

            {/* Metadata row */}
            {(data.confidence !== undefined || data.type || data.subgroup) && (
              <div className="ceg-tooltip__meta">
                {data.type && (
                  <span className="ceg-tooltip__tag ceg-tooltip__tag--type">
                    {data.type}
                  </span>
                )}
                {data.subgroup && (
                  <span className="ceg-tooltip__tag ceg-tooltip__tag--subgroup">
                    {data.subgroup.replace(/-/g, ' ')}
                  </span>
                )}
                {data.confidence !== undefined && (
                  <span className="ceg-tooltip__tag ceg-tooltip__tag--confidence">
                    {Math.round(data.confidence * 100)}% confidence
                  </span>
                )}
              </div>
            )}

            {/* Related concepts */}
            {data.relatedConcepts && data.relatedConcepts.length > 0 && (
              <div className="ceg-tooltip__related">
                <span className="ceg-tooltip__related-label">Related:</span>
                {data.relatedConcepts.slice(0, 3).join(', ')}
                {data.relatedConcepts.length > 3 && ` +${data.relatedConcepts.length - 3} more`}
              </div>
            )}

            {/* View details link hint */}
            {data.href && (
              <div className="ceg-tooltip__action">
                Click to view details →
              </div>
            )}

            {/* No description fallback */}
            {!data.description && !data.confidence && !data.relatedConcepts?.length && (
              <div className="ceg-tooltip__empty">
                {data.href ? 'Click to view details' : 'No additional information'}
              </div>
            )}

            <div className="ceg-node__tooltip-arrow" />
          </div>,
          document.body
        )
      }
    </div>
  );
}
