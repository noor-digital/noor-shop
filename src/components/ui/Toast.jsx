import { useStore } from '../../context/StoreContext.jsx';
import { classNames } from '../../lib/format.js';

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  const tones = {
    info: 'bg-ink text-white',
    success: 'bg-ink text-white',
    error: 'bg-danger text-white',
  };
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div
        className={classNames(
          'pointer-events-auto flex items-center gap-2 rounded-pill px-5 py-3 text-body-sm shadow-lift',
          tones[toast.tone] || tones.info,
        )}
      >
        <span className="h-1.5 w-1.5 rounded-pill bg-violet-wash" aria-hidden />
        {toast.message}
      </div>
    </div>
  );
}

export default Toast;
