import React, { useState, useMemo } from 'react';
import { resources } from '../../data';
import type { Resource } from '../../data/schema';
import './wiki.css';

interface ResourcesIndexProps {
  showSearch?: boolean;
  showFilters?: boolean;
  defaultType?: string;
}

/**
 * Get human-readable label for resource type
 */
function getResourceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    paper: 'Paper',
    book: 'Book',
    blog: 'Blog Post',
    report: 'Report',
    talk: 'Talk',
    podcast: 'Podcast',
    government: 'Government',
    reference: 'Reference',
    web: 'Web',
  };
  return labels[type] || 'Link';
}

/**
 * Get icon for resource type
 */
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

export function ResourcesIndex({
  showSearch = true,
  showFilters = true,
  defaultType,
}: ResourcesIndexProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(defaultType || 'all');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'type'>('title');

  // Get unique types for filter
  const types = useMemo(() => {
    const typeSet = new Set(resources.map((r) => r.type));
    return Array.from(typeSet).sort();
  }, []);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let result = [...resources];

    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter((r) => r.type === selectedType);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.authors?.some((a) => a.toLowerCase().includes(query)) ||
          r.summary?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (b.published_date || '').localeCompare(a.published_date || '');
        case 'type':
          return a.type.localeCompare(b.type);
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [searchQuery, selectedType, sortBy]);

  // Group by type for summary
  const typeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    for (const r of resources) {
      stats[r.type] = (stats[r.type] || 0) + 1;
    }
    return stats;
  }, []);

  return (
    <div className="resources-index">
      {/* Stats summary */}
      <div className="resources-index__stats">
        <span className="resources-index__total">{resources.length} resources</span>
        <span className="resources-index__breakdown">
          {Object.entries(typeStats)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
              <span key={type} className="resources-index__stat-item">
                {getResourceTypeIcon(type)} {count} {getResourceTypeLabel(type).toLowerCase()}s
              </span>
            ))}
        </span>
      </div>

      {/* Controls */}
      <div className="resources-index__controls">
        {showSearch && (
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="resources-index__search"
          />
        )}

        {showFilters && (
          <div className="resources-index__filters">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="resources-index__select"
            >
              <option value="all">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {getResourceTypeLabel(type)} ({typeStats[type]})
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="resources-index__select"
            >
              <option value="title">Sort by Title</option>
              <option value="date">Sort by Date</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="resources-index__results-count">
        Showing {filteredResources.length} of {resources.length} resources
      </div>

      {/* Table */}
      <div className="resources-index__table-wrapper">
        <table className="resources-index__table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Authors</th>
              <th>Date</th>
              <th>Cited By</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((resource) => (
              <tr key={resource.id}>
                <td>
                  <span
                    className={`resources-index__type-badge resources-index__type-badge--${resource.type}`}
                    title={getResourceTypeLabel(resource.type)}
                  >
                    {getResourceTypeIcon(resource.type)} {getResourceTypeLabel(resource.type)}
                  </span>
                </td>
                <td>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resources-index__title-link"
                  >
                    {resource.title}
                  </a>
                  {resource.summary && (
                    <p className="resources-index__summary">{resource.summary}</p>
                  )}
                </td>
                <td className="resources-index__authors">
                  {resource.authors?.join(', ') || '—'}
                </td>
                <td className="resources-index__date">{resource.published_date || '—'}</td>
                <td className="resources-index__cited-by">
                  {resource.cited_by && resource.cited_by.length > 0 ? (
                    <span title={resource.cited_by.join(', ')}>
                      {resource.cited_by.length} article{resource.cited_by.length !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="resources-index__actions">
                  <a
                    href={`/browse/resources/${resource.id}/`}
                    className="resources-index__view-link"
                  >
                    View →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredResources.length === 0 && (
        <div className="resources-index__empty">
          No resources found matching your criteria.
        </div>
      )}
    </div>
  );
}

export default ResourcesIndex;
