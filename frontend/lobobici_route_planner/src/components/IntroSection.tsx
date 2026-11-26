import { Bike, Compass, MapPin } from 'lucide-react'

export function IntroSection() {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003B5C] via-[#044C73] to-[#0077A8] px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-400/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-sky-300/10 blur-2xl" />

      <div className="relative z-10 max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium tracking-wide text-cyan-100 backdrop-blur-sm">
          <Bike className="h-3.5 w-3.5" />
          <span>Movilidad Inteligente · Ciudad Universitaria BUAP</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Lobobici Route Planner
        </h1>

        <p className="mt-4 text-base leading-relaxed text-sky-100 sm:text-lg">
          Planifica tus traslados dentro de Ciudad Universitaria encontrando la
          ruta óptima entre facultades y casetas del sistema Lobobici. Combina
          trayectos peatonales y tramos de ciclovía mediante algoritmos de
          búsqueda de caminos mínimos para llegar más rápido a tu destino.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs text-cyan-100/90 sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5">
            <Compass className="h-4 w-4 text-cyan-300" />
            Algoritmos Dijkstra y A*
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5">
            <MapPin className="h-4 w-4 text-cyan-300" />
            Red peatonal y ciclovía de CU
          </span>
        </div>
      </div>
    </header>
  )
}
