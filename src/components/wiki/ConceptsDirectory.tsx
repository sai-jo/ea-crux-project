"use client"

import * as React from "react"
import { pages, type Page } from "../../data"

interface CategorySection {
  key: string
  title: string
  description?: string
  pages: Page[]
}

interface ConceptsDirectoryProps {
  initialItemsPerSection?: number
  sortBy?: "backlinks" | "importance" | "quality" | "title"
  showDescription?: boolean
}

// Category configuration with display order and styling
const categoryConfig: Record<string, { title: string; order: number; description?: string }> = {
  "arguments": { title: "Arguments & Debates", order: 1, description: "Core cases for and against AI risk" },
  "risks": { title: "Risks", order: 2, description: "Potential harms from AI systems" },
  "responses": { title: "Responses & Interventions", order: 3, description: "Technical and governance approaches" },
  "models": { title: "Analytical Models", order: 4, description: "Frameworks for understanding AI risk" },
  "capabilities": { title: "AI Capabilities", order: 5, description: "Current and emerging AI abilities" },
  "cruxes": { title: "Key Uncertainties", order: 6, description: "Critical questions and disagreements" },
  "organizations": { title: "Organizations", order: 7, description: "Labs, research orgs, and institutions" },
  "people": { title: "People", order: 8, description: "Key researchers and figures" },
  "funders": { title: "Funders", order: 9, description: "Funding organizations" },
  "history": { title: "History", order: 10, description: "Timeline and key events" },
  "scenarios": { title: "Scenarios", order: 11, description: "Future possibilities" },
  "metrics": { title: "Metrics & Estimates", order: 12, description: "Quantified predictions" },
  "worldviews": { title: "Worldviews", order: 13, description: "Different perspectives" },
  "debates": { title: "Debates", order: 14, description: "Structured disagreements" },
  "literature": { title: "Literature", order: 15, description: "Essential reading" },
  "forecasting": { title: "Forecasting", order: 16, description: "Prediction methods" },
  "foundation-models": { title: "Foundation Models", order: 17, description: "Specific AI systems" },
  "parameters": { title: "Parameters", order: 18, description: "Key variables" },
}

function PageItem({ page }: { page: Page }) {
  return (
    <div className="concepts-item">
      <a href={page.path} className="concepts-item__title">
        {page.title}
      </a>
      {page.backlinkCount > 0 && (
        <span className="concepts-item__meta">({page.backlinkCount})</span>
      )}
    </div>
  )
}

function CategorySectionComponent({
  section,
  initialItems,
  showDescription
}: {
  section: CategorySection
  initialItems: number
  showDescription: boolean
}) {
  const [expanded, setExpanded] = React.useState(false)
  const displayedPages = expanded ? section.pages : section.pages.slice(0, initialItems)
  const hasMore = section.pages.length > initialItems

  return (
    <section className="concepts-section">
      <h2 className="concepts-section__title">{section.title}</h2>
      {showDescription && section.description && (
        <p className="concepts-section__description">{section.description}</p>
      )}
      <div className="concepts-grid">
        {displayedPages.map((page) => (
          <PageItem key={page.id} page={page} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="concepts-section__toggle"
        >
          {expanded
            ? `Show Less`
            : `Load More (${initialItems}/${section.pages.length})`
          }
        </button>
      )}
    </section>
  )
}

export function ConceptsDirectory({
  initialItemsPerSection = 30,
  sortBy = "backlinks",
  showDescription = true
}: ConceptsDirectoryProps) {
  const sections = React.useMemo(() => {
    // Group pages by category
    const grouped: Record<string, Page[]> = {}

    for (const page of pages) {
      const category = page.category || "other"
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(page)
    }

    // Sort within each category
    for (const category of Object.keys(grouped)) {
      grouped[category].sort((a, b) => {
        if (sortBy === "backlinks") {
          return (b.backlinkCount ?? 0) - (a.backlinkCount ?? 0)
        } else if (sortBy === "importance") {
          return (b.importance ?? -1) - (a.importance ?? -1)
        } else if (sortBy === "quality") {
          return (b.quality ?? -1) - (a.quality ?? -1)
        } else {
          return a.title.localeCompare(b.title)
        }
      })
    }

    // Convert to sections array with proper ordering
    const sectionsArray: CategorySection[] = Object.entries(grouped).map(([key, pagesInCategory]) => {
      const config = categoryConfig[key] || { title: key.charAt(0).toUpperCase() + key.slice(1), order: 99 }
      return {
        key,
        title: config.title,
        description: config.description,
        pages: pagesInCategory,
      }
    })

    // Sort sections by configured order
    sectionsArray.sort((a, b) => {
      const orderA = categoryConfig[a.key]?.order ?? 99
      const orderB = categoryConfig[b.key]?.order ?? 99
      return orderA - orderB
    })

    return sectionsArray
  }, [sortBy])

  const totalPages = pages.length
  const categoriesCount = sections.length

  return (
    <div className="concepts-directory">
      <div className="concepts-directory__stats">
        <span>{totalPages} pages across {categoriesCount} categories</span>
      </div>

      {sections.map((section) => (
        <CategorySectionComponent
          key={section.key}
          section={section}
          initialItems={initialItemsPerSection}
          showDescription={showDescription}
        />
      ))}

      <style>{`
        .concepts-directory {
          --gap: 0.75rem;
        }

        .concepts-directory__stats {
          color: var(--sl-color-gray-3);
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }

        .concepts-section {
          margin-bottom: 3rem;
        }

        .concepts-section__title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--sl-color-white);
          font-variant: small-caps;
          letter-spacing: 0.05em;
        }

        .concepts-section__description {
          color: var(--sl-color-gray-3);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          margin-top: 0;
        }

        .concepts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--gap) 2rem;
        }

        @media (max-width: 1024px) {
          .concepts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .concepts-grid {
            grid-template-columns: 1fr;
          }
        }

        .concepts-item {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          line-height: 1.4;
        }

        .concepts-item__title {
          color: var(--sl-color-white);
          text-decoration: none;
          font-size: 0.95rem;
        }

        .concepts-item__title:hover {
          text-decoration: underline;
          color: var(--sl-color-accent);
        }

        .concepts-item__meta {
          color: var(--sl-color-gray-4);
          font-size: 0.8rem;
        }

        .concepts-section__toggle {
          background: none;
          border: none;
          color: var(--sl-color-accent);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem 0;
          margin-top: 0.75rem;
        }

        .concepts-section__toggle:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

export default ConceptsDirectory
