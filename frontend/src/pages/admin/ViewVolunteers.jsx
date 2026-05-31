import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function ViewVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  const addLoading = (id) =>
    setLoadingIds((prev) => [...prev, id]);

  const removeLoading = (id) =>
    setLoadingIds((prev) => prev.filter((x) => x !== id));

  // ✅ Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      const res = await API.get("/volunteers");
      const d = res.data;
      const list = Array.isArray(d) ? d : (d && Array.isArray(d.data) ? d.data : []);
      if (!Array.isArray(list)) console.warn('Unexpected /volunteers response', d);
      setVolunteers(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  // ✅ APPROVE (FIXED)
  const handleApprove = async (v) => {
    const id = v.volunteerId || v.id;

    addLoading(id);

    try {
      await API.put(`/volunteers/${id}/approve`);

      setVolunteers((prev) =>
        prev.map((item) =>
          (item.volunteerId || item.id) === id
            ? { ...item, isApproved: true }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Approve failed");
    } finally {
      removeLoading(id);
    }
  };

  // ✅ DECLINE (FIXED)
  const handleDecline = async (v) => {
    const id = v.volunteerId || v.id;

    addLoading(id);

    try {
      await API.put(`/volunteers/${id}/reject`);

      setVolunteers((prev) =>
        prev.map((item) =>
          (item.volunteerId || item.id) === id
            ? { ...item, isApproved: false }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Decline failed");
    } finally {
      removeLoading(id);
    }
  };

  return (
    <div>
      <h3>All Volunteers</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Skill</th>
            <th>Status</th>
            <th>Applied At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {volunteers.map((v, i) => {
            const id = v.volunteerId || v.id || i;

            return (
              <tr key={id}>
                <td>{v.name || v.fullName}</td>
                <td>{v.email}</td>
                <td>{v.skills || v.skill}</td>

                <td>
                  {v.isApproved ? (
                    <span className="badge bg-success">
                      Approved
                    </span>
                  ) : (
                    <span className="badge bg-warning">
                      Pending
                    </span>
                  )}
                </td>

                <td>
                  {v.appliedAt
                    ? new Date(v.appliedAt).toLocaleString()
                    : "-"}
                </td>

                <td>
                  {!v.isApproved ? (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApprove(v)}
                      disabled={loadingIds.includes(id)}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => handleDecline(v)}
                      disabled={loadingIds.includes(id)}
                    >
                      Decline
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}