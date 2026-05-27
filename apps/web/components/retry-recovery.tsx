"use client";

import { RefreshCw, WifiOff, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";

export type RetryStatus = "idle" | "retrying" | "failed" | "success";

interface RetryBoundaryProps {
  error: Error | null;
  onRetry: () => Promise<void> | void;
  children: React.ReactNode;
  label?: string;
  className?: string;
}

/**
 * FE-216: Retry boundary for transient API failures in Wave workflows.
 * Wraps content and shows a retry prompt on error without losing context.
 */
export function RetryBoundary({
  error,
  onRetry,
  children,
  label = "Reload",
  className = "",
}: RetryBoundaryProps) {
  const [status, setStatus] = useState<RetryStatus>("idle");

  const handleRetry = useCallback(async () => {
    setStatus("retrying");
    try {
      await onRetry();
      setStatus("success");
    } catch {
      setStatus("failed");
    }
  }, [onRetry]);

  if (!error) return <>{children}</>;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-lg border bg-card p-6 text-center ${className}`}
    >
      <AlertCircle className="h-8 w-8 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          {error.message || "A transient error occurred. Your progress has not been lost."}
        </p>
      </div>
      <button
        type="button"
        onClick={handleRetry}
        disabled={status === "retrying"}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw className={`h-4 w-4 ${status === "retrying" ? "animate-spin" : ""}`} />
        {status === "retrying" ? "Retrying…" : label}
      </button>
      {status === "failed" && (
        <p className="text-xs text-destructive">Retry failed. Please try again later.</p>
      )}
    </div>
  );
}

interface OfflineBannerProps {
  isOffline: boolean;
  className?: string;
}

/**
 * FE-216: Offline banner shown when the browser loses connectivity.
 */
export function OfflineBanner({ isOffline, className = "" }: OfflineBannerProps) {
  if (!isOffline) return null;
  return (
    <div
      role="alert"
      className={`flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 ${className}`}
    >
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>
        You are offline. Read-only mode is active. Changes will resume when connectivity is restored.
      </span>
    </div>
  );
}

interface RetryableActionProps {
  onAction: () => Promise<void>;
  label: string;
  disabled?: boolean;
  className?: string;
}

/**
 * FE-216: Button that handles its own retry state for idempotent Wave actions.
 */
export function RetryableAction({
  onAction,
  label,
  disabled,
  className = "",
}: RetryableActionProps) {
  const [status, setStatus] = useState<RetryStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleClick() {
    setStatus("retrying");
    setErrorMsg(null);
    try {
      await onAction();
      setStatus("success");
    } catch (err) {
      setStatus("failed");
      setErrorMsg(err instanceof Error ? err.message : "Action failed.");
    }
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || status === "retrying"}
        className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${status === "retrying" ? "animate-spin" : ""}`} />
        {status === "retrying" ? "Working…" : label}
      </button>
      {status === "failed" && errorMsg && (
        <p className="text-xs text-destructive">{errorMsg}</p>
      )}
    </div>
  );
}
