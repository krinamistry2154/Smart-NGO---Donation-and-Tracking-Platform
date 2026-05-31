import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './statsBar.css';

function StatsBar() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalVolunteers: 0,
    totalCauses: 0,
    loading: true
  });

  useEffect(() => {
    // Check if stats are cached and still fresh (within 5 minutes)
    const getCachedStats = () => {
      try {
        const cached = sessionStorage.getItem('stats_cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          if (age < 5 * 60 * 1000) { // 5 minutes
            return data;
          }
        }
      } catch (error) {
        console.error('Error reading cache:', error);
      }
      return null;
    };

    const fetchStats = async () => {
      const cached = getCachedStats();
      if (cached) {
        setStats({ ...cached, loading: false });
        return;
      }

      try {
        // Try to get dashboard data first (most complete)
        const dashboardRes = await API.get('/admin/dashboard').catch(() => ({ data: {} }));
        const dashboardData = dashboardRes.data || {};

        let stats_data = {
          totalDonations: dashboardData.totalDonations || 0,
          totalVolunteers: dashboardData.totalVolunteers || 0,
          totalCauses: dashboardData.totalCauses || 6
        };

        // If dashboard doesn't have complete data, fetch individual endpoints
        if (!stats_data.totalDonations || !stats_data.totalVolunteers) {
          try {
            const [donationsRes, volunteersRes] = await Promise.all([
              API.get('/donations').catch(() => ({ data: [] })),
              API.get('/volunteers').catch(() => ({ data: [] }))
            ]);

            const donations = Array.isArray(donationsRes.data) ? donationsRes.data : [];
            const volunteers = Array.isArray(volunteersRes.data) ? volunteersRes.data : [];

            stats_data = {
              totalDonations: donations.length || stats_data.totalDonations,
              totalVolunteers: volunteers.length || stats_data.totalVolunteers,
              totalCauses: stats_data.totalCauses
            };
          } catch (error) {
            console.error('Error fetching individual stats:', error);
          }
        }

        // Cache the stats
        try {
          sessionStorage.setItem('stats_cache', JSON.stringify({
            data: stats_data,
            timestamp: Date.now()
          }));
        } catch (error) {
          console.error('Error caching stats:', error);
        }

        setStats({ ...stats_data, loading: false });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="stats-bar">
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-icon">💰</span>
          <div className="stat-content">
            <span className="stat-label">Donations</span>
            <span className="stat-value">{stats.loading ? '—' : stats.totalDonations}</span>
          </div>
        </div>

        <div className="stat-divider"></div>

        <div className="stat-item">
          <span className="stat-icon">👥</span>
          <div className="stat-content">
            <span className="stat-label">Volunteers</span>
            <span className="stat-value">{stats.loading ? '—' : stats.totalVolunteers}</span>
          </div>
        </div>

        <div className="stat-divider"></div>

        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <span className="stat-label">Causes</span>
            <span className="stat-value">{stats.loading ? '—' : stats.totalCauses}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
