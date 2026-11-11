import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { projects } from "@/content/projects";

describe("projects", () => {
  it("lists the build-in-public entries without inventing a url", () => {
    expect(projects.map((project) => [project.name, project.url])).toEqual([
      ["Open Model License Dashboard", "https://license.kydo.sh/"],
      ["GPU Flow", undefined],
    ]);
  });

  it("points each preview at a committed image", () => {
    for (const project of projects) {
      expect(project.oneLiner.trim().length).toBeGreaterThan(0);
      expect(project.previewAlt.trim().length).toBeGreaterThan(0);
      expect(project.preview.startsWith("/projects/")).toBe(true);
      expect(project.name.includes("—")).toBe(false);
      expect(project.oneLiner.includes("—")).toBe(false);
      expect(project.previewAlt.includes("—")).toBe(false);
      const file = path.join(process.cwd(), "public", project.preview);
      expect(fs.existsSync(file)).toBe(true);
    }
  });
});
