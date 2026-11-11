import { classNames } from '../../lib/format.js';

export function Card({ as = 'div', className, children, padded = true, elevated = false, ...rest }) {
  const Comp = as;
  return (
    <Comp
      className={classNames(
        'rounded-card bg-white border border-hairline',
        elevated && 'border-transparent shadow-card',
        padded && 'p-6',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Badge({ children, tone = 'muted', className }) {
  const tones = {
    muted: 'bg-canvas text-muted',
    info: 'bg-violet-soft text-violet',
    success: 'bg-[#DCFCE7] text-success',
    warning: 'bg-[#FEF3C7] text-warning',
    danger: 'bg-[#FEE2E2] text-danger',
    dark: 'bg-ink text-white',
  };
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-caption font-medium',
        tones[tone] || tones.muted,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Pill({ children, active = false, className, ...rest }) {
  return (
    <button
      className={classNames(
        'inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-[13px] font-medium transition',
        active
          ? 'border-ink bg-ink text-white'
          : 'border-hairline bg-white text-ink hover:border-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SectionHeader({ title, subtitle, action, className }) {
  return (
    <div className={classNames('flex items-end justify-between gap-4 mb-6', className)}>
      <div>
        <h2 className="text-[20px] font-semibold tracking-tightest text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-body-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export default Card;
