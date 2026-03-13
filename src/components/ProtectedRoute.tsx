import { Navigate, useLocation } from 'react-router-dom';

/**
 * Route protégée : redirige vers la page de connexion si l'utilisateur n'est pas connecté.
 * Après connexion, l'utilisateur peut être renvoyé vers la page demandée via ?next=...
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('accessToken') !== null;

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/shop-login?next=${next}`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
