/**
 * PROJECT ARGUS 3D — VISION (Groq IA + Edge TTS)
 * VISUAL CINEMATOGRÁFICO (Iluminação e Alta Resolução)
 */

import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./App.css";
import IntroScreen from "./IntroScreen";

const API_URL = "http://127.0.0.1:8000";
const REFRESH_MS = 900000;

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

function infoPorSatelite(nome) {
  const n = nome.toUpperCase();
  if (n.includes("STARLINK"))
    return { empresa: "SpaceX", cor: Cesium.Color.CYAN };
  if (n.includes("ISS") || n.includes("ZARYA"))
    return { empresa: "NASA/ESA", cor: Cesium.Color.WHITE };
  if (
    n.includes("CSS") ||
    n.includes("SHENZHOU") ||
    n.includes("TIANZHOU") ||
    n.includes("TIANHE") ||
    n.includes("WENTIAN")
  )
    return { empresa: "CNSA (China)", cor: Cesium.Color.GOLD };
  if (n.includes("SOYUZ") || n.includes("PROGRESS") || n.includes("NAUKA"))
    return { empresa: "Roscosmos (Rússia)", cor: Cesium.Color.RED };
  return { empresa: "Outra", cor: Cesium.Color.CYAN };
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

export default function App() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const flightsDataSourceRef = useRef(null);
  const satellitesDataSourceRef = useRef(null);
  const earthquakesDataSourceRef = useRef(null);
  const flightsDataRef = useRef([]);
  const baseTimeRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const visionAudioRef = useRef(null);

  const [isSystemActive, setIsSystemActive] = useState(false);
  const [flightCount, setFlightCount] = useState(0);
  const [status, setStatus] = useState("INICIALIZANDO...");
  const [loading, setLoading] = useState(false);
  const [showSatellites, setShowSatellites] = useState(false);
  const [showEarthquakes, setShowEarthquakes] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [visionMessage, setVisionMessage] = useState("");
  const [currentTrack, setCurrentTrack] = useState("");
  const [textInput, setTextInput] = useState("");

  const stateRef = useRef({ flightCount, showSatellites, showEarthquakes });
  useEffect(() => {
    stateRef.current = { flightCount, showSatellites, showEarthquakes };
  }, [flightCount, showSatellites, showEarthquakes]);

  const visionFalar = async (texto) => {
    if (!texto) return;
    setVisionMessage(texto);
    setIsSpeaking(true);

    try {
      const res = await fetch(`${API_URL}/vision/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: texto }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);

        if (visionAudioRef.current) visionAudioRef.current.pause();

        visionAudioRef.current = new Audio(audioUrl);
        visionAudioRef.current.onended = () => setIsSpeaking(false);
        visionAudioRef.current.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Erro ao tocar áudio:", error);
      setIsSpeaking(false);
    }
  };

  const tocarTrilha = (numero) => {
    const nomeArquivo = `/trilha${numero}.mp3`;
    if (currentTrack === nomeArquivo && audioRef.current) {
      audioRef.current.play().catch((e) => console.log(e));
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(nomeArquivo);
    audioRef.current.volume = 0.15;
    audioRef.current.loop = true;
    audioRef.current.play().catch((e) => console.log("Erro áudio:", e));
    setCurrentTrack(nomeArquivo);
    visionFalar(`Iniciando trilha sonora ${numero}, senhor.`);
  };

  const pararMusica = () => {
    if (audioRef.current) audioRef.current.pause();
    visionFalar("Silenciando trilha sonora, senhor.");
  };

  const filtrarVoos = (icaoCode) => {
    const dataSource = flightsDataSourceRef.current;
    if (!dataSource) return;
    dataSource.entities.values.forEach((entity) => {
      if (entity.model) {
        if (!icaoCode) entity.show = true;
        else {
          const original = flightsDataRef.current.find(
            (f) => `voo-${flightsDataRef.current.indexOf(f)}` === entity.id,
          );
          entity.show = original && original.companhia_aerea?.icao === icaoCode;
        }
      }
    });
  };

  const processarComando = async (comando) => {
    if (!comando.trim() || isSpeaking) return;
    const cmd = comando.toLowerCase().trim();
    setStatus("PROCESSANDO...");

    if (cmd.includes("modo viana")) {
      tocarTrilha(1);
      setStatus("ARGUS ONLINE");
      return;
    }
    if (cmd.includes("silêncio") || cmd.includes("parar música")) {
      pararMusica();
      setStatus("ARGUS ONLINE");
      return;
    }
    if (cmd.includes("ativar olho de deus")) {
      visionFalar("Ativando todas as camadas, senhor.");
      if (!showSatellites) toggleSatellites();
      if (!showEarthquakes) toggleEarthquakes();
      setStatus("ARGUS ONLINE");
      return;
    }

    try {
      const {
        flightCount: currentFlights,
        showSatellites: currentSats,
        showEarthquakes: currentQuakes,
      } = stateRef.current;
      const contexto = `Temos ${currentFlights} voos. Satélites: ${currentSats ? "ligados" : "desligados"}. Terremotos: ${currentQuakes ? "ligados" : "desligados"}.`;

      const res = await fetch(`${API_URL}/vision/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: cmd, contexto: contexto }),
      });

      if (!res.ok) throw new Error("Falha na API");
      const data = await res.json();

      if (data.resposta) visionFalar(data.resposta);

      if (data.acao === "FILTRAR_GOL") filtrarVoos("GLO");
      else if (data.acao === "FILTRAR_LATAM") filtrarVoos("TAM");
      else if (data.acao === "FILTRAR_AZU") filtrarVoos("AZU");
      else if (data.acao === "MOSTRAR_AVIOES") filtrarVoos(null);
      else if (data.acao === "MOSTRAR_TERREMOTOS" && !showEarthquakes)
        toggleEarthquakes();
      else if (data.acao === "MOSTRAR_SATELITES" && !showSatellites)
        toggleSatellites();

      setStatus("ARGUS ONLINE");
    } catch (error) {
      console.error(error);
      visionFalar("Desculpe, senhor. Meu núcleo neural está offline.");
      setStatus("ARGUS ONLINE");
    }
  };

  useEffect(() => {
    if (!isSystemActive) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    if (!recognitionRef.current) {
      const recognition = new SR();
      recognition.lang = "pt-BR";
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => {
          if (isSystemActive && recognitionRef.current)
            try {
              recognitionRef.current.start();
            } catch (e) {}
        }, 2000);
      };
      recognition.onresult = (e) =>
        processarComando(e.results[e.results.length - 1][0].transcript);
      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (e) {}
    }
    return () => {
      if (recognitionRef.current)
        try {
          recognitionRef.current.abort();
        } catch (e) {}
    };
  }, [isSystemActive]);

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

    // VISUAL CINEMATOGRÁFICO RESTAURADO
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.showGroundAtmosphere = true;

    // Textura em alta resolução
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
    viewer.cesiumWidget.creditContainer.style.display = "none";
    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-50, 15, 18000000),
    });
    viewerRef.current = viewer;

    const flightsDS = new Cesium.CustomDataSource("flights");
    viewer.dataSources.add(flightsDS);
    flightsDataSourceRef.current = flightsDS;

    const satsDS = new Cesium.CustomDataSource("satellites");
    viewer.dataSources.add(satsDS);
    satellitesDataSourceRef.current = satsDS;

    const quakesDS = new Cesium.CustomDataSource("earthquakes");
    viewer.dataSources.add(quakesDS);
    earthquakesDataSourceRef.current = quakesDS;

    carregarVoos();
    const interval = setInterval(carregarVoos, REFRESH_MS);

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      if (Cesium.defined(picked) && picked.id)
        viewer.flyTo(picked.id, {
          duration: 2,
          offset: new Cesium.HeadingPitchRange(
            0,
            Cesium.Math.toRadians(-40),
            80000,
          ),
        });
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
      // Voltei para 200 aviões
      const res = await fetch(`${API_URL}/flights?limit=200`);
      if (!res.ok) throw new Error("API offline");
      const data = await res.json();
      const ds = flightsDataSourceRef.current;
      if (!ds) return;

      flightsDataRef.current = data.voos.filter(
        (v) => v.latitude && v.longitude,
      );
      baseTimeRef.current = Date.now();
      ds.entities.removeAll();

      for (let i = 0; i < flightsDataRef.current.length; i++) {
        const v = flightsDataRef.current[i];
        const altVisual = 2000 + (v.altitude_m || 10000) * 0.05;
        const cor = corPorCompanhia(v.companhia_aerea);

        const pos = new Cesium.CallbackProperty(() => {
          const dist =
            ((v.velocidade_ms || 200) *
              ((Date.now() - baseTimeRef.current) / 1000)) /
            1000;
          const n = moverPosicao(v.longitude, v.latitude, v.heading || 0, dist);
          return Cesium.Cartesian3.fromDegrees(n.lon, n.lat, altVisual);
        }, false);

        const ori = new Cesium.CallbackProperty(() => {
          const p = pos.getValue();
          if (!p) return Cesium.Quaternion.IDENTITY;
          return Cesium.Transforms.headingPitchRollQuaternion(
            p,
            new Cesium.HeadingPitchRoll(
              Cesium.Math.toRadians((v.heading || 0) - 90),
              0,
              0,
            ),
          );
        }, false);

        ds.entities.add({
          id: `voo-${i}`,
          name: v.callsign,
          position: pos,
          orientation: ori,
          model: {
            uri: "https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
            minimumPixelSize: 32,
            maximumScale: 20000,
            color: cor,
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

        ds.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              const dist =
                ((v.velocidade_ms || 200) *
                  ((Date.now() - baseTimeRef.current) / 1000)) /
                1000;
              const at = moverPosicao(
                v.longitude,
                v.latitude,
                v.heading || 0,
                dist,
              );
              const tr = moverPosicao(
                v.longitude,
                v.latitude,
                v.heading || 0,
                Math.max(0, dist - 150),
              );
              return Cesium.Cartesian3.fromDegreesArrayHeights([
                tr.lon,
                tr.lat,
                altVisual,
                at.lon,
                at.lat,
                altVisual,
              ]);
            }, false),
            width: 2,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.3,
              color: cor.withAlpha(0.8),
            }),
          },
        });
      }
      setFlightCount(flightsDataRef.current.length);
      setStatus("ARGUS ONLINE");
    } catch (e) {
      setStatus("AGUARDANDO SINAL...");
    } finally {
      setLoading(false);
    }
  };

  const toggleSatellites = async () => {
    const ds = satellitesDataSourceRef.current;
    if (!ds) return;
    if (showSatellites) {
      ds.entities.removeAll();
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
      ds.entities.removeAll();
      data.satelites.forEach((sat) => {
        const info = infoPorSatelite(sat.nome);
        ds.entities.add({
          name: sat.nome,
          position: Cesium.Cartesian3.fromDegrees(
            sat.longitude,
            sat.latitude,
            sat.altitude_km * 1000,
          ),
          point: {
            pixelSize: 12,
            color: info.cor,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: sat.nome,
            font: "12px Inter",
            fillColor: info.cor,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -25),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
      });
      setShowSatellites(true);
      setStatus("ARGUS ONLINE");
    } catch (e) {
      setStatus("ERRO SATÉLITES");
    }
  };

  const toggleEarthquakes = async () => {
    const ds = earthquakesDataSourceRef.current;
    if (!ds) return;
    if (showEarthquakes) {
      ds.entities.removeAll();
      setShowEarthquakes(false);
      return;
    }
    try {
      setStatus("BUSCANDO TERREMOTOS...");
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-50, 15, 18000000),
        duration: 2,
      });
      const res = await fetch(
        `${API_URL}/earthquakes?periodo=dia&magnitude=m25&limit=100`,
      );
      const data = await res.json();
      ds.entities.removeAll();
      data.terremotos.forEach((eq) => {
        ds.entities.add({
          name: `M${eq.magnitude}`,
          position: Cesium.Cartesian3.fromDegrees(eq.longitude, eq.latitude, 0),
          point: {
            pixelSize: Math.max(10, eq.magnitude * 4),
            color: Cesium.Color.RED.withAlpha(0.6),
            outlineColor: Cesium.Color.RED,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: `M${eq.magnitude}`,
            font: "bold 12px Inter",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -20),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
      });
      setShowEarthquakes(true);
      setStatus("ARGUS ONLINE");
    } catch (e) {
      setStatus("ERRO TERREMOTOS");
    }
  };

  return (
    <>
      <div
        style={{
          display: isSystemActive ? "none" : "block",
          position: "absolute",
          inset: 0,
          zIndex: 10000,
        }}
      >
        {!isSystemActive && (
          <IntroScreen onFinish={() => setIsSystemActive(true)} />
        )}
      </div>

      <div className="argus-root" style={{ opacity: isSystemActive ? 1 : 0 }}>
        <div ref={containerRef} className="argus-globe" />
        <div className="argus-hud">
          <div className="argus-logo">
            <span className="argus-eye">👁️</span>
            <div>
              <h1>PROJECT ARGUS</h1>
              <p className="mono">Cem olhos. Uma verdade.</p>
            </div>
          </div>
          <div className="vision-indicator">
            <div
              className={`vision-dot ${isListening ? "listening" : ""} ${isSpeaking ? "speaking" : ""}`}
            />
            <span className="vision-text">
              {isSpeaking
                ? "VISION FALANDO..."
                : isListening
                  ? "VISION OUVINDO..."
                  : "VISION OFFLINE"}
            </span>
          </div>
          {visionMessage && (
            <div className="vision-message">
              <p>{visionMessage}</p>
            </div>
          )}
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

        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "30px",
            zIndex: 10,
            background: "rgba(11,13,20,0.9)",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #FFB020",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processarComando(textInput);
              setTextInput("");
            }}
            style={{ display: "flex", gap: "10px" }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Fale ou digite..."
              style={{
                background: "transparent",
                border: "none",
                color: "#FFB020",
                outline: "none",
                width: "200px",
                fontFamily: "JetBrains Mono",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#FFB020",
                border: "none",
                padding: "5px 15px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ENVIAR
            </button>
          </form>
        </div>

        <div className="argus-actions">
          <button className="argus-refresh" onClick={toggleEarthquakes}>
            <span className="argus-btn-en">
              {showEarthquakes ? "HIDE QUAKES" : "SHOW QUAKES"}
            </span>
          </button>
          <button className="argus-refresh" onClick={toggleSatellites}>
            <span className="argus-btn-en">
              {showSatellites ? "HIDE SATELLITES" : "SHOW SATELLITES"}
            </span>
          </button>
          <button
            className="argus-refresh"
            onClick={() =>
              viewerRef.current?.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(-50, 15, 18000000),
                duration: 2,
              })
            }
          >
            <span className="argus-btn-en">ORBITAL VIEW</span>
          </button>
          <button
            className="argus-refresh"
            onClick={carregarVoos}
            disabled={loading}
          >
            <span className="argus-btn-en">
              {loading ? "LOADING..." : "REFRESH"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
