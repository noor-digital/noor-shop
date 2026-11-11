import { classNames } from '../../lib/format.js';

export function Stat({ label, value, delta, hint, icon, className }) {
  return (
    <div className={classNames('rounded-card border border-hairline bg-white p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-tight text-muted">{label}</p>
          <p className="mt-2 text-[24px] font-semibold tracking-tightest text-ink">{value}</p>
        </div>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-canvas text-ink">
            {icon}
          </span>
        )}
      </div>
      {(delta || hint) && (
        <div className="mt-3 flex items-center gap-2 text-body-sm">
          {delta && (
            <span
              className={classNames(
                'rounded-pill px-2 py-0.5 text-caption font-medium',
                delta.startsWith('-') ? 'bg-red-50 text-danger' : 'bg-emerald-50 text-success',
              )}
            >
              {delta}
            </span>
          )}
          {hint && <span className="text-muted">{hint}</span>}
        </div>
      )}
    </div>
  );
}

export default Stat;
