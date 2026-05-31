import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function getStoredUser() {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default function PrivateRoute({ children, role }) {
  const user = getStoredUser()
  const location = useLocation()

  // dev bypass: add ?asAdmin=1 to URL to allow access locally for testing
  const params = new URLSearchParams(location.search)
  const devAsAdmin = params.get('asAdmin') === '1'

  if (!user && !devAsAdmin) return <Navigate to="/login" replace />

  const userRole = user?.role || user?.Role || user?.roleName || (user?.user && (user.user.role || user.user.Role))
  if (role && !devAsAdmin && userRole !== role) return <Navigate to="/" replace />

  return children
}
