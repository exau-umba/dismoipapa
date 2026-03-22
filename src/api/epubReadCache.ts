/**
 * Cache IndexedDB des EPUB lus via la bibliothèque (GET …/read/) pour limiter les retéléchargements.
 * Vidage : TTL, déconnexion, ou session expirée (clé liée au token).
 */
import { fetchEpubArrayBuffer, fetchEpubBlobUrl } from './epubBlob';

const DB_NAME = 'livre-online-epub-cache';
const DB_VERSION = 1;
const STORE = 'epubs';

/** Conservation locale : 7 jours (nouveau téléchargement après expiration). */
export const EPUB_LIBRARY_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface EpubCacheRecord {
  key: string;
  bookId: string;
  storedAt: number;
  expiresAt: number;
  buffer: ArrayBuffer;
}

function canUseIndexedDB(): boolean {
  return typeof indexedDB !== 'undefined';
}

/** Évite de servir un cache EPUB à un autre compte sur le même navigateur. */
function readerSessionKey(): string {
  if (typeof localStorage === 'undefined') return 'anon';
  const refresh = localStorage.getItem('refreshToken');
  const access = localStorage.getItem('accessToken');
  const raw = refresh || access || '';
  if (!raw) return 'anon';
  return `${raw.length}:${raw.slice(-20)}`;
}

export function libraryBookCacheKey(bookId: string): string {
  return `${readerSessionKey()}:${bookId}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB'));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' });
      }
    };
  });
}

async function pruneExpired(db: IDBDatabase): Promise<void> {
  const now = Date.now();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.openCursor();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) {
        resolve();
        return;
      }
      const rec = cursor.value as EpubCacheRecord;
      if (rec.expiresAt <= now) {
        cursor.delete();
      }
      cursor.continue();
    };
  });
}

async function tryGetCached(key: string): Promise<ArrayBuffer | null> {
  const db = await openDb();
  await pruneExpired(db);
  const row = await new Promise<EpubCacheRecord | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result as EpubCacheRecord | undefined);
  });
  if (row && row.expiresAt > Date.now() && row.buffer?.byteLength) {
    return row.buffer;
  }
  return null;
}

async function tryPutRecord(record: EpubCacheRecord): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(record);
  });
}

/**
 * URL blob pour la lecture : cache hit (IndexedDB) ou téléchargement puis mise en cache.
 */
export async function getLibraryBookReadUrlCached(bookId: string): Promise<string> {
  const path = `/api/library/books/${bookId}/read/`;
  const key = libraryBookCacheKey(bookId);

  if (!canUseIndexedDB()) {
    return fetchEpubBlobUrl(path);
  }

  try {
    const cachedBuf = await tryGetCached(key);
    if (cachedBuf) {
      return URL.createObjectURL(new Blob([cachedBuf], { type: 'application/epub+zip' }));
    }
  } catch {
    /* réseau ci-dessous */
  }

  const buf = await fetchEpubArrayBuffer(path);

  try {
    const now = Date.now();
    await tryPutRecord({
      key,
      bookId,
      storedAt: now,
      expiresAt: now + EPUB_LIBRARY_CACHE_TTL_MS,
      buffer: buf,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      void clearEpubReadCache();
    }
  }

  return URL.createObjectURL(new Blob([buf], { type: 'application/epub+zip' }));
}

/** À appeler à la déconnexion (ne pas servir les EPUB d’un autre utilisateur). */
export async function clearEpubReadCache(): Promise<void> {
  if (!canUseIndexedDB()) return;
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      const cr = tx.objectStore(STORE).clear();
      cr.onerror = () => reject(cr.error);
    });
  } catch {
    /* ignore */
  }
}
