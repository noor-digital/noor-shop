import { classNames } from '../../lib/format.js';

export function Input({ label, hint, error, as = 'input', className, id, ...rest }) {
  const Comp = as;
  const inputId = id || rest.name;
  return (
    <label htmlFor={inputId} className="block">
      {label && (
        <span className="mb-2 block text-body-sm font-medium text-ink">{label}</span>
      )}
      <Comp
        id={inputId}
        className={classNames(
          'w-full rounded-pill bg-white border border-hairline px-4 py-3 text-[14px] text-ink placeholder:text-muted/80 focus:border-ink focus:outline-none',
          as === 'textarea' && 'rounded-[24px] min-h-[120px] py-3 resize-y',
          error && 'border-danger',
          className,
        )}
        {...rest}
      />
      {hint && !error && <span className="mt-1.5 block text-caption text-muted">{hint}</span>}
      {error && <span className="mt-1.5 block text-caption text-danger">{error}</span>}
    </label>
  );
}

export function Select({ label, hint, error, className, children, id, ...rest }) {
  return (
    <label htmlFor={id || rest.name} className="block">
      {label && <span className="mb-2 block text-body-sm font-medium text-ink">{label}</span>}
      <div className="relative">
        <select
          id={id || rest.name}
          className={classNames(
            'w-full appearance-none rounded-pill bg-white border border-hairline px-4 py-3 pr-9 text-[14px] text-ink focus:border-ink focus:outline-none',
            error && 'border-danger',
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">▾</span>
      </div>
      {hint && !error && <span className="mt-1.5 block text-caption text-muted">{hint}</span>}
      {error && <span className="mt-1.5 block text-caption text-danger">{error}</span>}
    </label>
  );
}

export default Input;
