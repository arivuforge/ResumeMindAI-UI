"use client";

import type { GraphNode } from "@/app/lib/types/graph";
import { getLevelPercentage } from "@/app/lib/types/graph";

interface GraphSidebarProps {
  node: GraphNode | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function GraphSidebar({
  node,
  onClose,
  isOpen,
}: GraphSidebarProps) {
  if (!isOpen || !node) return null;

  const { data } = node;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/50 z-10 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-80 z-20 transform transition-transform duration-300 ease-out">
        <div className="glass-card h-full rounded-l-2xl p-6 overflow-y-auto border-l border-slate-700/50">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${node.color}20` }}
              >
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {data.name}
                </h3>
                <span className="text-xs text-slate-400 capitalize">
                  {data.type}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Details based on node type */}
          <div className="space-y-5">
            {data.description && (
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Description
                </label>
                <p className="text-sm text-slate-300 mt-1.5">
                  {data.description}
                </p>
              </div>
            )}

            {data.level && (
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Proficiency Level
                </label>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white capitalize">
                      {data.level}
                    </span>
                    <span className="text-xs text-slate-400">
                      {getLevelPercentage(data.level)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${getLevelPercentage(data.level)}%`,
                        backgroundColor: node.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {data.years !== undefined && (
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Years of Experience
                </label>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-2xl font-bold text-white">
                    {data.years}
                  </span>
                  <span className="text-sm text-slate-400">years</span>
                </div>
              </div>
            )}

            {data.relevanceScore !== undefined && (
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Relevance Score
                </label>
                <div className="flex items-center gap-3 mt-1.5">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: node.color }}
                  >
                    {data.relevanceScore}%
                  </span>
                  <div className="flex-1">
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${data.relevanceScore}%`,
                          backgroundColor: node.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {data.institution && (
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Institution
                </label>
                <p className="text-sm text-white mt-1.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-slate-400">
                    school
                  </span>
                  {data.institution}
                </p>
              </div>
            )}

            {data.date && (
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Date
                </label>
                <p className="text-sm text-white mt-1.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-slate-400">
                    calendar_today
                  </span>
                  {data.date}
                </p>
              </div>
            )}
          </div>

          {/* Labels/Tags */}
          {node.labels.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                Labels
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {node.labels.map((label) => (
                  <span
                    key={label}
                    className="px-2.5 py-1 text-xs rounded-full font-medium"
                    style={{
                      backgroundColor: `${node.color}20`,
                      color: node.color,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
