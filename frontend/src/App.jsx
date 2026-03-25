import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { api } from './api';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import Transactions from './pages/Transactions';
import Admin from './pages/Admin';

function RequireAuth({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireAdmin({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">CPAGrip Earn MVP</div>
        {user && (
          <nav className="nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/withdraw">Withdraw</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button className="link-button" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        )}
      </header>

      <main className="content">
        <Routes>
          <Route path="/login" element={<Login onAuth={setUser} />} />
          <Route path="/register" element={<Register onAuth={setUser} />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth user={user}>
                <Dashboard user={user} />
              </RequireAuth>
            }
          />
          <Route
            path="/transactions"
            element={
              <RequireAuth user={user}>
                <Transactions />
              </RequireAuth>
            }
          />
          <Route
            path="/withdraw"
            element={
              <RequireAuth user={user}>
                <Withdraw />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin user={user}>
                <Admin />
              </RequireAdmin>
            }
          />
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
