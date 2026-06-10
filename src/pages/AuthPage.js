import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(108,142,245,0.08) 0%, transparent 70%)",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    pointerEvents: "none",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "40px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "var(--shadow)",
    position: "relative",
    zIndex: 1,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.3px",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "var(--text)",
    marginBottom: 6,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 14,
    color: "var(--text2)",
    marginBottom: 28,
  },
  tabs: {
    display: "flex",
    gap: 4,
    background: "var(--bg)",
    borderRadius: "var(--radius)",
    padding: 4,
    marginBottom: 28,
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    borderRadius: 7,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "var(--transition)",
    fontFamily: "var(--font)",
  },
  tabActive: {
    background: "var(--surface2)",
    color: "var(--text)",
    boxShadow: "var(--shadow-sm)",
  },
  tabInactive: {
    background: "transparent",
    color: "var(--text3)",
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text2)",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    fontSize: 14,
    fontFamily: "var(--font)",
    outline: "none",
    transition: "border-color var(--transition)",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    border: "none",
    borderRadius: "var(--radius)",
    color: "white",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font)",
    transition: "opacity var(--transition)",
    marginTop: 4,
  },
  error: {
    background: "rgba(248,113,113,0.1)",
    border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: "var(--radius)",
    padding: "10px 14px",
    fontSize: 13,
    color: "var(--danger)",
    marginBottom: 16,
  },
};

export default function AuthPage() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🎯</div>
          <span style={styles.logoText}>JobTracker</span>
        </div>

        <h1 style={styles.title}>
          {tab === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p style={styles.subtitle}>
          {tab === "login"
            ? "Sign in to your job tracker"
            : "Start tracking your applications"}
        </p>

        <div style={styles.tabs}>
          {["login", "register"].map((t) => (
            <button
              key={t}
              style={{
                ...styles.tab,
                ...(tab === t ? styles.tabActive : styles.tabInactive),
              }}
              onClick={() => { setTab(t); setError(""); }}
            >
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={submit}>
          {tab === "register" && (
            <>
              <label style={styles.label}>Name</label>
              <input
                style={styles.input}
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handle}
                required
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </>
          )}
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handle}
            required
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder={tab === "register" ? "Min. 6 characters" : "Password"}
            value={form.password}
            onChange={handle}
            required
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
