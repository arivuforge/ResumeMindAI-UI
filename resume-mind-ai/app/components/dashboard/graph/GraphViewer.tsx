"use client";

import {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import type {
  GraphData,
  GraphNode,
  GraphLink,
  CanvasConfig,
} from "@/app/lib/types/graph";
import GraphSkeleton from "./GraphSkeleton";

// Import the FalkorDB Canvas type
import type FalkorDBCanvasType from "@falkordb/canvas";

export interface GraphViewerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  resetView: () => void;
  getZoom: () => number;
}

interface GraphViewerProps {
  data: GraphData;
  config?: CanvasConfig;
  className?: string;
  isLoading?: boolean;
}

const GraphViewer = forwardRef<GraphViewerHandle, GraphViewerProps>(
  function GraphViewer(
    { data, config, className = "", isLoading = false },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<FalkorDBCanvasType | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Initialize the canvas element when mounted
    useEffect(() => {
      const container = containerRef.current;
      if (!container || canvasRef.current) return;

      // Dynamically import and create the canvas
      const initCanvas = async () => {
        // Import the module to ensure the web component is registered
        await import("@falkordb/canvas");

        // Wait for the custom element to be defined
        await customElements.whenDefined("falkordb-canvas");

        // Create the canvas element
        const canvas = document.createElement(
          "falkordb-canvas",
        ) as unknown as FalkorDBCanvasType;
        (canvas as unknown as HTMLElement).style.width = "100%";
        (canvas as unknown as HTMLElement).style.height = "100%";
        (canvas as unknown as HTMLElement).style.display = "block";

        container.appendChild(canvas as unknown as Node);
        canvasRef.current = canvas;
        setIsReady(true);
      };

      initCanvas();

      return () => {
        // Cleanup on unmount
        if (
          canvasRef.current &&
          container.contains(canvasRef.current as unknown as Node)
        ) {
          container.removeChild(canvasRef.current as unknown as Node);
        }
        canvasRef.current = null;
      };
    }, []);

    // Update canvas data and config when they change
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !isReady || !data) return;

      // Set the graph data
      canvas.setData({
        nodes: data.nodes.map((node) => ({
          id: node.id,
          labels: node.labels,
          color: node.color,
          visible: node.visible,
          data: node.data,
        })),
        links: data.links.map((link) => ({
          id: link.id,
          relationship: link.relationship,
          color: link.color,
          source: link.source,
          target: link.target,
          visible: link.visible,
          data: link.data,
        })),
      });

      // Configure the canvas
      canvas.setConfig({
        backgroundColor: "#0f172a", // background-dark
        foregroundColor: "#e2e8f0", // slate-200
        onNodeClick: (node) => {
          config?.onNodeClick?.(node as unknown as GraphNode);
        },
        onNodeHover: (node) => {
          config?.onNodeHover?.(node as unknown as GraphNode | null);
        },
        onLinkClick: (link) => {
          config?.onLinkClick?.(link as unknown as GraphLink);
        },
        onLinkHover: (link) => {
          config?.onLinkHover?.(link as unknown as GraphLink | null);
        },
        onBackgroundClick: () => {
          config?.onBackgroundClick?.();
        },
        onZoom: (transform) => {
          config?.onZoom?.(transform.k * 100);
        },
      });

      // Fit to view after a short delay to let the graph settle
      const timeout = setTimeout(() => {
        canvas.zoomToFit(1.2);
      }, 500);

      return () => clearTimeout(timeout);
    }, [data, config, isReady]);

    // Create stable handlers for the imperative methods
    const zoomIn = useCallback(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const currentZoom = canvas.getViewport()?.zoom ?? 1;
        canvas.zoom(currentZoom * 1.2);
      }
    }, []);

    const zoomOut = useCallback(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const currentZoom = canvas.getViewport()?.zoom ?? 1;
        canvas.zoom(currentZoom / 1.2);
      }
    }, []);

    const zoomToFit = useCallback(() => {
      canvasRef.current?.zoomToFit(1.2);
    }, []);

    const resetView = useCallback(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.zoom(1);
        canvas.zoomToFit(1.2);
      }
    }, []);

    const getZoom = useCallback(() => {
      return (canvasRef.current?.getViewport()?.zoom ?? 1) * 100;
    }, []);

    // Expose methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        zoomIn,
        zoomOut,
        zoomToFit,
        resetView,
        getZoom,
      }),
      [zoomIn, zoomOut, zoomToFit, resetView, getZoom],
    );

    if (isLoading) {
      return <GraphSkeleton />;
    }

    return (
      <div
        ref={containerRef}
        className={`w-full h-full bg-background-dark ${className}`}
      />
    );
  },
);

export default GraphViewer;
