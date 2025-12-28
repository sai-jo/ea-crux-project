import React from 'react';
import { resources } from '../../data';
import './wiki.css';

interface ArticleSourcesProps {
  entityId: string;
  title?: string;
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
 * ArticleSources - Shows all external resources citing this article as a simple table
 */
export function ArticleSources({
  entityId,
  title = 'Sources & References',
}: ArticleSourcesProps) {
  const citingResources = resources.filter((r) => r.cited_by?.includes(entityId) && r.url);

  if (citingResources.length === 0) {
    return null;
  }

  const sorted = [...citingResources].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="article-sources">
      <h2>{title}</h2>
      <table className="article-sources__table">
        <thead>
          <tr>
            <th>Resource</th>
            <th>Domain</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((resource) => (
            <tr key={resource.id}>
              <td>
                <span className="article-sources__type-icon">
                  {getResourceTypeIcon(resource.type)}
                </span>
                {resource.title}
              </td>
              <td className="article-sources__domain">{getDomain(resource.url)}</td>
              <td className="article-sources__links">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </a>
                {' · '}
                <a href={`/browse/resources/${resource.id}/`}>
                  Notes
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ArticleSources;
