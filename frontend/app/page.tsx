"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Database,
  FileSpreadsheet,
  GitBranch,
  Menu,
  MonitorCheck,
  Shield,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserPlus,
  X,
  Zap,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("dataTrustTheme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }

    const updateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  function toggleTheme() {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    localStorage.setItem(
      "dataTrustTheme",
      nextMode ? "dark" : "light"
    );
  }

  return (
    <main
      className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-[#041126] text-white"
          : "bg-[#f5f9ff] text-[#102b52]"
      }`}
    >
      {/* =========================================================
          BACKGROUND GRAPHICS
      ========================================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl ${
            darkMode ? "bg-blue-600/20" : "bg-blue-400/20"
          }`}
        />

        <div
          className={`absolute top-[35%] -right-40 w-[550px] h-[550px] rounded-full blur-3xl ${
            darkMode ? "bg-cyan-500/15" : "bg-cyan-400/15"
          }`}
        />

        <div
          className={`absolute bottom-0 left-[30%] w-[500px] h-[500px] rounded-full blur-3xl ${
            darkMode ? "bg-indigo-600/10" : "bg-indigo-400/10"
          }`}
        />

        <div
          className={`absolute inset-0 ${
            darkMode ? "opacity-[0.035]" : "opacity-[0.06]"
          }`}
          style={{
            backgroundImage: darkMode
              ? "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)"
              : "linear-gradient(#2457a6 1px, transparent 1px), linear-gradient(90deg, #2457a6 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${
          darkMode
            ? "bg-[#041126]/85 border-blue-900/40"
            : "bg-white/85 border-blue-100"
        }`}
      >
        <div className="max-w-[1450px] mx-auto px-6 lg:px-10 h-[78px] flex items-center justify-between">
          {/* LOGO */}

          <button
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-blue-500 blur-md opacity-40 group-hover:opacity-70 transition" />

              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-left">
              <div
                className={`text-[19px] font-extrabold tracking-[0.16em] ${
                  darkMode ? "text-white" : "text-[#102b52]"
                }`}
              >
                CSVify
              </div>

              <div className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-semibold">
                Data Trust Layer
              </div>
            </div>
          </button>

          {/* DESKTOP NAV */}

          <nav className="hidden lg:flex items-center gap-8">
            <NavLink darkMode={darkMode} href="#home">
              Home
            </NavLink>

            <NavLink darkMode={darkMode} href="#features">
              Features
            </NavLink>

            <NavLink darkMode={darkMode} href="#how-it-works">
              How It Works
            </NavLink>

            <NavLink darkMode={darkMode} href="#trust">
              Trust
            </NavLink>

            <NavLink darkMode={darkMode} href="#about">
              About
            </NavLink>
          </nav>

          {/* RIGHT NAV */}

          <div className="hidden md:flex items-center gap-3">
            {/* THEME BUTTON */}

            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                darkMode
                  ? "bg-blue-950/70 border-blue-800 text-cyan-300 hover:bg-blue-900"
                  : "bg-white border-blue-100 text-blue-600 hover:bg-blue-50"
              }`}
              title={darkMode ? "Bright Mode" : "Dark Mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* LOGIN */}

            <button
              onClick={() => router.push("/login")}
              className={`px-5 h-10 rounded-xl border font-semibold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                darkMode
                  ? "border-blue-700 text-blue-200 hover:bg-blue-950"
                  : "border-blue-200 text-blue-700 hover:bg-blue-50"
              }`}
            >
              Login
            </button>

            {/* GET STARTED */}

            <button
              onClick={() => router.push("/register")}
              className="px-5 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 hover:-translate-y-1 transition-all"
            >
              Get Started
            </button>
          </div>

          {/* MOBILE */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden w-10 h-10 rounded-xl border flex items-center justify-center ${
              darkMode
                ? "border-blue-800 text-white"
                : "border-blue-200 text-blue-700"
            }`}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}

        {menuOpen && (
          <div
            className={`md:hidden border-t px-6 py-5 ${
              darkMode
                ? "bg-[#061631] border-blue-900"
                : "bg-white border-blue-100"
            }`}
          >
            <div className="flex flex-col gap-4">
              <MobileNavLink
                darkMode={darkMode}
                href="#home"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </MobileNavLink>

              <MobileNavLink
                darkMode={darkMode}
                href="#features"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </MobileNavLink>

              <MobileNavLink
                darkMode={darkMode}
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
              >
                How It Works
              </MobileNavLink>

              <MobileNavLink
                darkMode={darkMode}
                href="#trust"
                onClick={() => setMenuOpen(false)}
              >
                Trust
              </MobileNavLink>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => router.push("/login")}
                  className="flex-1 h-11 rounded-xl border border-blue-200 text-blue-700 font-semibold"
                >
                  Login
                </button>

                <button
                  onClick={() => router.push("/register")}
                  className="flex-1 h-11 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section id="home" className="relative">
        <div className="max-w-[1450px] mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-24">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
            {/* LEFT */}

            <div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold tracking-wider mb-7 ${
                  darkMode
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
              >
                <Sparkles className="w-4 h-4" />

                AI-POWERED DATA TRUST PLATFORM
              </div>

              <h1
                className={`text-5xl md:text-6xl lg:text-[72px] leading-[1.02] font-black tracking-tight ${
                  darkMode ? "text-white" : "text-[#102b52]"
                }`}
              >
                Your Data.
                <br />

                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Your Dashboard.
                </span>

                <br />

                <span
                  className={
                    darkMode ? "text-blue-100" : "text-[#214775]"
                  }
                >
                  Our Trust.
                </span>
              </h1>

              <p
                className={`mt-7 max-w-[680px] text-lg md:text-xl leading-8 ${
                  darkMode
                    ? "text-blue-100/70"
                    : "text-[#5d7290]"
                }`}
              >
                CSVify transforms messy datasets into clean,
                validated and trustworthy data so teams can make
                confident decisions.
              </p>

              {/* CTA */}

              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  onClick={() => router.push("/register")}
                  className="group h-14 px-7 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-3 shadow-xl shadow-blue-600/25 hover:-translate-y-1 transition-all"
                >
                  Get Started

                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => router.push("/login")}
                  className={`h-14 px-7 rounded-2xl border font-bold flex items-center gap-3 hover:-translate-y-1 transition-all ${
                    darkMode
                      ? "border-blue-700 text-blue-200 hover:bg-blue-950"
                      : "border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <Shield className="w-5 h-5" />

                  Login
                </button>
              </div>

              {/* STATUS */}

              <div className="mt-8 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />

                <span
                  className={`text-xs font-semibold ${
                    darkMode
                      ? "text-emerald-300"
                      : "text-emerald-700"
                  }`}
                >
                  SYSTEM ONLINE • DATA TRUST ENGINE READY
                </span>

                <span
                  className={`hidden sm:block text-xs ${
                    darkMode ? "text-blue-300/50" : "text-slate-400"
                  }`}
                >
                  {currentTime}
                </span>
              </div>
            </div>

            {/* RIGHT GRAPHIC */}

            <div className="relative">
              <div
                className={`absolute -inset-5 rounded-[35px] blur-2xl ${
                  darkMode
                    ? "bg-blue-600/20"
                    : "bg-blue-400/20"
                }`}
              />

              <div
                className={`relative rounded-[30px] border p-7 shadow-2xl ${
                  darkMode
                    ? "bg-[#081b38]/90 border-blue-800/50"
                    : "bg-white/90 border-blue-100"
                } backdrop-blur-xl`}
              >
                {/* CARD HEADER */}

                <div className="flex items-center justify-between mb-7">
                  <div>
                    <div
                      className={`text-xs uppercase tracking-[0.2em] font-bold ${
                        darkMode
                          ? "text-blue-400"
                          : "text-blue-600"
                      }`}
                    >
                      Live Trust Monitor
                    </div>

                    <div
                      className={`text-xl font-bold mt-1 ${
                        darkMode
                          ? "text-white"
                          : "text-[#17365f]"
                      }`}
                    >
                      Dataset Health
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <MonitorCheck className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* SCORE */}

                <div className="flex items-center gap-7">
                  <div className="relative w-36 h-36 rounded-full border-[12px] border-blue-100 dark:border-blue-950 flex items-center justify-center">
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-blue-500 border-r-cyan-400 rotate-12" />

                    <div className="text-center">
                      <div
                        className={`text-4xl font-black ${
                          darkMode ? "text-white" : "text-[#102b52]"
                        }`}
                      >
                        96
                      </div>

                      <div className="text-xs text-blue-500 font-bold">
                        TRUST SCORE
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <MiniMetric
                      label="Completeness"
                      value={98}
                      darkMode={darkMode}
                    />

                    <MiniMetric
                      label="Accuracy"
                      value={95}
                      darkMode={darkMode}
                    />

                    <MiniMetric
                      label="Consistency"
                      value={93}
                      darkMode={darkMode}
                    />

                    <MiniMetric
                      label="Validity"
                      value={96}
                      darkMode={darkMode}
                    />
                  </div>
                </div>

                {/* PIPELINE */}

                <div className="mt-8">
                  <div
                    className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                      darkMode
                        ? "text-blue-300"
                        : "text-blue-700"
                    }`}
                  >
                    Data Trust Pipeline
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    <GraphicStep
                      icon={<FileSpreadsheet />}
                      label="Raw"
                      darkMode={darkMode}
                    />

                    <GraphicStep
                      icon={<Sparkles />}
                      label="Clean"
                      darkMode={darkMode}
                    />

                    <GraphicStep
                      icon={<ShieldCheck />}
                      label="Validate"
                      darkMode={darkMode}
                    />

                    <GraphicStep
                      icon={<Database />}
                      label="Trust"
                      darkMode={darkMode}
                    />

                    <GraphicStep
                      icon={<BarChart3 />}
                      label="BI"
                      darkMode={darkMode}
                    />
                  </div>
                </div>

                {/* SUCCESS */}

                <div
                  className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 ${
                    darkMode
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-emerald-50 border-emerald-100"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />

                  <div>
                    <div
                      className={`text-sm font-bold ${
                        darkMode
                          ? "text-emerald-300"
                          : "text-emerald-700"
                      }`}
                    >
                      Trust Gate Passed
                    </div>

                    <div
                      className={`text-xs ${
                        darkMode
                          ? "text-emerald-200/60"
                          : "text-emerald-700/60"
                      }`}
                    >
                      Dataset is ready for trusted analytics.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}

      <section id="features" className="relative py-24">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
          <SectionHeading
            darkMode={darkMode}
            eyebrow="WHAT WE PROVIDE"
            title="Everything Your Data Needs Before You Trust It"
            description="CSVify creates a transparent trust layer between raw data and business decisions."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            <FeatureCard
              icon={<Sparkles />}
              number="01"
              title="Data Cleaning"
              description="Identify missing values, duplicates, invalid formats and inconsistent records before they affect your dashboard."
              darkMode={darkMode}
            />

            <FeatureCard
              icon={<ShieldCheck />}
              number="02"
              title="Quality Validation"
              description="Run repeatable quality checks and determine whether the dataset passes the Trust Gate."
              darkMode={darkMode}
            />

            <FeatureCard
              icon={<GitBranch />}
              number="03"
              title="Explainable Data Lineage"
              description="Understand where a number came from, what happened to it and why it can be trusted."
              darkMode={darkMode}
            />

            <FeatureCard
              icon={<Shield />}
              number="04"
              title="Trust Score"
              description="Get a simple quality score based on completeness, accuracy, consistency, validity and freshness."
              darkMode={darkMode}
            />

            <FeatureCard
              icon={<MonitorCheck />}
              number="05"
              title="Real-time Monitoring"
              description="Monitor data quality and identify failures before they reach decision-makers."
              darkMode={darkMode}
            />

            <FeatureCard
              icon={<BarChart3 />}
              number="06"
              title="Power BI Integration"
              description="Move trusted data into analytics and dashboards for reliable business insights."
              darkMode={darkMode}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section
        id="how-it-works"
        className={`relative py-24 ${
          darkMode ? "bg-[#061732]" : "bg-white"
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
          <SectionHeading
            darkMode={darkMode}
            eyebrow="HOW IT WORKS"
            title="From Messy CSV to Trusted Dashboard"
            description="A clear pipeline makes the journey from raw data to decisions visible and explainable."
          />

          <div className="mt-16 grid md:grid-cols-5 gap-4">
            <ProcessCard
              number="01"
              icon={<UploadCloud />}
              title="Upload"
              text="Bring your raw CSV dataset."
              darkMode={darkMode}
            />

            <ProcessCard
              number="02"
              icon={<Sparkles />}
              title="Clean"
              text="Detect and fix safe data issues."
              darkMode={darkMode}
            />

            <ProcessCard
              number="03"
              icon={<ShieldCheck />}
              title="Validate"
              text="Run quality checks and tests."
              darkMode={darkMode}
            />

            <ProcessCard
              number="04"
              icon={<Database />}
              title="Trust"
              text="Pass the Trust Gate."
              darkMode={darkMode}
            />

            <ProcessCard
              number="05"
              icon={<BarChart3 />}
              title="Analyze"
              text="Build reliable dashboards."
              darkMode={darkMode}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST SECTION
      ========================================================= */}

      <section id="trust" className="relative py-24">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
          <div
            className={`rounded-[32px] p-8 md:p-12 lg:p-16 border relative overflow-hidden ${
              darkMode
                ? "bg-[#081b38] border-blue-800/50"
                : "bg-gradient-to-br from-blue-50 to-white border-blue-100"
            }`}
          >
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">
                  <Zap className="w-4 h-4" />
                  TRUST FIRST
                </div>

                <h2
                  className={`mt-4 text-4xl md:text-5xl font-black ${
                    darkMode
                      ? "text-white"
                      : "text-[#102b52]"
                  }`}
                >
                  Don't just build a dashboard.
                  <br />
                  <span className="text-blue-600">
                    Build confidence.
                  </span>
                </h2>

                <p
                  className={`mt-6 leading-8 ${
                    darkMode
                      ? "text-blue-100/70"
                      : "text-[#607592]"
                  }`}
                >
                  Every trusted decision starts with trusted data.
                  CSVify gives teams visibility into quality,
                  validation and lineage before insights reach the
                  dashboard.
                </p>

                <button
                  onClick={() => router.push("/register")}
                  className="mt-8 h-13 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:-translate-y-1 transition"
                >
                  Start Building Trust
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TrustBox
                  value="98%"
                  label="Completeness"
                  darkMode={darkMode}
                />

                <TrustBox
                  value="95%"
                  label="Accuracy"
                  darkMode={darkMode}
                />

                <TrustBox
                  value="93%"
                  label="Consistency"
                  darkMode={darkMode}
                />

                <TrustBox
                  value="96"
                  label="Trust Score"
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================= */}

      <section
        id="about"
        className={`relative py-24 ${
          darkMode ? "bg-[#061732]" : "bg-white"
        }`}
      >
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/20">
            <Database className="w-8 h-8 text-white" />
          </div>

          <h2
            className={`mt-6 text-4xl md:text-5xl font-black ${
              darkMode ? "text-white" : "text-[#102b52]"
            }`}
          >
            About CSVify
          </h2>

          <p
            className={`mt-6 text-lg leading-8 max-w-3xl mx-auto ${
              darkMode
                ? "text-blue-100/70"
                : "text-[#607592]"
            }`}
          >
            CSVify is a Data Trust Layer designed to bridge
            the gap between messy raw datasets and reliable business
            decisions. It combines data cleaning, validation,
            quality scoring, lineage and analytics into one
            transparent workflow.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <SmallBadge
              icon={<ShieldCheck />}
              text="Trust First"
              darkMode={darkMode}
            />

            <SmallBadge
              icon={<GitBranch />}
              text="Explainable"
              darkMode={darkMode}
            />

            <SmallBadge
              icon={<MonitorCheck />}
              text="Monitored"
              darkMode={darkMode}
            />

            <SmallBadge
              icon={<BarChart3 />}
              text="Analytics Ready"
              darkMode={darkMode}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="relative py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-10 md:p-16 text-center shadow-2xl shadow-blue-600/20">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <Sparkles className="w-10 h-10 text-white mx-auto mb-5" />

              <h2 className="text-4xl md:text-5xl font-black text-white">
                Ready to Trust Your Data?
              </h2>

              <p className="mt-5 text-blue-100 max-w-2xl mx-auto">
                Create your account and start turning messy data
                into reliable decisions.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => router.push("/register")}
                  className="h-13 px-7 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 hover:-translate-y-1 transition shadow-lg flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Get Started
                </button>

                <button
                  onClick={() => router.push("/login")}
                  className="h-13 px-7 rounded-xl border border-white/40 bg-white/10 text-white font-bold hover:bg-white/20 hover:-translate-y-1 transition flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer
        className={`border-t ${
          darkMode
            ? "border-blue-900/40 bg-[#031024]"
            : "border-blue-100 bg-[#f7faff]"
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            <div>
              <div
                className={`font-bold tracking-wider ${
                  darkMode ? "text-white" : "text-[#17365f]"
                }`}
              >
                CSVify
              </div>

              <div className="text-[10px] text-blue-500 uppercase tracking-wider">
                Data Trust Layer
              </div>
            </div>
          </div>

          <div
            className={`text-xs ${
              darkMode
                ? "text-blue-200/50"
                : "text-[#8292a9]"
            }`}
          >
            Because good decisions need good data.
          </div>

          <div
            className={`text-xs ${
              darkMode
                ? "text-blue-200/40"
                : "text-[#9aa8ba]"
            }`}
          >
            © 2026 CSVify
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   NAV LINK
========================================================= */

function NavLink({
  children,
  href,
  darkMode,
}: {
  children: React.ReactNode;
  href: string;
  darkMode: boolean;
}) {
  return (
    <a
      href={href}
      className={`text-sm font-semibold transition hover:text-blue-500 ${
        darkMode ? "text-blue-100/75" : "text-[#526987]"
      }`}
    >
      {children}
    </a>
  );
}

/* =========================================================
   MOBILE NAV LINK
========================================================= */

function MobileNavLink({
  children,
  href,
  darkMode,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  darkMode: boolean;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`font-semibold ${
        darkMode ? "text-blue-100" : "text-[#526987]"
      }`}
    >
      {children}
    </a>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
  darkMode,
}: {
  eyebrow: string;
  title: string;
  description: string;
  darkMode: boolean;
}) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="text-blue-500 text-xs font-black tracking-[0.2em] uppercase">
        {eyebrow}
      </div>

      <h2
        className={`mt-3 text-4xl md:text-5xl font-black ${
          darkMode ? "text-white" : "text-[#102b52]"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-5 leading-7 ${
          darkMode
            ? "text-blue-100/65"
            : "text-[#657994]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  number,
  title,
  description,
  darkMode,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`group relative rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        darkMode
          ? "bg-[#081b38] border-blue-900/60 hover:border-blue-500/50 hover:shadow-blue-900/20"
          : "bg-white border-blue-100 hover:border-blue-300 hover:shadow-blue-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition">
          {icon}
        </div>

        <span
          className={`text-xs font-black ${
            darkMode
              ? "text-blue-400/50"
              : "text-blue-200"
          }`}
        >
          {number}
        </span>
      </div>

      <h3
        className={`mt-6 text-xl font-bold ${
          darkMode ? "text-white" : "text-[#17365f]"
        }`}
      >
        {title}
      </h3>

      <p
        className={`mt-3 text-sm leading-6 ${
          darkMode
            ? "text-blue-100/60"
            : "text-[#71839d]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   PROCESS CARD
========================================================= */

function ProcessCard({
  number,
  icon,
  title,
  text,
  darkMode,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`group relative rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-2 ${
        darkMode
          ? "bg-[#081b38] border-blue-900/60 hover:border-blue-500"
          : "bg-[#f8fbff] border-blue-100 hover:border-blue-300 hover:shadow-xl"
      }`}
    >
      <div className="text-[10px] font-black tracking-wider text-blue-500">
        STEP {number}
      </div>

      <div className="mx-auto mt-4 w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition shadow-lg shadow-blue-600/20">
        {icon}
      </div>

      <h3
        className={`mt-5 font-bold ${
          darkMode ? "text-white" : "text-[#17365f]"
        }`}
      >
        {title}
      </h3>

      <p
        className={`mt-2 text-xs leading-5 ${
          darkMode
            ? "text-blue-100/55"
            : "text-[#7b8da5]"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   TRUST BOX
========================================================= */

function TrustBox({
  value,
  label,
  darkMode,
}: {
  value: string;
  label: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 text-center transition hover:-translate-y-1 ${
        darkMode
          ? "bg-[#0b2347] border-blue-800/60"
          : "bg-white border-blue-100 shadow-sm"
      }`}
    >
      <div className="text-3xl font-black text-blue-600">
        {value}
      </div>

      <div
        className={`mt-2 text-xs font-semibold ${
          darkMode
            ? "text-blue-100/60"
            : "text-[#71839d]"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

/* =========================================================
   MINI METRIC
========================================================= */

function MiniMetric({
  label,
  value,
  darkMode,
}: {
  label: string;
  value: number;
  darkMode: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span
          className={`text-[10px] ${
            darkMode
              ? "text-blue-100/60"
              : "text-[#71839d]"
          }`}
        >
          {label}
        </span>

        <span className="text-[10px] font-bold text-blue-500">
          {value}%
        </span>
      </div>

      <div
        className={`h-1.5 rounded-full overflow-hidden ${
          darkMode ? "bg-blue-950" : "bg-blue-100"
        }`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   GRAPHIC STEP
========================================================= */

function GraphicStep({
  icon,
  label,
  darkMode,
}: {
  icon: React.ReactNode;
  label: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center transition hover:-translate-y-1 ${
        darkMode
          ? "bg-blue-950/40 border-blue-800/60"
          : "bg-blue-50 border-blue-100"
      }`}
    >
      <div className="text-blue-500 flex justify-center">
        {icon}
      </div>

      <div
        className={`mt-2 text-[10px] font-bold ${
          darkMode
            ? "text-blue-100/70"
            : "text-[#5f7593]"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

/* =========================================================
   SMALL BADGE
========================================================= */

function SmallBadge({
  icon,
  text,
  darkMode,
}: {
  icon: React.ReactNode;
  text: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold ${
        darkMode
          ? "border-blue-800 bg-blue-950/50 text-blue-200"
          : "border-blue-100 bg-blue-50 text-blue-700"
      }`}
    >
      <span className="text-blue-500">{icon}</span>
      {text}
    </div>
  );
}