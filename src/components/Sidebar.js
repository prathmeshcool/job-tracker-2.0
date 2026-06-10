import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  Applied: "var(--accent)",
  OA: "var(--warning)",
  Interview: "var(--success)",
  Offer: "var(--offer)",
  Rejected: "var(--danger)",
};

export default function Sidebar({ stats, activeFilter, onFilter }) {
  const { user, logout } = useAuth();

  const filters = ["All", "Applied", "OA", "Interview", "Offer", "Rejected"];

  return (
    <aside style={{
      width: 240,
      minHeight: "100vh",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🎯</div>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" }}>JobTracker</span>
        </div>
      </div>

      {/* Filters */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>
          Filter by Status
        </p>
        {filters.map((f) => {
          const count = f === "All" ? stats?.total : stats?.[f];
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => onFilter(f)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 10px",
                borderRadius: "var(--radius)",
                border: "none",
                background: isActive ? "var(--surface2)" : "transparent",
                color: isActive ? "var(--text)" : "var(--text2)",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "var(--font)",
                transition: "var(--transition)",
                marginBottom: 2,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {f !== "All" && (
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: STATUS_COLORS[f] || "var(--text3)",
                    flexShrink: 0,
                  }} />
                )}
                {f}
              </span>
              {count !== undefined && (
                <span style={{
                  background: isActive ? "var(--border2)" : "var(--surface2)",
                  color: "var(--text2)",
                  fontSize: 12,
                  padding: "1px 7px",
                  borderRadius: 20,
                  fontFamily: "var(--mono)",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ overflow: "hidden" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.name}
          </p>
          <p style={{ fontSize: 12, color: "var(--text3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.email}
          </p>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 7,
            color: "var(--text3)",
            cursor: "pointer",
            padding: "6px 8px",
            fontSize: 14,
            flexShrink: 0,
            transition: "var(--transition)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--danger)";
            e.currentTarget.style.color = "var(--danger)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text3)";
          }}
        >
          ↪
        </button>
      </div>
    </aside>
  );
}
