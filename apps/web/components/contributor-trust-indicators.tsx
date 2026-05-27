"use client";

import { CheckCircle2, Clock, ShieldOff, AlertTriangle, Ban } from "lucide-react";

export type ContributorTrustStatus =
  | "verified"
  | "previously_paid"
  | "appeal_active"
  | "restricted"
  | "unverified";

export interface ContributorTrustInfo {
  login: string;
  status: ContributorTrustStatus;
  note?: string;
}

const STATUS_CONFIG: Record<
  ContributorTrustStatus,
  { icon: React.ReactNode; label: string; colorClass: string }
> = {
  verified: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: "Verified",
    colorClass: "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  previously_paid: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: "Previously paid",
    colorClass: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  appeal_active: {
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "Appeal active",
    colorClass: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  restricted: {
    icon: <Ban className="h-3.5 w-3.5" />,
    label: "Restricted",
    colorClass: "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
  unverified: {
    icon: <ShieldOff className="h-3.5 w-3.5" />,
    label: "Unverified",
    colorClass: "text-muted-foreground bg-muted border-border",
  },
};

interface ContributorTrustBadgeProps {
  status: ContributorTrustStatus;
  className?: string;
}

/**
 * FE-213: Compact trust/eligibility badge for use in assignment and review surfaces.
 */
export function ContributorTrustBadge({ status, className = "" }: ContributorTrustBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${config.colorClass} ${className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

interface ContributorTrustCardProps {
  info: ContributorTrustInfo;
  className?: string;
}

/**
 * FE-213: Contributor trust card for maintainer assignment and review views.
 * Informative without being punitive or noisy.
 */
export function ContributorTrustCard({ info, className = "" }: ContributorTrustCardProps) {
  const config = STATUS_CONFIG[info.status];
  const isActionable = info.status === "restricted" || info.status === "appeal_active";

  return (
    <div className={`rounded-md border bg-card p-3 space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium">@{info.login}</span>
        <ContributorTrustBadge status={info.status} />
      </div>
      {info.note && (
        <p className="text-xs text-muted-foreground">{info.note}</p>
      )}
      {isActionable && (
        <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          {info.status === "restricted"
            ? "This contributor cannot receive new assignments."
            : "An active appeal may affect assignment eligibility."}
        </p>
      )}
    </div>
  );
}
