import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { PWA_UPDATE_EVENT } from '../serviceWorkerRegistration';

type UpdateDetail = { registration: ServiceWorkerRegistration };

/**
 * Barre fixe : nouvelle build disponible (service worker en attente).
 * - Mettre à jour : envoie SKIP_WAITING au worker, puis recharge au prochain contrôleur.
 * - Plus tard : masque la barre (le badge est retiré si l’API est supportée).
 */
function PwaUpdatePrompt() {
  const [visible, setVisible] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(
    null
  );
  const pendingReloadRef = useRef(false);

  const trySetBadge = useCallback(() => {
    if ('setAppBadge' in navigator && typeof navigator.setAppBadge === 'function') {
      navigator.setAppBadge(1).catch(() => {});
    }
  }, []);

  const tryClearBadge = useCallback(() => {
    if ('clearAppBadge' in navigator && typeof navigator.clearAppBadge === 'function') {
      navigator.clearAppBadge().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onUpdateEvent = (e: Event) => {
      const custom = e as CustomEvent<UpdateDetail>;
      if (custom.detail?.registration) {
        setRegistration(custom.detail.registration);
        setVisible(true);
        trySetBadge();
      }
    };

    window.addEventListener(PWA_UPDATE_EVENT, onUpdateEvent);
    return () => window.removeEventListener(PWA_UPDATE_EVENT, onUpdateEvent);
  }, [trySetBadge]);

  useEffect(() => {
    const onControllerChange = () => {
      if (pendingReloadRef.current) {
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () =>
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);

  const applyUpdate = useCallback(() => {
    const waiting = registration?.waiting;
    if (!waiting) return;
    pendingReloadRef.current = true;
    waiting.postMessage({ type: 'SKIP_WAITING' });
  }, [registration]);

  const dismiss = useCallback(() => {
    setVisible(false);
    tryClearBadge();
  }, [tryClearBadge]);

  if (!visible || !registration) {
    return null;
  }

  return (
    <div
      className="pwa-update-prompt position-fixed bottom-0 start-0 end-0 p-3"
      style={{ zIndex: 1080 }}
      role="status"
      aria-live="polite"
    >
      <Alert variant="dark" className="mb-0 shadow border-primary d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-2">
        <span className="small">
          Une nouvelle version de l’application est prête. Mettez à jour pour utiliser les
          derniers correctifs et fonctionnalités.
        </span>
        <div className="d-flex flex-shrink-0 gap-2 justify-content-end">
          <Button variant="outline-light" size="sm" onClick={dismiss}>
            Plus tard
          </Button>
          <Button variant="primary" size="sm" onClick={applyUpdate}>
            Mettre à jour
          </Button>
        </div>
      </Alert>
    </div>
  );
}

export default PwaUpdatePrompt;
