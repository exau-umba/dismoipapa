import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface EpubReaderProps {
  /** URL du fichier EPUB (blob URL ou URL publique) */
  epubUrl: string | null;
  /** Titre du livre pour l'en-tête */
  title: string;
  /** Appelé à la fermeture */
  onClose: () => void;
  /** Mode sombre */
  dark?: boolean;
  /** Taille de police par défaut */
  fontSize?: number;
  /** Affichage en page pleine (sans Modal) pour l'admin */
  asPage?: boolean;
  /** Action de téléchargement (optionnel) */
  onDownload?: () => void;
}

export default function EpubReader({
  epubUrl,
  title,
  onClose,
  dark = false,
  fontSize = 18,
  asPage = false,
  onDownload,
}: EpubReaderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSizeState, setFontSizeState] = useState(fontSize);
  const [darkState, setDarkState] = useState(dark);
  const [sectionInfo, setSectionInfo] = useState({ current: 0, total: 0 });
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const renditionRef = useRef<{
    destroy: () => void;
    themes: { register: (n: string, o: object) => void; select: (n: string) => void; font: (s: string) => void };
    on: (e: string, fn: (l: { start?: { index?: number } }) => void) => void;
    prev: () => Promise<void>;
    next: () => Promise<void>;
    display: () => Promise<void>;
  } | null>(null);
  const bookRef = useRef<{
    opened: Promise<unknown>;
    loaded?: { navigation?: Promise<{ toc?: unknown[] }> };
    renderTo: (el: HTMLElement, o: object) => typeof renditionRef.current;
    destroy?: () => void;
  } | null>(null);

  // Calcule la hauteur disponible pour éviter le scroll de page
  useEffect(() => {
    const compute = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = Math.max(320, Math.round(window.innerHeight - rect.top - 16));
      setAvailableHeight(h);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Fullscreen API (sur le wrapper)
  useEffect(() => {
    const onFs = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = async () => {
    const el = wrapperRef.current;
    try {
      if (!document.fullscreenElement && el?.requestFullscreen) {
        await el.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore (permissions / iOS)
    }
  };

  const themeCss = useMemo(() => {
    const bg = darkState ? '#0f1115' : '#ffffff';
    const fg = darkState ? '#e9eaee' : '#111827';
    const muted = darkState ? '#a7adbb' : '#6b7280';
    const link = darkState ? '#8ab4ff' : '#1a1668';
    return {
      bg,
      fg,
      css: `
        html, body { background: ${bg} !important; color: ${fg} !important; }
        body { line-height: 1.8 !important; }
        a { color: ${link} !important; }
        h1,h2,h3,h4,h5,h6 { color: ${fg} !important; }
        p,li,span,div { color: ${fg} !important; }
        code, pre { color: ${fg} !important; background: ${darkState ? '#141824' : '#f3f4f6'} !important; }
        hr { border-color: ${darkState ? '#2b2f3a' : '#e5e7eb'} !important; }
        ::selection { background: ${darkState ? '#2b4b8f' : '#c7d2fe'}; }
        .muted { color: ${muted} !important; }
      `,
    };
  }, [darkState]);

  useEffect(() => {
    if (!epubUrl || !containerRef.current) return;

    setError(null);
    setReady(false);
    const container = containerRef.current;
    container.innerHTML = '';

    let mounted = true;

    const loadEpub = async () => {
      try {
        const { default: ePub } = await import('epubjs');
        const book = ePub(epubUrl) as NonNullable<typeof bookRef.current>;
        bookRef.current = book;

        await book.opened;
        if (!mounted || !containerRef.current) return;

        const nav = await book.loaded?.navigation;
        const toc = (nav as { toc?: unknown[] })?.toc ?? [];
        setSectionInfo((s) => ({ ...s, total: toc.length || 1 }));

        const headerH = headerRef.current?.getBoundingClientRect().height ?? 52;
        const footerH = footerRef.current?.getBoundingClientRect().height ?? 52;
        const maxH = availableHeight ?? Math.max(520, window.innerHeight - 180);
        const viewportH = Math.max(320, maxH - headerH - footerH);
        const viewportW = Math.max(320, container.clientWidth || window.innerWidth);

        // A4 sur desktop, plus fluide sur mobile
        const maxPageWidth = viewportW < 768 ? viewportW - 16 : Math.min(760, viewportW - 32);
        const pageWidth = Math.max(320, Math.floor(maxPageWidth));
        const pageHeight = Math.max(420, Math.min(Math.round(pageWidth * Math.SQRT2), viewportH));

        const rendition = book.renderTo(container, {
          width: pageWidth,
          height: pageHeight,
          spread: 'none',
          flow: 'paginated',
          allowScriptedContent: true,
        }) as NonNullable<typeof renditionRef.current>;
        renditionRef.current = rendition;

        // Applique le thème dans l'iframe
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rendition.themes as any).register('dark', themeCss.css);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rendition.themes as any).register('light', themeCss.css);
        rendition.themes.select(darkState ? 'dark' : 'light');
        rendition.themes.font(`${fontSizeState}px`);

        rendition.on('relocated', (location: { start?: { index?: number }; end?: { index?: number } }) => {
          if (mounted && location?.start?.index != null) {
            setSectionInfo((s) => ({ ...s, current: location.start?.index ?? 0 }));
          }
        });

        await rendition.display();
        if (!mounted) return;
        setReady(true);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Impossible de charger le livre.');
        }
      }
    };

    loadEpub();

    return () => {
      mounted = false;
      renditionRef.current?.destroy();
      renditionRef.current = null;
      if (bookRef.current?.destroy) bookRef.current.destroy();
      bookRef.current = null;
    };
  }, [epubUrl, availableHeight, themeCss.css]);

  useEffect(() => {
    const r = renditionRef.current;
    if (!r?.themes) return;
    r.themes.select(darkState ? 'dark' : 'light');
    // epubjs est parfois capricieux : on force le font-size aussi via override
    r.themes.font(`${fontSizeState}px`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r.themes as any).override?.('font-size', `${fontSizeState}px`, true);
  }, [darkState, fontSizeState, ready]);

  const goPrev = () => renditionRef.current?.prev();
  const goNext = () => renditionRef.current?.next();

  const bg = themeCss.bg;
  const color = themeCss.fg;

  const content = (
    <div
      ref={wrapperRef}
      className="d-flex flex-column"
      style={{
        backgroundColor: bg,
        height: availableHeight ? `${availableHeight}px` : '70vh',
        minHeight: 420,
        overflow: 'hidden',
        borderRadius: asPage ? 0 : undefined,
      }}
    >
      <div
        ref={headerRef}
        className="d-flex justify-content-between align-items-center px-3 py-2"
        style={{ borderBottom: `1px solid ${darkState ? '#333' : '#eee'}`, backgroundColor: bg, color }}
      >
        <div className="d-flex align-items-center gap-2">
          {/* <Button
            variant={darkState ? 'outline-light' : 'outline-secondary'}
            size="sm"
            onClick={onClose}
          >
            <i className="fa fa-arrow-left me-1" /> Retour
          </Button> */}
          <h2 className="mb-0" style={{ color, fontSize: '1.1rem', fontWeight: 600 }}>
            {title}
          </h2>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            value={fontSizeState}
            onChange={(e) => setFontSizeState(Number(e.target.value))}
            style={{ width: 'auto' }}
          >
            {[12, 14, 16, 18, 20, 22, 24].map((n) => (
              <option key={n} value={n}>{n}px</option>
            ))}
          </select>
          <Button
            variant={darkState ? 'light' : 'dark'}
            size="sm"
            onClick={() => setDarkState(!darkState)}
            title={darkState ? 'Mode clair' : 'Mode sombre'}
          >
            <i className={`fa fa-${darkState ? 'sun' : 'moon'}`} />
          </Button>
          <Button
            variant={darkState ? 'outline-light' : 'outline-secondary'}
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            <i className={`fa fa-${isFullscreen ? 'compress' : 'expand'}`} />
          </Button>
          {onDownload && (
            <Button
              variant={darkState ? 'outline-light' : 'outline-secondary'}
              size="sm"
              onClick={onDownload}
              title="Télécharger"
            >
              <i className="fa fa-download" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
        {error && (
          <div className="p-4 text-center text-danger">
            <p>{error}</p>
            <Button variant="outline-secondary" onClick={onClose}>Fermer</Button>
          </div>
        )}
        {!error && (
          <div
            ref={containerRef}
            style={{
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
              padding: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}
      </div>

      {ready && !error && (
        <div
          ref={footerRef}
          className="d-flex justify-content-between align-items-center px-3 py-2"
          style={{ borderTop: `1px solid ${darkState ? '#333' : '#eee'}`, backgroundColor: bg, color }}
        >
          <span className="small text-muted">
            Section {sectionInfo.current + 1} {sectionInfo.total > 0 ? `/ ${sectionInfo.total}` : ''}
          </span>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={goPrev}>
              <i className="fa fa-chevron-left me-1" /> Précédent
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={goNext}>
              Suivant <i className="fa fa-chevron-right ms-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (asPage) {
    return (
      <div style={{ height: '100%', minHeight: '70vh' }}>
        {content}
      </div>
    );
  }

  return (
    <Modal
      show
      fullscreen
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      style={{ zIndex: 9999 }}
    >
      {content}
    </Modal>
  );
}
