
import { useState } from "react";
import { createLead, updateLead } from "../services/leadService";
import Swal from "sweetalert2";


function AddLead({ lead, onLeadAdded, onLeadUpdated, onCancel }) {
  const [formData, setFormData] = useState(() => ({
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    source: lead?.source ?? "Website",
    status: lead?.status ?? "New",
    notes: lead?.notes ?? ""
  }));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  

const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");
  setSaving(true);

  try {
    if (lead) {
      const result = await updateLead(lead._id, formData);

      onLeadUpdated(result.data);

      await Swal.fire({
        title: "Lead Updated!",
        text: `${formData.name}'s details have been updated successfully.`,
        icon: "success",
        confirmButtonColor: "#3984e8"
      });
    } else {
      const result = await createLead(formData);

      onLeadAdded(result.data);

      await Swal.fire({
        title: "Lead Added!",
        text: `${formData.name} has been added successfully.`,
        icon: "success",
        confirmButtonColor: "#3984e8"
      });
    }
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Something went wrong. Please try again.";

    setError(message);

    await Swal.fire({
      title: "Operation Failed",
      text: message,
      icon: "error",
      confirmButtonColor: "#3984e8"
    });
  } finally {
    setSaving(false);
  }
};


<h3>{lead ? "Edit Lead" : "Add New Lead"}</h3>
  return (
    
    <form onSubmit={handleSubmit} className="add-lead-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="source">Lead Source</label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
          >
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Lead Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional information about this lead"
            maxLength={1000}
            rows={3}
          />
        </div>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? "Saving..." : lead ? "Update Lead" : "Save Lead"}
        </button>
      </div>
    </form>
  );
}

export default AddLead;
