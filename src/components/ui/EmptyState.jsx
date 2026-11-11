import { classNames } from '../../lib/format.js';

export function EmptyState({ icon = '✧', title, description, action, className }) {
  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center rounded-card border border-dashed border-hairline bg-white px-6 py-14 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-canvas text-2xl">
        {icon}
      </div>
      <h3 className="text-[18px] font-semibold tracking-tightest text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-body text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadingRows({ rows = 4 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-card bg-canvas" />
      ))}
    </div>
  );
}

export function Alert({ tone = 'info', title, children, className }) {
  const tones = {
    info: 'border-violet/30 bg-violet-soft/60 text-ink',
    warning: 'border-amber-200 bg-amber-50 text-ink',
    danger: 'border-red-200 bg-red-50 text-ink',
    success: 'border-emerald-200 bg-emerald-50 text-ink',
    demo: 'border-hairline bg-canvas text-ink',
  };
  return (
    <div className={classNames('rounded-card border px-5 py-4', tones[tone], className)}>
      {title && <p className="font-semibold text-[14px] mb-1">{title}</p>}
      <div className="text-body-sm text-muted">{children}</div>
    </div>
  );
}

export default EmptyState;
