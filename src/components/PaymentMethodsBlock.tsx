import React from 'react';

/** Logos mobile money RDC (dossier public/mobile_money/) */
export const MOBILE_MONEY_LOGOS = [
  { src: '/mobile_money/airtel-money.png', alt: 'Airtel Money' },
  { src: '/mobile_money/Orange-Money-logo.png', alt: 'Orange Money' },
  { src: '/mobile_money/M-pesa-logo.png', alt: 'M-Pesa' },
  { src: '/mobile_money/afrimpney.jpg', alt: 'Afrimoney' },
] as const;

type PaymentMethodsBlockProps = {
  /** Balise du titre (h5 pour le footer, h2 pour une page type FAQ) */
  titleTag?: 'h2' | 'h3' | 'h5';
  titleClassName?: string;
  introClassName?: string;
  className?: string;
  /** Centrer titre, texte et logos (ex. page FAQ) */
  centered?: boolean;
};

/**
 * Bloc « Moyens de paiement » (mobile money RDC) — réutilisable footer, FAQ, etc.
 */
export default function PaymentMethodsBlock({
  titleTag = 'h5',
  titleClassName = 'footer-title mb-2',
  introClassName = 'text small mb-3',
  className = '',
  centered = false,
}: PaymentMethodsBlockProps) {
  const Title = titleTag;

  return (
    <div
      className={`payment-methods-block ${centered ? 'payment-methods-block--centered' : ''} ${className}`.trim()}
    >
      <Title className={titleClassName}>Moyens de paiement</Title>
      <p className={introClassName} style={{ textAlign: centered ? 'center' : 'start' }}>
        Pour l’instant, les paiements sont acceptés par <strong>mobile money</strong>.
      </p>
      <div className="footer-payment-logos" role="list" aria-label="Opérateurs mobile money acceptés">
        {MOBILE_MONEY_LOGOS.map((logo) => (
          <div className="footer-payment-logos__item" role="listitem" key={logo.src}>
            <img src={logo.src} alt={logo.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
