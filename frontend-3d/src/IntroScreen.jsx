import { useState, useEffect, useRef } from "react";
import "./IntroScreen.css";

export default function IntroScreen({ onFinish }) {
  const [status, setStatus] = useState("AGUARDANDO COMANDO...");
  const [isOpening, setIsOpening] = useState(false);
  const [hudLines, setHudLines] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    // Inicializa o áudio
    audioRef.current = new Audio("/trilha1.mp3");
    audioRef.current.volume = 0.3;
  }, []);

  const iniciarSistema = () => {
    if (isOpening) return;
    setIsOpening(true); // Isso ativa a animação no CSS
    setStatus("ESCUTANDO...");

    // Toca a música no clique
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Áudio bloqueado", e));
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR";
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const texto = event.results[0][0].transcript.toLowerCase();
        if (
          texto.includes("ativar olho de deus") ||
          texto.includes("abrir olho de deus") ||
          texto.includes("iniciar")
        ) {
          iniciarAnimacao();
        } else {
          setStatus("COMANDO NÃO RECONHECIDO");
          setIsOpening(false);
          if (audioRef.current) audioRef.current.pause();
        }
      };

      recognition.onerror = () => {
        iniciarAnimacao();
      };

      recognition.start();

      setTimeout(() => {
        if (!isOpening) iniciarAnimacao();
      }, 5000);
    } else {
      iniciarAnimacao();
    }
  };

  const iniciarAnimacao = () => {
    setStatus("ACESSO CONCEDIDO");

    // Linhas de HUD (como na imagem)
    const linhas = [
      "> INICIANDO PROTOCOLO...",
      "> CONECTANDO A SATÉLITES...",
      "> BEM-VINDO, SENHOR VIANA.",
    ];

    linhas.forEach((linha, index) => {
      setTimeout(() => {
        setHudLines((prev) => [...prev, linha]);
      }, index * 500);
    });

    setTimeout(() => {
      if (audioRef.current) audioRef.current.pause();
      onFinish();
    }, 3500);
  };

  return (
    <div
      className={`intro-container ${isOpening ? "opening" : ""}`}
      onClick={iniciarSistema}
    >
      {/* A Imagem do Olho de Deus como Fundo */}
      <div className="intro-eye-image"></div>

      {/* Texto de Status (se não estiver aberto) */}
      {!isOpening && (
        <div className="intro-text">
          <h2>{status}</h2>
          <p>Clique no Olho de Deus e diga: "Ativar Olho de Deus"</p>
        </div>
      )}

      {/* Linhas de HUD no canto */}
      <div className="intro-hud">
        {hudLines.map((linha, i) => (
          <p key={i} className="hud-line">
            {linha}
          </p>
        ))}
      </div>
    </div>
  );
}
