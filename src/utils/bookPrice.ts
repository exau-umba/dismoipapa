/** Parse un prix livre renvoyé par l’API (chaîne, virgule éventuelle). */
export function parseBookPrice(raw: string | undefined | null): number {
  if (raw == null) return NaN;
  const s = String(raw).trim().replace(',', '.');
  if (s === '') return NaN;
  return Number.parseFloat(s);
}

/** Livre gratuit : 0, 0.0, etc. (pas une chaîne vide / invalide). */
export function isFreeBookPrice(raw: string | undefined | null): boolean {
  const n = parseBookPrice(raw);
  return Number.isFinite(n) && n <= 0;
}

/** Affichage boutique : « Gratuit » ou « 4.99 $ ». */
export function formatBookPriceLabel(raw: string | undefined | null): string {
  if (raw == null || String(raw).trim() === '') return '—';
  if (isFreeBookPrice(raw)) return 'Gratuit';
  return `${String(raw).trim()} $`;
}
