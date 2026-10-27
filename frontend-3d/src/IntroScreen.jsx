import { useState } from "react";
import "./IntroScreen.css";

export default function IntroScreen({ onFinish }) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("SISTEMA EM ESPERA");

  const iniciarSistema = () => {
    if (step !== 2) return;
    setStatus("CONECTANDO...");
    setTimeout(() => {
      setStatus("ACESSO CONCEDIDO");
      setTimeout(() => onFinish(), 1000);
    }, 1500);
  };

  return (
    <div className={`intro-container step-${step}`}>
      {step === 1 && (
        <div className="eye-intro-container" onClick={() => setStep(2)}>
          {/* O Olho de Deus em CSS */}
          <div className="eye-css-fallback">
            <div className="iris"></div>
            <div className="pupila"></div>
          </div>
          <p className="eye-instruction">Clique no Olho para acordar o ARGUS</p>
        </div>
      )}

      {step === 2 && (
        <div className="jarvis-orb-container" onClick={iniciarSistema}>
          <div className="jarvis-orb-core"></div>
          <div className="jarvis-orb-ring ring-1"></div>
          <div className="jarvis-orb-ring ring-2"></div>
          <div className="jarvis-orb-ring ring-3"></div>
        </div>
      )}

      {step === 2 && <h2 className="intro-status">{status}</h2>}
    </div>
  );
}
