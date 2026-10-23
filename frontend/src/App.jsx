/**
 * PROJECT ARGUS — Dashboard Principal
 * Mapa interativo + camada de voos em tempo real
 */

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

// Registra o worker do MapLibre v6 (obrigatório com Vite)
maplibregl.setWorkerUrl(maplibreWorkerUrl);

const API_URL = "http://127.0.0.1:8000";

// Estilo dark gratuito do Carto
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [status, setStatus] = useState("Inicializando...");
  const [flightCount, setFlightCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Inicializa o mapa
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [-50, 15],
      zoom: 2.5,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setStatus("ARGUS ONLINE");
      carregarVoos();
    });

    return () => map.current?.remove();
  }, []);

  // Busca voos do backend e plota no mapa
  const carregarVoos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/flights?limit=300`);
      const data = await res.json();

      const voos = data.voos || [];
      setFlightCount(voos.length);

      // Converte em GeoJSON
      const geojson = {
        type: "FeatureCollection",
        features: voos
          .filter((v) => v.latitude && v.longitude)
          .map((v) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [v.longitude, v.latitude],
            },
            properties: {
              callsign: v.callsign || "N/A",
              pais: v.pais_origem || "N/A",
              altitude: v.altitude_m || 0,
              velocidade: v.velocidade_ms || 0,
              heading: v.heading || 0,
            },
          })),
      };

      // Adiciona a fonte, se não existir
      if (!map.current.getSource("flights")) {
        map.current.addSource("flights", {
          type: "geojson",
          data: geojson,
        });

        map.current.addLayer({
          id: "flights-layer",
          type: "circle",
          source: "flights",
          paint: {
            "circle-radius": 3,
            "circle-color": "#FFB020",
            "circle-stroke-color": "#FF7A00",
            "circle-stroke-width": 1,
            "circle-opacity": 0.85,
          },
        });

        // Popup ao clicar em um voo
        map.current.on("click", "flights-layer", (e) => {
          const p = e.features[0].properties;
          const coords = e.features[0].geometry.coordinates.slice();
          new maplibregl.Popup()
            .setLngLat(coords)
            .setHTML(
              `<div style="font-family: Inter; color:#05060A;">
                <strong>${p.callsign}</strong><br/>
                País: ${p.pais}<br/>
                Altitude: ${Math.round(p.altitude)} m<br/>
                Velocidade: ${Math.round(p.velocidade)} m/s
              </div>`,
            )
            .addTo(map.current);
        });

        map.current.on("mouseenter", "flights-layer", () => {
          map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "flights-layer", () => {
          map.current.getCanvas().style.cursor = "";
        });
      } else {
        map.current.getSource("flights").setData(geojson);
      }
    } catch (err) {
      console.error("Erro ao carregar voos:", err);
      setStatus("ERRO DE CONEXÃO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="argus-root">
      <div ref={mapContainer} className="argus-map" />

      {/* HUD superior esquerdo */}
      <div className="argus-hud">
        <div className="argus-logo">
          <span className="argus-eye">👁️</span>
          <div>
            <h1>PROJECT ARGUS</h1>
            <p className="mono">Cem olhos. Uma verdade.</p>
          </div>
        </div>
      </div>

      {/* HUD superior direito — status */}
      <div className="argus-status">
        <div className="argus-status-item">
          <span className="argus-label">STATUS</span>
          <span className="argus-value">{status}</span>
        </div>
        <div className="argus-status-item">
          <span className="argus-label">FLIGHTS</span>
          <span className="argus-value mono">{flightCount}</span>
        </div>
      </div>

      {/* Botão de atualizar */}
      <button
        className="argus-refresh"
        onClick={carregarVoos}
        disabled={loading}
      >
        <span className="argus-btn-en">
          {loading ? "LOADING..." : "REFRESH FLIGHTS"}
        </span>
        <span className="argus-btn-pt">
          {loading ? "Carregando..." : "Atualizar voos"}
        </span>
      </button>
    </div>
  );
}

export default App;
