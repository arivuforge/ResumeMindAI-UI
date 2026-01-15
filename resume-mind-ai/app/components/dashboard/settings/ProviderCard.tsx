'use client';

export type ProviderStatus = 'connected' | 'inactive' | 'error';

interface ProviderCardProps {
  id: string;
  name: string;
  model: string;
  status: ProviderStatus;
  latency?: number;
  errorMessage?: string;
  logoInitials: string;
  logoColorClass: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry?: (id: string) => void;
}

const statusConfig = {
  connected: {
    label: 'Connected',
    badgeClasses: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    showPulse: true,
    pulseColor: 'bg-emerald-500',
    barColor: 'bg-emerald-500',
  },
  inactive: {
    label: 'Inactive',
    badgeClasses: 'bg-slate-700/50 border-slate-600 text-slate-400',
    showPulse: false,
    pulseColor: '',
    barColor: 'bg-slate-600',
  },
  error: {
    label: 'Error',
    badgeClasses: 'bg-red-500/10 border-red-500/20 text-red-400',
    showPulse: false,
    pulseColor: '',
    barColor: 'bg-red-500',
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
  onEdit,
  onDelete,
  onRetry,
}: ProviderCardProps) {
  const config = statusConfig[status];
  const latencyPercentage = latency ? Math.min(100, Math.max(5, 100 - latency / 5)) : 0;

  return (
    <div
      className={`group relative glass-card rounded-xl p-5 transition-all duration-300 ${
        status === 'error' ? 'hover:border-red-500/30' : 'hover:border-primary/50'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg ${logoColorClass} flex items-center justify-center border border-current/20`}
          >
            <span className="font-bold text-sm tracking-tighter">{logoInitials}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{name}</h3>
            <p className="text-xs text-slate-500">{model}</p>
          </div>
        </div>
        <div
          className={`inline-flex items-center px-2 py-1 rounded-md border text-[10px] font-medium uppercase tracking-wider ${config.badgeClasses}`}
        >
          {config.showPulse && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          )}
          {config.label}
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Latency</span>
          <span className={status === 'error' ? 'text-red-400' : 'text-slate-300'}>
            {status === 'error' ? errorMessage || 'Timeout' : latency ? `${latency}ms` : '--'}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1">
          {status !== 'inactive' && (
            <div
              className={`${config.barColor} h-1 rounded-full transition-all duration-300 ${
                status === 'connected' ? 'shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''
              }`}
              style={{ width: status === 'error' ? '100%' : `${latencyPercentage}%` }}
            ></div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
        {status === 'error' && onRetry && (
          <button
            onClick={() => onRetry(id)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            title="Retry"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        )}
        <button
          onClick={() => onEdit(id)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
          title="Edit"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
          title="Delete"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </div>
  );
}
