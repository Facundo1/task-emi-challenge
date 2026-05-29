export type Locale = "en" | "es";

export const LOCALES: ReadonlyArray<{ code: Locale; label: string; short: string }> = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
];

const EN = {
  "masthead.issue": "Issue · Vol. 04",
  "masthead.title.prefix": "The",
  "masthead.title.accent": "Candidates",
  "masthead.title.suffix": "Desk",
  "masthead.tagline":
    "A recruiter's console for screened applicants. Approve, reject, and feed the loop — every override sharpens tomorrow's screen.",
  "masthead.inQueue": "In Queue",
  "masthead.inQueueHint": "screened · pending review",

  "nav.desk": "Desk",
  "nav.pipeline": "Pipeline",
  "nav.insights": "Insights",
  "nav.settings": "Settings",

  "language.switch": "Language",

  "stats.section": "Daily ledger",
  "stats.total": "Total",
  "stats.approved": "Approved",
  "stats.rejected": "Rejected",
  "stats.rate": "Approval rate",
  "stats.hint.total": "screened",
  "stats.hint.approved": "cleared",
  "stats.hint.rejected": "filed out",
  "stats.hint.rate": "{count} in view",

  "roster.section": "Roster",

  "table.column.status": "Status",
  "table.column.actions": "Actions",
  "table.viewCV": "View CV",
  "table.empty.title": "No candidates match the current filters.",
  "table.empty.hint": "Adjust filters or wait for the next batch",

  "status.approved": "Approved",
  "status.rejected": "Rejected",

  "action.approve": "Approve",
  "action.reject": "Reject",
  "action.approve.aria": "Approve {name}",
  "action.reject.aria": "Reject {name}",

  "search.placeholder": "Search by name, email, or document",
  "search.aria": "Search candidates",

  "filter.all": "All",
  "filter.approved": "Approved",
  "filter.rejected": "Rejected",
  "filter.aria": "Filter by status",

  "columns.label": "Columns",
  "columns.heading": "Visible fields",
  "columns.totalHint": "{count} total",

  "modal.reject.eyebrow": "File · Rejection",
  "modal.reject.title.prefix": "Reject",
  "modal.reject.body": "Pick the reasons that apply. The model learns from each override.",
  "modal.reject.close": "esc",
  "modal.reject.close.aria": "Close dialog",
  "modal.reject.reasons": "Reasons",
  "modal.reject.selected": "{count} selected",
  "modal.reject.noReasons": "No reasons available",
  "modal.reject.signed": "Signed · {time}",
  "modal.reject.cancel": "Cancel",
  "modal.reject.confirm": "Reject ({count})",

  "spinner.loading": "Loading roster",
  "error.label": "Fault",
  "error.dismiss": "Dismiss",
  "error.retry": "Retry",

  "footer.status": "Stream live · feedback loop active",
  "footer.copy": "© Emi Labs · Recruiter Desk",

  "pagination.previous": "Prev",
  "pagination.next": "Next",
  "pagination.first": "First",
  "pagination.last": "Last",
  "pagination.showing": "Showing {from}–{to} of {total}",
  "pagination.page.aria": "Go to page {page}",
  "pagination.previous.aria": "Previous page",
  "pagination.next.aria": "Next page",

  "column.id": "ID",
  "column.name": "Name",
  "column.document": "Document",
  "column.cv_zonajobs": "CV · Zona Jobs",
  "column.cv_bumeran": "CV · Bumeran",
  "column.phone": "Phone",
  "column.email": "Email",
  "column.date": "Date",
  "column.age": "Age",
  "column.has_university": "University",
  "column.career": "Career",
  "column.graduated": "Graduated",
  "column.courses_approved": "Courses approved",
  "column.location": "Location",
  "column.accepts_working_hours": "Accepts hours",
  "column.desired_salary": "Salary",
  "column.had_interview": "Interview",
  "column.reason": "Reason",

  "value.yes": "Yes",
  "value.no": "No",
} as const;

export type TranslationKey = keyof typeof EN;

type Dictionary = Record<TranslationKey, string>;

const ES: Dictionary = {
  "masthead.issue": "Edición · Vol. 04",
  "masthead.title.prefix": "Mesa de",
  "masthead.title.accent": "Candidatos",
  "masthead.title.suffix": "",
  "masthead.tagline":
    "La consola del reclutador para postulantes filtrados. Aprobá, rechazá y alimentá el loop — cada override afina la próxima clasificación.",
  "masthead.inQueue": "En cola",
  "masthead.inQueueHint": "filtrados · pendientes de revisión",

  "nav.desk": "Mesa",
  "nav.pipeline": "Pipeline",
  "nav.insights": "Análisis",
  "nav.settings": "Ajustes",

  "language.switch": "Idioma",

  "stats.section": "Resumen del día",
  "stats.total": "Total",
  "stats.approved": "Aprobados",
  "stats.rejected": "Rechazados",
  "stats.rate": "Tasa de aprobación",
  "stats.hint.total": "filtrados",
  "stats.hint.approved": "habilitados",
  "stats.hint.rejected": "archivados",
  "stats.hint.rate": "{count} a la vista",

  "roster.section": "Listado",

  "table.column.status": "Estado",
  "table.column.actions": "Acciones",
  "table.viewCV": "Ver CV",
  "table.empty.title": "Ningún candidato coincide con los filtros actuales.",
  "table.empty.hint": "Ajustá los filtros o esperá el próximo lote",

  "status.approved": "Aprobado",
  "status.rejected": "Rechazado",

  "action.approve": "Aprobar",
  "action.reject": "Rechazar",
  "action.approve.aria": "Aprobar a {name}",
  "action.reject.aria": "Rechazar a {name}",

  "search.placeholder": "Buscar por nombre, email o documento",
  "search.aria": "Buscar candidatos",

  "filter.all": "Todos",
  "filter.approved": "Aprobados",
  "filter.rejected": "Rechazados",
  "filter.aria": "Filtrar por estado",

  "columns.label": "Columnas",
  "columns.heading": "Campos visibles",
  "columns.totalHint": "{count} en total",

  "modal.reject.eyebrow": "Expediente · Rechazo",
  "modal.reject.title.prefix": "Rechazar a",
  "modal.reject.body":
    "Elegí las razones que aplican. El modelo aprende de cada override.",
  "modal.reject.close": "esc",
  "modal.reject.close.aria": "Cerrar diálogo",
  "modal.reject.reasons": "Razones",
  "modal.reject.selected": "{count} seleccionadas",
  "modal.reject.noReasons": "No hay razones disponibles",
  "modal.reject.signed": "Firmado · {time}",
  "modal.reject.cancel": "Cancelar",
  "modal.reject.confirm": "Rechazar ({count})",

  "spinner.loading": "Cargando listado",
  "error.label": "Falla",
  "error.dismiss": "Descartar",
  "error.retry": "Reintentar",

  "footer.status": "Stream activo · loop de feedback en vivo",
  "footer.copy": "© Emi Labs · Mesa del Reclutador",

  "pagination.previous": "Ant.",
  "pagination.next": "Sig.",
  "pagination.first": "Inicio",
  "pagination.last": "Fin",
  "pagination.showing": "Mostrando {from}–{to} de {total}",
  "pagination.page.aria": "Ir a la página {page}",
  "pagination.previous.aria": "Página anterior",
  "pagination.next.aria": "Página siguiente",

  "column.id": "ID",
  "column.name": "Nombre",
  "column.document": "Documento",
  "column.cv_zonajobs": "CV · Zona Jobs",
  "column.cv_bumeran": "CV · Bumeran",
  "column.phone": "Teléfono",
  "column.email": "Email",
  "column.date": "Fecha",
  "column.age": "Edad",
  "column.has_university": "Universidad",
  "column.career": "Carrera",
  "column.graduated": "Graduación",
  "column.courses_approved": "Materias aprobadas",
  "column.location": "Ubicación",
  "column.accepts_working_hours": "Acepta horarios",
  "column.desired_salary": "Salario pretendido",
  "column.had_interview": "Entrevista",
  "column.reason": "Motivo",

  "value.yes": "Sí",
  "value.no": "No",
};

export const TRANSLATIONS: Record<Locale, Dictionary> = {
  en: EN,
  es: ES,
};

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "es";
}

const REASON_MAP_ES_TO_EN: ReadonlyMap<string, string> = new Map([
  ["Cantidad de materias aprobadas fuera de lo deseado", "Number of approved courses outside desired range"],
  ["No estudia/o carreras deseadas", "Does not study / has not studied desired careers"],
  ["Edad fuera de rango", "Age out of range"],
  ["Salario pretendido fuera de rango", "Expected salary out of range"],
  ["Ubicación.", "Location"],
  ["No acepta horarios", "Does not accept working hours"],
  ["Ya trabajó en PwC", "Previously worked at PwC"],
  ["No es universitario", "No university background"],
]);

export function translateReason(reason: string, locale: Locale): string {
  if (locale === "en") return REASON_MAP_ES_TO_EN.get(reason) ?? reason;
  return reason;
}
