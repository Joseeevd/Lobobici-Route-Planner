export type MapLayer = 'peatonal' | 'ciclovia' | 'ambas'

export type RouteAlgorithm = 'dijkstra' | 'astar' | null

export interface RouteStats {
  startPoint: string
  destination: string
  startStation: string
  destinationStation: string
  distanceMeters: number | null
  estimatedTime: string
}
