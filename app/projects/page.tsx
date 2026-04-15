"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProjects, deleteProject } from "@/lib/storage";
import type { BrandProject } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<BrandProject[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    setMounted(true);
  }, []);

  function handleDelete(id: string) {
    if (!confirm("Hapus proyek ini?")) return;
    deleteProject(id);
    setProjects(loadProjects());
  }

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Proyek Tersimpan</h1>
          <p className="text-slate-600 mt-1">
            Semua brand yang sudah pernah kamu buat.
          </p>
        </div>
        <Link
          href="/create"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          + Buat Baru
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-white border border-dashed border-slate-300">
          <p className="text-slate-600 mb-4">Belum ada proyek tersimpan.</p>
          <Link
            href="/create"
            className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium"
          >
            Mulai Buat Brand
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-xl bg-white border border-slate-200 flex items-center gap-4"
            >
              <div className="flex gap-1">
                {p.identity.palette.slice(0, 5).map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-10 rounded"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{p.brief.brandName}</div>
                <div className="text-xs text-slate-500">
                  {p.brief.industry} ·{" "}
                  {new Date(p.createdAt).toLocaleDateString("id-ID")}
                </div>
              </div>
              <Link
                href={`/projects/${p.id}`}
                className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 hover:bg-slate-50"
              >
                Buka
              </Link>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
