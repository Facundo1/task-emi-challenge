# Tailwind Component Styles — emi-challenge

> Cargado on-demand desde `SKILL.md` cuando la pregunta es sobre estilos de componentes concretos.

## Tabla legible

```tsx
<table className="w-full text-left text-sm">
  <thead className="bg-slate-100 text-slate-700 uppercase tracking-wide">
    <tr>
      {visibleColumns.map((col) => (
        <th key={col} className="px-4 py-3 font-medium">{col}</th>
      ))}
      <th className="px-4 py-3 font-medium text-right">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-200">
    {candidates.map((c) => (
      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
        {visibleColumns.map((col) => (
          <td key={col} className="px-4 py-3">{String(c[col])}</td>
        ))}
        <td className="px-4 py-3 text-right">
          <ApproveRejectActions candidate={c} />
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

## Badge approved / rejected

```tsx
const isApproved = candidate.reason === "";

<span
  className={
    isApproved
      ? "inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
      : "inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
  }
>
  {isApproved ? "Approved" : "Rejected"}
</span>
```

## Botón primario / secundario

```tsx
<button
  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
  disabled={isPending}
  onClick={handleApprove}
>
  Approve
</button>

<button
  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  onClick={handleCancel}
>
  Cancel
</button>
```

## Modal (rechazo con razones)

```tsx
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
  onClick={onClose}
>
  <div
    className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
    onClick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    aria-labelledby="reject-title"
  >
    <h2 id="reject-title" className="text-lg font-semibold text-slate-900">
      Reject candidate
    </h2>
    <p className="mt-1 text-sm text-slate-600">
      Select one or more reasons for rejection.
    </p>
    <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
      {reasons.map((r) => (
        <label key={r} className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.has(r)}
            onChange={() => toggleReason(r)}
            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-800">{r}</span>
        </label>
      ))}
    </div>
    <div className="mt-6 flex justify-end gap-2">
      <button
        type="button"
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
        disabled={selected.size === 0}
        onClick={onConfirm}
      >
        Reject ({selected.size})
      </button>
    </div>
  </div>
</div>
```

Accesibilidad: `role="dialog"`, `aria-modal`, `aria-labelledby`. Click en backdrop cierra; `stopPropagation` evita que el click dentro del modal lo cierre.

## Input de búsqueda

```tsx
<div className="relative">
  <input
    type="search"
    placeholder="Search candidates..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pl-9 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
  <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /* ...search icon... */ />
</div>
```

## Spinner / Loading

```tsx
<div className="flex items-center justify-center py-12">
  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
</div>
```

## Empty state

```tsx
<div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
  <p className="text-sm text-slate-600">No candidates match the current filters.</p>
  <button
    onClick={onResetFilters}
    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
  >
    Reset filters
  </button>
</div>
```

## Error banner

```tsx
<div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
  <strong className="font-medium">Failed to load:</strong> {error.message}{" "}
  <button onClick={onRetry} className="ml-2 underline">Retry</button>
</div>
```

## Lookup table de colors

```tsx
const STATUS_STYLES = {
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
} as const;

<span className={clsx("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[status])}>
  {status}
</span>
```

Esta es la forma correcta de tener clases "dinámicas" — todas las variantes son strings literales que Tailwind detecta en build.
