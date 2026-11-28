import {
  Bike,
  Clock,
  Flag,
  MapPin,
  Navigation,
  Ruler,
} from 'lucide-react'
import type { RouteStats } from '../types/route'

interface RouteStatsSectionProps {
  stats: RouteStats
}

export function RouteStatsSection({ stats }: RouteStatsSectionProps) {
  const items = [
    {
      label: 'Punto de partida',
      value: stats.startPoint,
      icon: MapPin,
      accent: 'text-sky-600 bg-sky-50',
    },
    {
      label: 'Destino',
      value: stats.destination,
      icon: Flag,
      accent: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Caseta de partida',
      value: stats.startStation,
      icon: Bike,
      accent: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Caseta de destino',
      value: stats.destinationStation,
      icon: Navigation,
      accent: 'text-cyan-600 bg-cyan-50',
    },
    {
      label: 'Distancia en metros',
      value:
        stats.distanceMeters !== null ? `${stats.distanceMeters} m` : '— m',
      icon: Ruler,
      accent: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Tiempo estimado',
      value: stats.estimatedTime,
      icon: Clock,
      accent: 'text-rose-600 bg-rose-50',
    },
  ]

  return (
    <section
      aria-labelledby="estadisticas-ruta-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2
          id="estadisticas-ruta-heading"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          Estadísticas y Datos de la Ruta
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Resumen del trayecto calculado entre puntos y casetas de Ciudad
          Universitaria.
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="flex items-start gap-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-white"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                {label}
              </dt>
              <dd className="mt-1 truncate text-base font-semibold text-slate-900">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
