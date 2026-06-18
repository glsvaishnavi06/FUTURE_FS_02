import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function App() {
  const [leads, setLeads] = useState([]);

  const loadLeads = async () => {
  try {
    const res = await axios.get("http://localhost:5000/leads");
    setLeads(res.data);
  } catch (error) {
    console.error("Error loading leads:", error);
  }
};

useEffect(() => {
  loadLeads();
}, []);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    notes: ""
  });

const addLead = async () => {
  try {
    if (!form.name || !form.email) {
      alert("Name and Email are required");
      return;
    }

    const payload = {
      ...form,
      status: "new"   // IMPORTANT FIX (your UI depends on this)
    };

    const res = await axios.post(`${API}/leads`, payload);

    console.log("Lead added:", res.data);

    setForm({
      name: "",
      email: "",
      phone: "",
      source: "",
      notes: ""
    });

    loadLeads(); // refresh table
  } catch (error) {
    console.error("Error adding lead:", error.response?.data || error.message);
    alert("Failed to add lead. Check backend.");
  }
};

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/leads/${id}`, { status });
      loadLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id) => {
    try {
      await axios.delete(`${API}/leads/${id}`);
      loadLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" || lead.status === filter;

    return matchSearch && matchFilter;
  });

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const contactedLeads = leads.filter(
    (l) => l.status === "contacted"
  ).length;
  const convertedLeads = leads.filter(
    (l) => l.status === "converted"
  ).length;

  const inputStyle = {
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  minWidth: "180px"
  }; 

  const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
  verticalAlign: "top",
  wordBreak: "break-word"
}; 

  return (
  <div
    style={{
      padding: "30px",
      background: "#f8fafc",
      minHeight: "100vh",
      fontFamily: "Segoe UI, sans-serif"
    }}
  >
    {/* HEADER */}
    <h1
      style={{
        textAlign: "center",
        color: "#1e293b",
        marginBottom: "30px",
        fontSize: "38px",
        fontWeight: "700"
      }}
    >
      Mini CRM Dashboard
    </h1>

    {/* DASHBOARD CARDS */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "30px"
      }}
    >
      <div
        style={{
          background: "#2563eb",
          color: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(37,99,235,0.2)"
        }}
      >
        <h3>Total Leads</h3>
        <h1>{totalLeads}</h1>
      </div>

      <div
        style={{
          background: "#0ea5e9",
          color: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(14,165,233,0.2)"
        }}
      >
        <h3>New Leads</h3>
        <h1>{newLeads}</h1>
      </div>

      <div
        style={{
          background: "#f59e0b",
          color: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(245,158,11,0.2)"
        }}
      >
        <h3>Contacted</h3>
        <h1>{contactedLeads}</h1>
      </div>

      <div
        style={{
          background: "#10b981",
          color: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(16,185,129,0.2)"
        }}
      >
        <h3>Converted</h3>
        <h1>{convertedLeads}</h1>
      </div>
    </div>

    {/* ADD LEAD */}
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginBottom: "25px"
      }}
    >
      <h2>Add Lead</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Source"
          value={form.source}
          onChange={(e) =>
            setForm({ ...form, source: e.target.value })
          }
          style={inputStyle}
        />

        <input
          placeholder="Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
          style={inputStyle}
        />

        <button
          onClick={addLead}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Add Lead
        </button>
      </div>
    </div>

    {/* SEARCH */}
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px",
    minWidth: "900px"
  }}
>
      <input
        placeholder="Search Leads..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={inputStyle}
      >
        <option value="all">All</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="converted">Converted</option>
      </select>
    </div>

    {/* TABLE */}
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}
    >
      <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  }}
>
  <thead>
    <tr style={{ background: "#f1f5f9" }}>
      {["Name", "Email", "Phone", "Source", "Notes", "Status", "Actions"].map((h) => (
        <th
          key={h}
          style={{
            padding: "12px",
            borderBottom: "1px solid #e2e8f0",
            whiteSpace: "nowrap"
          }}
        >
          {h}
        </th>
      ))}
    </tr>
  </thead>

  <tbody>
    {filteredLeads.map((lead) => (
      <tr key={lead._id}>
        <td style={cellStyle}>{lead.name}</td>
        <td style={cellStyle}>{lead.email}</td>
        <td style={cellStyle}>{lead.phone}</td>
        <td style={cellStyle}>{lead.source}</td>
        <td style={cellStyle}>{lead.notes}</td>

        <td style={cellStyle}>
          <span style={{
            padding: "6px 10px",
            borderRadius: "12px",
            color: "white",
            background:
              lead.status === "converted"
                ? "#10b981"
                : lead.status === "contacted"
                ? "#f59e0b"
                : "#64748b"
          }}>
            {lead.status}
          </span>
        </td>

        <td style={cellStyle}>
          <button onClick={() => updateStatus(lead._id, "contacted")}>
            Contacted
          </button>

          <button
            onClick={() => updateStatus(lead._id, "converted")}
            style={{ marginLeft: "6px" }}
          >
            Converted
          </button>

          <button
            onClick={() => deleteLead(lead._id)}
            style={{ marginLeft: "6px", color: "red" }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  </div>
);
}

export default App;