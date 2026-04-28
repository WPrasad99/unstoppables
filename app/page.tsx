"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, ArrowRight, Loader2, LogOut, Copy, CheckCircle2, Upload } from "lucide-react";
import TopBar from "@/components/TopBar";
import BiasSummaryCard from "@/components/cards/BiasSummaryCard";
import SelectionBarChart from "@/components/charts/SelectionBarChart";
import DecisionPieChart from "@/components/charts/DecisionPieChart";
import LiveFeedTable from "@/components/table/LiveFeedTable";
import AlertsPanel from "@/components/panels/AlertsPanel";
import RecommendationsPanel from "@/components/panels/RecommendationsPanel";
import DownloadReportButton from "@/components/DownloadReportButton";
import UploadDataButton from "@/components/UploadDataButton";

interface BiasData {
  company_id: string;
  company_name: string;
  fairness_percentage: number;
  bias_score: number;
  bias_level: "Low" | "Medium" | "High";
  male_selection_rate: number;
  female_selection_rate: number;
  total_selected: number;
  total_rejected: number;
  total_decisions: number;
  alerts: string[];
  recommendations: string[];
  recent_decisions: {
    id: string;
    gender: string;
    decision: string;
    timestamp: string;
  }[];
}

type AppState = "auth" | "loading" | "dashboard" | "error" | "empty";

export default function Home() {
  const [companyId, setCompanyId] = useState("");
  const [password, setPassword] = useState("");
  const [appState, setAppState] = useState<AppState>("auth");
  const [data, setData] = useState<BiasData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem("bias_monitor_company_id");
    const savedPass = localStorage.getItem("bias_monitor_password");
    if (savedId && savedPass) {
      setCompanyId(savedId);
      setPassword(savedPass);
      setAppState("loading");
    }
  }, []);

  // Fetch results
  const fetchResults = useCallback(async (id: string, pass: string) => {
    try {
      const res = await fetch("/api/results", {
        headers: { 
          "x-company-id": id,
          "x-password": pass
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch results");
      }

      const json: BiasData = await res.json();
      setData(json);
      setLastUpdated(new Date());

      if (json.total_decisions === 0) {
        setAppState("empty");
      } else {
        setAppState("dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Connection failed");
      setAppState("error");
    }
  }, []);


  // Connect with API key
  const handleConnect = async () => {
    const trimmedId = companyId.trim();
    const trimmedPass = password.trim();
    if (!trimmedId || !trimmedPass) return;

    setErrorMessage("");
    setAppState("loading");

    try {
      const res = await fetch("/api/results", {
        headers: { 
          "x-company-id": trimmedId,
          "x-password": trimmedPass
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unauthorized access");
      }

      const json: BiasData = await res.json();
      localStorage.setItem("bias_monitor_company_id", trimmedId);
      localStorage.setItem("bias_monitor_password", trimmedPass);
      setData(json);
      setLastUpdated(new Date());
      setAppState(json.total_decisions === 0 ? "empty" : "dashboard");
    } catch (err: any) {
      setErrorMessage(err.message);
      setAppState("auth");
      alert("Error: " + err.message);
    }
  };

  // Disconnect
  const handleDisconnect = () => {
    localStorage.removeItem("bias_monitor_company_id");
    localStorage.removeItem("bias_monitor_password");
    setCompanyId("");
    setPassword("");
    setData(null);
    setAppState("auth");
  };

  // Polling every 3 seconds
  useEffect(() => {
    if (!companyId || !password) return;

    fetchResults(companyId, password);

    const interval = setInterval(() => {
      fetchResults(companyId, password);
    }, 3000);

    return () => clearInterval(interval);
  }, [companyId, password, fetchResults]);

  // ────────────────────────────
  // AUTH SCREEN (Split-Pane Design)
  // ────────────────────────────
  if (appState === "auth") {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 overflow-x-hidden">
        {/* Sticky Navbar */}
        <nav className="nav-pill">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg" />
            <span className="font-black tracking-tighter text-lg uppercase">Audit</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">Solutions</a>
            <a href="#audit" className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">Client Node</a>
            <a href="#compliance" className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">Compliance</a>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById("audit");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
          >
            Access
          </button>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
          <div className="grid-background absolute inset-0 opacity-20" />
          <div className="hero-glow" />
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 text-center max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Trusted by Ethics Boards Worldwide</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent uppercase">
              Audit the <br /> <span className="text-white">Black Box</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Uncover algorithmic bias in real-time. Ensure fairness, maintain compliance, and build radical transparency into your AI systems.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-all"
              >
                Launch Monitor Node
              </button>
              <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
                View Documentation
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
             <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em]">Scroll to Audit</span>
             <div className="w-[1px] h-10 bg-gradient-to-b from-zinc-700 to-transparent" />
          </motion.div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Core AI Solutions</h2>
            <p className="text-zinc-500 font-medium">From automation to analytics, we turn your vision into fair AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
             {/* Card 1: Large */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-8 bento-card flex flex-col justify-between group"
             >
                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <KeyRound className="w-6 h-6 text-purple-500" />
                   </div>
                   <h3 className="text-2xl font-bold">Real-time Bias Hub</h3>
                   <p className="text-zinc-500 max-w-md">Our live audit engine monitors decisions as they happen, calculating fairness scores with sub-millisecond latency.</p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                   {[84, 92, 78].map((v, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                         <div className="text-xs text-zinc-600 font-black uppercase mb-1">Node {i+1}</div>
                         <div className="text-xl font-black">{v}%</div>
                      </div>
                   ))}
                </div>
             </motion.div>

             {/* Card 2: Small */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-4 bento-card bg-gradient-to-br from-cyan-500/10 to-transparent flex flex-col justify-between"
             >
                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                   </div>
                   <h3 className="text-2xl font-bold">Certified Audits</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Generate immutable compliance reports recognized by global ethics standards including GDPR and EU AI Act.
                </p>
             </motion.div>

             {/* Card 3: Small */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-4 bento-card bg-gradient-to-bl from-purple-500/10 to-transparent flex flex-col justify-between"
             >
                <div className="space-y-4">
                   <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-purple-500" />
                   </div>
                   <h3 className="text-2xl font-bold">Smart Alerts</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Instant notifications for disparate impact spikes, allowing for immediate algorithmic recalibration.
                </p>
             </motion.div>

             {/* Card 4: Medium */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-8 bento-card flex items-center justify-center relative group"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-center z-10">
                   <div className="text-4xl font-black mb-2 uppercase">99.9%</div>
                   <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Audit Precision</div>
                </div>
             </motion.div>
          </div>
        </section>

        {/* Audit / Login Section */}
        <section id="audit" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
             <div className="lg:w-1/2 space-y-8">
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Access Your <br /> Audit Node</h2>
                <p className="text-zinc-500 text-lg max-w-md">Connect your corporate identity to view live fairness analytics and manage your compliance reports.</p>
                
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                         <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Demo Access Ready</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Company ID</p>
                         <code className="text-xs text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">demo-company</code>
                      </div>
                      <div>
                         <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Password</p>
                         <code className="text-xs text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">password123</code>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Side: Login Form (Reduced Size) */}
             <div className="lg:w-1/2 w-full max-w-md">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="p-10 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl relative"
                >
                   <div className="absolute top-0 right-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                   
                   <div className="space-y-8">
                      <div className="space-y-2">
                         <h3 className="text-xl font-bold uppercase tracking-tight">Authorize Node</h3>
                         <p className="text-xs text-zinc-500 font-medium">Verify credentials to enter dashboard.</p>
                      </div>

                      <div className="space-y-4">
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Company ID</label>
                            <input
                              type="text"
                              value={companyId}
                              onChange={(e) => setCompanyId(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                              placeholder="ID"
                              className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder-zinc-800 focus:border-purple-500/40 focus:bg-white/[0.05] transition-all outline-none text-sm"
                            />
                         </div>

                         <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Access Password</label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                              placeholder="••••••••"
                              className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder-zinc-800 focus:border-cyan-500/40 focus:bg-white/[0.05] transition-all outline-none text-sm"
                            />
                         </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConnect}
                        disabled={!companyId.trim() || !password.trim()}
                        className="w-full py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all"
                      >
                        Enter Node
                      </motion.button>
                   </div>
                </motion.div>
             </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5 px-6">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-white rounded-md" />
                 <span className="font-black tracking-tighter text-sm uppercase">Audit Monitor</span>
              </div>
              <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em]">Antigravity Infrastructure • V2.0.4</p>
              <div className="flex gap-6">
                 <a href="#" className="text-zinc-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">Twitter</a>
                 <a href="#" className="text-zinc-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest">LinkedIn</a>
              </div>
           </div>
        </footer>
      </div>
    );
  }

  // ────────────────────────────
  // LOADING SCREEN
  // ────────────────────────────
  if (appState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
          </div>
          <p className="text-gray-400 text-lg font-medium tracking-tight">Syncing Live Bias Hub…</p>
        </motion.div>
      </div>
    );
  }

  // ────────────────────────────
  // ERROR SCREEN
  // ────────────────────────────
  if (appState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-md w-full text-center border-red-500/20"
        >
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
            <LogOut className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-3">
            Authorization Denied
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed">{errorMessage}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDisconnect}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-lg font-bold hover:bg-white/10 transition-all"
          >
            Reconnect System
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ────────────────────────────
  // EMPTY STATE (connected but no data)
  // ────────────────────────────
  if (appState === "empty") {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-black">
        <TopBar
          companyName={data?.company_name}
          totalDecisions={0}
          lastUpdated={lastUpdated}
          isConnected={true}
        />
        <div className="flex items-center justify-center" style={{ minHeight: "75vh" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 max-w-2xl w-full text-center"
          >
            <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-8">
              <Upload className="w-10 h-10 text-cyan-400 animate-bounce" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Awaiting First Decisions
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Authorized. Your monitoring node is active. Send data via API or upload a historical file to begin analysis.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <UploadDataButton companyId={companyId} password={password} onSuccess={() => fetchResults(companyId, password)} />
              <button
                onClick={() => { }} // Could trigger an API hint modal
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold hover:bg-white/5 transition-all cursor-default opacity-50"
              >
                SDK Integration Ready
              </button>
            </div>

            <code className="text-sm text-cyan-400 block bg-black/50 p-6 rounded-2xl text-left border border-white/5 overflow-x-auto whitespace-pre">
              {`curl -X POST http://localhost:3000/api/decision \\
  -H "x-company-id: ${companyId}" \\
  -H "x-password: ${password}" \\
  -d '{"gender":"female","decision":"selected"}'`}
            </code>
            <button
              onClick={handleDisconnect}
              className="mt-10 text-sm text-gray-500 hover:text-white flex items-center gap-2 mx-auto transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Reset Connection
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ────────────────────────────
  // MAIN DASHBOARD
  // ────────────────────────────
  return (
    <div className="min-h-screen p-4 sm:p-10 bg-black">
      {/* Top Bar */}
      <TopBar
        companyName={data?.company_name}
        totalDecisions={data?.total_decisions || 0}
        lastUpdated={lastUpdated}
        isConnected={true}
      />

      {/* Actions Row */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mb-10">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <UploadDataButton companyId={companyId} password={password} onSuccess={() => fetchResults(companyId, password)} />
          <DownloadReportButton data={data} companyName={data?.company_name} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDisconnect}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-gray-400 text-sm font-bold hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </motion.button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Row 1: Summary + Bar Chart + Pie Chart */}
            <BiasSummaryCard
              fairnessPercentage={data.fairness_percentage}
              biasScore={data.bias_score}
              biasLevel={data.bias_level}
              totalDecisions={data.total_decisions}
            />
            <SelectionBarChart
              maleSelectionRate={data.male_selection_rate}
              femaleSelectionRate={data.female_selection_rate}
            />
            <DecisionPieChart
              totalSelected={data.total_selected}
              totalRejected={data.total_rejected}
            />

            {/* Row 2: Live Feed (spans 2 cols) + Right Sidebar (Alerts + Recommendations) */}
            <div className="lg:col-span-2">
              <LiveFeedTable decisions={data.recent_decisions} />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-8">
              <AlertsPanel alerts={data.alerts} />
              <RecommendationsPanel recommendations={data.recommendations} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
