export default function SearchFilter({ search, onSearch }) {
  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <span style={{
        position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
        color: "var(--text3)", fontSize: 15, pointerEvents: "none",
      }}>🔍</span>
      <input
        type="text"
        placeholder="Search by company or role..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px 10px 38px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          color: "var(--text)",
          fontSize: 14,
          fontFamily: "var(--font)",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.18s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />
      {search && (
        <button
          onClick={() => onSearch("")}
          style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            background: "transparent", border: "none", color: "var(--text3)",
            cursor: "pointer", fontSize: 16,
          }}
        >×</button>
      )}
    </div>
  );
}
