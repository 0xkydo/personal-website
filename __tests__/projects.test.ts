import { describe, it, expect } from "vitest";
import { projects } from "@/content/projects";

const stages = ["Shape", "Build", "Launch", "Iterate"];

describe("projects", () => {
  it("lists public and unreleased build-in-public work", () => {
    expect(projects.map((project) => [project.name, project.stage, project.url])).toEqual([
      ["Open Model License Dashboard", "Iterate", "https://license.kydo.sh/"],
      ["GPU Flow", "Build", undefined],
    ]);
  });

  it("keeps every entry on a known stage with a one-liner", () => {
    for (const project of projects) {
      expect(stages).toContain(project.stage);
      expect(project.oneLiner.trim().length).toBeGreaterThan(0);
      expect(project.name.includes("—")).toBe(false);
      expect(project.oneLiner.includes("—")).toBe(false);
    }
  });
});
