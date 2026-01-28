"use client";

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToView: () => void;
  onResetView: () => void;
  zoomLevel?: number;
}

export default function GraphControls({
  onZoomIn,
  onZoomOut,
  onFitToView,
  onResetView,
  zoomLevel = 100,
}: GraphControlsProps) {
  const controls = [
    { icon: "add", label: "Zoom In", onClick: onZoomIn },
    { icon: "remove", label: "Zoom Out", onClick: onZoomOut },
    { icon: "fit_screen", label: "Fit to View", onClick: onFitToView },
    { icon: "restart_alt", label: "Reset", onClick: onResetView },
  ];

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
      {/* Zoom level indicator */}
      <div className="glass-card px-3 py-1.5 rounded-lg text-xs text-slate-400 text-center font-medium">
        {Math.round(zoomLevel)}%
      </div>

      {/* Control buttons */}
      <div className="glass-card p-2 rounded-xl flex flex-col gap-1">
        {controls.map((control) => (
          <button
            key={control.icon}
            onClick={control.onClick}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            title={control.label}
            aria-label={control.label}
          >
            <span className="material-symbols-outlined text-xl">
              {control.icon}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
