import { useState, type Dispatch, type SetStateAction } from 'react';
import {
    MapContainer,
    TileLayer,
    GeoJSON,
    Marker,
    Polyline,
    useMapEvents,
} from 'react-leaflet';
import type {
    LatLngTuple,
    Layer,
    LeafletMouseEvent,
    PathOptions,
} from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { MapLayer, RouteAlgorithm } from '../types/route';

// Coordenadas centrales de Ciudad Universitaria BUAP [lat, lng]
const CENTRO_CU: LatLngTuple = [19.0052, -98.2041];

export interface MapFeatureProperties {
    id: string;
    nombre: string;
    tipo: string;
}

export interface MapaLeafletProps {
    casetasCerradas?: string[];
    vialidadesCerradas?: string[];
    geoJsonData?: FeatureCollection<Geometry, MapFeatureProperties> | null;
    activeLayer?: MapLayer;
    activeAlgorithm?: RouteAlgorithm;
}

interface SelectorPuntosProps {
    origen: LatLngTuple | null;
    setOrigen: Dispatch<SetStateAction<LatLngTuple | null>>;
    destino: LatLngTuple | null;
    setDestino: Dispatch<SetStateAction<LatLngTuple | null>>;
}

interface CalcularRutaResponse {
    ruta: LatLngTuple[];
}

// Subcomponente para capturar clics en el mapa (Origen / Destino)
function SelectorPuntos({
    origen,
    setOrigen,
    destino,
    setDestino,
}: SelectorPuntosProps) {
    useMapEvents({
        click(e: LeafletMouseEvent) {
            const punto: LatLngTuple = [e.latlng.lat, e.latlng.lng];
            if (!origen) {
                setOrigen(punto);
            } else if (!destino) {
                setDestino(punto);
            } else {
                // Reinicia selección si ya había ambos puntos
                setOrigen(punto);
                setDestino(null);
            }
        },
    });
    return null;
}

export default function MapaLeaflet({
    casetasCerradas = [],
    vialidadesCerradas = [],
    geoJsonData = null,
    activeLayer = 'ambas',
    activeAlgorithm = 'astar',
}: MapaLeafletProps) {
    const [origen, setOrigen] = useState<LatLngTuple | null>(null);
    const [destino, setDestino] = useState<LatLngTuple | null>(null);
    const [rutaCalculada, setRutaCalculada] = useState<LatLngTuple[]>([]);

    // Estilo dinámico según el tipo de línea (ciclovía vs peatonal) y si está cerrada
    const estiloVialidad = (
        feature?: Feature<Geometry, MapFeatureProperties>
    ): PathOptions => {
        if (!feature?.properties) {
            return { color: '#22aa44', weight: 2.5 };
        }

        const { id, tipo } = feature.properties;
        const estaCerrada = vialidadesCerradas.includes(id);

        if (estaCerrada) {
            return { color: '#dc2626', weight: 4, dashArray: '6, 6' }; // Rojo punteado si está cerrada
        }
        if (tipo === 'ciclovia') {
            return { color: '#0066cc', weight: 4 }; // Azul para ciclovías
        }
        return { color: '#22aa44', weight: 2.5 }; // Verde para andadores peatonales
    };

    // Configurar popups y estado al renderizar cada elemento del GeoJSON
    const onEachFeature = (
        feature: Feature<Geometry, MapFeatureProperties>,
        layer: Layer
    ): void => {
        if (!feature.properties) return;

        const { id, nombre, tipo } = feature.properties;
        const cerrada =
            casetasCerradas.includes(id) || vialidadesCerradas.includes(id);
        layer.bindPopup(
            `<strong>${nombre}</strong><br/>Tipo: ${tipo}<br/>Estado: ${cerrada ? 'Cerrada' : 'Disponible'}`
        );
    };

    // Llamada al endpoint de FastAPI en /api/calcular-ruta
    const solicitarRuta = async (): Promise<void> => {
        if (!origen || !destino) return;

        const respuesta = await fetch('/api/calcular-ruta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                origen,
                destino,
                casetas_cerradas: casetasCerradas,
                vialidades_cerradas: vialidadesCerradas,
                algoritmo: activeAlgorithm ?? 'astar',
            }),
        });

        const data: CalcularRutaResponse = await respuesta.json();
        // data.ruta debe ser un arreglo de coordenadas [[lat, lng], [lat, lng], ...]
        setRutaCalculada(data.ruta);
    };

    const filtrarCapa = (
        feature: Feature<Geometry, MapFeatureProperties>
    ): boolean => {
        if (activeLayer === 'ambas') return true;
        return feature.properties?.tipo === activeLayer;
    };

    return (
        <div className="relative h-full w-full">
            <MapContainer center={CENTRO_CU} zoom={16} className="h-full w-full">
                {/* Capa base gratuita de OpenStreetMap */}
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Capa con tus ciclovías, andadores, casetas y POIs */}
                {geoJsonData && (
                    <GeoJSON
                        key={`${casetasCerradas.join()}-${vialidadesCerradas.join()}-${activeLayer}`}
                        data={geoJsonData}
                        filter={filtrarCapa}
                        style={estiloVialidad}
                        onEachFeature={onEachFeature}
                    />
                )}

                {/* Captura de clics del usuario */}
                <SelectorPuntos
                    origen={origen}
                    setOrigen={setOrigen}
                    destino={destino}
                    setDestino={setDestino}
                />

                {/* Marcadores de origen y destino */}
                {origen && <Marker position={origen} />}
                {destino && <Marker position={destino} />}

                {/* Dibujo de la ruta óptima devuelta por Dijkstra / A* */}
                {rutaCalculada.length > 0 && (
                    <Polyline
                        positions={rutaCalculada}
                        pathOptions={{ color: '#f59e0b', weight: 6 }}
                    />
                )}
            </MapContainer>

            <button
                onClick={solicitarRuta}
                disabled={!origen || !destino}
                className="absolute bottom-6 left-6 z-[1000] rounded bg-blue-600 px-4 py-2 text-white shadow"
            >
                Calcular Ruta
            </button>
        </div>
    );
}
