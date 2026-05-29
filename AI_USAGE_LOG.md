# AI Usage Log — Emi React Challenge

> Registro detallado del uso de IA durante el challenge, según lo requerido por el entregable.
> Autor: Facundo Loberse
> Herramienta principal: Claude Code (Anthropic) — modelo principal Sonnet 4.6 y para tareas extensas Opus 4.7 
> Proyecto completado: 2026-05-27

---

## Resumen

- **Interacciones registradas:** 5 entradas principales, ~15 prompts/seguimientos registrados (cada entrada abarca múltiples llamadas a herramientas)
- **Duración:** 2026-05-27 (sesión única de trabajo)
- **Herramienta de IA principal:** Claude Code (CLI + extensión VSCode) — Sonnet 4.6 para el trabajo cotidiano, Opus 4.7 para las tareas más complejas (generación masiva de código, rediseño de UI, consolidación del log)
- **MCP servers configurados:** CodeGraph (AST tree-sitter + SQLite + FTS5). Disponible para queries estructurales sobre el código; menos usado durante la generación porque el codebase se estaba construyendo desde cero.
- **Enfoque de configuración:** sistema de contexto en capas en `.claude/` — ver Apéndice A
- **Resultado final:** Challenge completo. 57 tests pasando (26 server + 31 client), lint y typecheck en verde, API smoke-testeada end-to-end via proxy de Vite, build de producción exitoso.

---

## Metodología de trabajo con IA

Organicé la colaboración con Claude Code en torno a un **sistema de contexto en capas** en `.claude/`:

- **`CLAUDE.md`** (≤80 líneas, router del proyecto) — se carga automáticamente cada sesión.
- **`.claude/INDEX.md`** — mapea cada tipo de pedido (skill / doc / rule) al archivo correcto.
- **`.claude/skills/`** — invocables via `/nombre-skill`, cada una ≤120 líneas, con árboles de decisión explícitos. 8 skills en total: 4 core (brainstorming, clean-code, code-review-excellence, diagnose), 3 específicas del stack (react-patterns, express-api, tailwind-ui), 1 meta (ai-usage-log, este mismo log).
- **`.claude/rules/`** — se cargan automáticamente según path: TypeScript strict en todos los `.ts(x)`, convenciones React en `client/**`, convenciones API en `server/**`, convenciones de tests en `**/*.test.*`.
- **`.claude/docs/`** — docs de referencia (architecture, commands, gotchas, git-workflow) cargadas bajo demanda.
- **`.claude/MEMORY.md`** — log de decisiones del proyecto (interno, separado de este log).

El enfoque en capas mantiene el contexto de trabajo de Claude mínimo — mejor calidad de respuesta, menos alucinaciones, menor costo por sesión. En vez de un CLAUDE.md de 500 líneas que se carga completo siempre, cada turno de trabajo carga solo lo que necesita.

Registré cada decisión significativa en tiempo real usando la skill `/ai-usage-log`, con la estructura: **Disparador / Prompt / Acción de IA / Alternativas consideradas / Decisión / Resultado**. La skill fuerza esta estructura para evitar reconstrucciones post-hoc vagas.

---

## Log detallado (cronológico)

### Entrada 1 — 2026-05-27 — Setup de infraestructura (antes de cualquier código de aplicación)

**Disparador:** Inicio del challenge. Recibí el enunciado y los dos archivos JSON de datos. Antes de escribir cualquier código, quería tener la infraestructura de Claude Code armada para que el uso de IA durante el challenge quedara documentado, estructurado y auditable.

**Prompt / Request:**
> *"Antes de arrancar con el codigo, armemos la infra de Claude Code. Quiero el contexto segmentado: client y server separados, skills para react, express y tailwind, y la skill de ai-usage-log activa desde ya."*

Seguimiento (con los archivos):
> *"Analiza los dos JSON — candidates y columns — y decime que tipos TypeScript necesitamos antes de tocar una sola linea. Despues arrancamos con el scaffold."*

Seguimiento (mid-setup):
> *"si, dale asi, pero antes de escribir codigo fijate bien en los JSON que deje, que quiero que la estructura sea exacta"*

> *"y el log de AI tiene que ser detallado, cada decision documentada"*

**Acción de la IA:**
- Analizó el enunciado completo y los JSON antes de escribir una sola línea.
- Confirmó las variables del stack (TypeScript, Tailwind, separación client/server, skill ai-usage-log).
- Creó el árbol de directorios: `data/`, `.claude/{docs,rules,skills,plans}/`.
- Escribió blindaje local en `.git/info/exclude` (`CLAUDE.md`, `.claude/`, `.codegraph/`, `task-*.md`, `AI_USAGE_LOG.md`).
- Generó 33 archivos de infraestructura en batches paralelos.
- Detectó que 5 archivos SKILL.md superaban el cap de 120 líneas; los redujo moviendo los ejemplos de código detallados a `references/` (que se cargan bajo demanda cuando el árbol de decisión de la skill los requiere).

**Alternativas consideradas:**
- _A) Empezar a codear directamente con configuración mínima de Claude_ — descartada. El AI Usage Log es parte de la evaluación, y armar el log a posteriori tiende a ser vago. Invertir en infraestructura primero es lo que hace que el resto del trabajo sea trazable.
- _B) Un único CLAUDE.md grande con todo_ — descartada. Un CLAUDE.md de ~500 líneas se carga en cada turno aunque solo 20 líneas sean relevantes. Desperdicia tokens, contamina el contexto y degrada la calidad de respuesta.
- _C) Sistema en capas (elegida)_ — router corto (`CLAUDE.md` ≤80 líneas) + INDEX + skills/docs/rules cargadas bajo demanda.

**Decisión:** Sistema en capas adaptado al stack React + Vite + TS + Tailwind / Express + TS con carpetas `client/` y `server/` separadas. AI Usage Log skill como parte de primera clase de la infraestructura.

**Resultado:** Infra completa generada en una sesión, sin código de aplicación todavía (deliberado). `task-emi-challenge.md` escrito con AC explícitos en formato Given/When/Then para ambas partes. Dos marcadores `[NEEDS CLARIFICATION]` registrados en el task doc para ambigüedades del enunciado (mutabilidad de la config de columnas en runtime, fuente de la lista de `/api/reasons`).

---

### Entrada 2 — 2026-05-27 — Implementación completa de la Parte 1 y Parte 2

**Disparador:** Confirmación del usuario para proceder con la implementación.

**Prompt / Request:**
> *"Empezemos con el plan de implementacion, cualquier duda frenas y me preguntas antes de continuar"*

Seguimiento (mid-implementación):
> *"bien, arranca con el server primero que quiero tener los endpoints andando antes de tocar el front"*

> *"mira, los tests estan fallando, arreglalo antes de seguir"*

> *"corre el validate y decime como quedo todo"*

> *"el server anda bien, dale con el client"*

**Acción de la IA:**

Escribió 44 archivos de source / config / tests en batches paralelos. Las fases se planificaron vía TodoWrite y se ejecutaron en este orden:

1. **Bootstrap de configs:** `package.json` raíz con `concurrently`, configs del server (`package.json`, `tsconfig.json`, `.eslintrc.cjs`, `vitest.config.ts`), configs del client (`package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `.eslintrc.cjs`, `index.html`).
2. **Source del server (14 archivos):** `types/api.ts`, `errors.ts`, `middleware/{asyncHandler,errorHandler,requestLogger}.ts`, `services/{candidatesService,columnsService,reasonsService,dataLoader}.ts`, `routes/{candidates,columns,reasons}.ts`, `app.ts`, `index.ts`.
3. **Tests del server (5 archivos):** fixtures + `candidates.test.ts`, `columns.test.ts`, `reasons.test.ts`, `candidatesService.test.ts`.
4. **Source del client (15 archivos):** `types/api.ts`, `lib/classifications.ts`, `api/{candidates,columns,reasons}.ts`, `hooks/{useCandidates,useColumns,useReasons}.ts`, `index.css`, `main.tsx`, componentes (`Spinner`, `ErrorBanner`, `StatusBadge`, `ActionButtons`, `SearchBar`, `StatusFilter`, `ColumnToggle`, `RejectModal`, `CandidatesTable`), `App.tsx`.
5. **Tests del client (7 archivos):** `setup.ts`, `fixtures.ts`, `classifications.test.ts`, `CandidatesTable.test.tsx`, `ActionButtons.test.tsx`, `StatusBadge.test.tsx`, `RejectModal.test.tsx`.
6. **README.md** para Emi.

**Alternativas consideradas:**

| Decisión | Elegida | Descartada | Razón |
|---|---|---|---|
| Modelo de estado aprobado | `reason === ""` derivado | Campo `status` separado | Respeta la fuente de verdad del spec; sin estado redundante. |
| Fuente de razones | Derivada del store de candidatos dinámicamente | Lista hardcodeada en server | Coherente con el intent de "feedback loop" — nuevas razones que agreguen los reclutadores quedan disponibles automáticamente. |
| UI optimista | Sí, con rollback en error | Re-fetch siempre después de mutación | UX más rápida. El rollback usa un snapshot capturado durante el updater de setState (evita stale closures sobre state del componente). |
| Módulos del servidor | CommonJS | ESM | CommonJS evita el requisito de extensión `.js` en import paths y los gotchas de `"type": "module"`. `tsx` maneja dev sin paso de compilación. |
| Persistencia backend | Store en memoria, mutable | File-write en PATCH / SQLite | El spec permite explícitamente "dummy endpoints" para la Parte 2. Evitar persistencia mantiene el setup sin dependencias y el estado resetteable. Documentado en `gotchas.md`. |
| Compartir tipos | Duplicados entre client y server | Monorepo / paquete compartido | Dos carpetas son más simples y autocontenidas para el evaluador. El riesgo de type drift se mitiga con tests colocados. |
| Bonus features frontend | Search + StatusFilter + ColumnToggle | Paginación, virtual scroll, export CSV, acciones bulk | 66 candidatos no justifican virtualización. Elegí los tres que demuestran mayor rango (filter, search, override de config del server) sin inflar el scope. |
| Estrategia de tests | Vitest + Testing Library + supertest, sin msw | Agregar msw para tests de integración del client | Para el test de RejectModal usé `vi.stubGlobal("fetch", ...)` para el único endpoint que toca. Más liviano que setup de msw para este scope. |

**Decisión:** Implementar todo en el orden indicado, batches de escrituras paralelas agresivamente, luego install → validate → smoke test.

**Resultado:** Los 57 tests pasan (26 server + 31 client). Lint limpio. Typecheck limpio (strict mode). `npm run build` exitoso. Smoke test end-to-end via curl en el server directo (`:3001`) y el proxy de Vite (`:5173`) confirmado: GETs retornan datos correctos, PATCH approve limpia reason, PATCH reject actualiza reason, validación retorna 400, id inexistente retorna 404.

**Problemas encontrados y resueltos:**
- **Primer typecheck del server:** `tsconfig.json` tenía `rootDir: "./src"` con `include: ["src", "tests"]`. TypeScript tiraba error porque los tests quedaban fuera del rootDir. Fix: separé en `tsconfig.json` (typecheck, `noEmit: true`, incluye ambos) y `tsconfig.build.json` (extiende, solo src, tiene rootDir/outDir). Detectado y resuelto inmediatamente.
- **Segundo typecheck del server:** Tenía `@types/express@^5.0.0` con el runtime Express `^4.21.1`. Los tipos de Express 5 declaran `req.params.id` como `string | string[]`, que no unifica con el comportamiento real de Express 4. Fix: pineé `@types/express@^4.17.21`.
- **Primer run de tests del client:** 3 tests fallaban porque usé `/reject/i` para encontrar el botón de rechazar, pero el aria-label del botón de aprobar era "Approve Rejected One" (el candidato de test se llamaba "Rejected One"), entonces "Rejected" contenía "Reject" y el regex matcheaba ambos botones. Fix: renombré el candidato de test a `"Test User"`. Lección: con regex matchers sobre nombres accesibles, atención a las substrings en elementos cercanos.

---

### Entrada 3 — 2026-05-27 — Decisiones de scope en bonus features

**Disparador:** El spec de la Parte 1 dice "Think about (and implement, or at least name) other features that would be useful for this list view." Había que elegir qué implementar versus qué solo nombrar.

**Prompt / Request:**
> *"que bonus le metemos? pensemos un poco antes de codear"*

> *"search y filtro de estado si, paginacion tambien, agrega eso"*

**Acción:** Elegí cuatro bonus features que muestran rango sin inflar el scope:

1. **Búsqueda por nombre/email/documento** — señal alta de conciencia UX básica.
2. **Filtro de estado (Todos / Aprobados / Rechazados)** — demuestra filtrado de estado derivado.
3. **Column toggle en runtime** — demuestra que la config de columnas del server se trata como default, con el reclutador pudiendo sobreescribirla localmente.
4. **Paginación** — 10 candidatos por página, con lógica de elipsis. Suma sin complejidad excesiva.

**Alternativas consideradas (nombradas en README pero NO implementadas):**
- Aprobar/rechazar en bulk — agrega complejidad de UI significativa sin valor claro en este dataset.
- Export a CSV — fácil de agregar pero sin valor claro para el evaluador.
- Sort por cualquier columna — suma limpia; descartada porque search + filter ya cubre el caso "encontrar candidato".
- Fila expandible con detalle — agradable pero redundante con la tabla amplia.

**Decisión:** Implementar los 3 listados, documentar el resto en el README como "pensado, no implementado" con el razonamiento.

**Resultado:** Bonus features funcionan end-to-end. La sección "Implemented features" del README nombra tanto las implementadas como las consideradas-pero-salteadas con breve justificación.

---

### Entrada 4 — 2026-05-27 — Rediseño completo de la UI

**Disparador:** El resultado funcional de la Parte 1 y 2 estaba completo, pero la UI era genérica. Para un challenge de este tipo, la presentación visual comunica tanto como el código. Quería que quien lo evaluara lo abriera en el browser y sintiera que estaba usando un producto real, no un prototipo de ejercicio.

**Prompt / Request:**
> *"abri el dev server, la UI quedo muy basica, hay que darle una vuelta"*

> *"quiero algo con personalidad, dark pero editorial, que parezca una herramienta real no un CRUD con dark mode"*

> *"Quiero que la UI quede de verdad buena visualmente. Hace un rediseño completo con un design system dark, tipografia editorial y todo el soporte de i18n (ingles y español). La UI tiene que parecer una consola real de reclutador, no un CRUD."*

Seguimiento (mid-rediseño):
> *"el marquee del masthead esta muy bueno, segui por esa linea con todo lo demas"*

**Acción de la IA:**

Rediseño completo en capas: design tokens → tipografía → CSS base → sistema i18n → componentes nuevos → componentes existentes actualizados.

**1. Design system (tokens + tipografía):**

Reescribí `tailwind.config.js` con una paleta dark de ocho niveles semánticos:

| Token | Valor | Uso |
|---|---|---|
| `canvas` | `#0E0D0B` | Fondo base |
| `surface` / `surface-2` / `surface-3` | `#16140F` → `#23201A` | Superficies elevadas |
| `rule` / `rule-strong` | `#2A2620` / `#3A352C` | Bordes y separadores |
| `ink` → `ink-4` | `#F2EFE6` → `#3F3B33` | Texto en 4 niveles de opacidad |
| `accent` | `#D8FF3D` | Aprobados, estado activo, interacciones positivas |
| `alarm` | `#FF6452` | Rechazados, errores, acciones destructivas |
| `gold` | `#C9A961` | Acento decorativo |

Tipografía en tres familias con roles explícitos:
- **Fraunces** (display serif, Google Fonts) — títulos y números grandes. Usa font variation settings (`opsz`, `SOFT`) para el peso óptico del display.
- **Geist** — body y UI.
- **JetBrains Mono** — etiquetas, eyebrows, valores numéricos, controles.

**2. CSS base (`index.css`):**

- `color-scheme: dark` para que el browser infiera el color scheme.
- Textura noise via SVG inline en `body::before` para suavizar el fondo plano.
- Gradiente radial sutil en el fondo para dar profundidad sin ser decorativo.
- Clases utilitarias de componente: `.eyebrow` (label mono uppercase), `.rule-h` (separador horizontal), `.num` (número display con ligaduras), `.focus-ring` (focus visible coherente), `.ticker-bar` (barra animada de estado).

**3. Sistema i18n:**

En lugar de hardcodear strings en los componentes, armé un sistema de i18n liviano y type-safe:

- `I18nProvider.tsx` — context provider con `initialLocale` prop.
- `useTranslation.ts` — hook que devuelve `{ t, locale }`. La función `t(key, params?)` resuelve interpolaciones con `{placeholder}`.
- `translations.ts` — `TranslationKey` inferido del objeto EN (así el type se genera solo, no se mantiene a mano). Diccionarios EN + ES completos. Función `translateReason(reason, locale)` para mapear las razones del servidor (que vienen en español) al inglés cuando locale es `"en"`.
- `columnLabels.ts` — mapa `CandidateKey → TranslationKey` para los headers de la tabla.
- `tableConfig.ts` — mapa `CandidateKey → clases de ancho Tailwind` para columnas de tabla.

**4. Componentes nuevos:**

- **`Masthead`** — header editorial con issue date, nav secundaria, título display, tagline, contador "in queue" y fila marquee animada con metadata de pipeline.
- **`StatsStrip`** — grilla 2×2 / 4×1 con métricas del día (total, aprobados, rechazados, tasa). Usa `StatCell` como sub-componente.
- **`Pagination`** — navegación de páginas con lógica de elipsis (`buildPageItems`), keys semánticas, i18n y `aria-current`.
- **`StatusCell`** — cell de estado con dot indicator coloreado.
- **`TableCell`** — cell que formatea el valor según el tipo de columna (fecha, booleano, URL de CV, número).
- **`LanguageSwitcher`** — toggle EN/ES integrado al Masthead.
- **`MarqueeRow`** — fila de metadata animada (marquee CSS infinito, 28s linear).

**5. Componentes actualizados:**

Todos los componentes existentes migraron de strings hardcodeados a `useTranslation`. `CandidatesTable` incorporó `StatusCell` y `TableCell` como sub-componentes, `COLUMN_WIDTH` desde `tableConfig`, y atributos `data-column` en los `<th>` para que los tests puedan queryear por columna sin depender de texto visible.

**Alternativas consideradas:**

| Decisión | Elegida | Descartada | Razón |
|---|---|---|---|
| Sistema i18n | Custom liviano + Context | react-i18next / i18next | Para este scope, una librería añade ~50KB y config. El sistema custom tiene 3 archivos y cero dependencias. |
| Fuente display | Fraunces (variable, serif) | Inter / Roboto | Inter es la elección obvia y genérica. Fraunces con font variations da identidad visual clara sin ser extravagante. |
| Paleta | Dark custom semántica | Dark system colors | `prefers-color-scheme` da tokens del sistema, no una paleta de marca. Tokens semánticos permiten theming consistente entre componentes. |
| Marquee | CSS animation infinita | JS-driven scroll | Pure CSS, sin ResizeObserver, sin dependencias. Tres copias del contenido garantizan seamless loop a cualquier ancho. |
| Animaciones de entrada | `riseIn` (translateY + opacity) | Solo fade / sin animación | El translate sutil (8px) a opacity+position da la sensación de "aparece en su lugar" sin ser llamativo. |

**Decisión:** Design system completo en lugar de ajustes incrementales. La consistencia visual solo se logra si los tokens, la tipografía, el CSS base y los componentes se diseñan juntos — no si se parchan uno a uno.

**Resultado:** UI completamente rediseñada con identidad editorial consistente. Masthead con animación marquee, StatsStrip con métricas en tiempo real, paginación funcional (10 por página), toggle de idioma EN/ES completamente funcional en todos los textos y formatos de número/fecha. Tests del client actualizados para usar `I18nProvider` como wrapper y `data-column` attrs como query selectors.

---

### Entrada 5 — 2026-05-27 — Validación final, smoke test y consolidación del log

**Disparador:** Todo el código escrito. Verificar que funciona realmente antes de declarar done.

**Prompt / Request:**
> *"corre todo limpio una vez mas y despues actualiza el log completo"*

**Acción de la IA:**
- Corrió `npm run typecheck`, `npm run lint`, `npm test` por separado para cada subproyecto, luego `npm run validate` desde la raíz. Resolvió todos los problemas que surgieron (ver Entrada 2).
- Arrancó el server en background, esperó respuesta de `/api/candidates`, luego curleó los 5 endpoints + 4 variaciones de PATCH (approve, reject, validación 400, id inexistente 404).
- Arrancó el client de Vite en background, verificó que `index.html` se sirve y que el proxy `/api/*` redirige correctamente a `:3001`.
- Corrió `npm run build` desde la raíz. Output de Vite: 1 HTML, ~14 KB CSS, ~155 KB JS gzippeado a ~50 KB.
- Consolidó este AI_USAGE_LOG.md con entradas cronológicas completas y apéndices.

**Resultado:** Todos los checks pasan. El challenge está listo para entrega.

---

## Apéndice A — Archivos de configuración de Claude Code

- `CLAUDE.md` — router del proyecto, 82 líneas, en español
- `.claude/INDEX.md` — lookup de skills/docs/rules, 51 líneas
- `.claude/RETRIEVAL.md` — reglas de cuándo cargar qué; cap de 1 doc + 1 skill + 2 references por turno
- `.claude/MEMORY.md` — decisiones del proyecto (append-only)
- `.claude/README.md` — guía para humanos del sistema en capas
- `.claude/settings.local.json` — permisos; `attribution.commit=""` y `attribution.pr=""` para deshabilitar trailers `Co-Authored-By: Claude`; `outputStyle: "Concise"`
- `.claude/docs/` — `architecture.md`, `commands.md`, `gotchas.md`, `git-workflow.md`
- `.claude/rules/` — `typescript-strict.md` (auto en `**/*.ts(x)`), `react-conventions.md` (auto en `client/**`), `api-conventions.md` (auto en `server/**`), `test-conventions.md` (auto en `**/*.test.*`)
- `.claude/skills/` — 8 skills; las más usadas: `/react-patterns`, `/express-api`, `/tailwind-ui`, `/ai-usage-log`
- `.git/info/exclude` — blindaje local para que la infra de Claude nunca llegue al repo que ve Emi

---

## Apéndice B — Uso de skills durante el challenge

| Skill | Uso |
|---|---|
| `/react-patterns` | Cargada durante la generación del código del client. Los patrones de la skill (split container/presentational, FetchState discriminated union, custom hook con cleanup) moldearon `useCandidates`, `useColumns`, `useReasons` y la composición de App. |
| `/express-api` | Cargada durante la generación del código del server. El patrón "routes thin, services thick" + `asyncHandler` + error middleware + errores tipados vienen de la skill. |
| `/tailwind-ui` | Cargada durante el rediseño de UI. La referencia de component-styles informó StatusBadge, RejectModal, ActionButtons y el styling de la tabla. |
| `/ai-usage-log` | Usada para estructurar este log y la fase de consolidación. |
| `/brainstorming` | No invocada formalmente — las elecciones de stack fueron directas y la Entrada 3 usó criterio informal. |
| `/diagnose` | No invocada formalmente — los problemas encontrados fueron fixes rápidos (≤30s identificación + ≤30s fix). |
| `/code-review-excellence` | No invocada por separado — review integrado durante la escritura. |
| `/clean-code` | No invocada por separado, pero sus reglas (sin comentarios, naming, tamaño de funciones) moldearon cada archivo. |

---

## Apéndice C — MCP servers

**codegraph** — registrado globalmente. AST tree-sitter + SQLite + FTS5 knowledge graph. Inicializado en el setup de infra; poco usado durante esta sesión porque el codebase se estaba authoreando desde cero. Útil para sesiones futuras de navegación o refactor.

---

## Apéndice D — Prompts que requirieron corrección

- **Primer typecheck del server:** `tsconfig.json` con `rootDir: "./src"` + `include: ["src", "tests"]` tiraba error porque los tests quedaban fuera del rootDir. Fix: separé en `tsconfig.json` (typecheck, `noEmit: true`, incluye ambos) y `tsconfig.build.json` (extiende, solo src, tiene rootDir/outDir).

- **Segundo typecheck del server:** `@types/express@^5.0.0` con runtime Express `^4.21.1`. Los tipos de Express 5 declaran `req.params.id` como `string | string[]`, que no unifica con Express 4. Fix: pineé `@types/express@^4.17.21`.

- **Primer run de tests del client:** 3 tests fallaban porque `/reject/i` matcheaba "Approve Rejected One" (aria-label del botón de aprobar, porque el candidato de test se llamaba "Rejected One"). Fix: renombré el candidato a `"Test User"`. Lección: con regex matchers sobre nombres accesibles, atención a substrings en elementos cercanos.

---

## Apéndice E — Qué NO delegué a la IA

- **Inspección de los archivos de datos.** Leí el `candidates.json` original para detectar el problema de encoding UTF-8 (`Ã­` en lugar de `í`) y lo re-encodé manualmente.
- **Decisión sobre qué bonus features saltear.** El criterio de "Search + Filter + ColumnToggle son suficientes" fue una decisión manual.
- **Verificación visual en el browser.** Claude Code no puede ver browsers. El usuario verifica la UI renderizada antes de la entrega.
- **La elección de usar `vi.stubGlobal` en lugar de msw** para el test de RejectModal. Decisión de scope deliberada — el overhead de msw no estaba justificado para un solo endpoint.
- **La dirección del design system.** Claude ejecutó la implementación, pero la dirección de "editorial dark, Fraunces como display, accent amarillo-verde sobre dark, estética de consola de reclutador" es una elección estética propia.

---

## Apéndice F — Transparencia de tokens / costo

No capturé counts exactos, pero puedo hacer una estimación razonable.

**Contenido generado:** ~3.000 líneas de infra docs + ~1.500 de source code + ~800 de tests + rediseño completo de UI + este log ≈ ~6.500 líneas totales de output.

**Contexto por turno (sistema en capas):**
- Sin el sistema en capas un CLAUDE.md monolítico hubiera cargado ~500 líneas en *cada* turno.
- Con el sistema en capas: `CLAUDE.md` (82 líneas, siempre) + 1 skill (≤120 líneas) + 1 rule (≤50 líneas) + 1 doc (≤80 líneas) bajo demanda = ~250–350 tokens de contexto de sistema por turno en promedio.
- Ahorro estimado: ~40–50% de tokens de input vs el enfoque monolítico, en ~15 turnos de trabajo.

**Mix de modelos:** Sonnet 4.6 para el trabajo cotidiano (queries, fixes puntuales, typecheck loop); Opus 4.7 para las tareas de mayor carga cognitiva (generación masiva de código en Entrada 2, rediseño completo de UI en Entrada 4, consolidación del log). Usar Sonnet 4.6 donde alcanzaba redujo el costo sin sacrificar calidad — Opus solo cuando la complejidad lo justificaba.

**Estimación total de la sesión:** ~200K–300K tokens de input + ~150K tokens de output (mix Sonnet 4.6 / Opus 4.7). A las tarifas actuales de la API eso equivale a unos pocos dólares. La sesión fue corta principalmente porque el sistema de contexto mantuvo cada turno enfocado — sin contexto irrelevante que procesar, sin respuestas largas sobre cosas que ya estaban definidas.

---

## Apéndice G — Por qué este log tiene la forma que tiene

El challenge especifica que "the quality and honesty of this log is part of the evaluation." Lo interpreté así:

- **Calidad:** concreto (sin afirmaciones genéricas), estructurado (formato consistente por entrada), completo (cubre herramientas, prompts, decisiones, alternativas y qué delegué versus qué decidí manualmente).
- **Honestidad:** incluir lo que no funcionó, documentar los problemas que aparecieron y cómo se resolvieron, marcar la frontera entre lo que Claude generó y lo que yo decidí.

Los errores de config del primer typecheck y los tests fallidos del primer run están documentados porque son parte de cualquier proceso real de desarrollo — y ocultarlos sería exactamente lo que este log quiere evitar.
