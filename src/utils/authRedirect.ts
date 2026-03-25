/**
 * Redirection après connexion / inscription : évite les URLs externes (open redirect)
 * et les boucles vers les pages de connexion.
 */

const AUTH_PATH_PREFIXES = ['/shop-login', '/shop-registration', '/admin/login'] as const;

export function isSafeInternalNextPath(path: string): boolean {
  const t = path.trim();
  if (!t.startsWith('/')) return false;
  if (t.startsWith('//')) return false;
  if (t.includes('://')) return false;

  const pathOnly = t.split('?')[0]?.split('#')[0] ?? '';
  for (const p of AUTH_PATH_PREFIXES) {
    if (pathOnly === p || pathOnly.startsWith(`${p}/`)) return false;
  }
  return true;
}

/**
 * @param next valeur du query param `next` (souvent déjà décodée par l’URL)
 * @param defaultPath si absent ou invalide
 */
export function getSafeRedirectPath(next: string | null | undefined, defaultPath = '/my-profile'): string {
  if (next == null || String(next).trim() === '') return defaultPath;
  try {
    const decoded = decodeURIComponent(String(next));
    if (!isSafeInternalNextPath(decoded)) return defaultPath;
    return decoded;
  } catch {
    return defaultPath;
  }
}

/** Lien vers la page de connexion en conservant la page courante comme `next`. */
export function buildShopLoginHref(pathname: string, search: string): string {
  for (const p of AUTH_PATH_PREFIXES) {
    if (pathname === p || pathname.startsWith(`${p}/`)) return '/shop-login';
  }
  return `/shop-login?next=${encodeURIComponent(pathname + search)}`;
}
