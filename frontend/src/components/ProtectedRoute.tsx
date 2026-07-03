import { Navigate, Outlet } from 'react-router-dom';

const getRole = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).role;
  } catch(e) {
    return null;
  }
};

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const role = getRole();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not in the allowed roles, redirect them to their default page
  if (!allowedRoles.includes(role)) {
    if (role === 'driver') {
      return <Navigate to="/trips" replace />;
    } else if (role === 'accountant') {
      return <Navigate to="/expenses" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
