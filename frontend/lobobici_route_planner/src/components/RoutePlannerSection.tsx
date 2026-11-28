import { useState } from 'react'
import {
  Bike,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Layers,
  Route,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import type { MapLayer, RouteAlgorithm } from '../types/route'
import MapaLeaflet from './LeafletMap'

interface RoutePlannerSectionProps {
  activeLayer: MapLayer
  onSelectLayer: (layer: MapLayer) => void
  activeAlgorithm: RouteAlgorithm
  onVisualizeRoute: (algorithm: Exclude<RouteAlgorithm, null>) => void
  disableStations: boolean
  onToggleDisableStations: () => void
  disableRoutes: boolean
  onToggleDisableRoutes: () => void
}

const LAYER_OPTIONS: { id: MapLayer; label: string; icon: typeof Footprints }[] = [
  { id: 'peatonal', label: 'Capa peatonal', icon: Footprints },
  { id: 'ciclovia', label: 'Capa de ciclovía', icon: Bike },
  { id: 'ambas', label: 'Ambas', icon: Layers },
]

export function RoutePlannerSection({
  activeLayer,
  onSelectLayer,
  activeAlgorithm,
  onVisualizeRoute,
  disableStations,
  onToggleDisableStations,
  disableRoutes,
  onToggleDisableRoutes,
}: RoutePlannerSectionProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(true)

  const activeLayerLabel =
    LAYER_OPTIONS.find((layer) => layer.id === activeLayer)?.label ?? 'Ambas'

  return (
    <section
      aria-labelledby="planea-tu-ruta-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="border-b border-slate-100 pb-5">
        <h2
          id="planea-tu-ruta-heading"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          Planea tu ruta
        </h2>

        {/* Apartado: Vista del mapa */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
            Vista del mapa
          </h3>

          <div
            role="group"
            aria-label="Vista del mapa"
            className="inline-flex flex-wrap gap-2 rounded-xl bg-slate-100 p-1.5"
          >
            {LAYER_OPTIONS.map(({ id, label, icon: Icon }) => {
              const isActive = activeLayer === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSelectLayer(id)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#003B5C] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Apartado 1 y 2: Título + Recuadro del mapa con menú emergente colapsable hacia la derecha */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-800">
            Mapa de Ciudad Universitaria
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 ring-1 ring-sky-200">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            Mostrando: {activeLayerLabel}
          </span>
        </div>

        <div className="relative h-[460px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner sm:h-[520px]">
          <MapaLeaflet
            activeLayer={activeLayer}
            activeAlgorithm={activeAlgorithm}
          />

          {/* Botón para expandir cuando el menú emergente está colapsado hacia la derecha */}
          {!isConfigOpen && (
            <button
              type="button"
              onClick={() => setIsConfigOpen(true)}
              aria-label="Abrir configuración del mapa"
              className="absolute right-0 top-4 z-[1001] flex cursor-pointer items-center gap-2 rounded-l-xl border border-r-0 border-slate-200 bg-white/95 px-3 py-2.5 text-sm font-medium text-slate-700 shadow-lg backdrop-blur-md transition hover:bg-slate-50 hover:text-[#003B5C]"
            >
              <ChevronLeft className="h-4 w-4" />
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Configuración</span>
            </button>
          )}

          {/* Menú emergente sobre el recuadro del mapa, colapsable hacia la derecha */}
          <aside
            aria-label="Configuración de ruta"
            aria-hidden={!isConfigOpen}
            className={`absolute right-3 top-3 z-[1001] w-72 max-w-[calc(100%-1.5rem)] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out sm:right-4 sm:top-4 sm:w-80 ${
              isConfigOpen
                ? 'translate-x-0 opacity-100'
                : 'pointer-events-none translate-x-[115%] opacity-0'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#003B5C]" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Configuración
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsConfigOpen(false)}
                aria-label="Colapsar configuración hacia la derecha"
                title="Colapsar hacia la derecha"
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg p-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <span className="sr-only">Colapsar</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => onVisualizeRoute('dijkstra')}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeAlgorithm === 'dijkstra'
                    ? 'bg-[#003B5C] text-white shadow-sm ring-2 ring-[#003B5C]/30'
                    : 'bg-sky-50 text-[#003B5C] hover:bg-sky-100'
                }`}
              >
                <Route className="h-4 w-4" />
                <span>Visualizar ruta con Dijkstra</span>
              </button>

              <button
                type="button"
                onClick={() => onVisualizeRoute('astar')}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeAlgorithm === 'astar'
                    ? 'bg-[#0077A8] text-white shadow-sm ring-2 ring-[#0077A8]/30'
                    : 'bg-cyan-50 text-[#0077A8] hover:bg-cyan-100'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Visualizar ruta con A*</span>
              </button>
            </div>

            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
              <ToggleOption
                label="Deshabilitar casetas"
                checked={disableStations}
                onToggle={onToggleDisableStations}
              />
              <ToggleOption
                label="Deshabilitar rutas"
                checked={disableRoutes}
                onToggle={onToggleDisableRoutes}
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

interface ToggleOptionProps {
  label: string
  checked: boolean
  onToggle: () => void
}

function ToggleOption({ label, checked, onToggle }: ToggleOptionProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-left transition hover:bg-slate-100/80"
    >
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-[#003B5C]' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4.5' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  )
}
