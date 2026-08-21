import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "../src/App";

describe("App", () => {
  it("labels every financial result as simulated", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Demo workspace" })).toBeInTheDocument();
    expect(screen.getByText("Simulated activity only")).toBeInTheDocument();
    expect(screen.getByText("No production account is connected.")).toBeInTheDocument();
  });
});
