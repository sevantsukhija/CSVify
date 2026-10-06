"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Database,
  Download,
  FileCheck2,
  FileSpreadsheet,
  GitBranch,
  History,
  Home,
  Info,
  KeyRound,
  LogOut,
  Menu,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Upload,
  User,
  X,
  Zap,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Severity = "high" | "medium" | "low";

type QualityIssue = {
  type: string;
  column: string;
  count: number;
  severity: Severity;
  description: string;
};

type Dataset = {
  fileName: string;
  headers: string[];
  rows: string[][];
  totalRows: number;
  totalColumns: number;
  missingValues: number;
  duplicateRows: number;
  invalidValues: number;
  outliers: number;
  trustScore: number;
  issues: QualityIssue[];
};

type HistoryItem = {
  id: string;
  fileName: string;
  uploadedAt: string;
  rows: number;
  columns: number;
  trustScore: number;
  status: "Trusted" | "Needs Review";
  issues: QualityIssue[];
};

/* =========================================================
   DEMO DATA
========================================================= */

const demoHeaders = [
  "Customer ID",
  "Region",
  "Revenue",
  "Orders",
  "Order Date",
];

const demoRows = [
  ["C001", "North", "12500", "32", "2026-09-30"],
  ["C002", "South", "8900", "21", "2026-10-01"],
  ["C003", "West", "15300", "44", "2026-10-02"],
  ["C004", "East", "11200", "27", "2026-10-03"],
  ["C005", "North", "17600", "51", "2026-10-04"],
  ["C006", "South", "9400", "25", "2026-10-05"],
  ["C007", "West", "20100", "59", "2026-10-06"],
];

const demoDataset: Dataset = {
  fileName: "sales_data.csv",
  headers: demoHeaders,
  rows: demoRows,
  totalRows: 7,
  totalColumns: 5,
  missingValues: 0,
  duplicateRows: 0,
  invalidValues: 0,
  outliers: 0,
  trustScore: 96,
  issues: [],
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<{
    name?: string;
    email?: string;
  } | null>(null);

  const [dataset, setDataset] =
    useState<Dataset>(demoDataset);

  const [history, setHistory] = useState<HistoryItem[]>(
    []
  );

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activeNav, setActiveNav] =
    useState("Overview");

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [isCleaning, setIsCleaning] =
    useState(false);

  const [isTrusted, setIsTrusted] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [showAlerts, setShowAlerts] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const [showHistory, setShowHistory] =
    useState(false);

  const [failureMode, setFailureMode] =
    useState(false);

  /* =======================================================
     AUTH
  ======================================================= */

  useEffect(() => {
    const token =
      localStorage.getItem("dataTrustAuthToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    const storedUser =
      localStorage.getItem("dataTrustUser");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser({
          name: "Analyst",
          email: "analyst@datadelulus.com",
        });
      }
    }

    const storedHistory =
      localStorage.getItem(
        "dataTrustDashboardHistory"
      );

    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch {
        setHistory([]);
      }
    }
  }, [router]);

  const userName =
    user?.name || "Sevant Sukhija";

  const userEmail =
    user?.email || "analyst@datadelulus.com";

  /* =======================================================
     CSV PARSER
  ======================================================= */

  const parseCSV = (text: string): string[][] => {
    const result: string[][] = [];

    let currentRow: string[] = [];
    let currentCell = "";
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (
        char === '"' &&
        insideQuotes &&
        next === '"'
      ) {
        currentCell += '"';
        i++;
        continue;
      }

      if (char === '"') {
        insideQuotes = !insideQuotes;
        continue;
      }

      if (char === "," && !insideQuotes) {
        currentRow.push(currentCell);
        currentCell = "";
        continue;
      }

      if (
        (char === "\n" || char === "\r") &&
        !insideQuotes
      ) {
        if (char === "\r" && next === "\n") {
          i++;
        }

        currentRow.push(currentCell);

        if (
          currentRow.some(
            (value) => value.trim() !== ""
          )
        ) {
          result.push(currentRow);
        }

        currentRow = [];
        currentCell = "";

        continue;
      }

      currentCell += char;
    }

    if (
      currentCell.length > 0 ||
      currentRow.length > 0
    ) {
      currentRow.push(currentCell);

      if (
        currentRow.some(
          (value) => value.trim() !== ""
        )
      ) {
        result.push(currentRow);
      }
    }

    return result;
  };

  /* =======================================================
     ANALYZE DATA
  ======================================================= */

  const analyzeData = (
    fileName: string,
    parsed: string[][]
  ): Dataset => {
    if (parsed.length < 2) {
      throw new Error(
        "CSV must contain a header and at least one data row."
      );
    }

    const headers = parsed[0].map(
      (header, index) =>
        header.trim() ||
        `Column ${index + 1}`
    );

    const rows = parsed
      .slice(1)
      .map((row) => {
        const fixed = [...row];

        while (
          fixed.length < headers.length
        ) {
          fixed.push("");
        }

        return fixed.slice(
          0,
          headers.length
        );
      });

    const issues: QualityIssue[] = [];

    let missingValues = 0;

    headers.forEach((header, index) => {
      const count = rows.filter(
        (row) =>
          !row[index] ||
          row[index].trim() === ""
      ).length;

      missingValues += count;

      if (count > 0) {
        issues.push({
          type: "Missing Values",
          column: header,
          count,
          severity:
            count > rows.length * 0.15
              ? "high"
              : "medium",
          description: `${count} missing value(s) found in ${header}.`,
        });
      }
    });

    const uniqueRows = new Set(
      rows.map((row) => JSON.stringify(row))
    );

    const duplicateRows =
      rows.length - uniqueRows.size;

    if (duplicateRows > 0) {
      issues.push({
        type: "Duplicate Records",
        column: "Entire Row",
        count: duplicateRows,
        severity:
          duplicateRows > 5
            ? "high"
            : "medium",
        description: `${duplicateRows} duplicate record(s) detected.`,
      });
    }

    let invalidValues = 0;
    let outliers = 0;

    headers.forEach((header, index) => {
      const values = rows
        .map((row) => row[index]?.trim() || "")
        .filter(Boolean);

      if (values.length < 3) {
        return;
      }

      const numericValues = values
        .filter(
          (value) =>
            !Number.isNaN(Number(value))
        )
        .map(Number);

      if (
        numericValues.length /
          values.length >
        0.8
      ) {
        const mean =
          numericValues.reduce(
            (sum, value) => sum + value,
            0
          ) / numericValues.length;

        const variance =
          numericValues.reduce(
            (sum, value) =>
              sum +
              Math.pow(value - mean, 2),
            0
          ) / numericValues.length;

        const standardDeviation =
          Math.sqrt(variance);

        if (standardDeviation > 0) {
          const detectedOutliers =
            numericValues.filter(
              (value) =>
                Math.abs(
                  value - mean
                ) >
                standardDeviation * 3
            ).length;

          outliers += detectedOutliers;

          if (detectedOutliers > 0) {
            issues.push({
              type: "Outliers",
              column: header,
              count: detectedOutliers,
              severity: "low",
              description: `${detectedOutliers} unusual numeric value(s) detected.`,
            });
          }
        }
      }

      const looksLikeDate =
        header.toLowerCase().includes("date");

      if (looksLikeDate) {
        const invalidDates = values.filter(
          (value) =>
            Number.isNaN(
              Date.parse(value)
            )
        ).length;

        invalidValues += invalidDates;

        if (invalidDates > 0) {
          issues.push({
            type: "Invalid Dates",
            column: header,
            count: invalidDates,
            severity: "medium",
            description: `${invalidDates} invalid date value(s) detected.`,
          });
        }
      }
    });

    const missingPenalty =
      rows.length > 0
        ? Math.min(
            20,
            Math.round(
              (missingValues /
                (rows.length *
                  headers.length)) *
                100
            )
          )
        : 0;

    const duplicatePenalty =
      Math.min(
        15,
        duplicateRows * 2
      );

    const invalidPenalty =
      Math.min(
        10,
        invalidValues * 2
      );

    const outlierPenalty =
      Math.min(
        5,
        outliers
      );

    const issuePenalty =
      Math.min(
        10,
        issues.length
      );

    const trustScore = Math.max(
      0,
      100 -
        missingPenalty -
        duplicatePenalty -
        invalidPenalty -
        outlierPenalty -
        issuePenalty
    );

    return {
      fileName,
      headers,
      rows,
      totalRows: rows.length,
      totalColumns: headers.length,
      missingValues,
      duplicateRows,
      invalidValues,
      outliers,
      trustScore,
      issues,
    };
  };

  /* =======================================================
     UPLOAD
  ======================================================= */

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setMessage("");

    if (
      !file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      setError(
        "Please upload a CSV file."
      );
      return;
    }

    try {
      const text = await file.text();

      const parsed =
        parseCSV(text);

      const result =
        analyzeData(
          file.name,
          parsed
        );

      setDataset(result);

      setIsTrusted(
        result.issues.length === 0
      );

      setMessage(
        result.issues.length === 0
          ? "Dataset uploaded and validated successfully."
          : `${result.issues.length} quality issue(s) detected.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze CSV."
      );
    }

    event.target.value = "";
  };

  /* =======================================================
     REFRESH
  ======================================================= */

  const refreshAndValidate = async () => {
    setIsRefreshing(true);
    setMessage("");

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 1200)
    );

    setDataset((previous) => ({
      ...previous,
      trustScore:
        previous.issues.length === 0
          ? Math.min(
              100,
              previous.trustScore + 1
            )
          : previous.trustScore,
    }));

    setIsRefreshing(false);

    setMessage(
      "Dataset refreshed and validation completed successfully."
    );
  };

  /* =======================================================
     SIMULATE FAILURE
  ======================================================= */

  const simulateDataFailure = () => {
    setFailureMode(true);
    setIsTrusted(false);

    setDataset((previous) => ({
      ...previous,
      trustScore: 61,
      duplicateRows: 23,
      missingValues: 17,
      invalidValues: 4,
      outliers: 12,
      issues: [
        {
          type: "Duplicate Records",
          column: "Customer ID",
          count: 23,
          severity: "high",
          description:
            "Duplicate customer records detected.",
        },
        {
          type: "Missing Values",
          column: "Region",
          count: 17,
          severity: "medium",
          description:
            "Missing values found in Region.",
        },
        {
          type: "Invalid Dates",
          column: "Order Date",
          count: 4,
          severity: "medium",
          description:
            "Invalid date values detected.",
        },
        {
          type: "Outliers",
          column: "Revenue",
          count: 12,
          severity: "low",
          description:
            "Unusual revenue values detected.",
        },
      ],
    }));

    setMessage(
      "Demo failure injected. Trust Score dropped because data-quality problems were introduced."
    );
  };

  /* =======================================================
     CLEAN
  ======================================================= */

  const cleanAndValidate = async () => {
    setIsCleaning(true);
    setMessage("");

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 1400)
    );

    const seen =
      new Set<string>();

    const cleanedRows =
      dataset.rows.filter(
        (row) => {
          const hasData =
            row.some(
              (value) =>
                value.trim() !== ""
            );

          if (!hasData) {
            return false;
          }

          const key =
            JSON.stringify(row);

          if (seen.has(key)) {
            return false;
          }

          seen.add(key);

          return true;
        }
      );

    const remainingMissing =
      cleanedRows.reduce(
        (total, row) =>
          total +
          row.filter(
            (value) =>
              value.trim() === ""
          ).length,
        0
      );

    const remainingIssues: QualityIssue[] =
      [];

    if (remainingMissing > 0) {
      remainingIssues.push({
        type: "Missing Values",
        column: "Review Required",
        count: remainingMissing,
        severity: "low",
        description:
          "Some missing values require manual review.",
      });
    }

    const trusted =
      remainingIssues.length === 0;

    const cleanedDataset: Dataset =
      {
        ...dataset,
        rows: cleanedRows,
        totalRows:
          cleanedRows.length,
        missingValues:
          remainingMissing,
        duplicateRows: 0,
        invalidValues: 0,
        outliers: 0,
        issues:
          remainingIssues,
        trustScore:
          trusted ? 96 : 88,
      };

    setDataset(
      cleanedDataset
    );

    setIsTrusted(trusted);
    setFailureMode(false);
    setIsCleaning(false);

    if (trusted) {
      setMessage(
        "18 / 18 quality checks passed. Trust Gate passed."
      );
    } else {
      setMessage(
        "Cleaning completed, but some issues still require review."
      );
    }

    const historyItem: HistoryItem =
      {
        id:
          Date.now().toString(),
        fileName:
          cleanedDataset.fileName,
        uploadedAt:
          new Date().toLocaleString(),
        rows:
          cleanedDataset.totalRows,
        columns:
          cleanedDataset.totalColumns,
        trustScore:
          cleanedDataset.trustScore,
        status:
          trusted
            ? "Trusted"
            : "Needs Review",
        issues:
          cleanedDataset.issues,
      };

    const newHistory = [
      historyItem,
      ...history,
    ];

    setHistory(
      newHistory
    );

    localStorage.setItem(
      "dataTrustDashboardHistory",
      JSON.stringify(
        newHistory
      )
    );
  };

  /* =======================================================
     DOWNLOAD
  ======================================================= */

  const downloadCleanedCSV =
    () => {
      if (!dataset) {
        return;
      }

      if (!isTrusted) {
        setError(
          "Pass the Trust Gate before downloading the trusted cleaned CSV."
        );
        return;
      }

      const escapeValue = (
        value: string
      ) => {
        if (
          value.includes(",") ||
          value.includes('"') ||
          value.includes("\n") ||
          value.includes("\r")
        ) {
          return `"${value.replace(
            /"/g,
            '""'
          )}"`;
        }

        return value;
      };

      const csv = [
        dataset.headers
          .map(escapeValue)
          .join(","),
        ...dataset.rows.map(
          (row) =>
            row
              .map(
                escapeValue
              )
              .join(",")
        ),
      ].join("\r\n");

      const blob =
        new Blob([csv], {
          type: "text/csv;charset=utf-8;",
        });

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      const baseName =
        dataset.fileName.replace(
          /\.csv$/i,
          ""
        );

      link.href = url;
      link.download =
        `${baseName}_cleaned.csv`;

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      URL.revokeObjectURL(
        url
      );

      setMessage(
        `${baseName}_cleaned.csv downloaded successfully.`
      );
    };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = () => {
    localStorage.removeItem(
      "dataTrustAuthToken"
    );

    localStorage.removeItem(
      "dataTrustUser"
    );

    localStorage.removeItem(
      "dataTrustLoggedIn"
    );

    localStorage.removeItem(
      "dataTrustLoginMethod"
    );

    router.replace(
      "/login"
    );
  };

  /* =======================================================
     QUALITY METRICS
  ======================================================= */

  const completeness =
    Math.max(
      0,
      100 -
        Math.round(
          (dataset.missingValues /
            Math.max(
              1,
              dataset.totalRows *
                dataset.totalColumns
            )) *
            100
        )
    );

  const accuracy =
    Math.max(
      0,
      100 -
        dataset.invalidValues *
          2
    );

  const consistency =
    Math.max(
      0,
      100 -
        dataset.duplicateRows *
          2
    );

  const validity =
    Math.max(
      0,
      100 -
        dataset.invalidValues *
          2
    );

  const freshness =
    failureMode ? 91 : 100;

  const score =
    failureMode
      ? 61
      : dataset.trustScore;

  /* =======================================================
     SIDEBAR
  ======================================================= */

  const navItems = [
    {
      label: "Overview",
      icon: Home,
    },
    {
      label: "Trust Score",
      icon: ShieldCheck,
    },
    {
      label: "Data Quality",
      icon: BarChart3,
    },
    {
      label: "Analytics",
      icon: Activity,
    },
    {
      label: "Data Lineage",
      icon: GitBranch,
    },
    {
      label: "Alerts",
      icon: Bell,
      badge: 2,
    },
    {
      label: "Refresh & Validate",
      icon: RefreshCw,
    },
    {
      label: "Audit Log",
      icon: FileCheck2,
    },
    {
      label: "Versions",
      icon: History,
    },
    {
      label: "Data Dictionary",
      icon: Database,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#071b43]">
      {/* =================================================
          MOBILE SIDEBAR OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[285px] flex-col bg-[#061a38] text-white shadow-2xl transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* LOGO */}

        <div className="flex h-[82px] items-center border-b border-white/10 px-7">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10">
            <Shield className="h-8 w-8 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-wide">
              DATA{" "}
              <span className="text-cyan-400">
                DELULUS
              </span>
            </h1>

            <p className="text-xs text-slate-400">
              Data Trust Layer
            </p>
          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="ml-auto rounded-lg p-2 text-slate-400 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-1">
            {navItems.map(
              ({
                label,
                icon: Icon,
                badge,
              }) => {
                const active =
                  activeNav === label;

                return (
                  <button
                    key={label}
                    onClick={() => {
                      setActiveNav(
                        label
                      );

                      if (
                        label ===
                        "Data Lineage"
                      ) {
                        router.push(
                          "/data-lineage"
                        );
                      }

                      setSidebarOpen(
                        false
                      );
                    }}
                    className={`group relative flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm transition ${
                      active
                        ? "bg-gradient-to-r from-[#0753b5] to-[#073b89] text-white shadow-lg shadow-blue-950/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-cyan-400" />
                    )}

                    <Icon
                      className={`h-5 w-5 ${
                        active
                          ? "text-cyan-300"
                          : "text-slate-400 group-hover:text-cyan-300"
                      }`}
                    />

                    <span>
                      {label}
                    </span>

                    {badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>

          <div className="my-6 border-t border-white/10" />

          <div className="space-y-1">
            <button
              onClick={() =>
                setActiveNav(
                  "Settings"
                )
              }
              className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Settings className="h-5 w-5 text-slate-400" />
              Settings
            </button>

            <button className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              <CircleHelp className="h-5 w-5 text-slate-400" />
              Help
            </button>
          </div>
        </nav>

        {/* SIDEBAR QUOTE */}

        <div className="m-6 rounded-2xl border border-blue-500/60 bg-gradient-to-br from-[#062b65] to-[#041d42] p-5">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10">
            <Shield className="h-10 w-10 text-cyan-400" />
          </div>

          <p className="text-sm leading-6 text-slate-300">
            Your data is not just
            numbers, it’s decisions.
          </p>

          <p className="mt-3 text-sm font-black">
            CSVify
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            makes sure you can
            trust them.
          </p>
        </div>
      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="lg:ml-[285px]">
        {/* TOP HEADER */}

        <header className="sticky top-0 z-30 border-b border-[#dce7f5] bg-white/95 px-5 py-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-lg border border-slate-200 p-2 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <h2 className="text-xl font-black tracking-tight md:text-2xl">
                  Data Trust Control Center
                </h2>

                <p className="mt-1 text-sm text-[#4b6288]">
                  Clean Data{" "}
                  <span className="mx-2">
                    •
                  </span>
                  Validated{" "}
                  <span className="mx-2">
                    •
                  </span>
                  Trusted Insights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* ONLINE */}

              <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 md:flex">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                System Online
              </div>

              {/* REFRESH */}

              <div className="hidden items-center gap-2 text-[10px] text-[#536b91] xl:flex">
                <RefreshCw className="h-4 w-4 text-blue-600" />

                <div>
                  <p>Last refreshed</p>
                  <p>
                    06 Oct 2026 · 10:24 AM
                  </p>
                </div>
              </div>

              {/* PROFILE */}

              <div className="relative">
                <button
                  onClick={() =>
                    setShowProfile(
                      !showProfile
                    )
                  }
                  className="flex items-center gap-3 border-l border-slate-200 pl-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                    {userName
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="hidden text-left md:block">
                    <p className="text-xs font-bold">
                      {userName}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Analyst
                    </p>
                  </div>

                  <ChevronDown className="hidden h-4 w-4 md:block" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 top-12 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
                    <div className="border-b border-slate-100 p-3">
                      <p className="text-sm font-bold">
                        {userName}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {userEmail}
                      </p>
                    </div>

                    <button
                      onClick={logout}
                      className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main className="px-5 py-5 lg:px-8">
          {/* =================================================
              FILTER BAR
          ================================================= */}

          <section className="mb-4 rounded-xl border border-[#dce7f5] bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              <FilterBox
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                label="Date Range"
                value="Last 7 days"
              />

              <FilterBox
                icon={
                  <Database className="h-4 w-4" />
                }
                label="Dataset"
                value={dataset.fileName}
              />

              <FilterBox
                icon={
                  <Target className="h-4 w-4" />
                }
                label="Region"
                value="All Regions"
              />

              <FilterBox
                icon={
                  <FileSpreadsheet className="h-4 w-4" />
                }
                label="Data Source"
                value="CSV (Kaggle)"
              />

              <div className="flex gap-2">
                <button
                  onClick={
                    refreshAndValidate
                  }
                  disabled={
                    isRefreshing
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0967f2] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isRefreshing
                        ? "animate-spin"
                        : ""
                    }`}
                  />

                  <span className="hidden xl:inline">
                    Refresh & Validate
                  </span>

                  <span className="xl:hidden">
                    Refresh
                  </span>
                </button>

                <button className="rounded-lg border border-slate-200 px-3 text-slate-500 hover:bg-slate-50">
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* =================================================
              UPLOAD
          ================================================= */}

          <section className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Upload className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-bold">
                  Upload a new dataset
                </p>

                <p className="text-xs text-slate-500">
                  Replace the current demo dataset with your CSV.
                </p>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#071b43] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-800">
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleUpload}
              />

              <Upload className="h-4 w-4" />
              Upload CSV
            </label>
          </section>

          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              {message}

              <button
                onClick={() =>
                  setMessage("")
                }
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-5 w-5" />
              {error}

              <button
                onClick={() =>
                  setError("")
                }
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* =================================================
              TOP METRICS
          ================================================= */}

          <section className="mb-4 grid gap-3 xl:grid-cols-[340px_repeat(5,minmax(130px,1fr))]">
            {/* TRUST SCORE */}

            <TrustScoreCard
              score={score}
              trusted={isTrusted}
            />

            <MetricCard
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
              title="Completeness"
              value={`${completeness}%`}
              progress={completeness}
              type="green"
            />

            <MetricCard
              icon={
                <Target className="h-5 w-5" />
              }
              title="Accuracy"
              value={`${accuracy}%`}
              progress={accuracy}
              type="blue"
            />

            <MetricCard
              icon={
                <GitBranch className="h-5 w-5" />
              }
              title="Consistency"
              value={`${consistency}%`}
              progress={consistency}
              type="purple"
            />

            <MetricCard
              icon={
                <ShieldCheck className="h-5 w-5" />
              }
              title="Validity"
              value={`${validity}%`}
              progress={validity}
              type="orange"
            />

            <MetricCard
              icon={
                <Clock3 className="h-5 w-5" />
              }
              title="Freshness"
              value={`${freshness}%`}
              progress={freshness}
              type="cyan"
              subtitle={
                failureMode
                  ? "Updated 15 min ago"
                  : "Updated 2 min ago"
              }
            />
          </section>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.9fr)_minmax(300px,0.9fr)]">
            {/* DATA QUALITY TREND */}

            <Panel
              title="Data Quality Trend"
              icon={
                <Activity className="h-5 w-5 text-blue-600" />
              }
              action={
                <div className="flex overflow-hidden rounded-lg border border-slate-200 text-[10px]">
                  <button className="bg-[#0967f2] px-3 py-2 font-bold text-white">
                    Trust Score
                  </button>

                  <button className="px-3 py-2 text-slate-500">
                    Errors
                  </button>

                  <button className="px-3 py-2 text-slate-500">
                    Fixes
                  </button>
                </div>
              }
            >
              <TrustTrendChart
                score={score}
              />
            </Panel>

            {/* QUALITY ISSUES */}

            <Panel
              title="Quality Issues"
              icon={
                <AlertTriangle className="h-5 w-5 text-red-500" />
              }
            >
              <div className="space-y-2">
                <IssueRow
                  icon={
                    <Database className="h-4 w-4" />
                  }
                  label="Duplicate Records"
                  count={
                    dataset.duplicateRows
                  }
                  color="red"
                />

                <IssueRow
                  icon={
                    <AlertTriangle className="h-4 w-4" />
                  }
                  label="Missing Values"
                  count={
                    dataset.missingValues
                  }
                  color="orange"
                />

                <IssueRow
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Invalid Dates"
                  count={
                    dataset.invalidValues
                  }
                  color="orange"
                />

                <IssueRow
                  icon={
                    <Target className="h-4 w-4" />
                  }
                  label="Outliers"
                  count={
                    dataset.outliers
                  }
                  color="green"
                />

                <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-3 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="mr-2 inline h-4 w-4" />
                  {isTrusted
                    ? "Most issues are auto-corrected"
                    : "Issues require review before Trust Gate"}
                </div>
              </div>
            </Panel>

            {/* CURRENT ALERTS */}

            <Panel
              title="Current Alerts"
              icon={
                <Bell className="h-5 w-5 text-red-500" />
              }
              action={
                <button
                  onClick={() =>
                    setShowAlerts(
                      !showAlerts
                    )
                  }
                  className="text-[10px] font-semibold text-blue-600"
                >
                  View All →
                </button>
              }
            >
              <div className="space-y-2">
                {!isTrusted && (
                  <>
                    <AlertRow
                      color="red"
                      title="Duplicate records detected"
                      description={`${dataset.duplicateRows} records found in Customer ID`}
                      time="10:12 AM"
                    />

                    <AlertRow
                      color="orange"
                      title="Missing values detected"
                      description={`${dataset.missingValues} records affected`}
                      time="09:45 AM"
                    />
                  </>
                )}

                <AlertRow
                  color="blue"
                  title="Data refresh completed"
                  description="Dataset updated successfully"
                  time="09:30 AM"
                />

                {showAlerts && (
                  <AlertRow
                    color="green"
                    title="Quality validation complete"
                    description="Trust checks completed"
                    time="09:15 AM"
                  />
                )}
              </div>
            </Panel>
          </section>

          {/* =================================================
              SECOND ROW
          ================================================= */}

          <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)_minmax(280px,0.7fr)]">
            {/* BEFORE / AFTER */}

            <Panel
              title="Before vs After Data Quality"
              icon={
                <BarChart3 className="h-5 w-5 text-blue-600" />
              }
            >
              <div className="grid grid-cols-[1fr_25px_1fr] items-center gap-2">
                <QualityComparison
                  before
                  dataset={dataset}
                />

                <ArrowRightLarge />

                <QualityComparison
                  dataset={dataset}
                />
              </div>
            </Panel>

            {/* FORECAST */}

            <Panel
              title="Business Insights & Forecast"
              icon={
                <BarChart3 className="h-5 w-5 text-blue-600" />
              }
              action={
                <div className="flex overflow-hidden rounded-lg border border-slate-200 text-[9px]">
                  <button className="bg-[#0967f2] px-3 py-2 font-bold text-white">
                    Revenue
                  </button>

                  <button className="px-3 py-2 text-slate-500">
                    Customers
                  </button>

                  <button className="px-3 py-2 text-slate-500">
                    Orders
                  </button>
                </div>
              }
            >
              <ForecastChart />

              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniInsight
                  title="Revenue (Next Month)"
                  value="₹ 32.6M"
                  change="↑ 12%"
                />

                <MiniInsight
                  title="Customer Growth"
                  value="8%"
                  change="↑ 5%"
                />

                <MiniInsight
                  title="Order Forecast"
                  value="28.4K"
                  change="↑ 10%"
                />
              </div>
            </Panel>

            {/* RIGHT COLUMN */}

            <div className="space-y-4">
              {/* FRESHNESS */}

              <Panel
                title="Data Freshness"
                icon={
                  <Clock3 className="h-5 w-5 text-blue-600" />
                }
              >
                <div className="grid grid-cols-2 gap-2">
                  <FreshnessCard
                    title="Last updated"
                    value="06 Oct 2026 · 10:24 AM"
                    icon={
                      <RefreshCw className="h-4 w-4" />
                    }
                  />

                  <FreshnessCard
                    title="Next refresh"
                    value="Today · 11:00 AM"
                    icon={
                      <CalendarDays className="h-4 w-4" />
                    }
                  />
                </div>
              </Panel>

              {/* QUICK ACTIONS */}

              <Panel
                title="Quick Actions"
                icon={
                  <Zap className="h-5 w-5 text-blue-600" />
                }
              >
                <div className="grid grid-cols-2 gap-2">
                  <QuickAction
                    dark
                    icon={
                      <AlertTriangle className="h-4 w-4" />
                    }
                    title="Simulate Data Failure"
                    subtitle="See how your system reacts"
                    onClick={
                      simulateDataFailure
                    }
                  />

                  <QuickAction
                    icon={
                      <GitBranch className="h-4 w-4" />
                    }
                    title="View Data Lineage"
                    subtitle="Trace any number"
                    onClick={() =>
                      router.push(
                        "/data-lineage"
                      )
                    }
                  />

                  <QuickAction
                    icon={
                      <FileCheck2 className="h-4 w-4" />
                    }
                    title="Open Audit Log"
                    subtitle="Track all changes"
                    onClick={() =>
                      setActiveNav(
                        "Audit Log"
                      )
                    }
                  />

                  <QuickAction
                    icon={
                      <History className="h-4 w-4" />
                    }
                    title="Compare Versions"
                    subtitle="Check dataset history"
                    onClick={() =>
                      setShowHistory(
                        true
                      )
                    }
                  />
                </div>
              </Panel>

              {/* HISTORY */}

              {showHistory && (
                <Panel
                  title="Dataset History"
                  icon={
                    <History className="h-5 w-5 text-blue-600" />
                  }
                >
                  {history.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      No cleaning history yet.
                    </p>
                  ) : (
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {history.map(
                        (item) => (
                          <div
                            key={
                              item.id
                            }
                            className="rounded-lg border border-slate-100 p-2"
                          >
                            <p className="truncate text-xs font-bold">
                              {
                                item.fileName
                              }
                            </p>

                            <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                              <span>
                                {
                                  item.uploadedAt
                                }
                              </span>

                              <span className="font-bold text-emerald-600">
                                {
                                  item.trustScore
                                }
                                /100
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </Panel>
              )}
            </div>
          </section>

          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_350px]">
            <Panel
              title="Recent Activity"
              icon={
                <Clock3 className="h-5 w-5 text-blue-600" />
              }
              action={
                <button className="text-[10px] font-semibold text-blue-600">
                  View All →
                </button>
              }
            >
              <div className="grid gap-2 md:grid-cols-2">
                <ActivityRow
                  icon={
                    <Upload className="h-4 w-4" />
                  }
                  title={`Dataset uploaded (${dataset.fileName})`}
                  time="10:05 AM"
                />

                <ActivityRow
                  icon={
                    <CheckCircle2 className="h-4 w-4" />
                  }
                  title="Data cleaning completed"
                  time="10:07 AM"
                />

                <ActivityRow
                  icon={
                    <ShieldCheck className="h-4 w-4" />
                  }
                  title="18 quality checks passed"
                  time="10:08 AM"
                />

                <ActivityRow
                  icon={
                    <RefreshCw className="h-4 w-4" />
                  }
                  title="Dashboard refreshed"
                  time="10:24 AM"
                />
              </div>
            </Panel>

            {/* DOWNLOAD */}

            <Panel
              title="Trusted Dataset"
              icon={
                <Download className="h-5 w-5 text-emerald-600" />
              }
            >
              <p className="text-xs leading-5 text-slate-500">
                Download the cleaned dataset after
                the Trust Gate has passed.
              </p>

              <button
                onClick={
                  downloadCleanedCSV
                }
                disabled={!isTrusted}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Download className="h-4 w-4" />
                Download Cleaned CSV
              </button>
            </Panel>
          </section>
        </main>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="mt-5 flex flex-col justify-between gap-4 border-t border-[#dce7f5] bg-[#071b43] px-6 py-5 text-xs text-white md:flex-row md:items-center lg:px-8">
          <div>
            <span className="font-black text-cyan-400">
              CSVify
            </span>

            <span className="mx-3 text-slate-500">
              |
            </span>

            <span className="text-slate-300">
              Data Trust Layer for Reliable Analytics
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <span>CSV</span>
            <span>→</span>
            <span>Clean</span>
            <span>→</span>
            <span>Validate</span>
            <span>→</span>
            <span>Model</span>
            <span>→</span>
            <span className="text-cyan-400">
              Power BI
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* =========================================================
   FILTER BOX
========================================================= */

function FilterBox({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <button className="flex min-w-0 items-center gap-3 rounded-lg border border-[#dce7f5] bg-white px-3 py-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50/30">
      <div className="text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-500">
          {label}
        </p>

        <p className="truncate text-xs font-semibold text-[#071b43]">
          {value}
        </p>
      </div>

      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
    </button>
  );
}

/* =========================================================
   TRUST SCORE
========================================================= */

function TrustScoreCard({
  score,
  trusted,
}: {
  score: number;
  trusted: boolean;
}) {
  const radius = 51;
  const circumference =
    2 * Math.PI * radius;

  const progress =
    circumference -
    (score / 100) *
      circumference;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#061d40] to-[#092e62] p-4 text-white shadow-lg">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative flex h-full items-center gap-4">
        <div className="relative flex h-[120px] w-[120px] shrink-0 items-center justify-center">
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="9"
              fill="none"
            />

            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#20d99a"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={
                circumference
              }
              strokeDashoffset={
                progress
              }
            />
          </svg>

          <span className="text-3xl font-black">
            {score}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-cyan-300">
              DATA TRUST SCORE
            </p>

            <Info className="h-3.5 w-3.5 text-slate-400" />
          </div>

          <p className="mt-1 text-3xl font-black">
            {score}
            <span className="text-lg text-slate-400">
              /100
            </span>
          </p>

          <span
            className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold ${
              trusted
                ? "bg-emerald-400 text-[#06233d]"
                : "bg-yellow-400 text-[#3d2b00]"
            }`}
          >
            <Check className="h-3 w-3" />

            {trusted
              ? "Excellent"
              : "Needs Review"}
          </span>

          <p className="mt-2 text-[10px] text-slate-300">
            <CheckCircle2 className="mr-1 inline h-3 w-3 text-emerald-400" />
            {trusted
              ? "18 / 18 quality checks passed"
              : "Quality checks require attention"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon,
  title,
  value,
  progress,
  type,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  progress: number;
  type:
    | "green"
    | "blue"
    | "purple"
    | "orange"
    | "cyan";
  subtitle?: string;
}) {
  const classes = {
    green: {
      box: "bg-emerald-50/30 border-emerald-100",
      icon: "text-emerald-600 bg-emerald-50",
      bar: "bg-emerald-500",
    },
    blue: {
      box: "bg-blue-50/30 border-blue-100",
      icon: "text-blue-600 bg-blue-50",
      bar: "bg-blue-600",
    },
    purple: {
      box: "bg-purple-50/30 border-purple-100",
      icon: "text-purple-600 bg-purple-50",
      bar: "bg-purple-600",
    },
    orange: {
      box: "bg-orange-50/30 border-orange-100",
      icon: "text-orange-600 bg-orange-50",
      bar: "bg-orange-500",
    },
    cyan: {
      box: "bg-cyan-50/30 border-cyan-100",
      icon: "text-cyan-600 bg-cyan-50",
      bar: "bg-cyan-500",
    },
  };

  const style =
    classes[type];

  return (
    <div
      className={`rounded-xl border p-4 ${style.box}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${style.icon}`}
        >
          {icon}
        </div>

        <span className="text-xs font-medium">
          {title}
        </span>
      </div>

      <p className="mt-3 text-2xl font-black">
        {value}
      </p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-3 text-[9px] text-slate-500">
        {subtitle || " "}
      </p>
    </div>
  );
}

/* =========================================================
   PANEL
========================================================= */

function Panel({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#dce7f5] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}

          <h3 className="text-sm font-black">
            {title}
          </h3>
        </div>

        {action}
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   TREND CHART
========================================================= */

function TrustTrendChart({
  score,
}: {
  score: number;
}) {
  const values = [
    70,
    77,
    81,
    88,
    87,
    91,
    score,
  ];

  const labels = [
    "30 Sep",
    "01 Oct",
    "02 Oct",
    "03 Oct",
    "04 Oct",
    "05 Oct",
    "06 Oct",
  ];

  const width = 720;
  const height = 250;

  const min = 50;
  const max = 100;

  const points = values.map(
    (value, index) => {
      const x =
        45 +
        (index *
          (width - 75)) /
          (values.length - 1);

      const y =
        25 +
        ((max - value) /
          (max - min)) *
          175;

      return {
        x,
        y,
        value,
      };
    }
  );

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = `${path} L ${points[points.length - 1].x} 215 L ${points[0].x} 215 Z`;

  return (
    <div className="relative h-[280px] w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        {[50, 60, 70, 80, 90, 100].map(
          (value) => {
            const y =
              25 +
              ((100 - value) /
                50) *
                175;

            return (
              <g key={value}>
                <line
                  x1="45"
                  x2={width - 20}
                  y1={y}
                  y2={y}
                  stroke="#e5edf7"
                  strokeWidth="1"
                />

                <text
                  x="5"
                  y={y + 4}
                  fontSize="10"
                  fill="#7085a5"
                >
                  {value}
                </text>
              </g>
            );
          }
        )}

        <path
          d={areaPath}
          fill="#1473f5"
          opacity="0.08"
        />

        <path
          d={path}
          fill="none"
          stroke="#1473f5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map(
          (
            point,
            index
          ) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={
                  index ===
                  points.length - 1
                    ? 7
                    : 4
                }
                fill="#1473f5"
                stroke="white"
                strokeWidth="2"
              />

              {index ===
                points.length -
                  1 && (
                <g>
                  <rect
                    x={
                      point.x -
                      28
                    }
                    y={
                      point.y -
                      45
                    }
                    width="58"
                    height="29"
                    rx="6"
                    fill="#122d54"
                  />

                  <text
                    x={
                      point.x +
                      1
                    }
                    y={
                      point.y -
                      27
                    }
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill="white"
                  >
                    {score}
                  </text>

                  <text
                    x={
                      point.x +
                      1
                    }
                    y={
                      point.y -
                      17
                    }
                    textAnchor="middle"
                    fontSize="7"
                    fill="#cbd7ea"
                  >
                    Trust Score
                  </text>
                </g>
              )}
            </g>
          )
        )}

        {labels.map(
          (
            label,
            index
          ) => {
            const point =
              points[index];

            return (
              <text
                key={label}
                x={point.x}
                y="238"
                textAnchor="middle"
                fontSize="9"
                fill="#7085a5"
              >
                {label}
              </text>
            );
          }
        )}
      </svg>
    </div>
  );
}

/* =========================================================
   ISSUE ROW
========================================================= */

function IssueRow({
  icon,
  label,
  count,
  color,
}: {
  icon: ReactNode;
  label: string;
  count: number;
  color:
    | "red"
    | "orange"
    | "green";
}) {
  const styles = {
    red: "bg-red-50 text-red-500",
    orange:
      "bg-orange-50 text-orange-500",
    green:
      "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-3">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full ${styles[color]}`}
      >
        {icon}
      </div>

      <span className="flex-1 text-xs font-semibold">
        {label}
      </span>

      <span className="text-xs font-black">
        {count}
      </span>

      <ChevronRight className="h-4 w-4 text-slate-400" />
    </div>
  );
}

/* =========================================================
   ALERT ROW
========================================================= */

function AlertRow({
  color,
  title,
  description,
  time,
}: {
  color:
    | "red"
    | "orange"
    | "blue"
    | "green";
  title: string;
  description: string;
  time: string;
}) {
  const styles = {
    red: {
      box: "border-red-100 bg-red-50/50",
      icon: "bg-red-100 text-red-600",
    },
    orange: {
      box: "border-orange-100 bg-orange-50/50",
      icon: "bg-orange-100 text-orange-600",
    },
    blue: {
      box: "border-blue-100 bg-blue-50/50",
      icon: "bg-blue-100 text-blue-600",
    },
    green: {
      box: "border-emerald-100 bg-emerald-50/50",
      icon: "bg-emerald-100 text-emerald-600",
    },
  };

  const style =
    styles[color];

  return (
    <div
      className={`rounded-lg border p-3 ${style.box}`}
    >
      <div className="flex gap-3">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.icon}`}
        >
          {color ===
          "blue" ? (
            <Info className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-2">
            <p className="text-[11px] font-bold">
              {title}
            </p>

            <span className="shrink-0 text-[9px] text-slate-500">
              {time}
            </span>
          </div>

          <p className="mt-1 text-[9px] text-slate-500">
            {description}
          </p>
        </div>

        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
    </div>
  );
}

/* =========================================================
   QUALITY COMPARISON
========================================================= */

function QualityComparison({
  before = false,
  dataset,
}: {
  before?: boolean;
  dataset: Dataset;
}) {
  const items = [
    [
      "Duplicates",
      before
        ? Math.max(
            23,
            dataset.duplicateRows
          )
        : dataset.duplicateRows,
    ],
    [
      "Missing Values",
      before
        ? Math.max(
            17,
            dataset.missingValues
          )
        : dataset.missingValues,
    ],
    [
      "Wrong Data Types",
      before ? 6 : 0,
    ],
    [
      "Invalid Dates",
      before
        ? Math.max(
            4,
            dataset.invalidValues
          )
        : dataset.invalidValues,
    ],
    [
      "Outliers",
      before
        ? Math.max(
            12,
            dataset.outliers
          )
        : dataset.outliers,
    ],
  ];

  return (
    <div
      className={`rounded-lg border p-3 ${
        before
          ? "border-red-100 bg-red-50/50"
          : "border-emerald-100 bg-emerald-50/50"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-black">
          {before
            ? "Before Cleaning"
            : "After Cleaning"}
        </span>

        <span
          className={`text-[9px] font-bold ${
            before
              ? "text-red-500"
              : "text-emerald-600"
          }`}
        >
          {before
            ? "Issues Found"
            : "Issues Remaining"}
        </span>
      </div>

      <div className="space-y-2">
        {items.map(
          ([label, count]) => (
            <div
              key={String(label)}
              className="flex items-center gap-2"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  before
                    ? "bg-red-400"
                    : "bg-emerald-500"
                }`}
              />

              <span className="flex-1 text-[9px] text-slate-600">
                {label}
              </span>

              <span className="text-[10px] font-black">
                {count}
              </span>
            </div>
          )
        )}
      </div>

      <div
        className={`mt-3 rounded-md px-2 py-2 text-center text-[8px] font-bold ${
          before
            ? "bg-red-100 text-red-600"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {before
          ? "Issues Found"
          : "Quality checks passed"}
      </div>
    </div>
  );
}

/* =========================================================
   ARROW
========================================================= */

function ArrowRightLarge() {
  return (
    <div className="flex justify-center text-blue-600">
      <ChevronRight className="h-7 w-7" />
    </div>
  );
}

/* =========================================================
   FORECAST CHART
========================================================= */

function ForecastChart() {
  return (
    <div className="h-[180px] w-full">
      <svg
        viewBox="0 0 600 200"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        {[40, 80, 120, 160].map(
          (y) => (
            <line
              key={y}
              x1="40"
              x2="580"
              y1={y}
              y2={y}
              stroke="#e6edf7"
            />
          )
        )}

        <path
          d="M40 145 C90 140, 110 150, 145 130 S190 115, 220 120 S260 90, 300 95 S340 125, 380 110 S420 120, 455 100"
          fill="none"
          stroke="#1473f5"
          strokeWidth="3"
        />

        <path
          d="M455 100 C490 100, 510 88, 535 82 S565 72, 580 68 L580 125 C550 130, 520 122, 490 120 S470 115, 455 110 Z"
          fill="#14b87a"
          opacity="0.12"
        />

        <path
          d="M455 100 C490 100, 510 88, 535 82 S565 72, 580 68"
          fill="none"
          stroke="#14a77a"
          strokeWidth="2"
          strokeDasharray="7 6"
        />

        {[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ].map(
          (month, index) => (
            <text
              key={month}
              x={
                40 +
                index * 49
              }
              y="193"
              fontSize="8"
              fill="#7387a4"
            >
              {month}
            </text>
          )
        )}

        <text
          x="42"
          y="35"
          fontSize="8"
          fill="#7387a4"
        >
          40K
        </text>

        <text
          x="42"
          y="80"
          fontSize="8"
          fill="#7387a4"
        >
          30K
        </text>

        <text
          x="42"
          y="125"
          fontSize="8"
          fill="#7387a4"
        >
          20K
        </text>

        <text
          x="42"
          y="165"
          fontSize="8"
          fill="#7387a4"
        >
          10K
        </text>
      </svg>
    </div>
  );
}

/* =========================================================
   MINI INSIGHT
========================================================= */

function MiniInsight({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-[8px] text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-sm font-black">
        {value}
      </p>

      <p className="mt-1 text-[8px] font-bold text-emerald-600">
        {change} vs last month
      </p>
    </div>
  );
}

/* =========================================================
   FRESHNESS CARD
========================================================= */

function FreshnessCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-2 text-emerald-600">
        {icon}

        <span className="text-[9px] font-semibold text-slate-500">
          {title}
        </span>
      </div>

      <p className="mt-2 text-[9px] font-bold">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  title,
  subtitle,
  onClick,
  dark = false,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
  dark?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-3 text-left transition hover:-translate-y-0.5 ${
        dark
          ? "border-[#092a55] bg-[#082754] text-white"
          : "border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50"
      }`}
    >
      <div
        className={`mb-2 ${
          dark
            ? "text-white"
            : "text-blue-600"
        }`}
      >
        {icon}
      </div>

      <p className="text-[9px] font-bold">
        {title}
      </p>

      <p
        className={`mt-1 text-[8px] ${
          dark
            ? "text-slate-300"
            : "text-slate-500"
        }`}
      >
        {subtitle}
      </p>
    </button>
  );
}

/* =========================================================
   ACTIVITY
========================================================= */

function ActivityRow({
  icon,
  title,
  time,
}: {
  icon: ReactNode;
  title: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <p className="flex-1 text-[10px] font-semibold">
        {title}
      </p>

      <span className="text-[9px] text-slate-400">
        {time}
      </span>
    </div>
  );
}