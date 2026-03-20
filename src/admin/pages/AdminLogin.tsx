import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import { getCurrentUser, loginUser, logoutUser } from '../../api/auth';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';
import '../admin.css';

function getAdminRedirectPath(next: string | null): string {
  if (!next) return '/admin';
  try {
    const path = decodeURIComponent(next);
    if (path === '/admin' || path.startsWith('/admin/')) return path;
  } catch {
    // ignore invalid next param
  }
  return '/admin';
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextParam = searchParams.get('next');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setCheckingSession(false);
      return;
    }

    getCurrentUser()
      .then((user) => {
        if (!user?.is_staff) {
          logoutUser();
          setError('Ce compte n’a pas les droits administrateur.');
          return;
        }
        navigate(getAdminRedirectPath(nextParam), { replace: true });
      })
      .catch(() => {
        logoutUser();
      })
      .finally(() => setCheckingSession(false));
  }, [navigate, nextParam]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser(email, password);
      const user = await getCurrentUser();

      if (!user?.is_staff) {
        logoutUser();
        setError('Accès refusé : compte administrateur requis.');
        return;
      }

      navigate(getAdminRedirectPath(nextParam), { replace: true });
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/logo.png" alt="Dis-moi Papa" className="admin-login-logo" />
          <h1>Connexion Admin</h1>
          <p>Connectez-vous pour accéder au back-office.</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} className="mb-3" />}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemple.com"
              required
              disabled={loading || checkingSession}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              disabled={loading || checkingSession}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || checkingSession}
          >
            {checkingSession ? 'Vérification…' : loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/shop-login">Connexion client</Link>
        </div>
      </div>
    </div>
  );
}
