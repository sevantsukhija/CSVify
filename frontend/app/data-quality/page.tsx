"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Database,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
} from "lucide-react";

type QualityData = {
  filename: string;
  rows: number;
  columns: number;
  missing_values: number;
  duplicate_rows: number;
  empty_values: number;
  completeness: number;
  uniqueness: number;
  validity: number;
  trust_score: number;
  trust_gate: string;
  data_types?: Record<string, string>;
};

export default function DataQualityPage() {
  const [data, setData] = useState<QualityData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("dataTrustProfile");

    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch {
        setData(null);
      }
    }
  }, []);

  // Demo fallback until the upload page saves the latest profile
  const quality: QualityData = data || {
    filename: "HousingDataset-Set-A.csv",
    rows: 545,
    columns: 13,
    missing_values: 0,
    duplicate_rows: 0,
    empty_values: 0,
    completeness: 100,
    uniqueness: 100,
    validity: 100,
    trust_score: 100,
    trust_gate: "PASSED",
    data_types: {
      price: "int64",
      area: "int64",
      bedrooms: "int64",
      bathrooms: "float64",
      stories: "int64",
      mainroad: "object",
      guestroom: "object",
      basement: "object",
      hotwaterheating: "object",
      airconditioning: "object",
      parking: "int64",
      prefarea: "object",
      furnishingstatus: "object",
    },
  };

  const passed = quality.trust_gate === "PASSED";

  return (
    <main className="min-h-screen bg-[#071321] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#091827]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-5">
          <div>
            <div className="text-xs font-bold tracking-[0.35em] text-cyan-400">
              DATA TRUST LAYER
            </div>

            <h1 className="mt-1 text-2xl font-bold">
              Data Quality Center
            </h1>
          </div>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#101e2d] px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-[#16283a]"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-8 py-8">
        {/* Dataset heading */}
        <section className="mb-7">
          <div className="flex items-center gap-3">
            <Database className="text-cyan-400" size={25} />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Quality Analysis
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {quality.filename}
              </h2>
            </div>
          </div>
        </section>

        {/* Top cards */}
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#0b1827] p-6">
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Trust Score
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-bold">
                {quality.trust_score}
              </span>

              <span className="mb-1 text-slate-500">/100</span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{
                  width: `${Math.min(100, quality.trust_score)}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1827] p-6">
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Dataset Rows
            </p>

            <p className="mt-3 text-4xl font-bold">
              {quality.rows.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Records analyzed
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1827] p-6">
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Columns
            </p>

            <p className="mt-3 text-4xl font-bold">
              {quality.columns}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Fields detected
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1827] p-6">
            <p className="text-sm uppercase tracking-wider text-slate-500">
              Trust Gate
            </p>

            <div className="mt-4 flex items-center gap-3">
              {passed ? (
                <CheckCircle2
                  size={30}
                  className="text-emerald-400"
                />
              ) : (
                <XCircle
                  size={30}
                  className="text-red-400"
                />
              )}

              <span
                className={`text-2xl font-bold ${
                  passed
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {quality.trust_gate}
              </span>
            </div>
          </div>
        </section>

        {/* Quality dimensions */}
        <section className="mt-7">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="text-cyan-400" size={21} />

            <h2 className="text-xl font-bold">
              Quality Dimensions
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <QualityCard
              title="Completeness"
              value={quality.completeness}
              description="Checks missing values"
            />

            <QualityCard
              title="Uniqueness"
              value={quality.uniqueness}
              description="Checks duplicate records"
            />

            <QualityCard
              title="Validity"
              value={quality.validity}
              description="Checks empty or invalid values"
            />
          </div>
        </section>

        {/* Detected issues */}
        <section className="mt-7 rounded-2xl border border-white/10 bg-[#0b1827] p-6">
          <div className="mb-6 flex items-center gap-3">
            <AlertTriangle className="text-cyan-400" size={22} />

            <div>
              <h2 className="text-xl font-bold">
                Detected Issues
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Problems detected during automated validation
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <IssueCard
              title="Missing Values"
              value={quality.missing_values}
            />

            <IssueCard
              title="Duplicate Rows"
              value={quality.duplicate_rows}
            />

            <IssueCard
              title="Empty Values"
              value={quality.empty_values}
            />
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
            <CheckCircle2
              className="text-emerald-400"
              size={22}
            />

            <div>
              <p className="font-semibold text-emerald-400">
                Dataset Quality Passed
              </p>

              <p className="text-sm text-slate-400">
                No critical quality issues were detected.
              </p>
            </div>
          </div>
        </section>

        {/* Data types */}
        <section className="mt-7 rounded-2xl border border-white/10 bg-[#0b1827] p-6">
          <div className="mb-6 flex items-center gap-3">
            <FileCheck2 className="text-cyan-400" size={22} />

            <div>
              <h2 className="text-xl font-bold">
                Detected Data Types
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Automatically detected column types
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {quality.data_types &&
              Object.entries(quality.data_types).map(
                ([column, type]) => (
                  <div
                    key={column}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-[#101e2d] px-4 py-3"
                  >
                    <span className="truncate pr-4 text-sm text-slate-300">
                      {column}
                    </span>

                    <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-xs font-semibold text-cyan-400">
                      {type}
                    </span>
                  </div>
                )
              )}
          </div>
        </section>

        {/* Trust decision */}
        <section className="mt-7 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-[#0b1d2c] to-[#0b1827] p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Final Decision
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {passed
                  ? "Dataset is trusted and ready for Power BI"
                  : "Dataset is blocked until quality issues are fixed"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                The Trust Gate prevents unverified data from moving
                into the reporting layer.
              </p>
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl px-5 py-4 ${
                passed
                  ? "bg-emerald-400/10"
                  : "bg-red-400/10"
              }`}
            >
              {passed ? (
                <CheckCircle2
                  size={27}
                  className="text-emerald-400"
                />
              ) : (
                <XCircle
                  size={27}
                  className="text-red-400"
                />
              )}

              <span
                className={`font-bold ${
                  passed
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {quality.trust_gate}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function QualityCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1827] p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>

        <span className="text-xl font-bold text-emerald-400">
          {value}%
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function IssueCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  const isGood = value === 0;

  return (
    <div className="rounded-xl border border-white/5 bg-[#101e2d] p-5">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">{title}</span>

        {isGood ? (
          <CheckCircle2
            size={19}
            className="text-emerald-400"
          />
        ) : (
          <XCircle
            size={19}
            className="text-red-400"
          />
        )}
      </div>

      <p
        className={`mt-3 text-3xl font-bold ${
          isGood ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}