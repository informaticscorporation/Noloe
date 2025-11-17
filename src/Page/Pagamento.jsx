import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../UIX/Pagamento.css";

export default function Pagamento() {
  
  const navigate = useNavigate();
  

  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);

 useEffect(() => {
   async function fetchPaymentUrl() {
     const response = await fetch("https://server-noloe.fly.dev/init-payment", )
     const data = await response.json();
     setPaymentUrl(data.url);
     setLoading(false);
   }
}, []);


 

  return (
    <div className="pagamento-container">
      {loading ? (
        <p>Loading payment...</p>
      ) : (
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
      )}
    </div>
  );
}
