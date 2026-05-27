"use client";

import { AppealTimeline, type AppealCase } from "@/components/appeal-timeline";

// Placeholder — in production fetched from BE-208 appeal API
const MOCK_APPEAL: AppealCase = {
  id: "APL-001",
  issueNumber: "42",
  issueTitle: "Fix contract storage serialization",
  submittedAt: "May 26, 2026",
  currentStage: "ai_review",
  outcome: null,
  timeline: [
    {
      stage: "submitted",
      label: "Appeal submitted",
      timestamp: "May 26, 10:02",
      status: "complete",
    },
    {
      stage: "intake",
      label: "Intake review",
      timestamp: "May 26, 10:05",
      note: "Evidence validated and queued for AI analysis.",
      status: "complete",
    },
    {
      stage: "ai_review",
      label: "AI analysis",
      note: "Reviewing submitted evidence against review history.",
      status: "active",
    },
    {
      stage: "human_review",
      label: "Human review",
      status: "pending",
    },
    {
      stage: "decided",
      label: "Decision",
      status: "pending",
    },
  ],
};

export default function AppealStatusPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Appeal status</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track the progress of your appeal through intake, review, and decision.
        </p>
      </div>
      <AppealTimeline appeal={MOCK_APPEAL} />
    </div>
  );
}
