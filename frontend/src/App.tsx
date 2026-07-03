import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trucks from './pages/Trucks';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import Drivers from './pages/Drivers';
import Contractors from './pages/Contractors';
import Trips from './pages/Trips';
import Users from './pages/Users';
import ExpenseCategories from './pages/ExpenseCategories';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout} />}>
          
          {/* Admin & Manager Only */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
            <Route index element={<Dashboard />} />
            <Route path="trucks" element={<Trucks />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="contractors" element={<Contractors />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin, Manager, Accountant */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'accountant']} />}>
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<ExpenseCategories />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Everyone including Driver */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'accountant', 'driver']} />}>
            <Route path="trips" element={<Trips />} />
            <Route path="expenses" element={<Expenses />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
