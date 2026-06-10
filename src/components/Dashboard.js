import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const STAT_CONFIG = [
  { key: "Applied",   color: "var(--accent)",   label: "Applied",   emoji: "📤" },
  { key: "OA",        color: "var(--warning)",   label: "Online Assessment", emoji: "📝" },
  { key: "Interview", color: "var(--success)",   label: "Interview", emoji: "🎤" },
  { key: "Offer",     color: "var(--offer)",     label: "Offer",     emoji: "🎉" },
  { key: "Rejected",  color: "var(--danger)",    label: "Rejected",  emoji: "❌" },
];

const COLORS = {
  Applied: "#6c8ef5",
  OA: "#fbbf24",
  Interview: "#34d399",
  Offer: "#a3e635",
  Rejected: "#f87171",
};

export default function Dashboard({ stats }) {
  if (!stats) return null;

  const chartData = STAT_CONFIG
    .filter((s) => stats[s.key] > 0)
    .map((s) => ({ name: s.key, value: stats[s.key] }));

  const successRate = stats.total > 0
    ? Math.round(((stats.Interview + stats.Offer) / stats.total) * 100)
    : 0;

  return (
    <div>
      {/* Stat cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
        marginBottom: 24,
      }}>
        {/* Total card */}
        <div style={{
          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)",
          borderRadius: "var(--radius)",
          padding: "18px 20px",
          gridColumn: "span 2",
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Total Applications
          </p>
          <p style={{ fontSize: 36, fontWeight: 700, color: "white", fontFamily: "var(--mono)" }}>
            {stats.total}
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
            {successRate}% interview rate
          </p>
        </div>

        {STAT_CONFIG.map(({ key, color, label, emoji }) => (
          <div key={key} style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "16px 18px",
            borderLeft: `3px solid ${color}`,
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{emoji}</div>
            <p style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", fontFamily: "var(--mono)" }}>
              {stats[key]}
            </p>
            <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div style={{
          background: "var(--surface2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "20px",
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Application Breakdown
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--text)",
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {chartData.map((entry) => (
                <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: COLORS[entry.name], flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>
                    {entry.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "var(--mono)" }}>
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
