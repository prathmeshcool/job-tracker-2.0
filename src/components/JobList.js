import JobCard from "./JobCard";

export default function JobList({ jobs, loading, onUpdate, onDelete, page, pages, onPage }) {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{
          width: 36, height: 36, border: "3px solid var(--border)",
          borderTopColor: "var(--accent)", borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
          margin: "0 auto 12px",
        }} />
        <p style={{ color: "var(--text3)", fontSize: 14 }}>Loading jobs...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "56px 24px",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>No applications yet</p>
        <p style={{ fontSize: 14, color: "var(--text3)" }}>Add your first job application above</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>
          {jobs.length} application{jobs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onUpdate={onUpdate} onDelete={onDelete} />
      ))}

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPage(p)}
              style={{
                width: 34, height: 34,
                background: p === page ? "var(--accent)" : "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: p === page ? "white" : "var(--text2)",
                cursor: "pointer", fontFamily: "var(--mono)", fontSize: 13,
                fontWeight: p === page ? 600 : 400,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
