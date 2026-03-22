import React from 'react';

/**
 * Opérateurs Mobile Money RDC — logos dans `public/mobile_money/`.
 * Source unique pour le checkout, le footer et la FAQ.
 */
export const MOBILE_MONEY_METHODS = [
  {
    id: 'mpesa',
    label: 'M-Pesa (Vodacom)',
    shortLabel: 'M-Pesa',
    logoSrc: '/mobile_money/M-pesa-logo.png',
    logoAlt: 'M-Pesa',
  },
  {
    id: 'orange',
    label: 'Orange Money',
    shortLabel: 'Orange Money',
    logoSrc: '/mobile_money/Orange-Money-logo.png',
    logoAlt: 'Orange Money',
  },
  {
    id: 'airtel',
    label: 'Airtel Money',
    shortLabel: 'Airtel Money',
    logoSrc: '/mobile_money/airtel-money.png',
    logoAlt: 'Airtel Money',
  },
  {
    id: 'afrimoney',
    label: 'Afrimoney (Africell)',
    shortLabel: 'Afrimoney',
    logoSrc: '/mobile_money/afrimpney.png',
    logoAlt: 'Afrimoney',
  },
] as const;

export type MobileMoneyOperatorId = (typeof MOBILE_MONEY_METHODS)[number]['id'];

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
        {MOBILE_MONEY_METHODS.map((m) => (
          <div className="footer-payment-logos__item" role="listitem" key={m.id}>
            <img src={m.logoSrc} alt={m.logoAlt} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
