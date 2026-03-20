import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../api/auth';

/**
 * Protège les routes d'administration.
 * Si non connecté, redirige vers la page de login admin avec le chemin demandé.
 */
export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!accessToken) {
      setIsAuthenticated(false);
      setChecking(false);
      return;
    }

    getCurrentUser()
      .then((user) => {
        if (user?.is_staff) {
          setIsAuthenticated(true);
        } else {
          logoutUser();
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        logoutUser();
        setIsAuthenticated(false);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return <p className="text-muted mb-0">Vérification de la session admin...</p>;
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/admin/login?next=${next}`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
