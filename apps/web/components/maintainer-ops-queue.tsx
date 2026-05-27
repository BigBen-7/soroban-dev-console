"use client";

import { Clock, ShieldAlert, GitPullRequest, CheckCircle2, AlertTriangle } from "lucide-react";

export type QueueItemType = "review_backlog" | "verification_exception" | "flagged_claim" | "appeal_followup";

export interface OpsQueueItem {
  id: string;
  type: QueueItemType;
  title: string;
  subtitle?: string;
  priority: "high" | "medium" | "low";
  dueLabel?: string;
  href?: string;
}

interface MaintainerOpsQueueProps {
  items: OpsQueueItem[];
  loading?: boolean;
  error?: string;
  className?: string;
}

const TYPE_CONFIG: Record<QueueItemType, { icon: React.ReactNode; label: string }> = {
  review_backlog: { icon: <GitPullRequest className="h-3.5 w-3.5" />, label: "Review" },
  verification_exception: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Verification" },
  flagged_claim: { icon: <ShieldAlert className="h-3.5 w-3.5" />, label: "Flagged claim" },
  appeal_followup: { icon: <Clock className="h-3.5 w-3.5" />, label: "Appeal" },
};

const PRIORITY_COLOR: Record<OpsQueueItem["priority"], string> = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-muted-foreground",
};

/**
 * FE-214: Maintainer operations queue for fairness and integrity triage.
 * Consolidates review backlog, verification exceptions, flagged claims, and appeal follow-up.
 */
export function MaintainerOpsQueue({
  items,
  loading,
  error,
  className = "",
}: MaintainerOpsQueueProps) {
  if (loading) {
    return (
      <div className={`rounded-lg border bg-card p-4 animate-pulse space-y-3 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="h-2 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-sm text-destructive rounded-lg border bg-card p-4 ${className}`}>
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={`rounded-lg border bg-card p-4 text-sm text-muted-foreground ${className}`}>
        Queue is clear. No pending items.
      </div>
    );
  }

  return (
    <div className={`rounded-lg border bg-card divide-y ${className}`}>
      <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Operations queue</h2>
        <span className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>
      {items.map((item) => {
        const typeConfig = TYPE_CONFIG[item.type];
        const row = (
          <div className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
            <span className={`mt-0.5 shrink-0 ${PRIORITY_COLOR[item.priority]}`}>
              {typeConfig.icon}
            </span>
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-xs font-medium truncate">{item.title}</p>
              {item.subtitle && (
                <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
              )}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{typeConfig.label}</span>
                {item.dueLabel && (
                  <>
                    <span>·</span>
                    <span className={item.priority === "high" ? "text-red-500 font-medium" : ""}>
                      {item.dueLabel}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );

        return item.href ? (
          <a key={item.id} href={item.href} className="block">
            {row}
          </a>
        ) : (
          <div key={item.id}>{row}</div>
        );
      })}
    </div>
  );
}
