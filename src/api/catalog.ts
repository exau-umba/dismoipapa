import { getJson } from './client';

/** Format de livre tel que renvoyé par GET /api/catalog/books/{id}/ */
export interface BookFormat {
  id: string;
  book: string;
  format_type: 'ebook' | 'physical' | string;
  price: string;
  stock_quantity: number;
  pdf_file: string | null;
  epub_file: string | null;
}

/** Livre tel que renvoyé par GET /api/catalog/books/ ou GET /api/catalog/books/{id}/ */
export interface Book {
  id: string;
  title: string;
  author: string;
  synopsis?: string | null;
  sample_text?: string | null;
  cover_image?: string | null;
  catalog: string;
  language?: string;
  publication_date?: string;
  formats?: BookFormat[];
}

/** Réponse possible : tableau direct, paginée { results: Book[] }, ou null/undefined */
function normalizeListResponse<T>(data: T[] | { results?: T[] } | null | undefined): T[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && Array.isArray((data as { results?: T[] }).results)) {
    return (data as { results: T[] }).results;
  }
  return [];
}

/** Liste des livres. GET /api/catalog/books/ (public, sans auth) */
export async function fetchBooks(): Promise<Book[]> {
  try {
    const url = '/api/catalog/books/?_=' + Date.now();
    const data = await getJson<Book[] | { results: Book[] } | null>(url, { skipAuth: true });
    return normalizeListResponse(data ?? null);
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw new Error('Livre non trouvé.');
    }
    throw error;
  }
}

/** Détail d'un livre. GET /api/catalog/books/{id}/ (public, sans auth) */
export async function getBook(id: string): Promise<Book> {
  try {
    return getJson<Book>(`/api/catalog/books/${id}/`, { skipAuth: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw new Error('Livre non trouvé.');
    }
    throw error;
  }
}

