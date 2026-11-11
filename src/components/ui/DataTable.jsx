import { classNames } from '../../lib/format.js';

export function DataTable({ columns, rows, empty, onRowClick }) {
  if (!rows || rows.length === 0) {
    return empty;
  }
  return (
    <div className="overflow-hidden rounded-card border border-hairline bg-white">
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-hairline bg-canvas/60 text-caption uppercase tracking-tight text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-5 py-3 font-medium whitespace-nowrap">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={classNames(
                  'border-b border-hairline/60 last:border-b-0 transition hover:bg-canvas/50',
                  onRowClick && 'cursor-pointer',
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-5 py-4 text-body text-ink align-middle">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile list */}
      <ul className="sm:hidden divide-y divide-hairline">
        {rows.map((row, idx) => (
          <li
            key={row.id || idx}
            className="p-5 space-y-2"
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map((c) => (
              <div key={c.key} className="flex items-start justify-between gap-3">
                <span className="text-caption uppercase tracking-tight text-muted shrink-0">
                  {c.header}
                </span>
                <span className="text-body text-ink text-right">
                  {c.render ? c.render(row) : row[c.key]}
                </span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataTable;
