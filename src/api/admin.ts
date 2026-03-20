/**
 * API admin (papa_dis_moi.json) : users, catalog CRUD, orders.
 */
import { getBook } from './catalog';
import { getJson, postJson, patchJson, delJson, API_BASE_URL } from './client';

function buildBookFormData(
  payload: Record<string, unknown>,
  coverImage?: File | null,
  pdfFile?: File | null,
  epubFile?: File | null
): FormData {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'formats' && Array.isArray(value)) {
      form.append(key, JSON.stringify(value));
    } else if (typeof value === 'string') {
      form.append(key, value);
    }
  });
  if (coverImage) {
    form.append('cover_image', coverImage, coverImage.name || 'cover.jpg');
  }
  if (pdfFile) {
    form.append('pdf_file', pdfFile, pdfFile.name || 'book.pdf');
  }
  if (epubFile) {
    form.append('epub_file', epubFile, epubFile.name || 'book.epub');
  }
  return form;
}

// --- Users (GET /api/users/, GET/PATCH/DELETE /api/users/{id}/) ---
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  shipping_address?: string;
  is_subscriber: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string;
  [key: string]: unknown;
}

export function listUsers(): Promise<AdminUser[]> {
  return getJson<AdminUser[]>('/api/users/');
}

export function getUser(id: string): Promise<AdminUser> {
  return getJson<AdminUser>(`/api/users/${id}/`);
}

export function updateUser(id: string, data: Partial<Pick<AdminUser, 'full_name' | 'phone_number' | 'shipping_address' | 'is_subscriber' | 'is_active'>>): Promise<AdminUser> {
  return patchJson<AdminUser>(`/api/users/${id}/`, data);
}

export function deleteUser(id: string): Promise<void> {
  return delJson<void>(`/api/users/${id}/`);
}

// --- Catalogs : même base /api/catalog/catalogs/ pour list, create, read, update, delete ---
export interface Catalog {
  id: string;
  name: string;
  description?: string;
  [key: string]: unknown;
}

const CATALOGS_PATH = '/api/catalog/catalogs';

/** Réponse possible : tableau direct, paginée { results: T[] }, ou null/undefined */
function normalizeCatalogList<T>(data: T[] | { results?: T[] } | null | undefined): T[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && Array.isArray((data as { results?: T[] }).results)) {
    return (data as { results: T[] }).results;
  }
  return [];
}

/** Liste. GET /api/catalog/catalogs/ (public, sans auth) */
export function listCatalogs(): Promise<Catalog[]> {
  const url = `${CATALOGS_PATH}/?_=${Date.now()}`;
  return getJson<Catalog[] | { results: Catalog[] } | null>(url, { skipAuth: true })
    .then((data) => normalizeCatalogList(data ?? null));
}

/** Détail. GET /api/catalog/catalogs/{id}/ */
export function getCatalog(id: string): Promise<Catalog> {
  try {
    return getJson<Catalog>(`${CATALOGS_PATH}/${id}/`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      throw new Error('Catalogue non trouvé.');
    }
    throw error;
  }
}

/** Création. POST /api/catalog/catalogs/ — body: { name, description } */
export function createCatalog(data: { name: string; description?: string }): Promise<Catalog> {
  return postJson<Catalog>(`${CATALOGS_PATH}/`, data);
}

/** Mise à jour. PATCH /api/catalog/catalogs/{id}/ */
export function updateCatalog(id: string, data: { name?: string; description?: string }): Promise<Catalog> {
  return patchJson<Catalog>(`${CATALOGS_PATH}/${id}/`, data);
}

/** Suppression. DELETE /api/catalog/catalogs/{id}/ */
export function deleteCatalog(id: string): Promise<void> {
  return delJson<void>(`${CATALOGS_PATH}/${id}/`);
}

// --- Books (POST/PATCH/DELETE /api/catalog/books/, formats) ---
/** Payload création livre : title, author, synopsis, sample_text, catalog (UUID), language, publication_date (YYYY-MM-DD), formats. Pas de genre. */
export interface CreateBookPayload {
  catalog: string;
  title: string;
  author: string;
  synopsis?: string;
  sample_text?: string;
  language?: string;
  publication_date?: string;
  formats?: { format_type: 'ebook' | 'physical'; price: string; stock_quantity: number }[];
}

export function createBook(
  payload: CreateBookPayload,
  coverImage?: File | null,
  pdfFile?: File | null,
  epubFile?: File | null
): Promise<{ id: string; [key: string]: unknown }> {
  if (coverImage || pdfFile || epubFile) {
    const form = buildBookFormData(
      payload as unknown as Record<string, unknown>,
      coverImage,
      pdfFile,
      epubFile
    );
    return postJson(`/api/catalog/books/`, form, { skipJsonHeader: true });
  }
  return postJson(`/api/catalog/books/`, payload);
}

export function updateBook(
  id: string,
  payload: Partial<CreateBookPayload>,
  coverImage?: File | null
): Promise<unknown> {
  if (coverImage) {
    const form = buildBookFormData(payload as unknown as Record<string, unknown>, coverImage);
    return patchJson(`/api/catalog/books/${id}/`, form, { skipJsonHeader: true });
  }
  return patchJson(`/api/catalog/books/${id}/`, payload);
}

export function deleteBook(id: string): Promise<void> {
  return delJson(`/api/catalog/books/${id}/`);
}

/** Crée un format pour un livre existant: POST /api/catalog/books/{bookId}/formats/ (multipart). */
export function createBookFormat(
  bookId: string,
  data: { format_type: 'ebook' | 'physical'; price: string; stock_quantity: number },
  pdfFile?: File | null,
  epubFile?: File | null
): Promise<unknown> {
  const form = new FormData();
  form.append('format_type', data.format_type);
  form.append('price', data.price);
  form.append('stock_quantity', String(data.stock_quantity));
  if (pdfFile) form.append('pdf_file', pdfFile, pdfFile.name || 'book.pdf');
  if (epubFile) form.append('epub_file', epubFile, epubFile.name || 'book.epub');
  return postJson(`/api/catalog/books/${bookId}/formats/`, form, { skipJsonHeader: true });
}

export function updateFormat(formatId: string, data: { price?: string; stock_quantity?: number }): Promise<unknown> {
  return patchJson(`/api/catalog/formats/${formatId}/`, data);
}

/** Met à jour un format avec éventuels fichiers PDF/EPUB (multipart). */
export function updateFormatWithFile(
  formatId: string,
  data: { price?: string; stock_quantity?: number },
  pdfFile?: File | null,
  epubFile?: File | null
): Promise<unknown> {
  if (pdfFile || epubFile) {
    const form = new FormData();
    if (data.price !== undefined) form.append('price', data.price);
    if (data.stock_quantity !== undefined) form.append('stock_quantity', String(data.stock_quantity));
    if (pdfFile) form.append('pdf_file', pdfFile, pdfFile.name || 'book.pdf');
    if (epubFile) form.append('epub_file', epubFile, epubFile.name || 'book.epub');
    return patchJson(`/api/catalog/formats/${formatId}/`, form, { skipJsonHeader: true });
  }
  return updateFormat(formatId, data);
}

export function deleteFormat(formatId: string): Promise<void> {
  return delJson(`/api/catalog/formats/${formatId}/`);
}

/** Prévisualisation EPUB d’un livre (admin). Si le backend expose GET /api/catalog/books/{id}/preview/, retourne une blob URL. */
export async function getCatalogBookPreviewUrl(bookId: string): Promise<string> {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('Non autorisé.');
  const res = await fetch(`${API_BASE_URL}/api/catalog/books/${bookId}/preview/`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(res.status === 404 ? 'Prévisualisation non disponible pour ce livre.' : 'Impossible de charger la prévisualisation.');
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function getBooksEpubPreviewUrl(bookId: string): Promise<string> {
  // const token = localStorage.getItem('accessToken');
  return getBook(bookId).then((book) => {
    if (book.formats?.[0]?.format_type === 'ebook') {
      return book.formats[0].epub_file;
    }
    return null;
  });
}

// --- Orders (GET /api/orders/ liste des commandes utilisateur ; admin peut avoir toutes si le backend le permet) ---
export interface OrderItem {
  format: string;
  quantity: number;
  unit_price?: string;
  book_title?: string;
  format_name?: string;
  [key: string]: unknown;
}

export interface AdminOrder {
  id: string;
  shipping_address?: string;
  order_date?: string;
  total_amount?: string | number;
  payment_status?: string | null;
  shipping_status?: string | null;
  user?: string | { email?: string };
  created_at?: string; // fallback
  total?: string | number; // fallback
  status?: string; // fallback
  items?: OrderItem[];
  [key: string]: unknown;
}

export function listOrders(): Promise<AdminOrder[]> {
  return getJson<AdminOrder[]>('/api/orders/');
}

export function getOrder(id: string): Promise<AdminOrder> {
  return getJson<AdminOrder>(`/api/orders/${id}/`);
}
