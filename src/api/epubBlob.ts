/**
 * Téléchargement binaire EPUB authentifié + blob URL (epub.js, même logique partout).
 */
import { getAuthenticatedBinaryResponse } from './client';

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

const EPUB_ACCEPT =
  'application/epub+zip,application/zip,application/octet-stream;q=0.9,*/*;q=0.8';

/**
 * Télécharge et valide l’EPUB ; utile pour mettre en cache le binaire sans créer d’URL blob.
 */
export async function fetchEpubArrayBuffer(apiPath: string): Promise<ArrayBuffer> {
  const res = await getAuthenticatedBinaryResponse(apiPath, EPUB_ACCEPT);

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
          /* ignore */
        } else {
          throw e;
        }
      }
    }
    throw new Error(
      'Le contenu reçu n’est pas un EPUB valide (fichier ZIP attendu). Vérifiez le fichier côté administration.',
    );
  }

  return buf;
}

/**
 * GET authentifié sur un chemin API qui renvoie un fichier EPUB → URL blob `application/epub+zip`.
 * À révoquer avec URL.revokeObjectURL.
 */
export async function fetchEpubBlobUrl(apiPath: string): Promise<string> {
  const buf = await fetchEpubArrayBuffer(apiPath);
  const blob = new Blob([buf], { type: 'application/epub+zip' });
  return URL.createObjectURL(blob);
}
