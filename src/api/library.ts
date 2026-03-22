/**
 * API bibliothèque utilisateur (livres achetés / abonnement) - papa_dis_moi.json
 * GET /api/library/ → liste des livres possédés
 * GET /api/library/books/{book_id}/read/ → lecture EPUB
 * GET /api/library/books/{book_id}/download/ → téléchargement PDF/Word
 */
import { API_BASE_URL, getAuthenticatedBinaryResponse, getJson } from './client';

export interface LibraryEntry {
  id: string;
  book: string;
  book_title: string;
  book_author: string;
  book_cover: string | null;
  book_language: string | null;
  book_publication_date: string | null;
  ebook_pdf_url: string | null;
  ebook_epub_url: string | null;
  access_type: 'purchase' | 'subscription' | string;
  added_at: string;
}

function normalizeLibraryList(
  data: LibraryEntry[] | { results?: LibraryEntry[] } | null | undefined
): LibraryEntry[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

/** GET /api/library/ - Liste des entrées de bibliothèque de l'utilisateur */
export async function listLibraryEntries(): Promise<LibraryEntry[]> {
  const data = await getJson<LibraryEntry[] | { results?: LibraryEntry[] } | null>('/api/library/');
  return normalizeLibraryList(data);
}

/** Signature magique ZIP (les fichiers EPUB sont des archives ZIP). */
function isZipMagic(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 4) return false;
  const u8 = new Uint8Array(buffer, 0, 4);
  return (
    u8[0] === 0x50 &&
    u8[1] === 0x4b &&
    (u8[2] === 0x03 || u8[2] === 0x05 || u8[2] === 0x07) &&
    (u8[3] === 0x04 || u8[3] === 0x06 || u8[3] === 0x08)
  );
}

/**
 * Récupère l'EPUB d'un livre de la bibliothèque (authentifié) et retourne une URL blob.
 * Utilise le client API (refresh token) et force le type MIME pour epub.js.
 * À révoquer avec URL.revokeObjectURL(url) après utilisation (ex: au démontage du lecteur).
 */
export async function getLibraryBookReadUrl(bookId: string): Promise<string> {
  const res = await getAuthenticatedBinaryResponse(
    `/api/library/books/${bookId}/read/`,
    'application/epub+zip,application/zip,application/octet-stream;q=0.9,*/*;q=0.8',
  );

  if (!res || !(res instanceof Response)) {
    throw new Error('Réponse invalide du serveur.');
  }

  const buf = await res.arrayBuffer();

  if (!buf || buf.byteLength < 22) {
    throw new Error(
      'Le fichier du livre est vide ou incomplet. Si le problème continue, contactez le support.',
    );
  }

  if (!isZipMagic(buf)) {
    const preview = new TextDecoder()
      .decode(buf.slice(0, Math.min(4000, buf.byteLength)))
      .trimStart();
    if (preview.startsWith('{') || preview.startsWith('[')) {
      try {
        const j = JSON.parse(preview) as { detail?: unknown };
        const d = j?.detail;
        const msg =
          typeof d === 'string'
            ? d
            : Array.isArray(d)
              ? d.map(String).join(' ')
              : 'Le serveur a renvoyé une erreur à la place du fichier EPUB.';
        throw new Error(msg);
      } catch (e) {
        if (e instanceof SyntaxError) {
          /* JSON tronqué ou invalide : message générique ci-dessous */
        } else {
          throw e;
        }
      }
    }
    throw new Error(
      'Le contenu reçu n’est pas un EPUB valide (fichier ZIP attendu). Vérifiez que l’e-book est bien au format EPUB côté administration.',
    );
  }

  const blob = new Blob([buf], { type: 'application/epub+zip' });
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
  const res = await getAuthenticatedBinaryResponse(
    `/api/library/books/${bookId}/download/`,
    'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/epub+zip,application/octet-stream,*/*',
  );

  if (!res || !(res instanceof Response)) {
    throw new Error('Réponse invalide du serveur.');
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
