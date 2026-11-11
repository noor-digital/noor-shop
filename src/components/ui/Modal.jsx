import { useEffect } from 'react';
import { classNames } from '../../lib/format.js';
import { Button } from './Button.jsx';

export function Modal({ open, onClose, title, description, children, actions, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/30 backdrop-blur-sm px-0 sm:px-4"
      onClick={onClose}
    >
      <div
        className={classNames(
          'w-full rounded-t-card sm:rounded-card bg-white p-6 shadow-lift',
          sizes[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="text-[18px] font-semibold tracking-tightest text-ink">{title}</h3>
        )}
        {description && <p className="mt-1 text-body-sm text-muted">{description}</p>}
        <div className="mt-4">{children}</div>
        {actions && <div className="mt-6 flex items-center justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirmer', tone = 'primary' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      actions={
        <>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}

export default Modal;
