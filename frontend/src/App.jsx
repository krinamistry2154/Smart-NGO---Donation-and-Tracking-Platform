import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'

import Home from './pages/user/Home'
import About from './pages/user/About'
import Causes from './pages/user/Causes'
import Donate from './pages/user/Donate'
import FinancialAnalyzer from './pages/user/FinancialAnalyzer'
import Volunteers from './pages/user/Volunteers'
import Gallery from './pages/user/Gallery';
import Contact from './pages/user/Contact';
import Login from './pages/login/Login'
import Register from './pages/login/Register'
import { Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import AdminPanel from './pages/admin/AdminPanel'
import AdminDashboard from './pages/admin/Dashboard'
import AdminDonations from './pages/admin/Donations'
import AdminVolunteers from './pages/admin/ViewVolunteers'
import AdminMessages from './pages/admin/Messages'
import AdminDonationTracking from './pages/admin/DonationTracking'
import MyDonations from './pages/user/MyDonations'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Navbar />
      <main className="app-content">
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/causes" element={<Causes />} />
        <Route path="/financial-analyzer" element={<FinancialAnalyzer />} />
        <Route path="/donate/:id" element={<Donate />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-donations" element={<PrivateRoute role="User"><MyDonations /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<PrivateRoute role="Admin"><AdminPanel /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="donation-tracking" element={<AdminDonationTracking />} />
        </Route>

        <Route path="/user" element={<PrivateRoute role="User"><Navigate to="/home" replace /></PrivateRoute>} />
        </Routes>
      </main>

      <Footer />
    </Router>
  )
}

export default App