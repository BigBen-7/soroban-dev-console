"use client";

import { AlertTriangle, WifiOff, Server, RefreshCw } from "lucide-react";

export type HealthScope = "budget" | "verification" | "appeals" | "review";
export type HealthStatus = "healthy" | "degraded" | "down";

export interface ServiceHealth {
  scope: HealthScope;
  status: HealthStatus;
  message?: string;
  isLocal?: boolean;
  isPlatform?: boolean;
}

interface WaveHealthBannersProps {
  services: ServiceHealth[];
  onRetry?: (scope: HealthScope) => void;
  className?: string;
}

const SCOPE_LABELS: Record<HealthScope, string> = {
  budget: "Budget service",
  verification: "Verification service",
  appeals: "Appeals API",
  review: "Review API",
};

const STATUS_CONFIG: Record<Exclude<HealthStatus, "healthy">, {
  icon: React.ReactNode;
  colorClass: string;
  defaultMessage: string;
}> = {
  degraded: {
    icon: <AlertTriangle className="h-4 w-4 shrink-0" />,
    colorClass: "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    defaultMessage: "Service is degraded. Some actions may be slow or unavailable.",
  },
  down: {
    icon: <WifiOff className="h-4 w-4 shrink-0" />,
    colorClass: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    defaultMessage: "Service is unavailable. Actions are disabled until restored.",
  },
};

/**
 * FE-215: Frontend health and degradation banners for Wave workflows.
 * Distinguishes local, backend, and platform-wide failures.
 */
export function WaveHealthBanners({
  services,
  onRetry,
  className = "",
}: WaveHealthBannersProps) {
  const unhealthy = services.filter((s) => s.status !== "healthy");
  if (!unhealthy.length) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {unhealthy.map((service) => {
        const config = STATUS_CONFIG[service.status as Exclude<HealthStatus, "healthy">];
        const origin = service.isPlatform
          ? "Platform-wide"
          : service.isLocal
          ? "Local"
          : "Backend";

        return (
          <div
            key={service.scope}
            role="alert"
            className={`flex items-center justify-between gap-3 rounded-md border px-4 py-2.5 text-sm ${config.colorClass}`}
          >
            <div className="flex items-start gap-2">
              {config.icon}
              <div className="space-y-0.5">
                <p className="font-medium text-xs">
                  {SCOPE_LABELS[service.scope]} — {service.status === "degraded" ? "Degraded" : "Down"}
                  <span className="ml-1.5 opacity-60 font-normal">({origin})</span>
                </p>
                <p className="text-xs opacity-80">
                  {service.message ?? config.defaultMessage}
                </p>
              </div>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(service.scope)}
                className="shrink-0 flex items-center gap-1 text-xs underline underline-offset-2 hover:no-underline"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * FE-215: Compact service status indicator for use in headers or sidebars.
 */
export function ServiceStatusDot({ status }: { status: HealthStatus }) {
  const colorMap: Record<HealthStatus, string> = {
    healthy: "bg-green-500",
    degraded: "bg-yellow-400",
    down: "bg-red-500",
  };
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colorMap[status]}`}
      title={status}
    />
  );
}
