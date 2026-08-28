import { useEffect, useState } from "react";

export type WorkspaceSummary = {
  id: string;
  name: string;
  account_email: string;
  document_count: number;
  financial_activity: "simulated";
  storage: "in-memory-sqlite";
};

type AppProps = {
  loadWorkspace?: () => Promise<WorkspaceSummary | null>;
};

export async function fetchWorkspace(): Promise<WorkspaceSummary | null> {
  try {
    const response = await fetch("/api/workspaces/demo-workspace-01");
    if (!response.ok) return null;
    return (await response.json()) as WorkspaceSummary;
  } catch {
    return null;
  }
}

export function App({ loadWorkspace = fetchWorkspace }: AppProps) {
  const [workspace, setWorkspace] = useState<WorkspaceSummary | null>(null);
  const [loadStatus, setLoadStatus] = useState<"loading" | "loaded" | "unavailable">(
    "loading",
  );

  useEffect(() => {
    let active = true;
    loadWorkspace()
      .then((result) => {
        if (!active) return;
        setWorkspace(result);
        setLoadStatus(result === null ? "unavailable" : "loaded");
      });
    return () => {
      active = false;
    };
  }, [loadWorkspace]);

  return (
    <main className="shell">
      <header>
        <div>
          <p className="eyebrow">Synthevia · sanitized portfolio edition</p>
          <h1>Demo workspace</h1>
          <p className="intro">
            A small offline view of the product boundary, populated with fictional data.
          </p>
        </div>
        <span className="status">Pre-launch</span>
      </header>

      <section className="notice" aria-label="Activity status">
        <div className="notice-mark">i</div>
        <div>
          <h2>Simulated activity only</h2>
          <p>No production account is connected.</p>
        </div>
      </section>

      <section className="grid" aria-label="Workspace summary">
        <article>
          <p className="label">Workspace</p>
          <h2>
            {loadStatus === "unavailable"
              ? "Local API unavailable"
              : (workspace?.name ?? "Loading synthetic data")}
          </h2>
          <p>
            {workspace === null
              ? "No account data loaded"
              : `Fictional account · ${workspace.account_email}`}
          </p>
        </article>
        <article>
          <p className="label">Knowledge documents</p>
          <strong>{workspace?.document_count ?? "N/A"}</strong>
          <p>Synthetic onboarding and billing guides</p>
        </article>
        <article>
          <p className="label">External services</p>
          <strong>0</strong>
          <p>Data comes from the local FastAPI and SQLite sample</p>
        </article>
      </section>
    </main>
  );
}
