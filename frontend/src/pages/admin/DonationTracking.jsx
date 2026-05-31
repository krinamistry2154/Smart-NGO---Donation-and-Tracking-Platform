import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./donationTracking.css";

export default function DonationTracking() {
  const [trackingData, setTrackingData] = useState({
    totalReceived: 0,
    totalUsed: 0,
    totalRemaining: 0,
    expenditures: [],
    causeBreakdown: []
  });
  const [allDonationTracking, setAllDonationTracking] = useState([]);

  const CAUSES = [
    "Food for Children",
    "Education Support",
    "Medical Help",
    "Women Empowerment",
    "Old Age Support",
    "Disaster Relief"
  ];

  const CATEGORY_MAP = {
    "Food for Children": ["Meals", "Food Packs", "Nutrition Programs", "Distribution"],
    "Education Support": ["Scholarships", "Books & Supplies", "School Fees", "Tutoring"],
    "Medical Help": ["Medicine", "Consultation", "Surgeries", "Medical Camps"],
    "Women Empowerment": ["Vocational Training", "Microfinance", "Workshops", "Awareness"],
    "Old Age Support": ["Care Services", "Medical Aid", "Shelter", "Recreation"],
    "Disaster Relief": ["Emergency Supplies", "Shelter", "Reconstruction", "Logistics"]
  };

  const [expForm, setExpForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    category: "",
    amount: "",
    cause: ""   // ✅ keep string
  });

  const [expErrors, setExpErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchSummary = () => {
    API.get("/donationtracking/admin/summary")
      .then((res) => setTrackingData(res.data))
      .catch((err) => {
        console.error(err);
        setTrackingData({
          totalReceived: 0,
          totalUsed: 0,
          totalRemaining: 0,
          expenditures: [],
          causeBreakdown: []
        });
      });
  };
  const fetchAllDonationTracking = () => {
    // Fetch all donations with tracking data
    API.get("/donations")
      .then((res) => {
        const donations = Array.isArray(res.data) ? res.data : [];
        setAllDonationTracking(donations);
      })
      .catch((err) => {
        console.error("Failed to fetch donation tracking data:", err);
        setAllDonationTracking([]);
      });
  };
  useEffect(() => {
    fetchSummary();
    fetchAllDonationTracking();
  }, []);

  const handleExpChange = (e) => {
    const { name, value } = e.target;

    setExpForm((prev) => {
      const updated = { ...prev, [name]: value };

      // reset category when cause changes
      if (name === "cause") {
        updated.category = "";
      }

      return updated;
    });

    setExpErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const validateExpForm = () => {
    const errs = {};
    if (!expForm.amount || Number(expForm.amount) <= 0)
      errs.amount = "Enter a valid amount > 0";

    if (!expForm.description || expForm.description.trim().length < 5)
      errs.description = "Provide a short description (min 5 chars)";

    return errs;
  };

  const submitExpenditure = async (e) => {
    e.preventDefault();

    const errs = validateExpForm();
    if (Object.keys(errs).length) {
      setExpErrors(errs);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      description: expForm.description,
      category: expForm.category,
      amount: Number(expForm.amount),

      // ✅ FIX: convert cause string → ID
      causeId: expForm.cause
        ? CAUSES.indexOf(expForm.cause) + 1
        : null,

      date: new Date(expForm.date).toISOString()
    };

    console.log("Payload:", payload); // 🔍 debug

    try {
      await API.post("/donationtracking/admin/expenditures", payload);

      setExpForm({
        date: new Date().toISOString().slice(0, 10),
        description: "",
        category: "",
        amount: "",
        cause: ""   // ✅ correct reset
      });

      fetchSummary();
      setSuccessMsg("Expenditure recorded successfully");

      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Failed to add expenditure", err);
      alert("Failed to add expenditure");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fmt = (v) =>
    v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const utilizationPercent = trackingData.totalReceived
    ? ((trackingData.totalUsed / trackingData.totalReceived) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="container-fluid mt-4 dt-page">
      <h3 className="mb-3">Donation Tracking</h3>

      {/* Summary Cards */}
      <div className="row dt-summary mb-4">
        <div className="col-md-4">
          <div className="card text-center dt-card">
            <div className="card-body">
              <h6 className="dt-card-title text-success">Total Received</h6>
              <h3 className="dt-amount">₹{fmt(trackingData.totalReceived)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center dt-card">
            <div className="card-body">
              <h6 className="dt-card-title text-primary">Total Used</h6>
              <h3 className="dt-amount">₹{fmt(trackingData.totalUsed)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center dt-card">
            <div className="card-body">
              <h6 className="dt-card-title text-warning">Remaining</h6>
              <h3 className="dt-amount">₹{fmt(trackingData.totalRemaining)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Cause Breakdown */}
      <div className="card mb-4 dt-cause-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Funds by Cause</h5>
          <div className="text-muted small">
            Overall Utilization: <strong>{utilizationPercent}%</strong>
          </div>
        </div>

        <div className="card-body">
          {trackingData.causeBreakdown.map((item) => {
            const pct = item.received
              ? Math.min(100, ((item.used / item.received) * 100).toFixed(1))
              : 0;

            return (
              <div key={item.cause} className="list-group-item dt-cause-row">
                <div className="dt-cause-header">
                  <strong>{item.cause}</strong>
                  <div className="dt-cause-amounts">
                    <span className="dt-amount-badge">
                      <small>Received:</small> ₹<strong>{fmt(item.received || 0)}</strong>
                    </span>
                    <span className="dt-amount-badge">
                      <small>Used:</small> ₹<strong>{fmt(item.used || 0)}</strong>
                    </span>
                    <span className="dt-amount-badge">
                      <small>Remaining:</small> ₹<strong>{fmt((item.received || 0) - (item.used || 0))}</strong>
                    </span>
                  </div>
                </div>
                <div className="dt-progress mt-3">
                  <div
                    className="dt-progress-bar"
                    style={{ width: `${pct}%` }} 
                  />
                </div>
                <small className="dt-progress-label">{pct}% utilized</small>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenditure Form */}
      <div className="card">
        <div className="card-body">
          <h5>Add Expenditure</h5>

          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <form className="dt-form-grid" onSubmit={submitExpenditure}>
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={expForm.date}
                onChange={handleExpChange}
              />
            </div>

            <div>
              <label className="form-label">Amount</label>
              <input
                type="number"
                name="amount"
                className="form-control"
                placeholder="Enter amount"
                value={expForm.amount}
                onChange={handleExpChange}
              />
            </div>

            <div>
              <label className="form-label">Cause</label>
              <select
                name="cause"
                className="form-select"
                value={expForm.cause}
                onChange={handleExpChange}
              >
                <option value="">Select Cause</option>
                {CAUSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={expForm.category}
                onChange={handleExpChange}
              >
                <option value="">Select Category</option>
                {(expForm.cause
                  ? CATEGORY_MAP[expForm.cause]
                  : []
                ).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Description</label>
              <input
                name="description"
                className="form-control"
                placeholder="Brief description of expenditure"
                value={expForm.description}
                onChange={handleExpChange}
              />
            </div>

            <button className="btn btn-danger" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record"}
            </button>
          </form>
        </div>
      </div>

      {/* All Donations Tracking Table */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">📊 All Donation Tracking Data</h5>
        </div>
        <div className="card-body">
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-striped table-hover">
              <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <tr>
                  <th>Donor Name</th>
                  <th>Cause</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allDonationTracking && allDonationTracking.length > 0 ? (
                  allDonationTracking.map((donation, idx) => (
                    <tr key={donation.donationId || idx}>
                      <td>{donation.userName || 'N/A'}</td>
                      <td>{donation.causeTitle || 'N/A'}</td>
                      <td style={{ fontWeight: 'bold', color: '#667eea' }}>₹{fmt(donation.amount || 0)}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          background: donation.paymentMethod === 'UPI' ? '#e3f2fd' : '#f3e5f5',
                          color: donation.paymentMethod === 'UPI' ? '#1e40af' : '#7c3aed'
                        }}>
                          {donation.paymentMethod || 'N/A'}
                        </span>
                      </td>
                      <td>{donation.donationDate ? new Date(donation.donationDate).toLocaleDateString('en-IN') : 'N/A'}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          background: '#d4edda',
                          color: '#155724'
                        }}>
                          ✅ Completed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted" style={{ padding: '20px' }}>
                      No donation tracking data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Recent Expenditures Table */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">Recent Expenditures</h5>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <tr>
                <th>Date</th>
                <th>Cause</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {trackingData.expenditures && trackingData.expenditures.length > 0 ? (
                trackingData.expenditures.map((exp, idx) => (
                  <tr key={idx}>
                    <td>{exp.date ? new Date(exp.date).toLocaleDateString() : 'N/A'}</td>
                    <td>{exp.cause || 'N/A'}</td>
                    <td>{exp.category || 'N/A'}</td>
                    <td>{exp.description || 'N/A'}</td>
                    <td className="dt-table-amount" style={{ fontWeight: 'bold', color: '#667eea' }}>₹{fmt(exp.amount || 0)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted" style={{ padding: '20px' }}>
                    No expenditures recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}