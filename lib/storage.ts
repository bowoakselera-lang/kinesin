import type { BrandProject } from "./types";

const KEY = "kinesin.projects";

export function loadProjects(): BrandProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BrandProject[];
  } catch {
    return [];
  }
}

export function saveProject(project: BrandProject): void {
  const all = loadProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx >= 0) all[idx] = project;
  else all.unshift(project);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteProject(id: string): void {
  const all = loadProjects().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getProject(id: string): BrandProject | null {
  return loadProjects().find((p) => p.id === id) ?? null;
}
