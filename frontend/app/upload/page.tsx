"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Database,
  Search,
  Loader2,
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isProfiling, setIsProfiling] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    setError("");
    setResult(null);

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV file only.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const startProfiling = async () => {
    if (!file) {
      setError("Please upload a CSV file first.");
      return;
    }

    setIsProfiling(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Profiling failed.");
      }

      // Save the real backend result so other pages can use it
      localStorage.setItem("dataTrustProfile", JSON.stringify(data));

      setResult(data);
    } catch (err: any) {
      setError(
        err.message ||
          "Could not connect to the Data Trust backend. Make sure the backend is running."
      );
    } finally {
      setIsProfiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#091525]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              DATA TRUST LAYER
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Upload Your Dataset
            </h1>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-8 py-10">
        {/* Pipeline */}
        <div className="mb-10 grid grid-cols-4 gap-4">
          <PipelineCard
            number="01"
            title="Upload"
            description="Add your raw CSV dataset"
            active
          />

          <PipelineCard
            number="02"
            title="Profile"
            description="Analyze dataset quality"
          />

          <PipelineCard
            number="03"
            title="Validate"
            description="Run quality checks"
          />

          <PipelineCard
            number="04"
            title="Trust"
            description="Calculate trust score"
          />
        </div>

        {/* Upload Area */}
        <section className="rounded-2xl border border-white/10 bg-[#0b1829] p-8 shadow-2xl">
          <div className="mb-7">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                <Upload size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Upload CSV Dataset
                </h2>

                <p className="text-sm text-gray-400">
                  Start the Data Trust profiling process.
                </p>
              </div>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="rounded-2xl border-2 border-dashed border-white/10 bg-[#081321] px-8 py-16 text-center transition hover:border-cyan-500/40"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <FileSpreadsheet size={30} />
            </div>

            <h3 className="text-lg font-semibold">
              Drag & Drop your CSV here
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              or choose a file from your computer
            </p>

            <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-[#04101c] transition hover:bg-cyan-400">
              <Upload size={17} />
              Choose CSV

              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>

            <p className="mt-4 text-xs text-gray-600">
              Supported format: CSV
            </p>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-cyan-500/10 p-3 text-cyan-400">
                    <FileSpreadsheet size={22} />
                  </div>

                  <div>
                    <p className="font-medium">{file.name}</p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <CheckCircle2
                  size={22}
                  className="text-emerald-400"
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              <AlertCircle size={19} />
              {error}
            </div>
          )}

          {/* Checks */}
          <div className="mt-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Quality Checks
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <CheckItem
                icon={<Search size={17} />}
                title="Missing Values"
                description="Detect incomplete records"
              />

              <CheckItem
                icon={<Database size={17} />}
                title="Duplicate Records"
                description="Find repeated rows"
              />

              <CheckItem
                icon={<FileSpreadsheet size={17} />}
                title="Data Types"
                description="Check column types"
              />

              <CheckItem
                icon={<AlertCircle size={17} />}
                title="Invalid Values"
                description="Detect empty or invalid values"
              />

              <CheckItem
                icon={<CheckCircle2 size={17} />}
                title="Consistency"
                description="Check dataset consistency"
              />

              <CheckItem
                icon={<ShieldCheck size={17} />}
                title="Trust Score"
                description="Calculate overall data trust"
              />
            </div>
          </div>

          {/* Start Profiling */}
          <button
            onClick={startProfiling}
            disabled={!file || isProfiling}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-[#04101c] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isProfiling ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Profiling Dataset...
              </>
            ) : (
              <>
                <Search size={19} />
                Start Data Profiling
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={15} />
            Dataset will not be trusted until validation is completed.
          </div>
        </section>

        {/* Results */}
        {result && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-[#0b1829] p-8">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  PROFILING COMPLETE
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Dataset Quality Report
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {result.filename}
                </p>
              </div>

              <div
                className={`rounded-xl px-5 py-3 text-center ${
                  result.trust_gate === "PASSED"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                <p className="text-xs uppercase tracking-wider">
                  Trust Gate
                </p>

                <p className="mt-1 text-lg font-bold">
                  {result.trust_gate}
                </p>
              </div>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <MetricCard
                title="Trust Score"
                value={`${result.trust_score}/100`}
              />

              <MetricCard
                title="Rows"
                value={result.rows.toLocaleString()}
              />

              <MetricCard
                title="Columns"
                value={result.columns.toString()}
              />

              <MetricCard
                title="Duplicates"
                value={result.duplicate_rows.toString()}
              />
            </div>

            {/* Quality Scores */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <QualityCard
                title="Completeness"
                value={result.completeness}
              />

              <QualityCard
                title="Uniqueness"
                value={result.uniqueness}
              />

              <QualityCard
                title="Validity"
                value={result.validity}
              />
            </div>

            {/* Issues */}
            <div className="mt-6 rounded-xl border border-white/10 bg-[#081321] p-5">
              <h3 className="font-semibold">
                Detected Issues
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <IssueRow
                  title="Missing Values"
                  value={result.missing_values}
                />

                <IssueRow
                  title="Duplicate Rows"
                  value={result.duplicate_rows}
                />

                <IssueRow
                  title="Empty Values"
                  value={result.empty_values}
                />

                <IssueRow
                  title="Trust Gate"
                  value={result.trust_gate}
                  text
                />
              </div>
            </div>

            {/* Data Types */}
            <div className="mt-6 rounded-xl border border-white/10 bg-[#081321] p-5">
              <h3 className="font-semibold">
                Column Data Types
              </h3>

              <div className="mt-4 space-y-2">
                {Object.entries(result.data_types).map(
                  ([column, type]) => (
                    <div
                      key={column}
                      className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3"
                    >
                      <span className="text-sm text-gray-300">
                        {column}
                      </span>

                      <span className="rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-400">
                        {String(type)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Continue to Data Quality */}
            <button
              onClick={() => router.push("/data-quality")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              <ShieldCheck size={19} />
              View Data Quality
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function PipelineCard({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        active
          ? "border-cyan-500/30 bg-cyan-500/5"
          : "border-white/10 bg-[#0b1829]"
      }`}
    >
      <div
        className={`mb-3 text-xs font-bold ${
          active ? "text-cyan-400" : "text-gray-600"
        }`}
      >
        {number}
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

function CheckItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] p-4">
      <div className="text-cyan-400">{icon}</div>

      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#081321] p-5">
      <p className="text-xs uppercase tracking-wider text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

function QualityCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#081321] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          {title}
        </span>

        <span className="font-semibold text-emerald-400">
          {value}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function IssueRow({
  title,
  value,
  text = false,
}: {
  title: string;
  value: number | string;
  text?: boolean;
}) {
  const isGood =
    text && value === "PASSED"
      ? true
      : !text && Number(value) === 0;

  return (
    <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-gray-400">
        {title}
      </span>

      <span
        className={`text-sm font-semibold ${
          isGood ? "text-emerald-400" : "text-orange-400"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}