import { useState, useEffect, useCallback } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";
import SearchFilter from "../components/SearchFilter";

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDashboard, setShowDashboard] = useState(true);

  const fetchStats = useCallback(async () => {
    const res = await api.get("/jobs/stats");
    setStats(res.data);
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filter !== "All") params.append("status", filter);
      if (search) params.append("search", search);
      const res = await api.get(`/jobs?${params}`);
      setJobs(res.data.jobs);
      setPages(res.data.pages);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { setPage(1); }, [filter, search]);
  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleAdd = async (form) => {
    setAddLoading(true);
    try {
      await api.post("/jobs", form);
      fetchJobs();
      fetchStats();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add job");
      return false;
    } finally {
      setAddLoading(false);
    }
  };

  // Called with (id, patch) for field updates, or (id, null, updatedJob) for note ops
  const handleUpdate = async (id, patch, updatedJob) => {
    if (updatedJob) {
      setJobs((prev) => prev.map((j) => (j._id === id ? updatedJob : j)));
      return;
    }
    try {
      const res = await api.put(`/jobs/${id}`, patch);
      setJobs((prev) => prev.map((j) => (j._id === id ? res.data : j)));
      fetchStats();
    } catch (err) {
      setError("Failed to update job");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      fetchStats();
    } catch (err) {
      setError("Failed to delete job");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar stats={stats} activeFilter={filter} onFilter={(f) => setFilter(f)} />

      <main style={{ flex: 1, padding: "32px", overflowY: "auto", minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 4 }}>
              {filter === "All" ? "All Applications" : filter}
            </h1>
            <p style={{ fontSize: 14, color: "var(--text3)" }}>
              Track and manage your job search
            </p>
          </div>
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", color: "var(--text2)",
              cursor: "pointer", padding: "9px 14px", fontSize: 13,
              fontFamily: "var(--font)", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {showDashboard ? "📊 Hide Stats" : "📊 Show Stats"}
          </button>
        </div>

        {error && (
          <div style={{
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: "var(--radius)", padding: "10px 14px",
            fontSize: 13, color: "var(--danger)", marginBottom: 16,
            display: "flex", justifyContent: "space-between",
          }}>
            {error}
            <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>✕</button>
          </div>
        )}

        {/* Dashboard */}
        {showDashboard && <Dashboard stats={stats} />}

        {/* Add form */}
        <JobForm onAdd={handleAdd} loading={addLoading} />

        {/* Search */}
        <SearchFilter search={search} onSearch={setSearch} />

        {/* Jobs list */}
        <JobList
          jobs={jobs}
          loading={loading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          page={page}
          pages={pages}
          onPage={setPage}
        />
      </main>
    </div>
  );
}
