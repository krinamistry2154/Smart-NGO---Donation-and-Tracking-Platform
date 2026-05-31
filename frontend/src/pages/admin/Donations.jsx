import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [rawResp, setRawResp] = useState(null);

  useEffect(() => {
    API.get("/donations")
      .then((res) => {
        const d = res.data;
        setRawResp(d);
        const list = Array.isArray(d)
          ? d
          : (d && Array.isArray(d.data) ? d.data : []);
        if (!Array.isArray(list)) console.warn('Unexpected /donations response', d);
        setDonations(list);
      })
      .catch((err) => {
        console.error(err);
        setRawResp(err.response ? err.response.data : String(err));
        setDonations([]);
      });
  }, []);

  return (
    <div>
      <h3>Donations</h3>



      {(!donations || donations.length === 0) ? (
        <div className="text-muted" style={{ padding: '20px', textAlign: 'center' }}>No donations found</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Cause</th>
              <th>Method</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d, idx) => {
              const id = d.donationId || d.id || d._id || idx;
              const user = d.userName || d.name || (d.user && (d.user.name || d.user.fullName)) || 'Anonymous';
              const cause = d.causeTitle || d.cause || (d.cause && d.cause.title) || 'N/A';
              const method = d.paymentMethod || d.method || d.gateway || (d.payment && d.payment.method) || '-';
              const amount = (d.amount == null) ? (d.total || d.value || 0) : d.amount;

              return (
                <tr key={id}>
                  <td>{user}</td>
                  <td>{cause}</td>
                  <td>{method}</td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: '#d4edda',
                      color: '#155724'
                    }}>
                      ✅ Completed
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#667eea' }}>₹{amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}