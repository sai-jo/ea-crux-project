import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import database from "../data/database.json";

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

// Helper to find entity path from ID
function getEntityPath(entityId: string): string | null {
  const pathRegistry = (database as any).pathRegistry || {};
  return pathRegistry[entityId] || null;
}

// Helper to get entity title from ID
function getEntityTitle(entityId: string): string {
  const entities = (database as any).entities || [];
  const entity = entities.find((e: any) => e.id === entityId);
  return entity?.title || entityId;
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

  // Compute some stats
  const hasEntity = !!entity;
  const hasGraphNode = !!graphNode;
  const hasRatings = frontmatter.ratings && Object.keys(frontmatter.ratings).length > 0;
  const totalEdges = incomingEdges.length + outgoingEdges.length;

  return (
    <div className="meta-view-container">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold mb-2">
            {frontmatter.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant={hasEntity ? "default" : "outline"}>
              {hasEntity ? "Entity ✓" : "No Entity"}
            </Badge>
            <Badge variant={hasGraphNode ? "default" : "outline"}>
              {hasGraphNode ? "In Graph ✓" : "Not in Graph"}
            </Badge>
            {totalEdges > 0 && (
              <Badge variant="secondary">{totalEdges} edges</Badge>
            )}
            {backlinks.length > 0 && (
              <Badge variant="secondary">{backlinks.length} backlinks</Badge>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleBack}>
          ← Back
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="page" className="w-full">
        <TabsList>
          <TabsTrigger value="page">Page</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
        </TabsList>

        {/* Page Tab */}
        <TabsContent value="page" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Frontmatter</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Title</dt>
                <dd>{frontmatter.title}</dd>

                <dt className="text-muted-foreground">Description</dt>
                <dd className="text-muted-foreground">
                  {frontmatter.description || <em>Not set</em>}
                </dd>

                <dt className="text-muted-foreground">Page Type</dt>
                <dd><Code>{frontmatter.pageType || "content"}</Code></dd>

                <dt className="text-muted-foreground">Last Edited</dt>
                <dd>{frontmatter.lastEdited || <em className="text-muted-foreground">Not set</em>}</dd>

                {frontmatter.sidebar && (
                  <>
                    <dt className="text-muted-foreground">Sidebar</dt>
                    <dd>
                      Order: {frontmatter.sidebar.order ?? "—"},
                      Label: {frontmatter.sidebar.label || frontmatter.title}
                    </dd>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          {hasRatings && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(frontmatter.ratings).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground capitalize w-32">{key}</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-l"
                            style={{ width: `${value as number}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{value as number}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">File Info</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Slug</dt>
                <dd><Code>{slug}</Code></dd>

                <dt className="text-muted-foreground">Entity ID</dt>
                <dd><Code>{entityId}</Code></dd>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Entity Data</CardTitle>
              <CardDescription>From entities.yaml</CardDescription>
            </CardHeader>
            <CardContent>
              {entity ? (
                <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">ID</dt>
                  <dd className="flex items-center gap-2">
                    <Code>{entity.id}</Code>
                    {getEntityPath(entity.id) && (
                      <a
                        href={getEntityPath(entity.id)!}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                      >
                        View Page →
                      </a>
                    )}
                  </dd>

                  <dt className="text-muted-foreground">Type</dt>
                  <dd><Code>{entity.type}</Code></dd>

                  <dt className="text-muted-foreground">Title</dt>
                  <dd>{entity.title}</dd>

                  <dt className="text-muted-foreground">Description</dt>
                  <dd className="text-muted-foreground">
                    {entity.description || <em>Not set</em>}
                  </dd>

                  {entity.tags?.length > 0 && (
                    <>
                      <dt className="text-muted-foreground">Tags</dt>
                      <dd className="flex flex-wrap gap-1">
                        {entity.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </dd>
                    </>
                  )}

                  <dt className="text-muted-foreground">Last Updated</dt>
                  <dd>{entity.lastUpdated || <em className="text-muted-foreground">Not set</em>}</dd>
                </dl>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No entity found for ID: <Code>{entityId}</Code>
                </p>
              )}
            </CardContent>
          </Card>

          {entity?.relatedEntries?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Related Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {entity.relatedEntries.map((rel: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <EntityLink entityId={rel.id} showId />
                      <Badge variant="outline" className="text-xs">{rel.type}</Badge>
                      <span className="text-muted-foreground">{rel.relationship}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {backlinks.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Backlinks ({backlinks.length})</CardTitle>
                <CardDescription>Pages that link to this page</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {backlinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.path} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {link.title || link.path}
                      </a>
                      {link.context && (
                        <span className="text-muted-foreground text-xs ml-2">"{link.context}"</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Graph Tab */}
        <TabsContent value="graph" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Parameter Graph Node</CardTitle>
            </CardHeader>
            <CardContent>
              {graphNode ? (
                <dl className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">ID</dt>
                  <dd><Code>{graphNode.id}</Code></dd>

                  <dt className="text-muted-foreground">Label</dt>
                  <dd>{graphNode.label}</dd>

                  <dt className="text-muted-foreground">Type</dt>
                  <dd><Code>{graphNode.type}</Code></dd>

                  <dt className="text-muted-foreground">Order</dt>
                  <dd>{graphNode.order ?? <em className="text-muted-foreground">Not set</em>}</dd>

                  <dt className="text-muted-foreground">Href</dt>
                  <dd>
                    <a href={graphNode.href} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                      {graphNode.href}
                    </a>
                  </dd>

                  {graphNode.description && (
                    <>
                      <dt className="text-muted-foreground">Description</dt>
                      <dd className="text-muted-foreground">{graphNode.description}</dd>
                    </>
                  )}
                </dl>
              ) : (
                <p className="text-muted-foreground text-sm">Not in parameter graph</p>
              )}
            </CardContent>
          </Card>

          {incomingEdges.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Incoming Edges ({incomingEdges.length})</CardTitle>
                <CardDescription>Factors that affect this</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {incomingEdges.map((edge, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <EntityLink entityId={edge.source} />
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="outline" className="text-xs">{edge.effect}</Badge>
                      {edge.strength && (
                        <span className="text-muted-foreground text-xs">({edge.strength})</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {outgoingEdges.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Outgoing Edges ({outgoingEdges.length})</CardTitle>
                <CardDescription>What this affects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {outgoingEdges.map((edge, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">→</span>
                      <EntityLink entityId={edge.target} />
                      <Badge variant="outline" className="text-xs">{edge.effect}</Badge>
                      {edge.strength && (
                        <span className="text-muted-foreground text-xs">({edge.strength})</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!graphNode && incomingEdges.length === 0 && outgoingEdges.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                This page is not connected to the parameter graph.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Debug Tab */}
        <TabsContent value="debug" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Full Slug</dt>
                <dd><Code>{slug}</Code></dd>

                <dt className="text-muted-foreground">Entity ID (derived)</dt>
                <dd><Code>{entityId}</Code></dd>

                <dt className="text-muted-foreground">Entity Found</dt>
                <dd>{entity ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>}</dd>

                <dt className="text-muted-foreground">Graph Node Found</dt>
                <dd>{graphNode ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>}</dd>

                <dt className="text-muted-foreground">Incoming Edges</dt>
                <dd>{incomingEdges.length}</dd>

                <dt className="text-muted-foreground">Outgoing Edges</dt>
                <dd>{outgoingEdges.length}</dd>

                <dt className="text-muted-foreground">Backlinks</dt>
                <dd>{backlinks.length}</dd>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Raw Frontmatter</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                {JSON.stringify(frontmatter, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {entity && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Raw Entity</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                  {JSON.stringify(entity, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component for inline code
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-xs font-mono">
      {children}
    </code>
  );
}

// Helper component for entity links
function EntityLink({ entityId, showId = false }: { entityId: string; showId?: boolean }) {
  const path = getEntityPath(entityId);
  const title = getEntityTitle(entityId);

  if (path) {
    return (
      <a
        href={path}
        className="text-blue-600 dark:text-blue-400 hover:underline"
        title={showId ? entityId : undefined}
      >
        {showId ? <Code>{entityId}</Code> : title}
      </a>
    );
  }

  // No path found - just show the ID
  return <Code>{entityId}</Code>;
}
