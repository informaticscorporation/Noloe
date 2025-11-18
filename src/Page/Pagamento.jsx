import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../UIX/Pagamento.css";

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state;

  const [loading, setLoading] = useState(true);
  const [verifyResult, setVerifyResult] = useState(null);

  // Controllo del path
  const path = location.pathname; // /pagamento oppure /pagamento/successo

  useEffect(() => {
    async function initPayment() {
      try {
        const response = await fetch("https://server-noloe.fly.dev/init-payment");
        const data = await response.json();

        if (!data.url) throw new Error("URL pagamento non ricevuto");

        // Apri pagamento in nuova scheda
        window.open(data.url, "_blank");
        setLoading(false);

      } catch (err) {
        console.error("Errore inizializzazione pagamento:", err);
        alert("Errore durante l'inizializzazione del pagamento!");
        navigate("/");
      }
    }

    async function verifyPayment() {
      try {
        const response = await fetch("https://server-noloe.fly.dev/verify-payment");
        const data = await response.json();
        setVerifyResult(data);
      } catch (err) {
        console.error("Errore verify:", err);
        setVerifyResult({ error: true });
      } finally {
        setLoading(false);
      }
    }

    // 🔹 Se siamo su /pagamento/successo → verify
    if (path === "/pagamento/successo") {
      verifyPayment();
      return;
    }

    // 🔹 Se siamo su /pagamento → init normale
    if (reservationData) {
      initPayment();
    } else {
      setLoading(false);
    }
  }, [reservationData, path, navigate]);

  // =========================
  // SCHERMATA POST VERIFY
  // =========================
  if (path === "/pagamento/successo") {
    if (loading) {
      return (
        <div className="pagamento-container">
          <h2>Verifica del pagamento…</h2>
          <div className="loader-box">
            <div className="spinner"></div>
            <p>Controllo stato della transazione…</p>
          </div>
        </div>
      );
    }

    if (!verifyResult || verifyResult.error) {
      return (
        <div className="pagamento-container">
          <h2>Pagamento non riuscito ❌</h2>
          <p>Si è verificato un errore durante il pagamento.</p>
          <button className="btn-orange" onClick={() => navigate("/")}>
            Torna alla Home
          </button>
        </div>
      );
    }

    const result = verifyResult.txHead?.resultCode;

    return (
      <div className="pagamento-container">
        {result === "IGFS_000" ? (
          <>
            <h2>Pagamento completato con successo ✅</h2>
            <button className="btn-green" onClick={() => navigate("/successo")}>
              Continua
            </button>
          </>
        ) : (
          <>
            <h2>Pagamento non riuscito ❌</h2>
            <p>Codice errore: {result}</p>
            <button className="btn-orange" onClick={() => navigate("/")}>
              Torna alla Home
            </button>
          </>
        )}
      </div>
    );
  }

  // =========================
  // SCHERMATA PRE PAGAMENTO
  // =========================
  if (!reservationData) {
    return (
      <div className="pagamento-container">
        <h2>Nessuna prenotazione trovata ❌</h2>
        <button className="btn-orange" onClick={() => navigate("/")}>
          Torna alla Home
        </button>
      </div>
    );
  }

  // Pagamento in corso (/pagamento)
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
