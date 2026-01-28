"use client";

export default function GraphSkeleton() {
  // Orbital positions for skeleton nodes
  const orbitalNodes = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background-dark">
      {/* Animated skeleton nodes */}
      <div className="relative w-64 h-64">
        {/* Center node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-primary/20 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary/30 rounded-full animate-pulse" />

        {/* Orbital nodes */}
        {orbitalNodes.map((angle, i) => {
          const radius = 40;
          const top = 50 + radius * Math.sin((angle * Math.PI) / 180);
          const left = 50 + radius * Math.cos((angle * Math.PI) / 180);

          return (
            <div
              key={i}
              className="absolute w-6 h-6 bg-slate-700/50 rounded-full animate-pulse"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                transform: "translate(-50%, -50%)",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          );
        })}

        {/* Connection lines (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {orbitalNodes.map((angle, i) => {
            const radius = 40;
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="#334155"
                strokeWidth="1"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            );
          })}
        </svg>
      </div>

      <p className="text-slate-500 text-sm mt-8">Loading knowledge graph...</p>
    </div>
  );
}
