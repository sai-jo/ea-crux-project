import { Button } from "@/components/ui/button";

// Simple table components without overflow wrappers
function SimpleTable({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <table className={`w-full text-sm ${className}`}>{children}</table>;
}
function SimpleTHead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-slate-200 dark:border-slate-700">{children}</thead>;
}
function SimpleTBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}
function SimpleTR({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-slate-100 dark:border-slate-800 last:border-0">{children}</tr>;
}
function SimpleTH({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`text-left py-2 pr-4 font-medium text-muted-foreground ${className}`}>{children}</th>;
}
function SimpleTD({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-2 pr-4 ${className}`}>{children}</td>;
}

interface MetaViewProps {
  slug: string;
  frontmatter: Record<string, any>;
  entity?: any;
  graphNode?: any;
  incomingEdges: any[];
  outgoingEdges: any[];
  backlinks: any[];
  entityId: string;
}

export function MetaView({
  slug,
  frontmatter,
  entity,
  graphNode,
  incomingEdges,
  outgoingEdges,
  backlinks,
  entityId,
}: MetaViewProps) {
  const handleBack = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("meta");
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="meta-view-container">
      {/* Header */}
      <div className="meta-view-header">
        <h1 className="meta-view-title">
          Page Metadata: {frontmatter.title}
        </h1>
        <Button variant="ghost" size="sm" onClick={handleBack}>
          ← Back to content
        </Button>
      </div>

      {/* Frontmatter Section */}
      <Section title="Frontmatter">
        <SimpleTable>
          <SimpleTBody>
            <Row label="Title" value={frontmatter.title} />
            <Row
              label="Description"
              value={frontmatter.description}
              fallback="Not set"
            />
            <Row label="Page Type">
              <Code>{frontmatter.pageType || "content"}</Code>
            </Row>
            <Row
              label="Last Edited"
              value={frontmatter.lastEdited}
              fallback="Not set"
            />
            <Row label="Sidebar Order" value={frontmatter.sidebar?.order} fallback="Not set" />
            <Row
              label="Sidebar Label"
              value={frontmatter.sidebar?.label || frontmatter.title}
            />
          </SimpleTBody>
        </SimpleTable>
      </Section>

      {/* Ratings Section */}
      {frontmatter.ratings && Object.keys(frontmatter.ratings).length > 0 && (
        <Section title="Ratings">
          <SimpleTable>
            <SimpleTHead>
              <tr>
                <SimpleTH className="w-40">Metric</SimpleTH>
                <SimpleTH className="w-24">Score</SimpleTH>
                <SimpleTH>Visual</SimpleTH>
              </tr>
            </SimpleTHead>
            <SimpleTBody>
              {Object.entries(frontmatter.ratings).map(([key, value]) => (
                <SimpleTR key={key}>
                  <SimpleTD className="text-muted-foreground capitalize">{key}</SimpleTD>
                  <SimpleTD>{value as number}/100</SimpleTD>
                  <SimpleTD>
                    <RatingBar value={value as number} />
                  </SimpleTD>
                </SimpleTR>
              ))}
            </SimpleTBody>
          </SimpleTable>
        </Section>
      )}

      {/* Entity Data Section */}
      <Section title="Entity Data (entities.yaml)">
        {entity ? (
          <>
            <SimpleTable>
              <SimpleTBody>
                <Row label="ID">
                  <Code>{entity.id}</Code>
                </Row>
                <Row label="Type">
                  <Code>{entity.type}</Code>
                </Row>
                <Row label="Title" value={entity.title} />
                <Row
                  label="Description"
                  value={entity.description}
                  fallback="Not set"
                />
                <Row
                  label="Tags"
                  value={entity.tags?.join(", ")}
                  fallback="None"
                />
                <Row
                  label="Last Updated"
                  value={entity.lastUpdated}
                  fallback="Not set"
                />
              </SimpleTBody>
            </SimpleTable>

            {entity.relatedEntries?.length > 0 && (
              <>
                <h3 className="text-sm text-muted-foreground mt-4 mb-2">
                  Related Entries
                </h3>
                <SimpleTable>
                  <SimpleTHead>
                    <tr>
                      <SimpleTH>ID</SimpleTH>
                      <SimpleTH>Type</SimpleTH>
                      <SimpleTH>Relationship</SimpleTH>
                    </tr>
                  </SimpleTHead>
                  <SimpleTBody>
                    {entity.relatedEntries.map((rel: any, i: number) => (
                      <SimpleTR key={i}>
                        <SimpleTD>
                          <Code>{rel.id}</Code>
                        </SimpleTD>
                        <SimpleTD>
                          <Code>{rel.type}</Code>
                        </SimpleTD>
                        <SimpleTD>{rel.relationship}</SimpleTD>
                      </SimpleTR>
                    ))}
                  </SimpleTBody>
                </SimpleTable>
              </>
            )}
          </>
        ) : (
          <p className="text-muted-foreground italic">
            No entity found for ID: <Code>{entityId}</Code>
          </p>
        )}
      </Section>

      {/* Graph Node Section */}
      <Section title="Parameter Graph Node">
        {graphNode ? (
          <>
            <SimpleTable>
              <SimpleTBody>
                <Row label="ID">
                  <Code>{graphNode.id}</Code>
                </Row>
                <Row label="Label" value={graphNode.label} />
                <Row label="Type">
                  <Code>{graphNode.type}</Code>
                </Row>
                <Row label="Order" value={graphNode.order} fallback="Not set" />
                <Row label="Href">
                  <a
                    href={graphNode.href}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {graphNode.href}
                  </a>
                </Row>
              </SimpleTBody>
            </SimpleTable>
            {graphNode.description && (
              <p className="mt-2 text-sm">
                <strong>Description:</strong> {graphNode.description}
              </p>
            )}
          </>
        ) : (
          <p className="text-muted-foreground italic">Not in parameter graph</p>
        )}
      </Section>

      {/* Incoming Edges */}
      {incomingEdges.length > 0 && (
        <Section title={`Incoming Edges (${incomingEdges.length})`}>
          <p className="text-sm text-muted-foreground mb-2">
            Factors that affect this
          </p>
          <SimpleTable>
            <SimpleTHead>
              <tr>
                <SimpleTH>Source</SimpleTH>
                <SimpleTH>Effect</SimpleTH>
                <SimpleTH>Strength</SimpleTH>
              </tr>
            </SimpleTHead>
            <SimpleTBody>
              {incomingEdges.map((edge, i) => (
                <SimpleTR key={i}>
                  <SimpleTD>
                    <Code>{edge.source}</Code>
                  </SimpleTD>
                  <SimpleTD>{edge.effect}</SimpleTD>
                  <SimpleTD>{edge.strength}</SimpleTD>
                </SimpleTR>
              ))}
            </SimpleTBody>
          </SimpleTable>
        </Section>
      )}

      {/* Outgoing Edges */}
      {outgoingEdges.length > 0 && (
        <Section title={`Outgoing Edges (${outgoingEdges.length})`}>
          <p className="text-sm text-muted-foreground mb-2">
            What this affects
          </p>
          <SimpleTable>
            <SimpleTHead>
              <tr>
                <SimpleTH>Target</SimpleTH>
                <SimpleTH>Effect</SimpleTH>
                <SimpleTH>Strength</SimpleTH>
              </tr>
            </SimpleTHead>
            <SimpleTBody>
              {outgoingEdges.map((edge, i) => (
                <SimpleTR key={i}>
                  <SimpleTD>
                    <Code>{edge.target}</Code>
                  </SimpleTD>
                  <SimpleTD>{edge.effect}</SimpleTD>
                  <SimpleTD>{edge.strength}</SimpleTD>
                </SimpleTR>
              ))}
            </SimpleTBody>
          </SimpleTable>
        </Section>
      )}

      {/* Backlinks */}
      {backlinks.length > 0 && (
        <Section title={`Backlinks (${backlinks.length})`}>
          <p className="text-sm text-muted-foreground mb-2">
            Pages that link here
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {backlinks.map((link, i) => (
              <li key={i}>
                <a href={link.path} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {link.title || link.path}
                </a>
                {link.context && (
                  <span className="text-muted-foreground italic text-sm">
                    {" "}
                    — "{link.context}"
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Debug Info */}
      <Section title="Debug Info">
        <SimpleTable>
          <SimpleTBody>
            <Row label="Full Slug">
              <Code>{slug}</Code>
            </Row>
            <Row label="Entity ID (derived)">
              <Code>{entityId}</Code>
            </Row>
            <Row label="Entity Found" value={entity ? "Yes" : "No"} />
            <Row label="Graph Node Found" value={graphNode ? "Yes" : "No"} />
            <Row label="Incoming Edges" value={incomingEdges.length} />
            <Row label="Outgoing Edges" value={outgoingEdges.length} />
            <Row label="Backlinks" value={backlinks.length} />
          </SimpleTBody>
        </SimpleTable>
      </Section>

      {/* Raw JSON */}
      <details className="mt-4 group">
        <summary className="cursor-pointer text-muted-foreground text-sm hover:text-foreground">
          Raw Frontmatter JSON
        </summary>
        <pre className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-4 rounded-lg overflow-x-auto text-xs mt-2 font-mono">
          {JSON.stringify(frontmatter, null, 2)}
        </pre>
      </details>

      {entity && (
        <details className="mt-4 group">
          <summary className="cursor-pointer text-muted-foreground text-sm hover:text-foreground">
            Raw Entity JSON
          </summary>
          <pre className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-4 rounded-lg overflow-x-auto text-xs mt-2 font-mono">
            {JSON.stringify(entity, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

// Helper components
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  fallback,
  children,
}: {
  label: string;
  value?: any;
  fallback?: string;
  children?: React.ReactNode;
}) {
  return (
    <SimpleTR>
      <SimpleTD className="text-muted-foreground w-36 align-top">{label}</SimpleTD>
      <SimpleTD>
        {children ?? (value !== undefined && value !== null ? (
          String(value)
        ) : (
          <span className="italic text-muted-foreground">{fallback}</span>
        ))}
      </SimpleTD>
    </SimpleTR>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
  );
}

function RatingBar({ value }: { value: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-l"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}
