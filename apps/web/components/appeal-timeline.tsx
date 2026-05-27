"use client";

import { CheckCircle2, Clock, Circle, AlertCircle, Loader2 } from "lucide-react";

export type AppealStage =
  | "submitted"
  | "intake"
  | "ai_review"
  | "human_review"
  | "decided";

export type AppealOutcome = "approved" | "denied" | "escalated" | null;

export interface AppealTimelineEvent {
  stage: AppealStage;
  label: string;
  timestamp?: string;
  note?: string;
  status: "complete" | "active" | "pending" | "error";
}

export interface AppealCase {
  id: string;
  issueNumber: string;
  issueTitle: string;
  submittedAt: string;
  currentStage: AppealStage;
  outcome: AppealOutcome;
  timeline: AppealTimelineEvent[];
}

interface AppealTimelineProps {
  appeal: AppealCase;
  className?: string;
}

function StageIcon({ status }: { status: AppealTimelineEvent["status"] }) {
  if (status === "complete")
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === "active")
    return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
  if (status === "error")
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  return <Circle className="h-5 w-5 text-muted-foreground/40" />;
}

const OUTCOME_CONFIG: Record<
  NonNullable<AppealOutcome>,
  { label: string; colorClass: string }
> = {
  approved: {
    label: "Appeal approved",
    colorClass: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  },
  denied: {
    label: "Appeal denied",
    colorClass: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  },
  escalated: {
    label: "Escalated for manual review",
    colorClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  },
};

/**
 * FE-208: Appeal timeline and case-status center.
 * Shows intake, AI review, human review, and final outcome stages.
 */
export function AppealTimeline({ appeal, className = "" }: AppealTimelineProps) {
  return (
    <div className={`rounded-lg border bg-card p-5 space-y-4 ${className}`}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">Appeal #{appeal.id}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Issue #{appeal.issueNumber} — {appeal.issueTitle}
            </p>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            Submitted {appeal.submittedAt}
          </span>
        </div>
      </div>

      {/* Outcome banner */}
      {appeal.outcome && (
        <div
          className={`rounded-md border px-3 py-2 text-sm font-medium ${OUTCOME_CONFIG[appeal.outcome].colorClass}`}
        >
          {OUTCOME_CONFIG[appeal.outcome].label}
        </div>
      )}

      {/* Timeline */}
      <ol className="relative space-y-0">
        {appeal.timeline.map((event, i) => {
          const isLast = i === appeal.timeline.length - 1;
          return (
            <li key={event.stage} className="flex gap-3">
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <StageIcon status={event.status} />
                {!isLast && (
                  <div
                    className={`w-px flex-1 my-1 ${
                      event.status === "complete"
                        ? "bg-green-300 dark:bg-green-700"
                        : "bg-border"
                    }`}
                    style={{ minHeight: "1.5rem" }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={`text-sm font-medium ${
                      event.status === "pending"
                        ? "text-muted-foreground"
                        : ""
                    }`}
                  >
                    {event.label}
                  </p>
                  {event.timestamp && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {event.timestamp}
                    </span>
                  )}
                </div>
                {event.note && (
                  <p className="text-xs text-muted-foreground mt-0.5">{event.note}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Pending note */}
      {!appeal.outcome && (
        <p className="text-xs text-muted-foreground border-t pt-3">
          Processing is automatic. You will be notified when a decision is reached.
        </p>
      )}
    </div>
  );
}

/**
 * FE-208: Compact case-status badge for use in lists and cards.
 */
export function AppealStatusBadge({
  stage,
  outcome,
}: {
  stage: AppealStage;
  outcome: AppealOutcome;
}) {
  if (outcome) {
    const config = OUTCOME_CONFIG[outcome];
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${config.colorClass}`}
      >
        {config.label}
      </span>
    );
  }

  const stageLabels: Record<AppealStage, string> = {
    submitted: "Submitted",
    intake: "In intake",
    ai_review: "AI review",
    human_review: "Human review",
    decided: "Decided",
  };

  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 px-2 py-0.5 text-xs font-medium">
      <Clock className="h-3 w-3" />
      {stageLabels[stage]}
    </span>
  );
}
