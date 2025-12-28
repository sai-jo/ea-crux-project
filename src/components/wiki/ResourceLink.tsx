import React from 'react';
import { getResourceById } from '../../data';
import './wiki.css';

interface ResourceLinkProps {
  id: string;
  label?: string;
  children?: React.ReactNode;
  showType?: boolean;
  className?: string;
}

function getResourceTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    paper: '📄',
    book: '📚',
    blog: '✏️',
    report: '📋',
    talk: '🎤',
    podcast: '🎧',
    government: '🏛️',
    reference: '📖',
    web: '🔗',
  };
  return icons[type] || '🔗';
}

function truncateText(text: string | undefined | null, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

function getDomain(url: string | undefined | null): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * ResourceLink - A component for linking to external resources by ID
 * Uses pure CSS hover with a bridge for hoverable popups
 */
export function ResourceLink({
  id,
  label,
  children,
  showType = false,
  className = '',
}: ResourceLinkProps) {
  const resource = getResourceById(id);

  if (!resource) {
    return (
      <span
        className={`resource-link resource-link--missing ${className}`}
        title={`Resource not found: ${id}`}
      >
        [{id}]
      </span>
    );
  }

  const displayLabel = children || label || resource.title;
  const icon = showType ? getResourceTypeIcon(resource.type) : null;
  const detailUrl = `/browse/resources/${id}/`;
  const domain = getDomain(resource.url);

  return (
    <span className={`resource-link ${className}`}>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="resource-link__anchor"
      >
        {icon && <span className="resource-link__icon">{icon}</span>}
        <span className="resource-link__label">{displayLabel}</span>
        <span className="resource-link__external">↗</span>
      </a>

      {/* Hover card with bridge for mouse movement */}
      <span className="resource-link__card-wrapper">
        <span className="resource-link__bridge" />
        <span className="resource-link__card">
          <span className="resource-link__card-header">
            <span className="resource-link__card-type">
              {getResourceTypeIcon(resource.type)} {resource.type}
            </span>
            {domain && <span className="resource-link__card-domain">{domain}</span>}
          </span>

          <span className="resource-link__card-title">{resource.title}</span>

          {resource.authors && resource.authors.length > 0 && (
            <span className="resource-link__card-authors">
              {resource.authors.slice(0, 3).join(', ')}
              {resource.authors.length > 3 && ' et al.'}
              {resource.published_date && ` (${resource.published_date.slice(0, 4)})`}
            </span>
          )}

          {resource.summary && (
            <span className="resource-link__card-summary">
              {truncateText(resource.summary, 180)}
            </span>
          )}

          <span className="resource-link__card-actions">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link__card-btn resource-link__card-btn--primary"
            >
              Source ↗
            </a>
            <a href={detailUrl} className="resource-link__card-btn">
              Notes
            </a>
          </span>
        </span>
      </span>
    </span>
  );
}

/**
 * ResourceCite - Inline citation style
 */
interface ResourceCiteProps {
  id: string;
  style?: 'numeric' | 'author-year';
  number?: number;
  className?: string;
}

export function ResourceCite({
  id,
  style = 'author-year',
  number,
  className = '',
}: ResourceCiteProps) {
  const resource = getResourceById(id);

  if (!resource) {
    return <span className="resource-cite resource-cite--missing">[?]</span>;
  }

  let citeText: string;
  if (style === 'numeric' && number !== undefined) {
    citeText = `[${number}]`;
  } else {
    const firstAuthor = resource.authors?.[0]?.split(' ').pop() || 'Unknown';
    const year = resource.published_date?.slice(0, 4) || '';
    citeText = `(${firstAuthor}${year ? ` ${year}` : ''})`;
  }

  const tooltip = [resource.title, resource.summary].filter(Boolean).join('\n\n');

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`resource-cite ${className}`}
      title={tooltip}
    >
      {citeText}
    </a>
  );
}

export { ResourceLink as R };

export default ResourceLink;
