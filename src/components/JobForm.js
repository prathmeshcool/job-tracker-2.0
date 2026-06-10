import { useState } from "react";

const inp = {
  width: "100%",
  padding: "10px 12px",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  color: "var(--text)",
  fontSize: 14,
  fontFamily: "var(--font)",
  outline: "none",
  transition: "border-color 0.18s",
};

const focus = (e) => (e.target.style.borderColor = "var(--accent)");
const blur  = (e) => (e.target.style.borderColor = "var(--border)");

export default function JobForm({ onAdd, loading }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    company: "", role: "", status: "Applied",
    location: "", jobLink: "", salary: "", resumeVersion: "",
  });
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and Role are required");
      return;
    }
    setError("");
    const ok = await onAdd(form);
    if (ok) {
      setForm({ company: "", role: "", status: "Applied", location: "", jobLink: "", salary: "", resumeVersion: "" });
      setOpen(false);
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 18px",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            border: "none", borderRadius: "var(--radius)",
            color: "white", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font)",
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Application
        </button>
      ) : (
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>New Application</h3>
            <button onClick={() => setOpen(false)} style={{
              background: "transparent", border: "none", color: "var(--text3)",
              cursor: "pointer", fontSize: 20, lineHeight: 1,
            }}>×</button>
          </div>

          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "var(--radius)", padding: "9px 14px",
              fontSize: 13, color: "var(--danger)", marginBottom: 16,
            }}>{error}</div>
          )}

          <form onSubmit={submit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 5 }}>
                  Company *
                </label>
                <input style={inp} name="company" placeholder="e.g. Google" value={form.company} onChange={handle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 5 }}>
                  Role *
                </label>
                <input style={inp} name="role" placeholder="e.g. Software Engineer" value={form.role} onChange={handle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 5 }}>
                  Status
                </label>
                <select style={{ ...inp, cursor: "pointer" }} name="status" value={form.status} onChange={handle}>
                  <option>Applied</option>
                  <option>OA</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 5 }}>
                  Location
                </label>
                <input style={inp} name="location" placeholder="e.g. Remote, Bangalore" value={form.location} onChange={handle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 5 }}>
                  Salary
                </label>
                <input style={inp} name="salary" placeholder="e.g. 25 LPA" value={form.salary} onChange={handle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 5 }}>
                  Resume Version
                </label>
                <input style={inp} name="resumeVersion" placeholder="e.g. v3-backend" value={form.resumeVersion} onChange={handle} onFocus={focus} onBlur={blur} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", display: "block", marginBottom: 5 }}>
                Job Link
              </label>
              <input style={inp} name="jobLink" placeholder="https://..." value={form.jobLink} onChange={handle} onFocus={focus} onBlur={blur} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1, padding: "11px",
                  background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                  border: "none", borderRadius: "var(--radius)",
                  color: "white", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "var(--font)",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Saving..." : "Save Application"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  padding: "11px 18px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--text2)",
                  cursor: "pointer", fontFamily: "var(--font)", fontSize: 14,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
