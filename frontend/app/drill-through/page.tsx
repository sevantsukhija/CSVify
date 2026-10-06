"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Database,
  GitBranch,
  ShieldCheck,
  Wrench,
  FileWarning,
  Activity,
  Search,
} from "lucide-react";

type ProfileData = {
  filename?: string;
  rows?: number;
  columns?: number;
  missing_values?: number;
  duplicate_rows?: number;
  empty_values?: number;
  completeness?: number;
  uniqueness?: number;
  validity?: number;
  trust_score?: number;
  trust_gate?: string;
};

export default function DrillThroughPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<ProfileData | null>(null);

  const type = searchParams.get("type") || "trust";
  const value = searchParams.get("value") || "";
  const dataset = searchParams.get("dataset") || "";

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dataTrustProfile");

      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch {
      setProfile(null);
    }
  }, []);

  const filename = dataset || profile?.filename || "HousingDataset-Set-A.csv";

  const trustScore =
    profile?.trust_score !== undefined ? profile.trust_score : 100;

  const rows = profile?.rows ?? 545;
  const columns = profile?.columns ?? 13;
  const missing = profile?.missing_values ?? 0;
  const duplicates = profile?.duplicate_rows ?? 0;
  const empty = profile?.empty_values ?? 0;

  const completeness = profile?.completeness ?? 100;
  const uniqueness = profile?.uniqueness ?? 100;
  const validity = profile?.validity ?? 100;

  const issueCount = missing + duplicates + empty;

  const goBack = () => {
    router.push("/dashboard");
  };

  const goLineage = () => {
    router.push(
      `/data-lineage?dataset=${encodeURIComponent(filename)}&source=${encodeURIComponent(
        type
      )}`
    );
  };

  const goQuality = () => {
    router.push("/data-quality");
  };

  const handleFix = () => {
    alert(
      "Data repair started. The issue will be cleaned and revalidated before the dashboard is updated."
    );
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07111f]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-5">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={goBack}
                className="rounded-lg border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                  CSVify
                </p>

                <h1 className="mt-1 text-xl font-bold">
                  Drill-Through Investigation
                </h1>
              </div>
            </div>
          </div>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            Trusted Data Investigation
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-8 py-8">
        {/* BREADCRUMB */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <span>Dashboard</span>
          <ArrowRight size={14} />
          <span>Drill-Through</span>
          <ArrowRight size={14} />
          <span className="text-white">
            {type === "issue"
              ? "Quality Issue"
              : type === "lineage"
              ? "Data Lineage"
              : "Trust Score"}
          </span>
        </div>

        {/* TITLE */}
        <section className="mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-sm font-medium text-cyan-400">
                INVESTIGATION CONTEXT
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {type === "issue"
                  ? "Quality Issue Details"
                  : type === "lineage"
                  ? "Why should I trust this number?"
                  : "Trust Score Investigation"}
              </h2>

              <p className="mt-3 max-w-3xl text-slate-400">
                You drilled through from the dashboard to investigate the
                selected data point and understand exactly how the result was
                produced.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 md:block">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Selected Dataset
              </p>
              <p className="mt-1 font-semibold">{filename}</p>
            </div>
          </div>
        </section>

        {/* SELECTED VALUE */}
        <section className="mb-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center justify-between">
              <Database size={20} className="text-cyan-400" />
              <span className="text-xs text-slate-500">DATASET</span>
            </div>
            <p className="text-lg font-bold">{filename}</p>
            <p className="mt-1 text-sm text-slate-400">
              {rows.toLocaleString()} rows · {columns} columns
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center justify-between">
              <ShieldCheck size={20} className="text-emerald-400" />
              <span className="text-xs text-slate-500">TRUST SCORE</span>
            </div>
            <p className="text-3xl font-bold">{trustScore}/100</p>
            <p className="mt-1 text-sm text-emerald-400">
              {trustScore >= 90 ? "Passed" : "Requires attention"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center justify-between">
              <Activity size={20} className="text-blue-400" />
              <span className="text-xs text-slate-500">SELECTED VALUE</span>
            </div>
            <p className="text-2xl font-bold">{value || "Trust Score"}</p>
            <p className="mt-1 text-sm text-slate-400">
              Drill-through context
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center justify-between">
              {issueCount === 0 ? (
                <CheckCircle2 size={20} className="text-emerald-400" />
              ) : (
                <AlertTriangle size={20} className="text-amber-400" />
              )}

              <span className="text-xs text-slate-500">ISSUES</span>
            </div>

            <p className="text-3xl font-bold">{issueCount}</p>

            <p
              className={`mt-1 text-sm ${
                issueCount === 0 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {issueCount === 0 ? "No issues detected" : "Requires review"}
            </p>
          </div>
        </section>

        {/* QUALITY BREAKDOWN */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
              QUALITY BREAKDOWN
            </p>

            <h3 className="mt-1 text-xl font-bold">
              How the trust score was calculated
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Completeness",
                score: completeness,
                detail: `${missing} missing values`,
              },
              {
                name: "Uniqueness",
                score: uniqueness,
                detail: `${duplicates} duplicate records`,
              },
              {
                name: "Validity",
                score: validity,
                detail: `${empty} empty values`,
              },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-white/10 bg-[#0b1728] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-semibold">{item.name}</span>

                  <span
                    className={`font-bold ${
                      item.score >= 90
                        ? "text-emerald-400"
                        : item.score >= 70
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.score}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: `${Math.max(0, Math.min(100, item.score))}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ISSUE INVESTIGATION */}
        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-amber-400/10 p-3">
                <FileWarning className="text-amber-400" size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-400">
                  ISSUE INVESTIGATION
                </p>
                <h3 className="font-bold">Affected Data</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3">
                <span className="text-slate-400">Missing values</span>
                <span className="font-semibold">{missing}</span>
              </div>

              <div className="flex justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3">
                <span className="text-slate-400">Duplicate records</span>
                <span className="font-semibold">{duplicates}</span>
              </div>

              <div className="flex justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3">
                <span className="text-slate-400">Empty values</span>
                <span className="font-semibold">{empty}</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
              <div className="flex gap-3">
                <Search size={19} className="mt-0.5 text-cyan-400" />

                <div>
                  <p className="font-semibold">Investigation result</p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    The quality engine inspected the uploaded dataset and
                    calculated the current trust status from measurable data
                    quality checks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* REPAIR */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400/10 p-3">
                <Wrench className="text-emerald-400" size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-400">
                  FIX & REVALIDATE
                </p>
                <h3 className="font-bold">Repair the data issue</h3>
              </div>
            </div>

            <p className="leading-7 text-slate-400">
              Safe corrections can be applied before the dataset is allowed
              back into the trusted reporting layer. After correction, the
              quality engine runs the validation checks again.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={17} className="text-emerald-400" />
                Detect issue
              </div>

              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={17} className="text-emerald-400" />
                Apply safe correction
              </div>

              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={17} className="text-emerald-400" />
                Re-run quality tests
              </div>

              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={17} className="text-emerald-400" />
                Recalculate Trust Score
              </div>
            </div>

            <button
              onClick={handleFix}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-[#04110b] transition hover:bg-emerald-400"
            >
              <Wrench size={18} />
              Fix & Revalidate
            </button>
          </div>
        </section>

        {/* LINEAGE */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
                EXPLAINABLE LINEAGE
              </p>

              <h3 className="mt-1 text-xl font-bold">
                Where did this number come from?
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Trace the selected result from the original CSV to the final
                trusted dashboard.
              </p>
            </div>

            <GitBranch className="hidden text-cyan-400 md:block" size={28} />
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {[
              ["01", "RAW CSV", "Source"],
              ["02", "CLEAN", "Python + Pandas"],
              ["03", "VALIDATE", "Quality Engine"],
              ["04", "MODEL", "Star Schema"],
              ["05", "POWER BI", "Trusted KPI"],
            ].map(([number, title, subtitle], index) => (
              <div
                key={title}
                className="relative rounded-xl border border-white/10 bg-[#0b1728] p-5"
              >
                <p className="text-xs font-bold text-cyan-400">{number}</p>
                <p className="mt-3 font-bold">{title}</p>
                <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

                {index < 4 && (
                  <ArrowRight
                    size={16}
                    className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-slate-600 md:block"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={goLineage}
            className="mt-6 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
          >
            Open Full Data Lineage
            <ArrowRight size={17} />
          </button>
        </section>

        {/* ACTIONS */}
        <section className="grid gap-4 md:grid-cols-3">
          <button
            onClick={goQuality}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
          >
            <ShieldCheck className="mb-3 text-cyan-400" size={22} />
            <p className="font-semibold">View Quality Report</p>
            <p className="mt-1 text-sm text-slate-500">
              See all quality dimensions and validation results.
            </p>
          </button>

          <button
            onClick={goLineage}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
          >
            <GitBranch className="mb-3 text-cyan-400" size={22} />
            <p className="font-semibold">Trace Data Lineage</p>
            <p className="mt-1 text-sm text-slate-500">
              Understand how this KPI reached the dashboard.
            </p>
          </button>

          <button
            onClick={goBack}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
          >
            <ArrowLeft className="mb-3 text-cyan-400" size={22} />
            <p className="font-semibold">Back to Dashboard</p>
            <p className="mt-1 text-sm text-slate-500">
              Return to the Data Trust Control Center.
            </p>
          </button>
        </section>
      </div>
    </main>
  );
}