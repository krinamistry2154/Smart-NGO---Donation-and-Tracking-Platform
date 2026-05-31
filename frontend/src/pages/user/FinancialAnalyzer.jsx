import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, PieChart, Pie, Cell, Legend } from 'recharts';

function FinancialAnalyzer() {
  const causeData = [
    { name: 'Education', value: 40 },
    { name: 'Healthcare', value: 30 },
    { name: 'Environment', value: 20 },
    { name: 'Disaster Relief', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const monthlyData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 70000 },
    { month: 'May', amount: 61000 },
    { month: 'Jun', amount: 69000 },
  ];

  return (
    <div className="container py-5 text-light">
      <h2 className="fw-bold text-center mb-5" style={{ color: 'var(--primary-white)' }}>Financial Analytics Dashboard</h2>

      {/* --- Key Metrics Cards --- */}
      <div className="row text-center mb-5 financial-metrics">
        <div className="col-md-4 mb-4">
          <div className="card shadow border-0 p-4 metric-card bg-primary text-white">
            <h3 className="fw-bold">₹3,45,000</h3>
            <p className="mb-0">Total Donations</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow border-0 p-4 metric-card bg-success text-white">
            <h3 className="fw-bold">6</h3>
            <p className="mb-0">Active Causes</p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card shadow border-0 p-4 metric-card bg-info text-white">
            <h3 className="fw-bold">42</h3>
            <p className="mb-0">Active Volunteers</p>
          </div>
        </div>
      </div>

      {/* --- Charts Section --- */}
      <div className="row mb-5">
        {/* Line Chart: Donation Trends */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow border-0 p-4 h-100">
            <h5 className="fw-bold mb-4">Donation Trends (Last 6 Months)</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }}>
                    <LabelList dataKey="amount" formatter={(val) => `₹${val.toLocaleString('en-IN')}`} position="top" style={{ fill: '#7dd3fc', fontWeight: 700 }} />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart: Allocation (keeps existing visualization) */}
        <div className="col-12 col-lg-4 mb-4">
          <div className="card shadow border-0 p-4 h-100">
            <h5 className="fw-bold mb-4">Fund Allocation</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={causeData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {causeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* --- Detailed Breakdown Table --- */}
      <div className="card shadow border-0 p-4 mb-5">
        <h5 className="fw-bold mb-4">Recent Transactions</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Donor Name</th>
                <th>Cause</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Amit Sharma</td>
                <td>Child Education</td>
                <td>Apr 05, 2026</td>
                <td>₹5,000</td>
                <td><span className="badge bg-success">Completed</span></td>
              </tr>
              <tr>
                <td>Priya Singh</td>
                <td>Tree Plantation</td>
                <td>Apr 03, 2026</td>
                <td>₹2,500</td>
                <td><span className="badge bg-success">Completed</span></td>
              </tr>
              <tr>
                <td>Rahul Varma</td>
                <td>Medical Relief</td>
                <td>Mar 28, 2026</td>
                <td>₹12,000</td>
                <td><span className="badge bg-warning">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default FinancialAnalyzer;
