import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../UIX/Pagamento.css"; // importa il CSS separato

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state;

  const [loading, setLoading] = useState(true);

  // Simula fetch pagamento
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!reservationData) {
    return (
      <div className="payment-container">
        <h2>Nessuna prenotazione trovata ❌</h2>
        <button className="btn-orange" onClick={() => navigate("/")}>
          Torna alla Home
        </button>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Indietro
      </button>

      <h2>Pagamento Prenotazione</h2>

      {loading ? (
        <div className="loader-box">
          <div className="spinner"></div>
          <p>Stiamo preparando il pagamento...</p>
        </div>
      ) : (
        <div className="payment-box">
          <h3>
            Totale da pagare: <span className="total-amount">{reservationData.total}€</span>
          </h3>

          {/* MOCK iframe pagamento */}
          <iframe
            title="payment"
            className="payment-iframe"
            src="https://sandbox.example.fake-gateway/demo"
          ></iframe>

          <button
            className="btn-green"
            onClick={() => navigate("/successo")}
          >
            Simula pagamento completato ✅
          </button>
        </div>
      )}
    </div>
  );
}
