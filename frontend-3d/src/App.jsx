/**
 * PROJECT ARGUS 3D — Aviões e Satélites
 */

import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";
const REFRESH_MS = 60000;

function corPorCompanhia(companhia) {
  if (!companhia || !companhia.icao)
    return Cesium.Color.fromCssColorString("#FFB020");
  const mapa = {
    GLO: "#FF7A00",
    TAM: "#8B1E3F",
    LAN: "#1A3A6C",
    LPE: "#1A3A6C",
    AZU: "#0055A4",
    AAL: "#B31B1B",
    DAL: "#003366",
    UAL: "#005DAA",
    RYR: "#073590",
    EZY: "#FF6600",
    BAW: "#075AAA",
    AFR: "#002157",
    DLH: "#05164D",
    UAE: "#D71920",
    QTR: "#5C0632",
    SWR: "#E30613",
  };
  return Cesium.Color.fromCssColorString(mapa[companhia.icao] || "#FFB020");
}

function moverPosicao(lon, lat, headingDeg, distanciaKm) {
  const R = 6371;
  const brng = Cesium.Math.toRadians(headingDeg);
  const lat1 = Cesium.Math.toRadians(lat);
  const lon1 = Cesium.Math.toRadians(lon);
  const d = distanciaKm / R;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) +
      Math.cos(lat1) * Math.sin(d) * Math.cos(brng),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
    );
  return { lon: Cesium.Math.toDegrees(lon2), lat: Cesium.Math.toDegrees(lat2) };
}

function App() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const flightsDataSourceRef = useRef(null);
  const satellitesDataSourceRef = useRef(null);

  const flightsDataRef = useRef([]);
  const baseTimeRef = useRef(null);

  const [flightCount, setFlightCount] = useState(0);
  const [status, setStatus] = useState("INICIALIZANDO...");
  const [loading, setLoading] = useState(false);
  const [showSatellites, setShowSatellites] = useState(false);

  useEffect(() => {
    if (viewerRef.current) return;

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      infoBox: true,
      selectionIndicator: true,
      skyBox: false,
      skyAtmosphere: new Cesium.SkyAtmosphere(),
    });

    viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        credit: "© Esri",
        maximumLevel: 18,
      }),
    );
    viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        credit: "© Esri",
        maximumLevel: 16,
      }),
    );

    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#0B0D14");
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#05060A");
    viewer.scene.globe.enableLighting = true;
    viewer.cesiumWidget.creditContainer.style.display = "none";
    viewer.scene.postProcessStages.fxaa.enabled = true;

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-50, 15, 18000000),
    });
    viewerRef.current = viewer;

    const flightsDataSource = new Cesium.CustomDataSource("flights");
    flightsDataSource.clustering.enabled = true;
    flightsDataSource.clustering.pixelRange = 40;
    flightsDataSource.clustering.minimumClusterSize = 4;
    flightsDataSource.clustering.clusterEvent.addEventListener(
      (entities, cluster) => {
        cluster.billboard.show = false;
        cluster.label.show = true;
        cluster.label.text = `${entities.length}`;
        cluster.label.font = "bold 13px Inter, sans-serif";
        cluster.label.fillColor = Cesium.Color.fromCssColorString("#FFB020");
        cluster.label.outlineColor = Cesium.Color.fromCssColorString("#05060A");
        cluster.label.outlineWidth = 3;
        cluster.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE;
        cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
        cluster.label.verticalOrigin = Cesium.VerticalOrigin.CENTER;
        cluster.point.show = false;
      },
    );
    viewer.dataSources.add(flightsDataSource);
    flightsDataSourceRef.current = flightsDataSource;

    const satellitesDataSource = new Cesium.CustomDataSource("satellites");
    viewer.dataSources.add(satellitesDataSource);
    satellitesDataSourceRef.current = satellitesDataSource;

    carregarVoos();
    const interval = setInterval(carregarVoos, REFRESH_MS);

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (Cesium.defined(picked) && picked.id) {
        viewer.flyTo(picked.id, {
          duration: 2,
          offset: new Cesium.HeadingPitchRange(
            0,
            Cesium.Math.toRadians(-40),
            80000,
          ),
        });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      clearInterval(interval);
      handler.destroy();
      viewer.destroy();
    };
  }, []);

  const carregarVoos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/flights?limit=200`);
      if (!res.ok) throw new Error("API fora do ar");

      const data = await res.json();
      const dataSource = flightsDataSourceRef.current;
      if (!dataSource) return;

      flightsDataRef.current = data.voos.filter(
        (v) => v.latitude && v.longitude,
      );
      baseTimeRef.current = Date.now();
      dataSource.entities.removeAll();

      let adicionados = 0;
      for (let i = 0; i < flightsDataRef.current.length; i++) {
        const v = flightsDataRef.current[i];
        const id = `voo-${i}`;
        const altVisual = 2000 + (v.altitude_m || 10000) * 0.05;
        const corCompanhia = corPorCompanhia(v.companhia_aerea);

        const posCallback = new Cesium.CallbackProperty(() => {
          const elapsedSec = (Date.now() - baseTimeRef.current) / 1000;
          const distKm = ((v.velocidade_ms || 200) * elapsedSec) / 1000;
          const nova = moverPosicao(
            v.longitude,
            v.latitude,
            v.heading || 0,
            distKm,
          );
          return Cesium.Cartesian3.fromDegrees(nova.lon, nova.lat, altVisual);
        }, false);

        const orientationCallback = new Cesium.CallbackProperty(() => {
          const pos = posCallback.getValue();
          if (!pos) return Cesium.Quaternion.IDENTITY;
          const headingRad = Cesium.Math.toRadians((v.heading || 0) - 90);
          return Cesium.Transforms.headingPitchRollQuaternion(
            pos,
            new Cesium.HeadingPitchRoll(headingRad, 0, 0),
          );
        }, false);

        dataSource.entities.add({
          id,
          name: v.callsign || "N/A",
          position: posCallback,
          orientation: orientationCallback,
          model: {
            uri: "https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
            minimumPixelSize: 32,
            maximumScale: 20000,
            color: corCompanhia,
            colorBlendMode: Cesium.ColorBlendMode.MIX,
            colorBlendAmount: 0.8,
          },
          description: `
            <div style="font-family: Inter, sans-serif; color:#05060A; padding:8px; min-width:240px;">
              <strong style="font-size:16px; color:#FF7A00;">${v.callsign || "N/A"}</strong>
              <div style="font-size:12px; color:#666; margin-top:2px;">${v.companhia_aerea?.nome || "Desconhecida"}</div>
              <hr style="border:none; border-top:1px solid #ddd; margin:8px 0;"/>
              <div style="font-size:13px;"><strong>🛫 Origem:</strong><br/>${v.origem ? `${v.origem.cidade || "?"} (${v.origem.iata || "?"})` : "Desconhecida"}</div>
              <div style="font-size:13px; margin-top:6px;"><strong>🛬 Destino:</strong><br/>${v.destino ? `${v.destino.cidade || "?"} (${v.destino.iata || "?"})` : "Desconhecido"}</div>
            </div>
          `,
        });

        dataSource.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              const elapsedSec = (Date.now() - baseTimeRef.current) / 1000;
              const distKm = ((v.velocidade_ms || 200) * elapsedSec) / 1000;
              const atual = moverPosicao(
                v.longitude,
                v.latitude,
                v.heading || 0,
                distKm,
              );
              const atras = moverPosicao(
                v.longitude,
                v.latitude,
                v.heading || 0,
                Math.max(0, distKm - 150),
              );
              return Cesium.Cartesian3.fromDegreesArrayHeights([
                atras.lon,
                atras.lat,
                altVisual,
                atual.lon,
                atual.lat,
                altVisual,
              ]);
            }, false),
            width: 2,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.3,
              color: corCompanhia.withAlpha(0.8),
            }),
          },
        });
        adicionados++;
      }
      setFlightCount(adicionados);
      setStatus("ARGUS ONLINE");
    } catch (err) {
      console.error(err);
      setStatus((prev) =>
        prev === "INICIALIZANDO..." ? "AGUARDANDO SINAL..." : prev,
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSatellites = async () => {
    const dataSource = satellitesDataSourceRef.current;
    if (!dataSource) return;

    if (showSatellites) {
      dataSource.entities.removeAll();
      setShowSatellites(false);
      return;
    }

    try {
      setStatus("BUSCANDO SATÉLITES...");
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-50, 15, 25000000),
        duration: 2,
      });

      const res = await fetch(`${API_URL}/satellites?grupo=estacoes&limit=50`);
      const data = await res.json();

      dataSource.entities.removeAll();

      for (const sat of data.satelites) {
        const altMetros = sat.altitude_km * 1000;

        dataSource.entities.add({
          name: sat.nome,
          position: Cesium.Cartesian3.fromDegrees(
            sat.longitude,
            sat.latitude,
            altMetros,
          ),

          // PONTO DE RADAR CIANO (À PROVA DE FALHAS)
          point: {
            pixelSize: 10, // Tamanho do ponto
            color: Cesium.Color.CYAN, // Cor ciano brilhante
            outlineColor: Cesium.Color.BLACK, // Borda preta para destacar
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY, // Não some atrás da Terra
          },

          // LABEL COM O NOME DO SATÉLITE
          label: {
            text: sat.nome,
            font: "12px Inter, sans-serif",
            fillColor: Cesium.Color.CYAN,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -20),
            showBackground: true,
            backgroundColor:
              Cesium.Color.fromCssColorString("#05060A").withAlpha(0.8),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          description: `
            <div style="font-family: Inter; padding: 8px;">
              <strong style="color: #00E5FF; font-size: 16px;">🛰️ ${sat.nome}</strong><br/>
              <hr style="border:none; border-top:1px solid #ccc; margin: 8px 0;"/>
              <strong>NORAD ID:</strong> ${sat.norad_id}<br/>
              <strong>Altitude:</strong> ${Math.round(sat.altitude_km)} km<br/>
              <strong>Lat:</strong> ${sat.latitude}°<br/>
              <strong>Lon:</strong> ${sat.longitude}°
            </div>
          `,
        });
      }
      setShowSatellites(true);
      setStatus("ARGUS ONLINE");
    } catch (err) {
      console.error(err);
      setStatus("ERRO AO BUSCAR SATÉLITES");
    }
  };

  const handleOrbitalView = () => {
    viewerRef.current?.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-50, 15, 18000000),
      duration: 2,
    });
  };

  return (
    <div className="argus-root">
      <div ref={containerRef} className="argus-globe" />

      <div className="argus-hud">
        <div className="argus-logo">
          <span className="argus-eye">👁️</span>
          <div>
            <h1>PROJECT ARGUS</h1>
            <p className="mono">Cem olhos. Uma verdade.</p>
          </div>
        </div>
      </div>

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

      <div className="argus-actions">
        <button className="argus-refresh" onClick={toggleSatellites}>
          <span className="argus-btn-en">
            {showSatellites ? "HIDE SATELLITES" : "SHOW SATELLITES"}
          </span>
          <span className="argus-btn-pt">
            {showSatellites ? "Ocultar satélites" : "Mostrar satélites"}
          </span>
        </button>
        <button className="argus-refresh" onClick={handleOrbitalView}>
          <span className="argus-btn-en">ORBITAL VIEW</span>
          <span className="argus-btn-pt">Visão orbital</span>
        </button>
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
    </div>
  );
}

export default App;
