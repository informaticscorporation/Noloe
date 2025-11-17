import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../UIX/Pagamento.css";

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state;

  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);

 useEffect(() => {
  if (!reservationData) return;

  const initPayment = async () => {
    try {
      const response = await fetch("https://server-noloe.fly.dev/init-payment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" // serve a volte per Vercel
        },
      });

      const data = await response.json();
      setPaymentUrl(data.redirectURL);
    } catch (err) {
      console.error("Errore inizializzazione pagamento:", err);
      alert("Errore durante l'inizializzazione del pagamento!");
    } finally {
      setLoading(false);
    }
  };

  initPayment();
}, [reservationData]);


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

          {paymentUrl ? (
            <iframe
              title="payment"
              className="payment-iframe"
              src={paymentUrl}
            ></iframe>
          ) : (
            <p>Errore nel caricamento del pagamento.</p>
          )}

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
