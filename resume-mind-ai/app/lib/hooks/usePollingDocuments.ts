"use client";

import { useEffect, useRef, useCallback } from "react";
import { getDocumentStatus } from "../api/documents";
import type { DocumentListItem, DocumentStatus } from "../types/document";
import { isTerminalStatus } from "../types/document";

interface UsePollingDocumentsOptions {
  documents: DocumentListItem[];
  onStatusUpdate: (
    id: string,
    status: DocumentStatus,
    progressMessage?: string,
    errorMessage?: string,
  ) => void;
  initialInterval?: number;
  backoffInterval?: number;
  backoffAfter?: number;
  maxDuration?: number;
  enabled?: boolean;
}

interface PollingEntry {
  startTime: number;
  intervalId: ReturnType<typeof setInterval>;
  currentInterval: number;
  lastPollTime: number;
  consecutiveErrors: number;
}

/**
 * Hook to manage polling for multiple documents with non-terminal statuses.
 * Implements backoff: switches from initialInterval to backoffInterval after backoffAfter ms.
 * Stops polling after maxDuration or when status becomes terminal.
 */
export function usePollingDocuments(options: UsePollingDocumentsOptions): void {
  const {
    documents,
    onStatusUpdate,
    initialInterval = 5000, // Increased from 2000ms to 5000ms
    backoffInterval = 10000, // Increased from 4000ms to 10000ms
    backoffAfter = 60000, // Increased from 30000ms to 60000ms
    maxDuration = 300000, // Increased from 120000ms to 300000ms (5 minutes)
    enabled = true,
  } = options;

  const pollingMapRef = useRef<Map<string, PollingEntry>>(new Map());
  const onStatusUpdateRef = useRef(onStatusUpdate);

  // Keep callback ref updated
  useEffect(() => {
    onStatusUpdateRef.current = onStatusUpdate;
  }, [onStatusUpdate]);

  const stopPolling = useCallback((id: string) => {
    const entry = pollingMapRef.current.get(id);
    if (entry) {
      clearInterval(entry.intervalId);
      pollingMapRef.current.delete(id);
    }
  }, []);

  const startPolling = useCallback(
    (id: string) => {
      // Don't start if already polling
      if (pollingMapRef.current.has(id)) return;

      const startTime = Date.now();

      const poll = async () => {
        const elapsed = Date.now() - startTime;
        const entry = pollingMapRef.current.get(id);

        if (!entry) return;

        // Stop after max duration
        if (elapsed > maxDuration) {
          stopPolling(id);
          return;
        }

        // Apply backoff if needed
        if (
          elapsed > backoffAfter &&
          entry.currentInterval === initialInterval
        ) {
          // Clear current interval and start with backoff interval
          clearInterval(entry.intervalId);
          const newIntervalId = setInterval(poll, backoffInterval);
          pollingMapRef.current.set(id, {
            ...entry,
            intervalId: newIntervalId,
            currentInterval: backoffInterval,
          });
        }

        // Rate limiting: don't poll if less than 1 second since last poll
        const timeSinceLastPoll = Date.now() - entry.lastPollTime;
        if (timeSinceLastPoll < 1000) {
          return;
        }

        try {
          const response = await getDocumentStatus(id);

          // Update last poll time
          const currentEntry = pollingMapRef.current.get(id);
          if (currentEntry) {
            pollingMapRef.current.set(id, {
              ...currentEntry,
              lastPollTime: Date.now(),
              consecutiveErrors: 0, // Reset error count on success
            });
          }

          if (response.error) {
            stopPolling(id);
            return;
          }

          const status = response.data!;
          onStatusUpdateRef.current(
            id,
            status.status,
            status.progress_message,
            status.error_message,
          );

          if (isTerminalStatus(status.status)) {
            stopPolling(id);
          }
        } catch (error) {
          // Handle rate limiting (429) and other errors
          const currentEntry = pollingMapRef.current.get(id);
          if (currentEntry) {
            const newErrorCount = currentEntry.consecutiveErrors + 1;

            // Stop polling after 3 consecutive errors
            if (newErrorCount >= 3) {
              stopPolling(id);
              return;
            }

            // Update error count and apply exponential backoff
            pollingMapRef.current.set(id, {
              ...currentEntry,
              consecutiveErrors: newErrorCount,
              lastPollTime: Date.now(),
            });

            // If it's a 429 error, wait longer before next poll
            if (error && (error as { status?: number }).status === 429) {
              clearInterval(currentEntry.intervalId);
              const backoffTime = Math.min(
                30000,
                1000 * Math.pow(2, newErrorCount),
              ); // Max 30 seconds
              const newIntervalId = setInterval(poll, backoffTime);
              pollingMapRef.current.set(id, {
                ...currentEntry,
                intervalId: newIntervalId,
                currentInterval: backoffTime,
              });
            }
          }
        }
      };

      // Start polling
      const intervalId = setInterval(poll, initialInterval);
      pollingMapRef.current.set(id, {
        startTime,
        intervalId,
        currentInterval: initialInterval,
        lastPollTime: Date.now(),
        consecutiveErrors: 0,
      });

      // Initial poll immediately
      poll();
    },
    [initialInterval, backoffInterval, backoffAfter, maxDuration, stopPolling],
  );

  useEffect(() => {
    if (!enabled) {
      // Stop all polling if disabled
      pollingMapRef.current.forEach((_, id) => stopPolling(id));
      return;
    }

    // Get non-terminal documents
    const nonTerminalDocs = documents.filter(
      (d) => !isTerminalStatus(d.status),
    );
    const nonTerminalIds = new Set(nonTerminalDocs.map((d) => d.id));

    // Start polling for new non-terminal docs
    nonTerminalDocs.forEach((doc) => startPolling(doc.id));

    // Stop polling for docs no longer in list or now terminal
    pollingMapRef.current.forEach((_, id) => {
      if (!nonTerminalIds.has(id)) {
        stopPolling(id);
      }
    });
  }, [documents, enabled, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    const pollingMap = pollingMapRef.current;
    return () => {
      pollingMap.forEach((entry) => {
        clearInterval(entry.intervalId);
      });
      pollingMap.clear();
    };
  }, []);
}
