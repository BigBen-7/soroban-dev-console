"use client";

import { CheckCircle2, Circle, AlertCircle, ExternalLink } from "lucide-react";

export type VerificationStep =
  | "identity"
  | "wallet"
  | "eligibility"
  | "terms";

export type VerificationStatus = "complete" | "pending" | "blocked";

export interface VerificationState {
  identity: VerificationStatus;
  wallet: VerificationStatus;
  eligibility: VerificationStatus;
  terms: VerificationStatus;
}

interface StepConfig {
  label: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

const STEPS: Record<VerificationStep, StepConfig> = {
  identity: {
    label: "Identity verification (KYC)",
    description: "Complete identity verification to participate in Wave rewards.",
    actionLabel: "Start verification",
    actionHref: "/settings#kyc",
  },
  wallet: {
    label: "Connect a payout wallet",
    description: "Link a Stellar wallet to receive point payouts.",
    actionLabel: "Connect wallet",
    actionHref: "/settings#wallet",
  },
  eligibility: {
    label: "Eligibility check",
    description: "Confirm your account meets Wave 5 contribution requirements.",
    actionLabel: "Check eligibility",
    actionHref: "/settings#eligibility",
  },
  terms: {
    label: "Accept Wave 5 terms",
    description: "Review and accept the updated contributor terms for this wave.",
    actionLabel: "Review terms",
    actionHref: "/settings#terms",
  },
};

const ORDERED_STEPS: VerificationStep[] = [
  "identity",
  "wallet",
  "eligibility",
  "terms",
];

interface VerificationChecklistProps {
  state: VerificationState;
  className?: string;
}

function StepIcon({ status }: { status: VerificationStatus }) {
  if (status === "complete")
    return <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />;
  if (status === "blocked")
    return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />;
  return <Circle className="h-5 w-5 text-muted-foreground shrink-0" />;
}

/**
 * FE-205: Contributor verification onboarding checklist.
 * Shows KYC, wallet, eligibility, and terms steps before Wave issue claiming.
 */
export function VerificationChecklist({
  state,
  className = "",
}: VerificationChecklistProps) {
  const allComplete = ORDERED_STEPS.every((s) => state[s] === "complete");

  return (
    <div className={`rounded-lg border bg-card p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Verification checklist</h2>
        {allComplete && (
          <span className="text-xs text-green-600 font-medium">All complete</span>
        )}
      </div>

      <ol className="space-y-3">
        {ORDERED_STEPS.map((step) => {
          const status = state[step];
          const config = STEPS[step];
          const isActionable = status !== "complete";

          return (
            <li key={step} className="flex items-start gap-3">
              <StepIcon status={status} />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    status === "complete" ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {config.label}
                </p>
                {status !== "complete" && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {config.description}
                  </p>
                )}
                {isActionable && config.actionLabel && config.actionHref && (
                  <a
                    href={config.actionHref}
                    className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2 mt-1 hover:no-underline"
                  >
                    {config.actionLabel}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {!allComplete && (
        <p className="text-xs text-muted-foreground border-t pt-3">
          Complete all steps above to unlock Wave 5 issue claiming and rewards.
        </p>
      )}
    </div>
  );
}
