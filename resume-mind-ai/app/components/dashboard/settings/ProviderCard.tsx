"use client";

export type ProviderStatus = "connected" | "inactive" | "error";

interface ProviderCardProps {
  id: string;
  name: string;
  model: string;
  status: ProviderStatus;
  latency?: number;
  errorMessage?: string;
  logoInitials: string;
  logoColorClass: string;
  isActive?: boolean;
  onSetActive?: (id: string) => void;
  isSettingActive?: boolean;
  setActiveInProgress?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry?: (id: string) => void;
  onTest?: (id: string) => void;
  isTesting?: boolean;
}

const statusConfig = {
  connected: {
    label: "Connected",
    badgeClasses: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    showPulse: true,
    pulseColor: "bg-emerald-500",
    barColor: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    badgeClasses: "bg-slate-700/50 border-slate-600 text-slate-400",
    showPulse: false,
    pulseColor: "",
    barColor: "bg-slate-600",
  },
  error: {
    label: "Error",
    badgeClasses: "bg-red-500/10 border-red-500/20 text-red-400",
    showPulse: false,
    pulseColor: "",
    barColor: "bg-red-500",
  },
};

export default function ProviderCard({
  id,
  name,
  model,
  status,
  latency,
  errorMessage,
  logoInitials,
  logoColorClass,
  isActive = false,
  onSetActive,
  isSettingActive = false,
  setActiveInProgress = false,
  onEdit,
  onDelete,
  onRetry,
  onTest,
  isTesting = false,
}: ProviderCardProps) {
  const config = statusConfig[status];
  const hasLatency = latency !== undefined && latency !== null;
  const latencyPercentage = hasLatency
    ? Math.min(100, Math.max(5, 100 - latency / 5))
    : 0;

  return (
    <div
      className={`group relative glass-card rounded-2xl p-6 transition-all duration-300 border border-slate-700/50 ${
        status === "error"
          ? "hover:border-red-500/30"
          : "hover:border-primary/50"
      } ${isActive ? "border-primary-light bg-primary/5 ring-1 ring-primary-light shadow-[0_0_25px_rgba(139,92,246,0.15)]" : "bg-slate-900/40 hover:bg-slate-900/60"}`}
    >
      {/* Utility Actions (Top Right) */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={() => onEdit(id)}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all border border-slate-700/50"
          title="Edit connection"
        >
          <span className="material-symbols-outlined text-base">edit</span>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-400 bg-slate-800/80 hover:bg-red-500/10 rounded-lg transition-all border border-slate-700/50"
          title="Delete connection"
        >
          <span className="material-symbols-outlined text-base">delete</span>
        </button>
      </div>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl ${logoColorClass} flex items-center justify-center border border-white/5 shadow-inner transition-transform group-hover:scale-105 duration-300`}
          >
            <span className="font-extrabold text-base tracking-tighter">
              {logoInitials}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="text-base font-bold text-white truncate pr-2 cursor-help"
              title={name}
            >
              {name}
            </h3>
            <p
              className="text-[11px] font-medium text-slate-500 truncate mt-0.5 cursor-help"
              title={model}
            >
              {model}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div
            className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${config.badgeClasses} shadow-sm`}
          >
            {config.showPulse && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            )}
            {config.label}
          </div>
          {isActive && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-primary/40 bg-primary/20 text-[9px] font-bold text-primary-light uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <span className="material-symbols-outlined text-[12px] mr-1">
                verified
              </span>
              Active
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center bg-slate-800/20 rounded-lg px-3 py-2 border border-slate-700/30">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Latency
            </span>
            {onTest && (
              <button
                onClick={() => onTest(id)}
                disabled={isTesting}
                className="text-slate-500 hover:text-emerald-400 disabled:opacity-50 transition-colors"
                title="Test connection"
              >
                {isTesting ? (
                  <span className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin inline-block"></span>
                ) : (
                  <span className="material-symbols-outlined text-sm">
                    bolt
                  </span>
                )}
              </button>
            )}
            {onRetry && status === "error" && (
              <button
                onClick={() => onRetry(id)}
                className="text-slate-500 hover:text-white transition-colors"
                title="Retry connection"
              >
                <span className="material-symbols-outlined text-sm">
                  refresh
                </span>
              </button>
            )}
          </div>
          <span
            className={`text-xs font-mono font-bold ${status === "error" ? "text-red-400" : "text-slate-200"}`}
          >
            {status === "error"
              ? "Timeout"
              : hasLatency
                ? `${latency}ms`
                : "--"}
          </span>
        </div>
        <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
          {status !== "inactive" && (
            <div
              className={`${config.barColor} h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
              style={{
                width:
                  status === "error"
                    ? "100%"
                    : hasLatency
                      ? `${latencyPercentage}%`
                      : "0%",
              }}
            ></div>
          )}
        </div>
      </div>

      {status === "error" && errorMessage && (
        <div className="mt-3 text-[10px] text-red-400/80 bg-red-500/5 border border-red-500/10 rounded-lg p-2 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <span className="material-symbols-outlined text-sm shrink-0">
            info
          </span>
          <span className="line-clamp-2">{errorMessage}</span>
        </div>
      )}

      {onSetActive && (
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => onSetActive(id)}
            disabled={
              isActive ||
              isSettingActive ||
              setActiveInProgress ||
              status !== "connected"
            }
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
              isActive
                ? "bg-primary/20 text-primary-light border border-primary/30 cursor-default"
                : status !== "connected"
                  ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                  : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-primary/50 shadow-sm"
            } disabled:opacity-50`}
          >
            {isSettingActive ? (
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-[16px]">
                {isActive ? "check_circle" : "radio_button_unchecked"}
              </span>
            )}
            {isActive ? "Default Provider" : "Set As Default"}
          </button>
        </div>
      )}
    </div>
  );
}
