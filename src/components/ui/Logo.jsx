import { classNames } from '../../lib/format.js';

export function Logo({ className, tone = 'light' }) {
  return (
    <div className={classNames('inline-flex items-center gap-2', className)}>
      <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-violet text-white font-semibold">
        <span className="text-[14px] tracking-tightest">n</span>
      </span>
      <span
        className={classNames(
          'text-[18px] font-semibold tracking-tightest',
          tone === 'dark' ? 'text-white' : 'text-ink',
        )}
      >
        noor<span className="text-violet">.</span>shop
      </span>
    </div>
  );
}

export default Logo;
