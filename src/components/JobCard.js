import { useState } from "react";
import api from "../api";

const STATUS_STYLES = {
  Applied:   { color: "#6c8ef5", bg: "rgba(108,142,245,0.12)" },
  OA:        { color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  Interview: { color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  Offer:     { color: "#a3e635", bg: "rgba(163,230,53,0.12)" },
  Rejected:  { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export default function JobCard({ job, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    company: job.company, role: job.role, status: job.status,
    location: job.location || "", salary: job.salary || "",
    jobLink: job.jobLink || "", resumeVersion: job.resumeVersion || "",
  });
  const [loadingNote, setLoadingNote] = useState(false);

  const statusStyle = STATUS_STYLES[job.status] || STATUS_STYLES["Applied"];

  const handleStatusChange = async (e) => {
    await onUpdate(job._id, { status: e.target.value });
  };

  const handleEditSave = async () => {
    await onUpdate(job._id, editForm);
    setEditMode(false);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setLoadingNote(true);
    try {
      const res = await api.post(`/jobs/${job._id}/notes`, { text: noteText });
      onUpdate(job._id, null, res.data); // pass updated job
      setNoteText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const res = await api.delete(`/jobs/${job._id}/notes/${noteId}`);
    onUpdate(job._id, null, res.data);
  };

  const inp = {
    background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 7, color: "var(--text)", fontSize: 13,
    fontFamily: "var(--font)", padding: "7px 10px", outline: "none",
  };

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      marginBottom: 8,
      transition: "border-color 0.18s",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border2)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Main row */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "14px 16px", gap: 12,
      }}>
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "transparent", border: "none",
            color: "var(--text3)", cursor: "pointer",
            fontSize: 12, padding: 4, flexShrink: 0,
            transition: "transform 0.18s",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >▶</button>

        {/* Company + role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {job.company}
          </p>
          <p style={{ fontSize: 12, color: "var(--text2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {job.role}
            {job.location && <span style={{ color: "var(--text3)" }}> · {job.location}</span>}
          </p>
        </div>

        {/* Date */}
        <span style={{ fontSize: 12, color: "var(--text3)", flexShrink: 0, fontFamily: "var(--mono)" }}>
          {new Date(job.dateApplied || job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>

        {/* Status badge/select */}
        <select
          value={job.status}
          onChange={handleStatusChange}
          style={{
            padding: "5px 8px",
            borderRadius: 20,
            border: "none",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font)",
            cursor: "pointer",
            background: statusStyle.bg,
            color: statusStyle.color,
            flexShrink: 0,
          }}
        >
          {["Applied","OA","Interview","Offer","Rejected"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Notes indicator */}
        {job.notes?.length > 0 && (
          <span style={{
            fontSize: 11, color: "var(--text3)",
            background: "var(--surface2)", padding: "3px 7px",
            borderRadius: 20, flexShrink: 0,
            fontFamily: "var(--mono)",
          }}>
            {job.notes.length} note{job.notes.length > 1 ? "s" : ""}
          </span>
        )}

        {/* Link */}
        {job.jobLink && (
          <a href={job.jobLink} target="_blank" rel="noreferrer" style={{
            fontSize: 14, color: "var(--accent)", textDecoration: "none", flexShrink: 0,
          }} title="Open job link">🔗</a>
        )}

        {/* Delete */}
        <button
          onClick={() => onDelete(job._id)}
          style={{
            background: "transparent", border: "none",
            color: "var(--text3)", cursor: "pointer", fontSize: 16,
            padding: "2px 4px", flexShrink: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text3)")}
          title="Delete"
        >✕</button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "16px",
        }}>
          {!editMode ? (
            <>
              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
                {[
                  ["Salary", job.salary],
                  ["Resume", job.resumeVersion],
                  ["Location", job.location],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                    <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{value}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setEditMode(true)}
                style={{
                  background: "transparent", border: "1px solid var(--border)",
                  borderRadius: 7, color: "var(--text2)", cursor: "pointer",
                  padding: "7px 14px", fontSize: 13, fontFamily: "var(--font)",
                  marginBottom: 16,
                }}
              >
                ✏️ Edit Details
              </button>
            </>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                {[["company","Company"],["role","Role"],["location","Location"],["salary","Salary"],["resumeVersion","Resume Version"],["jobLink","Job Link"]].map(([name, label]) => (
                  <div key={name}>
                    <label style={{ fontSize: 11, color: "var(--text3)", display: "block", marginBottom: 4 }}>{label}</label>
                    <input style={{ ...inp, width: "100%" }} value={editForm[name]} onChange={(e) => setEditForm({ ...editForm, [name]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleEditSave} style={{ padding: "8px 16px", background: "var(--accent)", border: "none", borderRadius: 7, color: "white", cursor: "pointer", fontSize: 13, fontFamily: "var(--font)", fontWeight: 600 }}>
                  Save
                </button>
                <button onClick={() => setEditMode(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text2)", cursor: "pointer", fontSize: 13, fontFamily: "var(--font)" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Notes
            </p>

            {job.notes?.map((note) => (
              <div key={note._id} style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                gap: 10, padding: "9px 12px", background: "var(--surface2)",
                borderRadius: 8, marginBottom: 6,
              }}>
                <div>
                  <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{note.text}</p>
                  <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>
                    {new Date(note.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  style={{ background: "transparent", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 14, flexShrink: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text3)")}
                >✕</button>
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                style={{ ...inp, flex: 1 }}
                placeholder="Add a note (interview date, feedback...)"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                disabled={loadingNote || !noteText.trim()}
                style={{
                  padding: "7px 14px", background: "var(--surface2)",
                  border: "1px solid var(--border)", borderRadius: 7,
                  color: "var(--text2)", cursor: "pointer", fontSize: 13,
                  fontFamily: "var(--font)", opacity: loadingNote ? 0.6 : 1,
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
