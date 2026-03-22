import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dropdown, Modal } from 'react-bootstrap';

interface EpubReaderProps {
  epubUrl: string | null;
  title: string;
  onClose: () => void;
  dark?: boolean;
  fontSize?: number;
  asPage?: boolean;
  onDownload?: () => void;
}

type TocItem = {
  href: string;
  label: string;
  depth: number;
};

function flattenToc(
  items: { href?: string; label?: string; subitems?: typeof items }[] | undefined,
  depth = 0,
): TocItem[] {
  if (!items?.length) return [];
  const out: TocItem[] = [];
  for (const item of items) {
    if (item.href) {
      out.push({
        href: item.href,
        label: (item.label || 'Sans titre').replace(/\s+/g, ' ').trim(),
        depth,
      });
    }
    if (item.subitems?.length) {
      out.push(...flattenToc(item.subitems, depth + 1));
    }
  }
  return out;
}

/** Compare hrefs EPUB (ignore fragment / query). */
function hrefMatches(a: string, b: string): boolean {
  if (!a || !b) return false;
  const norm = (h: string) => h.split('#')[0].split('?')[0];
  return norm(a) === norm(b) || a.includes(norm(b)) || b.includes(norm(a));
}

const SERIF_STACK =
  'Georgia, "Times New Roman", Times, "Liberation Serif", serif';

/**
 * Thèmes injectés dans l’iframe EPUB.
 * IMPORTANT : utiliser `themes.registerCss(name, css)` — pas `register(name, string)`
 * (sinon epub.js traite la chaîne comme une URL et le thème ne s’applique pas).
 */
const EPUB_THEME_CSS = {
  light: `
    html { background: #ffffff !important; }
    body {
      background: #ffffff !important;
      color: #1a1a1a !important;
      line-height: 1.8 !important;
      font-family: ${SERIF_STACK} !important;
      max-width: 40rem !important;
      margin-left: auto !important;
      margin-right: auto !important;
      padding: 1.25rem 1.75rem 2.5rem !important;
      box-sizing: border-box !important;
    }
    a, a * { color: #1a1668 !important; }
    h1, h2, h3, h4, h5, h6 { color: #111827 !important; font-family: ${SERIF_STACK} !important; }
    p, li, td, th, blockquote { color: #1a1a1a !important; }
    code, pre { color: #111827 !important; background: #f3f4f6 !important; }
    hr { border-color: #e5e7eb !important; }
    ::selection { background: #c7d2fe; }
  `,
  dark: `
    html { background: #0f1115 !important; }
    body {
      background: #0f1115 !important;
      color: #e8e8ed !important;
      line-height: 1.8 !important;
      font-family: ${SERIF_STACK} !important;
      max-width: 40rem !important;
      margin-left: auto !important;
      margin-right: auto !important;
      padding: 1.25rem 1.75rem 2.5rem !important;
      box-sizing: border-box !important;
    }
    /* Couleurs inline éditeur (ex. noir) : !important bat le style inline sans !important */
    body *:not(img):not(svg):not(video):not(canvas):not(math) {
      color: #e8e8ed !important;
    }
    a, a * { color: #93c5fd !important; }
    h1, h2, h3, h4, h5, h6 { color: #f4f4f5 !important; }
    code, pre {
      color: #e8e8ed !important;
      background: #18181b !important;
      border: 1px solid #3f3f46 !important;
    }
    hr { border-color: #3f3f46 !important; }
    img { opacity: 0.95; }
    ::selection { background: #3b4f7d; }
  `,
};

/** Enregistre les thèmes clair/sombre (API registerCss, pas register+string). */
function registerReaderThemes(rendition: { themes: unknown }) {
  const t = rendition.themes as {
    registerCss: (name: string, css: string) => void;
  };
  t.registerCss('light', EPUB_THEME_CSS.light);
  t.registerCss('dark', EPUB_THEME_CSS.dark);
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
  const shellRef = useRef<HTMLDivElement>(null);
  const readColumnRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const readInnerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSizeState, setFontSizeState] = useState(fontSize);
  const [darkState, setDarkState] = useState(dark);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [currentHref, setCurrentHref] = useState<string | null>(null);
  const [sectionInfo, setSectionInfo] = useState({ current: 0, total: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTocMobile, setShowTocMobile] = useState(false);
  const [shellHeight, setShellHeight] = useState<number | null>(null);

  const renditionRef = useRef<{
    destroy: () => void;
    resize: (w: number, h: number) => void;
    themes: {
      register: (n: string, o: object) => void;
      select: (n: string) => void;
      font: (s: string) => void;
    };
    on: (e: string, fn: (l: { start?: { index?: number; href?: string } }) => void) => void;
    prev: () => Promise<void>;
    next: () => Promise<void>;
    display: (t?: string | number) => Promise<void>;
  } | null>(null);
  const bookRef = useRef<{
    opened: Promise<unknown>;
    loaded?: { navigation?: Promise<{ toc?: unknown[] }> };
    renderTo: (el: HTMLElement, o: object) => typeof renditionRef.current;
    destroy?: () => void;
  } | null>(null);

  const layoutChrome = asPage;

  // Hauteur du lecteur (viewport − position)
  useEffect(() => {
    const compute = () => {
      const el = shellRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = Math.max(400, Math.round(window.innerHeight - rect.top - 12));
      setShellHeight(h);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = async () => {
    const el = shellRef.current;
    try {
      if (!document.fullscreenElement && el?.requestFullscreen) {
        await el.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore */
    }
  };

  const measureReadArea = useCallback(() => {
    const inner = readInnerRef.current;
    if (!inner) return { w: 600, h: 500 };
    const ir = inner.getBoundingClientRect();
    const w = Math.max(280, Math.floor(ir.width));
    const h = Math.max(320, Math.floor(ir.height));
    return { w, h };
  }, []);

  const applyResize = useCallback(() => {
    const r = renditionRef.current;
    if (!r?.resize || !ready) return;
    const { w, h } = measureReadArea();
    const contentW = Math.min(680, Math.max(300, w - 40));
    const contentH = Math.max(280, h - 12);
    try {
      r.resize(contentW, contentH);
    } catch {
      /* ignore */
    }
  }, [measureReadArea, ready]);

  // Recalcul taille zone de lecture (sidebar, redimensionnement fenêtre)
  useEffect(() => {
    const inner = readInnerRef.current;
    if (!inner) return;
    const ro = new ResizeObserver(() => applyResize());
    ro.observe(inner);
    return () => ro.disconnect();
  }, [applyResize, ready, layoutChrome]);

  useEffect(() => {
    if (!epubUrl || !containerRef.current) return;

    setError(null);
    setReady(false);
    setTocItems([]);
    setCurrentHref(null);
    const container = containerRef.current;
    container.innerHTML = '';

    let mounted = true;

    const loadEpub = async () => {
      try {
        const { default: ePub } = await import('epubjs');
        const bookOptions =
          typeof epubUrl === 'string'
            ? { openAs: 'epub' as const, replacements: 'blobUrl' as const }
            : undefined;
        const book = ePub(epubUrl, bookOptions) as NonNullable<typeof bookRef.current>;
        bookRef.current = book;

        await book.opened;
        if (!mounted || !containerRef.current) return;

        const nav = await book.loaded?.navigation;
        const rawToc = (nav as { toc?: unknown[] })?.toc ?? [];
        const flat = flattenToc(rawToc as Parameters<typeof flattenToc>[0]);
        setTocItems(flat);
        setSectionInfo((s) => ({ ...s, total: flat.length || 1 }));

        await new Promise((r) => requestAnimationFrame(() => r(null)));

        const { w: viewportW, h: viewportH } = measureReadArea();
        const contentW = Math.min(680, Math.max(300, viewportW - 40));
        const contentH = Math.max(280, viewportH - 12);

        const renderOpts = {
          width: contentW,
          height: contentH,
          spread: 'none' as const,
          flow: 'scrolled' as const,
          allowScriptedContent: true,
        };

        const rendition = book.renderTo(container, renderOpts) as NonNullable<typeof renditionRef.current>;
        renditionRef.current = rendition;

        registerReaderThemes(rendition);
        rendition.themes.select(darkState ? 'dark' : 'light');
        rendition.themes.font(`${fontSizeState}px`);

        rendition.on('relocated', (location: { start?: { index?: number; href?: string } }) => {
          if (!mounted) return;
          if (location?.start?.index != null) {
            setSectionInfo((s) => ({ ...s, current: location.start!.index! }));
          }
          if (location?.start?.href) {
            setCurrentHref(location.start.href);
          }
        });

        await rendition.display();

        if (!mounted) return;
        setReady(true);
        requestAnimationFrame(() => applyResize());
      } catch (err) {
        renditionRef.current?.destroy();
        renditionRef.current = null;
        if (bookRef.current?.destroy) bookRef.current.destroy();
        bookRef.current = null;
        if (containerRef.current) containerRef.current.innerHTML = '';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chargement uniquement à changement d’URL
  }, [epubUrl]);

  useEffect(() => {
    const r = renditionRef.current;
    if (!r?.themes) return;
    const name = darkState ? 'dark' : 'light';
    r.themes.select(name);
    r.themes.font(`${fontSizeState}px`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = r.themes as { override?: (a: string, b: string, c: boolean) => void; update?: (n: string) => void };
    t.override?.('font-size', `${fontSizeState}px`, true);
    t.update?.(name);
  }, [darkState, fontSizeState, ready]);

  const goPrev = () => renditionRef.current?.prev();
  const goNext = () => renditionRef.current?.next();

  const goToHref = useCallback(async (href: string) => {
    try {
      await renditionRef.current?.display(href);
      setShowTocMobile(false);
    } catch {
      /* ignore */
    }
  }, []);

  const bumpFont = (delta: number) => {
    setFontSizeState((s) => Math.min(28, Math.max(12, s + delta)));
  };

  const shellBg = darkState ? '#14161c' : '#f0f1f3';
  const sidebarBg = darkState ? '#1e2128' : '#e8e9ec';
  const sidebarBorder = darkState ? '#2d323c' : '#d8d9de';
  const toolbarBg = darkState ? '#1a1d24' : '#fafafa';
  const toolbarBorder = darkState ? '#333842' : '#e5e5e5';
  const textMuted = darkState ? '#9ca3af' : '#6b7280';
  const chevronBg = darkState ? 'rgba(30,33,40,0.65)' : 'rgba(255,255,255,0.85)';
  const chevronColor = darkState ? '#e5e7eb' : '#6b7280';

  const tocList = useMemo(() => {
    if (!tocItems.length) {
      return (
        <p className="small px-3 py-2 mb-0" style={{ color: textMuted }}>
          Aucun sommaire pour ce livre.
        </p>
      );
    }
    return (
      <nav className="py-2" aria-label="Sommaire">
        {tocItems.map((item, idx) => {
          const active = Boolean(currentHref && hrefMatches(currentHref, item.href));
          return (
            <button
              key={`${item.href}-${idx}`}
              type="button"
              onClick={() => void goToHref(item.href)}
              className="w-100 text-start border-0 reader-toc-item"
              style={{
                padding: `10px 12px 10px ${14 + item.depth * 14}px`,
                fontSize: '0.875rem',
                lineHeight: 1.35,
                color: active ? (darkState ? '#fff' : '#1a1668') : darkState ? '#d1d5db' : '#374151',
                background: active ? (darkState ? '#2d3748' : '#e8eaf6') : 'transparent',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                borderLeft: active ? '3px solid #1a1668' : '3px solid transparent',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    );
  }, [tocItems, currentHref, textMuted, darkState, goToHref]);

  const settingsDropdown = (
    <Dropdown align="start">
      <Dropdown.Toggle
        variant={darkState ? 'outline-light' : 'outline-secondary'}
        size="sm"
        className="rounded-circle p-2"
        style={{ width: 40, height: 40 }}
        aria-label="Réglages de lecture"
      >
        <i className="fa fa-cog" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="shadow p-3" style={{ minWidth: 240 }}>
        <div className="small text-muted mb-2">Taille du texte</div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <Button variant="outline-secondary" size="sm" onClick={() => bumpFont(-1)} aria-label="Diminuer">
            A−
          </Button>
          <span className="flex-grow-1 text-center fw-semibold">{fontSizeState}px</span>
          <Button variant="outline-secondary" size="sm" onClick={() => bumpFont(1)} aria-label="Augmenter">
            A+
          </Button>
        </div>
        <div className="small text-muted mb-2">Apparence</div>
        <div className="d-grid gap-2 mb-2">
          <Button
            variant={!darkState ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setDarkState(false)}
          >
            <i className="fa fa-sun me-2" />
            Mode clair
          </Button>
          <Button
            variant={darkState ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setDarkState(true)}
          >
            <i className="fa fa-moon me-2" />
            Mode sombre
          </Button>
        </div>
        <Dropdown.Divider />
        <Button variant="outline-primary" size="sm" className="w-100" onClick={() => void toggleFullscreen()}>
          <i className={`fa fa-${isFullscreen ? 'compress' : 'expand'} me-2`} />
          {isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
        </Button>
        {onDownload && (
          <>
            <Dropdown.Divider />
            <Button variant="outline-secondary" size="sm" className="w-100" onClick={onDownload}>
              <i className="fa fa-download me-2" />
              Télécharger
            </Button>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );

  const chevronBtn = (side: 'left' | 'right', onClick: () => void) => (
    <button
      type="button"
      onClick={() => void onClick()}
      className="position-absolute border-0 d-none d-md-flex align-items-center justify-content-center reader-chevron"
      style={{
        ...(side === 'left' ? { left: 8 } : { right: 8 }),
        top: '50%',
        transform: 'translateY(-50%)',
        width: 48,
        height: 96,
        borderRadius: 8,
        background: chevronBg,
        color: chevronColor,
        zIndex: 4,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
      }}
      aria-label={side === 'left' ? 'Page précédente' : 'Page suivante'}
    >
      <i className={`fa fa-chevron-${side}`} style={{ fontSize: '1.35rem' }} />
    </button>
  );

  const readerChrome = (
    <div
      ref={shellRef}
      className="d-flex flex-column epub-reader-shell overflow-hidden"
      style={{
        backgroundColor: shellBg,
        height: shellHeight ? `${shellHeight}px` : 'min(85vh, 820px)',
        minHeight: 480,
        borderRadius: asPage ? 8 : 0,
      }}
    >
      {error && (
        <div className="p-4 text-center text-danger m-auto">
          <p>{error}</p>
          <Button variant="outline-secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      )}

      {!error && layoutChrome && (
        <div className="d-flex flex-grow-1 min-h-0" style={{ minHeight: 0 }}>
          {/* Sommaire — desktop */}
          <aside
            className="d-none d-lg-flex flex-column flex-shrink-0 border-end"
            style={{
              width: 300,
              maxWidth: '32vw',
              backgroundColor: sidebarBg,
              borderColor: sidebarBorder,
            }}
          >
            <div
              className="px-3 py-3 border-bottom small fw-semibold text-uppercase"
              style={{ borderColor: sidebarBorder, color: textMuted, letterSpacing: '0.04em' }}
            >
              Sommaire
            </div>
            <div className="flex-grow-1 overflow-auto">{tocList}</div>
          </aside>

          {/* Colonne lecture */}
          <div
            ref={readColumnRef}
            className="d-flex flex-column flex-grow-1 min-w-0"
            style={{ backgroundColor: darkState ? '#12141a' : '#fff', minHeight: 0 }}
          >
            {/* Barre : réglages + titre + actions */}
            <div
              ref={toolbarRef}
              className="d-flex align-items-center gap-2 px-2 py-2 border-bottom flex-shrink-0"
              style={{ borderColor: toolbarBorder, backgroundColor: toolbarBg }}
            >
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant={darkState ? 'outline-light' : 'outline-secondary'}
                  size="sm"
                  className="d-lg-none"
                  onClick={() => setShowTocMobile(true)}
                  aria-label="Ouvrir le sommaire"
                >
                  <i className="fa fa-list-ul" />
                </Button>
                {settingsDropdown}
              </div>
              <h2
                className="flex-grow-1 text-center mb-0 text-truncate px-2"
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: darkState ? '#f3f4f6' : '#1a1668',
                }}
                title={title}
              >
                {title}
              </h2>
              <div className="d-flex align-items-center gap-1 flex-shrink-0">
                <Button
                  variant={darkState ? 'outline-light' : 'outline-secondary'}
                  size="sm"
                  className="d-none d-sm-inline-flex"
                  onClick={() => void toggleFullscreen()}
                  title="Plein écran"
                  aria-label="Plein écran"
                >
                  <i className={`fa fa-${isFullscreen ? 'compress' : 'expand'}`} />
                </Button>
                {onDownload && (
                  <Button
                    variant={darkState ? 'outline-light' : 'outline-secondary'}
                    size="sm"
                    className="d-none d-sm-inline-flex"
                    onClick={onDownload}
                    title="Télécharger"
                  >
                    <i className="fa fa-download" />
                  </Button>
                )}
                <Button
                  variant={darkState ? 'outline-light' : 'outline-danger'}
                  size="sm"
                  onClick={onClose}
                  aria-label="Fermer la lecture"
                  title="Fermer"
                >
                  <i className="fa fa-times" />
                </Button>
              </div>
            </div>

            {/* Zone EPUB : fond bandeau, contenu centré, scroll dans l’iframe (mode scrolled) */}
            <div
              ref={readInnerRef}
              className="flex-grow-1 position-relative d-flex justify-content-center align-items-stretch"
              style={{
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '10px 14px 14px',
                backgroundColor: darkState ? '#12141a' : '#f4f5f7',
              }}
            >
              {chevronBtn('left', goPrev)}
              <div
                ref={containerRef}
                className="position-relative z-1 reader-epub-container"
                style={{
                  width: '100%',
                  maxWidth: 700,
                  height: '100%',
                  minHeight: 300,
                  margin: '0 auto',
                  overflow: 'hidden',
                  display: 'block',
                  boxShadow: darkState ? '0 0 0 1px #27272f' : '0 1px 8px rgba(0,0,0,0.06)',
                  borderRadius: 6,
                  backgroundColor: darkState ? '#0f1115' : '#fff',
                }}
              />
              {chevronBtn('right', goNext)}
            </div>

            {ready && (
              <div
                className="d-flex justify-content-between align-items-center px-3 py-2 border-top flex-shrink-0 small"
                style={{
                  borderColor: toolbarBorder,
                  backgroundColor: toolbarBg,
                  color: textMuted,
                }}
              >
                <span>
                  Section {sectionInfo.current + 1}
                  {sectionInfo.total > 0 ? ` / ${sectionInfo.total}` : ''}
                </span>
                <div className="d-flex gap-2 d-md-none">
                  <Button variant="outline-secondary" size="sm" onClick={() => void goPrev()}>
                    <i className="fa fa-chevron-left" />
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={() => void goNext()}>
                    <i className="fa fa-chevron-right" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!error && !layoutChrome && (
        <div className="d-flex flex-column flex-grow-1 min-h-0">
          <div
            ref={toolbarRef}
            className="d-flex align-items-center gap-2 px-2 py-2 border-bottom flex-shrink-0"
            style={{ borderColor: toolbarBorder, backgroundColor: toolbarBg }}
          >
            {settingsDropdown}
            <h2 className="flex-grow-1 text-center mb-0 text-truncate" style={{ fontSize: '1rem' }}>
              {title}
            </h2>
            <Button variant="outline-secondary" size="sm" onClick={onClose}>
              <i className="fa fa-times" />
            </Button>
          </div>
          <div
            ref={readInnerRef}
            className="flex-grow-1 position-relative d-flex justify-content-center"
            style={{
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '10px 12px',
              backgroundColor: darkState ? '#12141a' : '#f4f5f7',
            }}
          >
            <div
              ref={containerRef}
              className="reader-epub-container"
              style={{
                width: '100%',
                maxWidth: 700,
                height: '100%',
                minHeight: 320,
                margin: '0 auto',
                display: 'block',
                position: 'relative',
                borderRadius: 6,
                overflow: 'hidden',
                backgroundColor: darkState ? '#0f1115' : '#fff',
                boxShadow: darkState ? '0 0 0 1px #27272f' : '0 1px 8px rgba(0,0,0,0.06)',
              }}
            />
          </div>
          {ready && (
            <div className="d-flex justify-content-center gap-2 p-2 border-top">
              <Button variant="outline-secondary" size="sm" onClick={() => void goPrev()}>
                Précédent
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => void goNext()}>
                Suivant
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Sommaire mobile */}
      {layoutChrome && showTocMobile && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ zIndex: 1050, background: 'rgba(0,0,0,0.45)' }}
          role="presentation"
          onClick={() => setShowTocMobile(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowTocMobile(false)}
        >
          <div
            className="h-100 shadow"
            style={{
              maxWidth: 320,
              width: '88%',
              backgroundColor: sidebarBg,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Sommaire"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
              <span className="fw-semibold" style={{ color: darkState ? '#f3f4f6' : '#111' }}>
                Sommaire
              </span>
              <Button variant="link" size="sm" className="p-0" onClick={() => setShowTocMobile(false)}>
                <i className="fa fa-times fa-lg" />
              </Button>
            </div>
            <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 56px)' }}>
              {tocList}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (asPage) {
    return (
      <div className="w-100" style={{ minHeight: 420 }}>
        {readerChrome}
      </div>
    );
  }

  return (
    <Modal show fullscreen onHide={onClose} backdrop="static" keyboard={false} style={{ zIndex: 9999 }}>
      <Modal.Body className="p-0 d-flex flex-column" style={{ minHeight: '100vh' }}>
        {readerChrome}
      </Modal.Body>
    </Modal>
  );
}

