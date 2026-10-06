"use client";

import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  CheckCircle2,
  Database,
  FileCheck2,
  GitBranch,
  Layers3,
  BarChart3,
  ShieldCheck,
  Search,
  ChevronRight,
  Clock3,
} from "lucide-react";

const lineageSteps = [
  {
    number: "01",
    title: "Source Dataset",
    subtitle: "Raw CSV",
    description: "Original uploaded dataset",
    detail: "sales_data.csv",
    icon: Database,
    status: "Received",
  },
  {
    number: "02",
    title: "Data Cleaning",
    subtitle: "Python + Pandas",
    description: "Missing values, duplicates and formats checked",
    detail: "Cleaning pipeline completed",
    icon: GitBranch,
    status: "Completed",
  },
  {
    number: "03",
    title: "Quality Validation",
    subtitle: "Quality Engine",
    description: "18 automated data quality checks",
    detail: "18 / 18 checks passed",
    icon: FileCheck2,
    status: "Passed",
  },
  {
    number: "04",
    title: "Data Model",
    subtitle: "Star Schema",
    description: "Validated data transformed into analytical model",
    detail: "Fact + Dimension tables",
    icon: Layers3,
    status: "Ready",
  },
  {
    number: "05",
    title: "Power BI",
    subtitle: "Trusted Dashboard",
    description: "Validated data reaches business reporting",
    detail: "Dashboard published",
    icon: BarChart3,
    status: "Trusted",
  },
];

export default function DataLineagePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f7faff] text-[#10234f]">
      {/* HEADER */}
      <header className="flex h-[82px] items-center justify-between border-b border-slate-200 bg-white px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-[24px] font-bold">
              Explainable Data Lineage
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Understand exactly where your numbers came from.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Trusted Pipeline
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
            SS
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1250px] p-7">
        {/* TOP SEARCH / KPI */}
        <section className="grid grid-cols-3 gap-5">
          <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Search size={19} className="text-blue-600" />

              <div>
                <h2 className="font-bold">
                  Why should I trust this number?
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Trace any business number back to its original source.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <Search size={17} className="text-slate-400" />

              <span className="text-sm text-slate-500">
                Search KPI, column or dataset...
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-[#06204a] p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck size={20} className="text-emerald-400" />
              Trust Status
            </div>

            <div className="mt-3 text-3xl font-bold">
              96/100
            </div>

            <div className="mt-2 text-xs text-emerald-300">
              ✓ Fully validated
            </div>
          </div>
        </section>

        {/* LINEAGE */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Data Trust Lineage
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                sales_data.csv → trusted business insight
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock3 size={15} />
              Last validated 2 min ago
            </div>
          </div>

          <div className="mt-8">
            {lineageSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.number}>
                  <div className="flex items-center gap-5">
                    {/* NUMBER */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                      {step.number}
                    </div>

                    {/* ICON */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                      <Icon size={25} />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 rounded-xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">
                              {step.title}
                            </h3>

                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
                              {step.subtitle}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            {step.description}
                          </p>

                          <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium">
                            {step.detail}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                          <CheckCircle2 size={13} />
                          {step.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CONNECTOR */}
                  {index < lineageSteps.length - 1 && (
                    <div className="ml-[91px] flex h-10 items-center">
                      <div className="h-full border-l-2 border-dashed border-blue-200" />

                      <ArrowDown
                        size={18}
                        className="-ml-[10px] text-blue-400"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* WHY TRUST */}
        <section className="mt-6 grid grid-cols-3 gap-5">
          <TrustCard
            title="Source Traceability"
            description="Every dashboard number can be traced back to its original CSV source."
            icon={<Database size={21} />}
          />

          <TrustCard
            title="Validation Evidence"
            description="Automated checks prove that the data passed quality validation."
            icon={<FileCheck2 size={21} />}
          />

          <TrustCard
            title="Business Transparency"
            description="Users can understand how raw data became a trusted business insight."
            icon={<ShieldCheck size={21} />}
          />
        </section>

        {/* DATA DICTIONARY */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">
                Data Dictionary
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Important fields used in the trusted dataset.
              </p>
            </div>

            <button className="flex items-center gap-1 text-xs font-semibold text-blue-600">
              View Full Dictionary
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3">Column</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Validation</th>
                </tr>
              </thead>

              <tbody>
                <DictionaryRow
                  column="Customer_ID"
                  type="Integer"
                />

                <DictionaryRow
                  column="Region"
                  type="Text"
                />

                <DictionaryRow
                  column="Revenue"
                  type="Decimal"
                />

                <DictionaryRow
                  column="Order_Date"
                  type="Date"
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER ACTIONS */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <button
            onClick={() => router.push("/data-quality")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View Quality Report
            <ChevronRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}

function TrustCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function DictionaryRow({
  column,
  type,
}: {
  column: string;
  type: string;
}) {
  return (
    <tr className="border-t border-slate-200">
      <td className="px-4 py-3 font-medium">
        {column}
      </td>

      <td className="px-4 py-3 text-slate-500">
        {type}
      </td>

      <td className="px-4 py-3 text-slate-500">
        sales_data.csv
      </td>

      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
          <CheckCircle2 size={12} />
          Passed
        </span>
      </td>
    </tr>
  );
}