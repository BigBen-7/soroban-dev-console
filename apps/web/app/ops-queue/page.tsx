"use client";

import { MaintainerOpsQueue, type OpsQueueItem } from "@/components/maintainer-ops-queue";
import { WaveHealthBanners, type ServiceHealth } from "@/components/wave-health-banners";
import { ContributorTrustCard, type ContributorTrustInfo } from "@/components/contributor-trust-indicators";

const MOCK_QUEUE: OpsQueueItem[] = [
  {
    id: "1",
    type: "review_backlog",
    title: "Issue #42 — Fix contract storage serialization",
    subtitle: "Awaiting maintainer review",
    priority: "high",
    dueLabel: "Due in 3h",
    href: "/review",
  },
  {
    id: "2",
    type: "flagged_claim",
    title: "Issue #38 — Add RPC failover logic",
    subtitle: "Medium risk flag detected",
    priority: "medium",
    dueLabel: "Due in 12h",
    href: "/review",
  },
  {
    id: "3",
    type: "verification_exception",
    title: "Contributor @dev-user — Verification exception",
    subtitle: "Manual review required",
    priority: "medium",
    href: "/verification",
  },
  {
    id: "4",
    type: "appeal_followup",
    title: "Appeal APL-002 — Awaiting human review",
    subtitle: "AI analysis complete",
    priority: "low",
    href: "/appeals/status",
  },
];

const MOCK_HEALTH: ServiceHealth[] = [
  {
    scope: "verification",
    status: "degraded",
    message: "Verification API is slow. Some checks may be delayed.",
  },
];

const MOCK_CONTRIBUTORS: ContributorTrustInfo[] = [
  { login: "dev-user", status: "appeal_active", note: "Active appeal on issue #38." },
  { login: "contributor-b", status: "verified" },
];

export default function OpsQueuePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Maintainer operations queue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review backlog, verification exceptions, flagged claims, and appeal follow-up.
        </p>
      </div>
      <WaveHealthBanners services={MOCK_HEALTH} />
      <MaintainerOpsQueue items={MOCK_QUEUE} />
      <div>
        <h2 className="text-sm font-semibold mb-3">Contributor trust signals</h2>
        <div className="space-y-2">
          {MOCK_CONTRIBUTORS.map((c) => (
            <ContributorTrustCard key={c.login} info={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
