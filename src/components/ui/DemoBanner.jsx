export function DemoBanner({ children = 'Interface de démonstration — les données affichées sont fictives.' }) {
  return (
    <div className="flex items-center justify-center gap-2 bg-ink text-white text-caption font-medium py-2 px-4">
      <span className="h-1.5 w-1.5 rounded-pill bg-violet-wash" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

export default DemoBanner;
