import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../UIX/Pagamento.css";

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservationData = location.state; // dati della prenotazione selezionata
  const path = location.pathname;

  const [loading, setLoading] = useState(true);
  const [verifyResult, setVerifyResult] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    // =========================
    // INIT PAYMENT
    // =========================
    async function initPayment() {
      try {
        // 1️⃣ Inseriamo un record nella tabella Pagamenti con status "pending"
        const { data: payment, error: insertError } = await supabase
          .from("Pagamenti")
          .insert([
            {
              prenotazione_id: reservationData.id,
              user_id: reservationData.user_id,
              vehicle_id: reservationData.vehicle_id,
              importo: reservationData.amount,
              status: "pending"
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        setPaymentId(payment.id);

        // 2️⃣ Chiamata al server esterno per inizializzare il pagamento
        const response = await fetch("https://server-noloe.fly.dev/init-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: payment.id,
            amount: payment.importo,
            userId: payment.user_id
          })
        });
        const data = await response.json();
        if (!data.url) throw new Error("URL pagamento non ricevuto");

        // 3️⃣ Salviamo l'URL del pagamento nella tabella Pagamenti
        await supabase
          .from("Pagamenti")
          .update({ payment_url: data.url })
          .eq("id", payment.id);

        setLoading(false);
        window.location.href = data.url;
      } catch (err) {
        console.error("Errore init-payment:", err);
        alert("Errore durante l'inizializzazione del pagamento!");
        navigate("/");
      }
    }

    // =========================
    // VERIFY PAYMENT
    // =========================
    async function verifyPayment() {
      try {
        const response = await fetch("https://server-noloe.fly.dev/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
        const data = await response.json();
        setVerifyResult(data);

        // Aggiorniamo lo stato del pagamento nella tabella Pagamenti
        const status = data.txHead?.resultCode === "IGFS_000" ? "completed" : "failed";
        await supabase
          .from("Pagamenti")
          .update({ status, result_code: data.txHead?.resultCode })
          .eq("id", paymentId);
      } catch (err) {
        console.error("Errore verify-payment:", err);
        setVerifyResult({ error: true });
        await supabase
          .from("Pagamenti")
          .update({ status: "failed" })
          .eq("id", paymentId);
      } finally {
        setLoading(false);
      }
    }

    if (path === "/pagamento/successo" && paymentId) {
      verifyPayment();
    } else if (path === "/pagamento" && reservationData) {
      initPayment();
    } else {
      setLoading(false);
    }
  }, [path, reservationData, navigate, paymentId]);

  // =========================
  // UI
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
            <button className="btn-green" onClick={() => navigate("/")}>
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
