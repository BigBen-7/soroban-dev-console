"use client";

import { VerificationChecklist, type VerificationState } from "@/components/verification-checklist";

// Placeholder state — in production this would come from the API/store
const MOCK_STATE: VerificationState = {
  identity: "pending",
  wallet: "complete",
  eligibility: "pending",
  terms: "pending",
};

export default function VerificationPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Contributor verification</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete the steps below before claiming Wave 5 issues.
        </p>
      </div>
      <VerificationChecklist state={MOCK_STATE} />
    </div>
  );
}
