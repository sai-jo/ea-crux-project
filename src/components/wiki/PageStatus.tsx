/**
 * PageStatus Component
 *
 * Displays editorial metadata for knowledge base pages including:
 * - Quality rating (1-5 stars)
 * - LLM summary (short explanation)
 * - Last edited date
 * - Optional todo/notes
 */

import React from 'react';

interface PageStatusProps {
  quality?: 1 | 2 | 3 | 4 | 5;
  llmSummary?: string;
  lastEdited?: string;
  todo?: string;
}

const qualityLabels: Record<number, string> = {
  1: 'Stub',
  2: 'Draft',
  3: 'Needs Work',
  4: 'Good',
  5: 'Comprehensive',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="page-status-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`page-status-star ${star <= rating ? 'page-status-star--filled' : 'page-status-star--empty'}`}
        >
          ★
        </span>
      ))}
      <span className="page-status-quality-label">({qualityLabels[rating]})</span>
    </span>
  );
}

export function PageStatus({ quality, llmSummary, lastEdited, todo }: PageStatusProps) {
  // Don't render if no metadata provided
  if (!quality && !llmSummary && !lastEdited && !todo) {
    return null;
  }

  return (
    <div className="page-status">
      <div className="page-status-header">
        <span className="page-status-icon">📋</span>
        <span className="page-status-title">Page Status</span>
      </div>

      <div className="page-status-content">
        {quality && (
          <div className="page-status-row">
            <span className="page-status-label">Quality:</span>
            <StarRating rating={quality} />
          </div>
        )}

        {lastEdited && (
          <div className="page-status-row">
            <span className="page-status-label">Last edited:</span>
            <span className="page-status-value">{lastEdited}</span>
          </div>
        )}

        {llmSummary && (
          <div className="page-status-row page-status-row--full">
            <span className="page-status-label">LLM Summary:</span>
            <span className="page-status-summary">{llmSummary}</span>
          </div>
        )}

        {todo && (
          <div className="page-status-row page-status-row--todo">
            <span className="page-status-label">Todo:</span>
            <span className="page-status-todo">{todo}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageStatus;
