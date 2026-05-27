"use client";

import { useState } from "react";
import { FileText, GitPullRequest, MessageSquare, Code2, Send, AlertCircle } from "lucide-react";

export type AppealEvidenceType = "issue" | "pr" | "review" | "code";

export interface AppealEvidence {
  type: AppealEvidenceType;
  url: string;
  description: string;
}

export interface AppealSubmission {
  issueNumber: string;
  summary: string;
  evidence: AppealEvidence[];
  additionalContext: string;
}

interface AppealWorkspaceProps {
  onSubmit: (submission: AppealSubmission) => Promise<void>;
  className?: string;
}

const EVIDENCE_ICONS: Record<AppealEvidenceType, React.ReactNode> = {
  issue: <FileText className="h-4 w-4" />,
  pr: <GitPullRequest className="h-4 w-4" />,
  review: <MessageSquare className="h-4 w-4" />,
  code: <Code2 className="h-4 w-4" />,
};

const EVIDENCE_LABELS: Record<AppealEvidenceType, string> = {
  issue: "Issue",
  pr: "Pull Request",
  review: "Review comment",
  code: "Code change",
};

const EMPTY_EVIDENCE: AppealEvidence = { type: "issue", url: "", description: "" };

/**
 * FE-207: Appeal submission workspace with structured evidence capture.
 * Collects issue, PR, review, and code context before the AI appeal pipeline runs.
 */
export function AppealWorkspace({ onSubmit, className = "" }: AppealWorkspaceProps) {
  const [issueNumber, setIssueNumber] = useState("");
  const [summary, setSummary] = useState("");
  const [evidence, setEvidence] = useState<AppealEvidence[]>([{ ...EMPTY_EVIDENCE }]);
  const [additionalContext, setAdditionalContext] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addEvidence() {
    setEvidence((prev) => [...prev, { ...EMPTY_EVIDENCE }]);
  }

  function removeEvidence(index: number) {
    setEvidence((prev) => prev.filter((_, i) => i !== index));
  }

  function updateEvidence(index: number, patch: Partial<AppealEvidence>) {
    setEvidence((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...patch } : e))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validEvidence = evidence.filter((ev) => ev.url.trim());
    if (!issueNumber.trim() || !summary.trim()) {
      setError("Issue number and summary are required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        issueNumber: issueNumber.trim(),
        summary: summary.trim(),
        evidence: validEvidence,
        additionalContext: additionalContext.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 rounded-lg border bg-card p-5 ${className}`}
    >
      <div>
        <h2 className="text-sm font-semibold">Submit an appeal</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Provide structured context so your appeal can be reviewed accurately.
        </p>
      </div>

      {/* Issue number */}
      <div className="space-y-1">
        <label className="text-xs font-medium" htmlFor="appeal-issue">
          Issue number <span className="text-red-500">*</span>
        </label>
        <input
          id="appeal-issue"
          type="text"
          placeholder="#1234"
          value={issueNumber}
          onChange={(e) => setIssueNumber(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      {/* Summary */}
      <div className="space-y-1">
        <label className="text-xs font-medium" htmlFor="appeal-summary">
          Appeal summary <span className="text-red-500">*</span>
        </label>
        <textarea
          id="appeal-summary"
          rows={3}
          placeholder="Briefly describe why you are appealing this decision..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          required
        />
      </div>

      {/* Evidence */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Supporting evidence</span>
          <button
            type="button"
            onClick={addEvidence}
            className="text-xs text-primary underline underline-offset-2 hover:no-underline"
          >
            + Add item
          </button>
        </div>

        {evidence.map((ev, i) => (
          <div key={i} className="rounded-md border p-3 space-y-2 bg-muted/30">
            <div className="flex items-center gap-2">
              <select
                value={ev.type}
                onChange={(e) =>
                  updateEvidence(i, { type: e.target.value as AppealEvidenceType })
                }
                className="rounded border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                aria-label="Evidence type"
              >
                {(Object.keys(EVIDENCE_LABELS) as AppealEvidenceType[]).map((t) => (
                  <option key={t} value={t}>
                    {EVIDENCE_LABELS[t]}
                  </option>
                ))}
              </select>
              <span className="text-muted-foreground">
                {EVIDENCE_ICONS[ev.type]}
              </span>
              {evidence.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEvidence(i)}
                  className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={ev.url}
              onChange={(e) => updateEvidence(i, { url: e.target.value })}
              className="w-full rounded border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              aria-label="Evidence URL"
            />
            <input
              type="text"
              placeholder="Brief description of this evidence..."
              value={ev.description}
              onChange={(e) => updateEvidence(i, { description: e.target.value })}
              className="w-full rounded border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              aria-label="Evidence description"
            />
          </div>
        ))}
      </div>

      {/* Additional context */}
      <div className="space-y-1">
        <label className="text-xs font-medium" htmlFor="appeal-context">
          Additional context
        </label>
        <textarea
          id="appeal-context"
          rows={2}
          placeholder="Any other context that may help reviewers..."
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Submitting…" : "Submit appeal"}
      </button>
    </form>
  );
}
