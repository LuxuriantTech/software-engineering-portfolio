export function App() {
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
          <h2>Northstar Demo</h2>
          <p>Fictional account · alex@example.com</p>
        </article>
        <article>
          <p className="label">Knowledge documents</p>
          <strong>2</strong>
          <p>Synthetic onboarding and billing guides</p>
        </article>
        <article>
          <p className="label">External calls</p>
          <strong>0</strong>
          <p>Retrieval stays deterministic and local</p>
        </article>
      </section>
    </main>
  );
}
