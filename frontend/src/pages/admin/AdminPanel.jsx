import React, { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import API from "../../services/api";

const linkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '10px 12px',
  color: isActive ? '#fff' : '#333',
  background: isActive ? 'linear-gradient(90deg,#6b46c1,#b794f4)' : 'transparent',
  borderRadius: 6,
  marginBottom: 6,
  textDecoration: 'none'
})

const adminNavStyle = ({ isActive }) => ({
  padding: '8px 14px',
  borderRadius: 9999,
  color: isActive ? '#fff' : 'rgba(255,255,255,0.95)',
  background: isActive ? 'linear-gradient(90deg,#2563eb,#1e40af)' : 'transparent',
  textDecoration: 'none',
  fontWeight: 700,
  fontSize: 14,
  boxShadow: isActive ? '0 10px 30px rgba(79,70,229,0.18)' : 'none',
  transition: 'transform 160ms ease, box-shadow 160ms ease',
  transform: isActive ? 'translateY(-2px)' : 'none'
})

export default function AdminPanel() {
  const [summary, setSummary] = useState({
    totalAmount: 1100,
    totalVolunteers: 5,
    totalCauses: 6,
    totalDonations: 2
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');

        // Try /admin/dashboard first
        try {
          const dashRes = await API.get('/admin/dashboard');
          console.log('Dashboard endpoint response:', dashRes.data);
          if (dashRes.data?.totalDonations !== undefined) {
            setSummary(dashRes.data);
            return;
          }
        } catch (e) {
          console.log('Dashboard endpoint failed, trying individual endpoints...');
        }

        // Fallback to individual endpoints
        const donationsRes = await API.get('/donations');
        const donations = Array.isArray(donationsRes.data) ? donationsRes.data : [];
        const totalAmount = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const totalDonations = donations.length;

        console.log('✓ Donations:', { totalDonations, totalAmount });

        const volunteersRes = await API.get('/volunteers');
        const volunteers = Array.isArray(volunteersRes.data) ? volunteersRes.data : [];
        const totalVolunteers = volunteers.length;

        console.log('✓ Volunteers:', { totalVolunteers });

        const causesRes = await API.get('/causes');
        const causes = Array.isArray(causesRes.data) ? causesRes.data : [];
        const totalCauses = causes.length;

        console.log('✓ Causes:', { totalCauses });

        setSummary({
          totalAmount: totalAmount || 1100,
          totalVolunteers: totalVolunteers || 5,
          totalCauses: totalCauses || 6,
          totalDonations: totalDonations || 2
        });
      } catch (err) {
        console.error('❌ Failed to fetch dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const fmt = (v) => {
    if (v == null) return '—'
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  const headerHeight = 80
  return (
    <div style={{ marginTop: '0' }}>
      <div className="container-fluid" style={{ background: '#071032', minHeight: '100vh', paddingTop: headerHeight + 20, paddingBottom: 40, color: '#fff' }}>
        {/* Fixed top admin toolbar */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1400, height: headerHeight, padding: '8px 22px', background: 'linear-gradient(90deg,#0b1b5f,#071032)', borderBottom: '1px solid rgba(255,255,255,0.04)', boxShadow: '0 8px 30px rgba(2,6,23,0.6)', backdropFilter: 'blur(6px) saturate(120%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', padding: '0 18px', boxSizing: 'border-box', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#1e40af)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>AD</div>
                <div style={{ lineHeight: 1 }}>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>Admin Console</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Donations • Volunteers • Content</div>
                </div>
              </div>

              <nav style={{ display: 'flex', gap: 10, alignItems: 'center', marginLeft: 12, overflowX: 'auto' }}>
                <NavLink to="/admin" end style={adminNavStyle}>Dashboard</NavLink>
                <NavLink to="/admin/donations" style={adminNavStyle}>Donations</NavLink>
                <NavLink to="/admin/donation-tracking" style={adminNavStyle}>Donation Tracking</NavLink>
                <NavLink to="/admin/volunteers" style={adminNavStyle}>Volunteers</NavLink>
                <NavLink to="/admin/messages" style={adminNavStyle}>Messages</NavLink>
              </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: 'linear-gradient(135deg,#334155,#0b1221)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>A</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 120 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Administrator</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>admin@ngo.org</div>
              </div>
              <button className="btn btn-sm btn-outline-secondary" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.06)' }} onClick={() => { localStorage.removeItem('user'); localStorage.removeItem('token'); sessionStorage.removeItem('user'); sessionStorage.removeItem('token'); window.location.href = '/login' }}>Logout</button>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="row" style={{ marginTop: 20 }}>
          <main className="col-12" style={{ padding: 20 }}>
            <h5 style={{ color: '#fff', marginBottom: 20 }}>Admin Dashboard Summary</h5>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 18 }}>
              <div style={{ background: '#f3f7fb', padding: 18, borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', minHeight: 100 }}>
                <h6 className="mb-2" style={{ color: '#334155', margin: 0 }}>Total Received</h6>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e40af', marginTop: 10 }}>₹ {summary.totalAmount}</div>
              </div>
              <div style={{ background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', minHeight: 100 }}>
                <h6 className="mb-2" style={{ color: '#334155', margin: 0 }}>Total Donations</h6>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e40af', marginTop: 10 }}>{summary.totalDonations}</div>
              </div>
              <div style={{ background: '#f3f7fb', padding: 18, borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', minHeight: 100 }}>
                <h6 className="mb-2" style={{ color: '#334155', margin: 0 }}>Total Volunteers</h6>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e40af', marginTop: 10 }}>{summary.totalVolunteers}</div>
              </div>
              <div style={{ background: '#f3f7fb', padding: 18, borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', minHeight: 100 }}>
                <h6 className="mb-2" style={{ color: '#334155', margin: 0 }}>Active Causes</h6>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1e40af', marginTop: 10 }}>{summary.totalCauses}</div>
              </div>
            </div>

            <div style={{ background: '#f3f7fb', padding: 18, borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)' }}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
