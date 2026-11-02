import { useState, useEffect, useRef } from "react";
import "./IntroScreen.css";
import JarvisOrb from "./JarvisOrb";

// Componente do Fundo: Chuva de Código
const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Ajusta o tamanho para a tela inteira
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) drops[x] = 1;

    const draw = () => {
      // Fundo preto translúcido para deixar o rastro
      ctx.fillStyle = "rgba(5, 6, 10, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];

        // Cores do ARGUS (Ciano, Âmbar e Laranja) aleatórias para cada letra
        const colors = ["#FFB020", "#FF7A00", "#00E5FF", "#8A8F98"];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 40);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
};

export default function IntroScreen({ onFinish }) {
  const [step, setStep] = useState(1); // 1: Terminal, 2: Orbe
  const [visibleLines, setVisibleLines] = useState([]);
  const [status, setStatus] = useState("SISTEMA EM ESPERA");

  const bootLines = [
    "> INICIANDO PROTOCOLO ARGUS v2.0...",
    "> CARREGANDO MODULO DE VOOS E SATELITES...",
    "> ESTABELECENDO CONEXAO COM A REDE OSINT...",
    "> AUTENTICANDO BIOMETRIA DO CRIADOR...",
    "> BEM-VINDO, SENHOR VIANA.",
    "> AGUARDANDO INICIALIZACAO MANUAL...",
  ];

  // Efeito de digitação do Terminal
  useEffect(() => {
    if (step !== 1) return;

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLines.length) {
        setVisibleLines((prev) => [...prev, bootLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        // Após terminar de digitar, avança para a Orbe
        setTimeout(() => setStep(2), 800);
      }
    }, 600); // Velocidade que cada linha aparece

    return () => clearInterval(interval);
  }, [step]);

  const iniciarSistema = () => {
    if (step !== 2) return;
    setStatus("CONECTANDO...");
    setTimeout(() => {
      setStatus("ACESSO CONCEDIDO");
      setTimeout(() => onFinish(), 1500);
    }, 1500);
  };

  return (
    <div className="intro-container">
      <MatrixRain />

      {/* ETAPA 1: O TERMINAL HACKER */}
      {step === 1 && (
        <div className="terminal-container">
          {visibleLines.map((line, index) => (
            <p key={index} className="terminal-line">
              {line}
            </p>
          ))}
          <span className="terminal-cursor">_</span>
        </div>
      )}

      {/* ETAPA 2: A ORBE 3D */}
      {step === 2 && (
        <div className="jarvis-orb-wrapper" onClick={iniciarSistema}>
          <JarvisOrb isListening={true} isSpeaking={false} />
          <h2 className="intro-status">{status}</h2>
          <p className="eye-instruction" style={{ marginTop: "10px" }}>
            Clique na Orbe para assumir o controle
          </p>
        </div>
      )}
    </div>
  );
}
