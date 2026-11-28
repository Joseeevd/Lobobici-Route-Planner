import { useState } from 'react'
import { IntroSection } from './components/IntroSection'
import { RoutePlannerSection } from './components/RoutePlannerSection'
import { RouteStatsSection } from './components/RouteStatsSection'
import type { MapLayer, RouteAlgorithm, RouteStats } from './types/route'

const INITIAL_STATS: RouteStats = {
  startPoint: 'Por definir',
  destination: 'Por definir',
  startStation: 'Por definir',
  destinationStation: 'Por definir',
  distanceMeters: null,
  estimatedTime: '— min',
}

const SAMPLE_STATS_BY_ALGORITHM: Record<
  Exclude<RouteAlgorithm, null>,
  RouteStats
> = {
  dijkstra: {
    startPoint: 'Facultad de Ciencias de la Computación',
    destination: 'Biblioteca Central Universitaria',
    startStation: 'Caseta FCC',
    destinationStation: 'Caseta Biblioteca Central',
    distanceMeters: 1180,
    estimatedTime: '6 min',
  },
  astar: {
    startPoint: 'Facultad de Ciencias de la Computación',
    destination: 'Biblioteca Central Universitaria',
    startStation: 'Caseta FCC',
    destinationStation: 'Caseta Biblioteca Central',
    distanceMeters: 1120,
    estimatedTime: '5 min',
  },
}

export function App() {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('ambas')
  const [activeAlgorithm, setActiveAlgorithm] = useState<RouteAlgorithm>(null)
  const [disableStations, setDisableStations] = useState(false)
  const [disableRoutes, setDisableRoutes] = useState(false)
  const [routeStats, setRouteStats] = useState<RouteStats>(INITIAL_STATS)

  const handleVisualizeRoute = (algorithm: Exclude<RouteAlgorithm, null>) => {
    setActiveAlgorithm(algorithm)
    setRouteStats(SAMPLE_STATS_BY_ALGORITHM[algorithm])
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <IntroSection />

        <RoutePlannerSection
          activeLayer={activeLayer}
          onSelectLayer={setActiveLayer}
          activeAlgorithm={activeAlgorithm}
          onVisualizeRoute={handleVisualizeRoute}
          disableStations={disableStations}
          onToggleDisableStations={() => setDisableStations((prev) => !prev)}
          disableRoutes={disableRoutes}
          onToggleDisableRoutes={() => setDisableRoutes((prev) => !prev)}
        />

        <RouteStatsSection stats={routeStats} />
      </main>
    </div>
  )
}

export default App
