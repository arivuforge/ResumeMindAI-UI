"use client";

import Link from "next/link";

export default function GraphEmptyState() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-background-dark">
      <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl text-slate-500">
          hub
        </span>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">No Graph Data</h3>

      <p className="text-slate-400 text-center max-w-md mb-8">
        Upload and analyze a resume to generate your career knowledge graph. The
        graph will visualize your skills, experiences, and their connections.
      </p>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-violet-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary/25"
      >
        <span className="material-symbols-outlined text-lg">upload</span>
        Upload Resume
      </Link>
    </div>
  );
}
