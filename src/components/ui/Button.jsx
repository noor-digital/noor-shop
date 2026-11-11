import { Link } from 'react-router-dom';
import { classNames } from '../../lib/format.js';

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-medium transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

const sizes = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
  icon: 'h-10 w-10 p-0',
};

const variants = {
  primary: 'bg-violet text-white shadow-violet hover:bg-[#4327c6]',
  secondary: 'bg-ink text-white hover:bg-black',
  outline: 'bg-white border border-hairline text-ink hover:border-ink',
  ghost: 'bg-transparent text-ink hover:bg-hairline/60',
  soft: 'bg-violet-soft text-violet hover:bg-violet-wash/60',
  danger: 'bg-white text-danger border border-danger/30 hover:bg-danger/5',
  link: 'bg-transparent text-violet underline-offset-2 hover:underline h-auto px-0',
};

export function Button({
  as,
  to,
  href,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) {
  const classes = classNames(base, sizes[size], variants[variant], className);
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  const Comp = as || 'button';
  return (
    <Comp className={classes} type={Comp === 'button' ? type : undefined} {...rest}>
      {children}
    </Comp>
  );
}

export default Button;
