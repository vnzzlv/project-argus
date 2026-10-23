/**
 * PROJECT ARGUS 3D — Globo CesiumJS
 * Voos em tempo real com direção e animação.
 */

import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";
const DURACAO_VOO_SEGUNDOS = 90; // tempo para o avião percorrer a linha

// Calcula ponto de destino (origem + rumo + distância)
function destinoAproximado(lon, lat, headingDeg, distanciaKm) {
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

  return {
    lon: Cesium.Math.toDegrees(lon2),
    lat: Cesium.Math.toDegrees(lat2),
  };
}

function App() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const dataSourceRef = useRef(null);
  const [flightCount, setFlightCount] = useState(0);
  const [status, setStatus] = useState("INICIALIZANDO...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (viewerRef.current) return;

    // ============ VIEWER ============
    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      skyBox: false,
      skyAtmosphere: new Cesium.SkyAtmosphere(),
    });

    // ============ CAMADAS DE MAPA ============
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

    // ============ ESTILO ARGUS ============
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#0B0D14");
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#05060A");
    viewer.scene.globe.enableLighting = true;
    viewer.cesiumWidget.creditContainer.style.display = "none";

    // Suaviza a renderização
    viewer.scene.postProcessStages.fxaa.enabled = true;

    // ============ CÂMERA INICIAL ============
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-50, 15, 18000000),
    });

    viewerRef.current = viewer;

    // ============ DATASOURCE COM CLUSTERING ============
    const dataSource = new Cesium.CustomDataSource("flights");

    dataSource.clustering.enabled = true;
    dataSource.clustering.pixelRange = 45;
    dataSource.clustering.minimumClusterSize = 3;

    dataSource.clustering.clusterEvent.addEventListener((entities, cluster) => {
      cluster.billboard.show = false;
      cluster.label.show = true;
      cluster.label.text = `${entities.length} voos`;
      cluster.label.font = "bold 12px Inter, sans-serif";
      cluster.label.fillColor = Cesium.Color.fromCssColorString("#FFB020");
      cluster.label.outlineColor = Cesium.Color.fromCssColorString("#05060A");
      cluster.label.outlineWidth = 3;
      cluster.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE;
      cluster.label.pixelOffset = new Cesium.Cartesian2(0, -22);
      cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
      cluster.label.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
      cluster.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;

      cluster.point.show = true;
      cluster.point.pixelSize = 14;
      cluster.point.color =
        Cesium.Color.fromCssColorString("#FFB020").withAlpha(0.6);
      cluster.point.outlineColor = Cesium.Color.fromCssColorString("#FF7A00");
      cluster.point.outlineWidth = 2;
      cluster.point.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    });

    viewer.dataSources.add(dataSource);
    dataSourceRef.current = dataSource;

    carregarVoos(viewer, dataSource);

    // Atualização automática
    const interval = setInterval(() => carregarVoos(viewer, dataSource), 30000);

    // ============ CLIQUE → ZOOM CINEMATOGRÁFICO ============
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (Cesium.defined(picked) && picked.id && picked.id.position) {
        viewer.flyTo(picked.id, {
          duration: 2.5,
          offset: new Cesium.HeadingPitchRange(
            0,
            Cesium.Math.toRadians(-35),
            60000,
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

  // ============ CARREGAR VOOS ============
  const carregarVoos = async (viewer, dataSource) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/flights?limit=150`);
      const data = await res.json();

      dataSource.entities.removeAll();

      const agora = viewer.clock.currentTime.clone();
      const inicio = agora.clone();

      let adicionados = 0;
      for (const v of data.voos || []) {
        if (!v.latitude || !v.longitude) continue;

        // Altitude visual (escala para não "sair" do globo)
        const altitudeVisual = Math.min((v.altitude_m || 10000) / 3, 4500);

        // Ponto de destino baseado no heading
        const destino = destinoAproximado(
          v.longitude,
          v.latitude,
          v.heading || 0,
          800,
        );

        // ============ LINHA DE DIREÇÃO ============
        dataSource.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              v.longitude,
              v.latitude,
              altitudeVisual,
              destino.lon,
              destino.lat,
              altitudeVisual,
            ]),
            width: 1.2,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.25,
              color: Cesium.Color.fromCssColorString("#FFB020").withAlpha(0.55),
            }),
          },
        });

        // ============ AVIÃO ANIMADO ============
        const duracao = DURACAO_VOO_SEGUNDOS;
        const fim = Cesium.JulianDate.addSeconds(
          inicio,
          duracao,
          new Cesium.JulianDate(),
        );

        const posicaoInicial = Cesium.Cartesian3.fromDegrees(
          v.longitude,
          v.latitude,
          altitudeVisual,
        );
        const posicaoFinal = Cesium.Cartesian3.fromDegrees(
          destino.lon,
          destino.lat,
          altitudeVisual,
        );

        const sampledPosition = new Cesium.SampledPositionProperty();
        sampledPosition.addSample(inicio, posicaoInicial);
        sampledPosition.addSample(fim, posicaoFinal);

        // Avião (ponto animado)
        dataSource.entities.add({
          id: `voo-${adicionados}`,
          name: v.callsign || "N/A",
          availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({ start: inicio, stop: fim }),
          ]),
          position: sampledPosition,
          point: {
            pixelSize: 7,
            color: Cesium.Color.fromCssColorString("#FFB020"),
            outlineColor: Cesium.Color.fromCssColorString("#05060A"),
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          properties: {
            callsign: v.callsign || "N/A",
            pais: v.pais_origem || "N/A",
            altitude: v.altitude_m || 0,
            velocidade: v.velocidade_ms || 0,
            heading: v.heading || 0,
          },
          description: `
            <div style="font-family: Inter, sans-serif; color:#05060A; padding:4px;">
              <strong style="font-size:14px; color:#FF7A00;">${v.callsign || "N/A"}</strong>
              <hr style="border:none; border-top:1px solid #ddd; margin:6px 0;"/>
              <strong>País:</strong> ${v.pais_origem || "N/A"}<br/>
              <strong>Altitude:</strong> ${Math.round(v.altitude_m || 0)} m<br/>
              <strong>Velocidade:</strong> ${Math.round(v.velocidade_ms || 0)} m/s<br/>
              <strong>Rumo:</strong> ${Math.round(v.heading || 0)}°
            </div>
          `,
        });
        adicionados++;
      }

      // Fazer o relógio do Cesium avançar para animar
      viewer.clock.startTime = inicio.clone();
      viewer.clock.currentTime = inicio.clone();
      viewer.clock.stopTime = Cesium.JulianDate.addSeconds(
        inicio,
        DURACAO_VOO_SEGUNDOS,
        new Cesium.JulianDate(),
      );
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      viewer.clock.multiplier = 1;
      viewer.clock.shouldAnimate = true;

      setFlightCount(adicionados);
      setStatus("ARGUS ONLINE");
    } catch (err) {
      console.error("Erro ao carregar voos:", err);
      setStatus("ERRO DE CONEXÃO");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (viewerRef.current && dataSourceRef.current) {
      carregarVoos(viewerRef.current, dataSourceRef.current);
    }
  };

  const handleOrbitalView = () => {
    if (viewerRef.current) {
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-50, 15, 18000000),
        duration: 2,
      });
    }
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
        <button className="argus-refresh" onClick={handleOrbitalView}>
          <span className="argus-btn-en">ORBITAL VIEW</span>
          <span className="argus-btn-pt">Visão orbital</span>
        </button>
        <button
          className="argus-refresh"
          onClick={handleRefresh}
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
