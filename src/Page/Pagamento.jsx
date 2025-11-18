import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../UIX/Pagamento.css";

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaymentUrl() {
      try {
        const response = await fetch("https://server-noloe.fly.dev/init-payment");
        const data = await response.json();

        if (!data.url) {
          throw new Error("URL pagamento non ricevuto");
        }

        // 👉 REDIRECT DIRETTO ALLA PAGINA DI PAGAMENTO
        window.location.href = data.url;

      } catch (err) {
        console.error("Errore inizializzazione pagamento:", err);
        alert("Errore durante l'inizializzazione del pagamento!");
        navigate("/");
      }
    }

    if (reservationData) {
      fetchPaymentUrl();
    }
  }, [reservationData, navigate]);

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
    <div className="pagamento-container">
      <h2>Reindirizzamento al pagamento…</h2>

      {loading && (
        <div className="loader-box">
          <div className="spinner"></div>
          <p>Preparazione pagamento...</p>
        </div>
      )}
    </div>
  );
}
