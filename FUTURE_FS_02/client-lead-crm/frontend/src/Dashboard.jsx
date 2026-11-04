
import { useEffect, useState } from "react";
import {getLeads,deleteLead} from "./services/leadService";
import "./css/App.css";
import AddLead from "./components/AddLead";
import Swal from "sweetalert2";


function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const result = await getLeads();
        setLeads(result.data);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
        setError("Unable to load leads. Please check your backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;
  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  const filteredLeads = leads.filter((lead) => {
  const search = searchTerm.toLowerCase().trim();

  const matchesSearch =
    lead.name.toLowerCase().includes(search) ||
    lead.email.toLowerCase().includes(search) ||
    lead.phone.toLowerCase().includes(search);

  const matchesStatus =
    statusFilter === "All" || lead.status === statusFilter;

  return matchesSearch && matchesStatus;
});

const handleDeleteLead = async (id, name) => {
  const result = await Swal.fire({
    title: "Delete Lead?",
    text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    reverseButtons: true
  });

  if (!result.isConfirmed) return;

  try {
    await deleteLead(id);

    setLeads((previous) =>
      previous.filter((lead) => lead._id !== id)
    );

    await Swal.fire({
      title: "Deleted!",
      text: "The lead has been deleted successfully.",
      icon: "success",
      confirmButtonColor: "#3984e8"
    });
  } catch (err) {
    console.error("Failed to delete lead:", err);

    Swal.fire({
      title: "Delete Failed",
      text:
        err.response?.data?.message ||
        "Unable to delete this lead. Please try again.",
      icon: "error",
      confirmButtonColor: "#3984e8"
    });
  }
};
  


  return (
    <div className="crm-app">
      <aside className="sidebar">
        {/* <h3 className="brand">
          LeadFlow<span>.</span>
        </h3> */}

        <div className="sidebar-brand">
    <span className="brand-lead">Lead</span><span className="brand-flow">Flow</span>
</div>


        <p className="menu-label">WORKSPACE</p>
        <a className="menu-item active" href="#dashboard">▦ Dashboard</a>
        <a className="menu-item" href="#leads">♧ All Leads</a>
        <a className="menu-item" href="#settings">⚙ Settings</a>

        <div className="sidebar-footer">
          <div className="avatar">HB</div>
          <div>
            <strong>Admin User</strong>
            <small>CRM Administrator</small>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">WORKSPACE / OVERVIEW</p>
            <h2>Dashboard</h2>
          </div>
          <span className="admin-badge">
    <svg
        className="admin-badge-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
    <span>Administrator</span>
</span>
        </header>

        <section className="welcome">
          <div>
            <p className="welcome-label">YOUR BUSINESS AT A GLANCE</p>
            <h1>Welcome back!</h1>
            <p>
              Manage your leads and build stronger customer relationships.
            </p>
          </div>
          <div className="welcome-icon">↗</div>
        </section>

        <section className="stats-grid">
          <StatCard title="Total Leads" value={totalLeads} icon="♧" />
          <StatCard title="New Leads" value={newLeads} icon="✦" />
          <StatCard title="Contacted" value={contactedLeads} icon="↗" />
          <StatCard title="Converted" value={convertedLeads} icon="✓" />
        </section>
        
<section className="content-card" id="leads">
  <div className="section-heading">
    <div>
      <h3>
        {editingLead
          ? "Edit Lead"
          : showAddForm
          ? "Add New Lead"
          : "Recent Leads"}
      </h3>
      <p>
        {showAddForm || editingLead
          ? "Enter the lead details below"
          : "Your latest customer prospects"}
      </p>
    </div>
    
{!showAddForm && !editingLead && (
  <div className="lead-toolbar">
    <input
      type="search"
      className="form-control"
      placeholder="Search by name, email, or phone..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      aria-label="Search leads"
    />

    <select
      className="form-select"
      value={statusFilter}
      onChange={(event) => setStatusFilter(event.target.value)}
      aria-label="Filter leads by status"
    >
      <option value="All">All Statuses</option>
      <option value="New">New</option>
      <option value="Contacted">Contacted</option>
      <option value="Converted">Converted</option>
    </select>
  </div>
)}


    {!showAddForm && !editingLead && (
      <button
        className="btn btn-primary"
        onClick={() => {
          setEditingLead(null);
          setShowAddForm(true);
        }}
      >
        + Add Lead
      </button>
    )}
  </div>

  {/* Add Lead or Edit Lead form */}
  {(showAddForm || editingLead) && (
    <AddLead
      lead={editingLead}
      onCancel={() => {
        setShowAddForm(false);
        setEditingLead(null);
      }}
      onLeadAdded={(newLead) => {
        setLeads((previous) => [newLead, ...previous]);
        setShowAddForm(false);
      }}
      onLeadUpdated={(updatedLead) => {
        setLeads((previous) =>
          previous.map((item) =>
            item._id === updatedLead._id ? updatedLead : item
          )
        );
        setEditingLead(null);
      }}
    />
  )}

  {/* Display leads only when the form is closed */}
  {!showAddForm && !editingLead && (
    <>
      {loading ? (
        <div className="empty-state">
          <h4>Loading leads...</h4>
        </div>
      ) : error ? (
        <div className="empty-state">
          <h4>Unable to load leads</h4>
          <p>{error}</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♧</div>
          <h4>
  {leads.length === 0 ? "No leads found" : "No matching leads"}
</h4>
<p>
  {leads.length === 0
    ? "Add your first lead to get started."
    : "Try another search term or status filter."}
</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.source}</td>
                  <td>
                <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                {lead.status}</span>
                  </td>
                  
<td>
  <div className="d-flex gap-2">
    <button
      type="button"
      className="btn btn-sm btn-outline-primary"
      onClick={() => {
        setShowAddForm(false);
        setEditingLead(lead);
      }}
    >
      Edit
    </button>

    <button
      type="button"
      className="btn btn-sm btn-outline-danger"
      onClick={() => handleDeleteLead(lead._id, lead.name)}
    >
      Delete
    </button>
  </div>
</td>

                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )}
</section>

      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <h2>{value}</h2>
      <p>Live CRM statistics</p>
    </article>
  );
}

export default Dashboard;
