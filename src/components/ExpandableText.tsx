import React, { useMemo, useState } from 'react';

type Props = {
  text: string;
  /** Nombre max de caractères avant troncature */
  maxChars?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function ExpandableText({ text, maxChars = 320, className, style }: Props) {
  const [expanded, setExpanded] = useState(false);

  const normalized = useMemo(() => (text ?? '').trim(), [text]);
  const isLong = normalized.length > maxChars;
  const visible = !isLong || expanded ? normalized : normalized.slice(0, maxChars).trimEnd() + '…';

  if (!normalized) return null;

  return (
    <div className={className} style={style}>
      <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>
        {visible}
      </p>
      {isLong && (
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
    </div>
  );
}

