/**
 * API bibliothèque utilisateur (livres achetés / abonnement) - papa_dis_moi.json
 * GET /api/library/books/{book_id}/read/ → lecture EPUB
 * GET /api/library/books/{book_id}/download/ → téléchargement PDF/Word
 */
import { API_BASE_URL } from './client';

/**
 * Récupère l'EPUB d'un livre de la bibliothèque (authentifié) et retourne une URL blob.
 * À révoquer avec URL.revokeObjectURL(url) après utilisation (ex: au démontage du lecteur).
 */
export async function getLibraryBookReadUrl(bookId: string): Promise<string> {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Vous devez être connecté pour lire ce livre.');
  }
  const res = await fetch(`${API_BASE_URL}/api/library/books/${bookId}/read/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    let message = res.statusText;
    try {
      const data = JSON.parse(text);
      if (data?.detail) message = Array.isArray(data.detail) ? data.detail.join(' ') : data.detail;
    } catch {
      if (text) message = text.slice(0, 200);
    }
    throw new Error(message || 'Impossible de charger le livre.');
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Retourne l'URL de téléchargement d'un livre (PDF/Word) pour le lien de téléchargement.
 * L'appelant peut utiliser cette URL dans un <a download> avec le token en header ou ouvrir en nouvelle fenêtre.
 */
export function getLibraryBookDownloadUrl(bookId: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  return `${base}/api/library/books/${bookId}/download/`;
}

/**
 * Télécharge un livre de la bibliothèque (authentifié) via l'endpoint:
 * GET /api/library/books/{book_id}/download/
 *
 * Le navigateur n'envoie pas automatiquement le header Authorization en navigation directe,
 * donc on récupère le fichier en blob puis on déclenche un téléchargement.
 */
export async function downloadLibraryBook(bookId: string): Promise<void> {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Vous devez être connecté pour télécharger ce livre.');
  }

  const res = await fetch(`${API_BASE_URL}/api/library/books/${bookId}/download/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let message = res.statusText;
    try {
      const data = JSON.parse(text);
      if (data?.detail) message = Array.isArray(data.detail) ? data.detail.join(' ') : data.detail;
    } catch {
      if (text) message = text.slice(0, 200);
    }
    throw new Error(message || 'Impossible de télécharger le livre.');
  }

  const blob = await res.blob();
  const dispo = res.headers.get('content-disposition') || '';
  const match = dispo.match(/filename\*?=(?:UTF-8''|"?)([^";]+)"?/i);
  const filename = (match?.[1] ? decodeURIComponent(match[1]) : null) || `livre-${bookId}`;

  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}
