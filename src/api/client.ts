const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://api.dismoipapa.shop';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface RequestOptions extends RequestInit {
  /** Si true, n'ajoute pas automatiquement le header JSON */
  skipJsonHeader?: boolean;
  /** Interne : évite de boucler sur le refresh token */
  _retry401?: boolean;
}

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const accessToken = localStorage.getItem('accessToken');

  const headers: HeadersInit = {
    ...(options.skipJsonHeader ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (accessToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }

  const doFetch = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method,
      headers,
      body:
        body === undefined || body === null || options.skipJsonHeader
          ? (body as BodyInit | undefined)
          : JSON.stringify(body),
    });

  let response = await doFetch();

  // Gestion automatique du refresh token sur 401
  if (response.status === 401 && !options._retry401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/users/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (refreshResponse.ok) {
          const data = (await refreshResponse.json()) as { access: string };
          localStorage.setItem('accessToken', data.access);
          // Met à jour le header Authorization et retente une fois
          (headers as Record<string, string>).Authorization = `Bearer ${data.access}`;
          response = await request<Response>(path, method, body, {
            ...options,
            _retry401: true,
          });
          // La réponse a déjà été traitée via l'appel récursif
          return response as unknown as T;
        } else {
          // Refresh invalide : on nettoie les tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch {
        // En cas d'erreur réseau sur le refresh, on laisse tomber et on remontera l'erreur originale
      }
    }
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      if (data && typeof data === 'object') {
        // Django REST Framework renvoie souvent {detail: "..."} ou des messages par champ
        if ('detail' in data) {
          message = data.detail as string;
        } else {
          message = JSON.stringify(data);
        }
      }
    } catch {
      // ignore erreur de parse JSON, on garde statusText
    }
    throw new Error(message || 'Erreur réseau');
  }

  if (response.status === 204) {
    // No Content
    return null as T;
  }

  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  // Pour les téléchargements / fichiers, on renvoie la réponse brute
  // @ts-expect-error type large accepté par les appelants spécifiques
  return response;
}

export function getJson<T>(path: string, options?: RequestOptions) {
  return request<T>(path, 'GET', undefined, options);
}

export function postJson<T>(path: string, body?: unknown, options?: RequestOptions) {
  return request<T>(path, 'POST', body, options);
}

export function patchJson<T>(path: string, body?: unknown, options?: RequestOptions) {
  return request<T>(path, 'PATCH', body, options);
}

export function delJson<T>(path: string, options?: RequestOptions) {
  return request<T>(path, 'DELETE', undefined, options);
}

export { API_BASE_URL };

