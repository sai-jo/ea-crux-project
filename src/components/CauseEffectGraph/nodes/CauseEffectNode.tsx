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
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Apply score-based highlighting (green intensity) when scoreIntensity is set
  // scoreIntensity: 0-1 = valid score intensity, -1 = no score for this dimension
  const hasScoreHighlight = data.scoreIntensity !== undefined;
  let scoreOpacity = 1;
  if (hasScoreHighlight) {
    if (data.scoreIntensity === -1) {
      // No score - extremely faded
      colors = {
        bg: 'rgba(30, 41, 59, 0.3)',
        border: 'rgba(51, 65, 85, 0.3)',
        text: 'rgba(100, 116, 139, 0.4)',
        accent: 'rgba(71, 85, 105, 0.3)',
      };
      scoreOpacity = 0.25;
    } else {
      const intensity = data.scoreIntensity;
      // Use a curve to make low scores much more faded
      // intensity^2 makes 0.5 -> 0.25, so mid-range is still fairly faded
      const adjustedIntensity = Math.pow(intensity, 1.5);

      // Low scores: very faded gray with low opacity
      // High scores: vibrant green with full opacity
      if (intensity < 0.45) {
        // Scores 1-4: Very faded, nearly invisible
        const fade = intensity / 0.45; // 0 to 1 within this range
        scoreOpacity = 0.25 + fade * 0.35; // 0.25 to 0.6 opacity
        colors = {
          bg: `rgba(30, 41, 59, ${0.4 + fade * 0.3})`,
          border: `rgba(71, 85, 105, ${0.4 + fade * 0.3})`,
          text: `rgba(148, 163, 184, ${0.5 + fade * 0.3})`,
          accent: `rgba(71, 85, 105, ${0.4 + fade * 0.3})`,
        };
      } else {
        // Scores 5-10: Transition to green
        const greenIntensity = (intensity - 0.45) / 0.55; // 0 to 1 for scores 5-10
        scoreOpacity = 0.6 + greenIntensity * 0.4; // 0.6 to 1.0 opacity

        // Interpolate from muted to vibrant green
        const r = Math.round(35 - greenIntensity * 15); // 35 -> 20
        const g = Math.round(55 + greenIntensity * 145); // 55 -> 200
        const b = Math.round(65 - greenIntensity * 5); // 65 -> 60
        const borderR = Math.round(55 - greenIntensity * 33); // 55 -> 22
        const borderG = Math.round(75 + greenIntensity * 90); // 75 -> 165
        const borderB = Math.round(85 - greenIntensity * 11); // 85 -> 74

        colors = {
          bg: `rgb(${r}, ${g}, ${b})`,
          border: `rgb(${borderR}, ${borderG}, ${borderB})`,
          text: greenIntensity > 0.5 ? '#f0fdf4' : '#e2e8f0',
          accent: `rgb(${borderR}, ${borderG}, ${borderB})`,
        };
      }
    }
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
    // Cancel any pending hide
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
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
    // Delay hiding to allow mouse to move to tooltip
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
      setTooltipPos(null);
    }, 150);
  }, []);

  const handleTooltipMouseEnter = useCallback(() => {
    // Cancel hide when entering tooltip
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const handleTooltipMouseLeave = useCallback(() => {
    // Hide when leaving tooltip
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
        borderWidth: hasScoreHighlight ? '2.5px' : undefined,
        boxShadow: selected ? `0 8px 24px rgba(0,0,0,0.15), 0 0 0 2px ${colors.accent}` : undefined,
        cursor: isClickable ? 'pointer' : undefined,
        opacity: hasScoreHighlight ? scoreOpacity : undefined,
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
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            {/* Description */}
            {data.description && (
              <div className="ceg-tooltip__description">
                {truncateDescription(data.description, 280)}
              </div>
            )}

            {/* Scores - compact inline */}
            {data.scores && (Object.values(data.scores).some(v => v !== undefined)) && (
              <div className="ceg-tooltip__scores-compact">
                {data.scores.novelty !== undefined && (
                  <span className="ceg-tooltip__score-item" title="Novelty: How surprising to informed readers">
                    <span className="ceg-tooltip__score-dot" style={{ backgroundColor: '#8b5cf6' }} />
                    <span className="ceg-tooltip__score-num">{data.scores.novelty}</span>
                  </span>
                )}
                {data.scores.sensitivity !== undefined && (
                  <span className="ceg-tooltip__score-item" title="Sensitivity: Impact on downstream nodes">
                    <span className="ceg-tooltip__score-dot" style={{ backgroundColor: '#ef4444' }} />
                    <span className="ceg-tooltip__score-num">{data.scores.sensitivity}</span>
                  </span>
                )}
                {data.scores.changeability !== undefined && (
                  <span className="ceg-tooltip__score-item" title="Changeability: How tractable to influence">
                    <span className="ceg-tooltip__score-dot" style={{ backgroundColor: '#22c55e' }} />
                    <span className="ceg-tooltip__score-num">{data.scores.changeability}</span>
                  </span>
                )}
                {data.scores.certainty !== undefined && (
                  <span className="ceg-tooltip__score-item" title="Certainty: How well understood">
                    <span className="ceg-tooltip__score-dot" style={{ backgroundColor: '#3b82f6' }} />
                    <span className="ceg-tooltip__score-num">{data.scores.certainty}</span>
                  </span>
                )}
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
