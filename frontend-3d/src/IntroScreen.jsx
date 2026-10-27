import "./IntroScreen.css";

export default function IntroScreen({ onFinish }) {
  return (
    <div className="intro-container">
      <div className="argus-lens-eye" onClick={onFinish}>
        <div className="lens-outer"></div>
        <div className="lens-middle"></div>
        <div className="lens-iris"></div>
        <div className="lens-pupil"></div>
        <div className="lens-glare"></div>
      </div>
      <p className="eye-instruction">Clique na Lente para acordar o ARGUS</p>
      <button
        onClick={onFinish}
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          background: "transparent",
          border: "1px solid #FFB020",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          color: "#FFB020",
          fontFamily: "Orbitron, sans-serif",
          fontSize: "12px",
        }}
      >
        PULAR INTRODUÇÃO
      </button>
    </div>
  );
}
