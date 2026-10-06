"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Database,
  GitBranch,
  Layers3,
  LineChart,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Table2,
  TrendingUp,
} from "lucide-react";

export default function PowerBIPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={22} className="text-blue-600" />
                <h1 className="text-2xl font-bold">Power BI Analytics</h1>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Trusted data → Star Schema → Dashboard → Forecast
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={17} />
              Data Trusted
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
              <Rocket size={17} />
              Publish Report
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-8 py-7">
        {/* Trust Banner */}
        <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-100 p-3">
                <ShieldCheck className="text-emerald-600" size={27} />
              </div>

              <div>
                <h2 className="font-bold text-emerald-900">
                  Power BI Trust Gate: PASSED
                </h2>
                <p className="mt-1 text-sm text-emerald-700">
                  The dataset passed validation and is ready for analytics.
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-700">100/100</p>
              <p className="text-xs font-medium text-emerald-600">
                TRUST SCORE
              </p>
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Analytics Pipeline</h2>
              <p className="text-sm text-slate-500">
                Every stage is validated before the next stage begins.
              </p>
            </div>

            <GitBranch size={21} className="text-slate-400" />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <PipelineCard
              number="01"
              title="Trusted Dataset"
              subtitle="CSV validated"
              icon={<Database size={23} />}
              status="PASSED"
            />

            <Arrow />

            <PipelineCard
              number="02"
              title="Star Schema"
              subtitle="Model prepared"
              icon={<Layers3 size={23} />}
              status="READY"
            />

            <Arrow />

            <PipelineCard
              number="03"
              title="Power BI"
              subtitle="Dashboard ready"
              icon={<BarChart3 size={23} />}
              status="READY"
            />
          </div>
        </section>

        {/* Main Analytics */}
        <div className="grid grid-cols-12 gap-6">
          {/* KPI cards */}
          <div className="col-span-8">
            <div className="grid grid-cols-4 gap-4">
              <MetricCard
                title="Total Records"
                value="545"
                change="+12.4%"
                icon={<Database size={19} />}
              />

              <MetricCard
                title="Average Price"
                value="₹4.77M"
                change="+8.2%"
                icon={<TrendingUp size={19} />}
              />

              <MetricCard
                title="Average Area"
                value="5,151"
                change="+5.6%"
                icon={<Table2 size={19} />}
              />

              <MetricCard
                title="Data Quality"
                value="100%"
                change="Stable"
                icon={<ShieldCheck size={19} />}
              />
            </div>

            {/* Chart */}
            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold">Price Trend & Forecast</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Historical values with projected trend
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                  <Sparkles size={15} />
                  AI Forecast
                </div>
              </div>

              <div className="mt-7 h-[280px] rounded-xl bg-slate-50 p-5">
                <div className="flex h-full items-end gap-3">
                  {[35, 48, 42, 57, 51, 66, 62, 73, 69, 79, 76, 88].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex flex-1 flex-col justify-end"
                      >
                        <div
                          className="rounded-t-lg bg-blue-500 transition-all hover:bg-blue-600"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="mt-3 flex justify-between text-[11px] text-slate-400">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-4">
                <Insight
                  title="Trend"
                  value="Increasing"
                  description="Positive movement"
                />
                <Insight
                  title="Forecast"
                  value="+11.8%"
                  description="Expected growth"
                />
                <Insight
                  title="Confidence"
                  value="94%"
                  description="Forecast confidence"
                />
              </div>
            </section>
          </div>

          {/* Right panel */}
          <div className="col-span-4 space-y-5">
            {/* Star Schema */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3">
                  <Layers3 className="text-purple-600" size={22} />
                </div>

                <div>
                  <h2 className="font-bold">Star Schema</h2>
                  <p className="text-xs text-slate-500">
                    Power BI data model
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <SchemaRow
                  title="Fact_Housing"
                  subtitle="545 records"
                  main
                />

                <SchemaRow
                  title="Dim_Location"
                  subtitle="Location attributes"
                />

                <SchemaRow
                  title="Dim_Property"
                  subtitle="Property attributes"
                />

                <SchemaRow
                  title="Dim_Furnishing"
                  subtitle="Furnishing details"
                />
              </div>
            </section>

            {/* Refresh */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold">Data Refresh</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Latest successful refresh
                  </p>
                </div>

                <RefreshCw size={20} className="text-emerald-500" />
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold">Today, 09:42 AM</p>
                <p className="mt-1 text-xs text-slate-500">
                  545 records processed successfully
                </p>
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50">
                <RefreshCw size={16} />
                Refresh Dataset
              </button>
            </section>

            {/* Publish */}
            <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <Rocket size={22} />
                <h2 className="font-bold">Ready to Publish</h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                All quality checks passed. The trusted model can now be
                published to the Power BI workspace.
              </p>

              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-slate-900 hover:bg-slate-100">
                <BarChart3 size={17} />
                Open Power BI Report
              </button>
            </section>
          </div>
        </div>

        {/* Bottom insights */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <LineChart size={21} className="text-blue-600" />
            <div>
              <h2 className="font-bold">Business Insights</h2>
              <p className="text-sm text-slate-500">
                Automatically generated from the trusted dataset.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <BusinessInsight
              title="Property Size"
              text="Larger properties show a strong relationship with higher prices."
            />

            <BusinessInsight
              title="Furnishing"
              text="Furnished and semi-furnished properties form a significant part of the dataset."
            />

            <BusinessInsight
              title="Parking"
              text="Properties with more parking availability show different price patterns."
            />
          </div>
        </section>

        {/* Footer flow */}
        <div className="mt-7 flex items-center justify-center gap-3 text-xs font-semibold text-slate-400">
          <span>RAW CSV</span>
          <span>→</span>
          <span>QUALITY GATE</span>
          <span>→</span>
          <span>STAR SCHEMA</span>
          <span>→</span>
          <span className="text-blue-600">POWER BI</span>
          <span>→</span>
          <span>FORECAST</span>
          <span>→</span>
          <span>PUBLISH</span>
        </div>
      </div>
    </main>
  );
}

/* ---------- Components ---------- */

function PipelineCard({
  number,
  title,
  subtitle,
  icon,
  status,
}: {
  number: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">{number}</span>

        <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
          {icon}
        </div>
      </div>

      <h3 className="mt-4 text-sm font-bold">{title}</h3>

      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

      <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
        <CheckCircle2 size={14} />
        {status}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-slate-300">
      →
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{title}</span>

        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs font-semibold text-emerald-600">
        {change}
      </p>
    </div>
  );
}

function Insight({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function SchemaRow({
  title,
  subtitle,
  main = false,
}: {
  title: string;
  subtitle: string;
  main?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-3 ${
        main
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <Table2
          size={17}
          className={main ? "text-blue-600" : "text-slate-500"}
        />

        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </div>

      <CheckCircle2 size={16} className="text-emerald-500" />
    </div>
  );
}

function BusinessInsight({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}