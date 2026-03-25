/**
 * Transforme une erreur technique (réseau, API, etc.) en message clair pour l'utilisateur.
 */
export function getFriendlyErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  // Erreurs réseau courantes
  if (message === 'Failed to fetch' || message === 'NetworkError when attempting to fetch resource.') {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion internet et réessayez.';
  }
  if (message.includes('Load failed') || message.includes('Network request failed')) {
    return 'Problème de connexion. Vérifiez votre accès internet.';
  }
  if (message.includes('timeout') || message === 'AbortError') {
    return 'La requête a pris trop de temps. Réessayez dans un moment.';
  }

  // Messages d'erreur HTTP / API déjà en français ou explicites — on les garde
  if (
    typeof message === 'string' &&
    message.length > 0 &&
    message.length < 200 &&
    !message.includes('fetch') &&
    !message.includes('Unexpected')
  ) {
    // Si le message ressemble à un message métier (pas du code), on le retourne
    return message;
  }

  // Messages techniques en anglais à traduire
  const known: Record<string, string> = {
    'Unauthorized': 'Session expirée. Veuillez vous reconnecter.',
    'Forbidden': "Vous n'avez pas les droits pour effectuer cette action.",
    'Not Found': 'La ressource demandée est introuvable.',
    'Internal Server Error': 'Un problème est survenu sur le serveur. Réessayez plus tard.',
    'Bad Request': 'Les informations envoyées sont incorrectes. Vérifiez et réessayez.',
    'Conflict': 'Cette action entre en conflit avec les données actuelles.',
    'Too Many Requests': 'Trop de tentatives. Veuillez patienter avant de réessayer.',
    'Payment error': 'Erreur de paiement. Veuillez vérifier vos informations de paiement et réessayer.',
    'No active account found with the given credentials': 'Compte invalide. Veuillez vérifier vos identifiants et réessayer.',
  };
  const trimmed = message.trim();
  if (known[trimmed]) return known[trimmed];

  // Réponse API avec "detail" ou message structuré
  if (typeof error === 'object' && error !== null && 'detail' in error) {
    const detail = (error as { detail: unknown }).detail;
    if (typeof detail === 'string' && detail.length > 0 && detail.length < 300) {
      return detail;
    }
  }

  return "Une erreur inattendue s'est produite. Veuillez réessayer ou contacter le support si le problème persiste.";
}
