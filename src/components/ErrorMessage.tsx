import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Affiche un message d'erreur clair et lisible, sans fond rouge agressif.
 */
export default function ErrorMessage({ message, onDismiss, className = '' }: ErrorMessageProps) {
  return (
    <div
      className={`d-flex align-items-start gap-2 p-3 rounded border border-danger border-opacity-50 bg-danger bg-opacity-10 ${className}`}
      role="alert"
    >
      <span className="text-danger mt-1" aria-hidden>
        <i className="fas fa-exclamation-circle" />
      </span>
      <div className="flex-grow-1">
        <p className="mb-0 text-dark small">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="btn btn-link p-0 text-muted text-decoration-none"
          onClick={onDismiss}
          aria-label="Fermer"
        >
          <i className="fas fa-times" />
        </button>
      )}
    </div>
  );
}
