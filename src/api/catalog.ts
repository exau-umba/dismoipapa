import { getJson } from './client';

export interface BookFormat {
  id: string;
  format_type: 'ebook' | 'physical' | string;
  price: string;
  stock_quantity: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  synopsis?: string;
  sample_text?: string;
  genre?: string;
  language?: string;
  publication_date?: string;
  formats?: BookFormat[];
  // On accepte d'autres champs renvoyés par l'API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export async function fetchBooks(): Promise<Book[]> {
  // GET /api/catalog/books/
  return getJson<Book[]>('/api/catalog/books/');
}

