import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { App, fetchWorkspace, type WorkspaceSummary } from "../src/App";

const demoWorkspace = {
  id: "demo-workspace-01",
  name: "Northstar Demo",
  account_email: "alex@example.com",
  document_count: 2,
  financial_activity: "simulated",
  storage: "in-memory-sqlite",
} satisfies WorkspaceSummary;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("labels every financial result as simulated", async () => {
    render(<App loadWorkspace={async () => demoWorkspace} />);

    expect(screen.getByRole("heading", { name: "Demo workspace" })).toBeInTheDocument();
    expect(screen.getByText("Simulated activity only")).toBeInTheDocument();
    expect(screen.getByText("No production account is connected.")).toBeInTheDocument();
    expect(await screen.findByText("Northstar Demo")).toBeInTheDocument();
  });

  it("renders the workspace returned by the local API contract", async () => {
    render(
      <App
        loadWorkspace={async () => ({
          ...demoWorkspace,
          name: "Orion Review",
          document_count: 3,
        })}
      />,
    );

    expect(await screen.findByText("Orion Review")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows a bounded failure when the local API has no record", async () => {
    render(<App loadWorkspace={async () => null} />);

    expect(await screen.findByText("Local API unavailable")).toBeInTheDocument();
  });

  it("converts a local API network failure into an unavailable result", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

    await expect(fetchWorkspace()).resolves.toBeNull();
  });
});
