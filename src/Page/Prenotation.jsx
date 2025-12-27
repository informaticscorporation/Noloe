import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import { addDays, differenceInDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../UIX/Booking.css"; // metti qui il CSS che hai fornito

export default function Pronotation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const baseDayPrice = 40;

  const insuranceOptions = {
    basic: 0,
    comfort: 10,
    premium: 20,
    supertotal: 35,
  };

  const [insurance, setInsurance] = useState("basic");
  const [airportDelivery, setAirportDelivery] = useState(false);

  const [extras, setExtras] = useState({
    babySeat: false,
    snowChains: false,
  });

  const toggleExtra = (key) => {
    setExtras((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const days = useMemo(() => {
    const d = differenceInDays(range[0].endDate, range[0].startDate);
    return d > 0 ? d : 1;
  }, [range]);

  const total = useMemo(() => {
    let price = baseDayPrice * days;

    price += insuranceOptions[insurance] * days;

    if (airportDelivery) price += 20;
    if (extras.babySeat) price += 8 * days;
    if (extras.snowChains) price += 5 * days;

    return price;
  }, [days, insurance, airportDelivery, extras]);

  const handleSubmit = () => {
    const reservation = {
      carId: id,
      startDate: range[0].startDate,
      endDate: range[0].endDate,
      days,
      insurance,
      extras,
      airportDelivery,
      total,
    };

    navigate("/pagamento", { state: reservation });
  };

  return (
    <div className="booking-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Indietro</button>

      <div className="booking-container">
        {/* STEP INDICATOR */}
        <h2>Prenotazione Veicolo #{id}</h2>
        <p>Step {step} di 5</p>

        {/* STEP 1: DATE */}
        {step === 1 && (
          <div className="card">
            <h3>1️⃣ Seleziona Check-In / Check-Out</h3>
            <DateRange
              editableDateInputs={true}
              onChange={item => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={range}
            />
            <button className="btn-primary" onClick={() => setStep(2)}>Avanti</button>
          </div>
        )}

        {/* STEP 2: INSURANCE */}
        {step === 2 && (
          <div className="card">
            <h3>2️⃣ Seleziona Tipo di Assicurazione</h3>

            <div className="options-grid">
              {Object.keys(insuranceOptions).map((key) => (
                <label key={key} className="option-item">
                  <input
                    type="radio"
                    name="insurance"
                    checked={insurance === key}
                    onChange={() => setInsurance(key)}
                  />
                  {key.toUpperCase()} +{insuranceOptions[key]}€/giorno
                </label>
              ))}
            </div>

            <button className="btn-primary" onClick={() => setStep(3)}>Avanti</button>
          </div>
        )}

        {/* STEP 3: AIRPORT DELIVERY */}
        {step === 3 && (
          <div className="card">
            <h3>3️⃣ Vuoi consegna/ritiro in aeroporto?</h3>

            <label className="option-item">
              <input
                type="checkbox"
                checked={airportDelivery}
                onChange={() => setAirportDelivery(!airportDelivery)}
              />
              🚗 Consegna & Ritiro Aeroporto (+20€)
            </label>

            <button className="btn-primary" onClick={() => setStep(4)}>Avanti</button>
          </div>
        )}

        {/* STEP 4: INCLUDED + EXTRA */}
        {step === 4 && (
          <div className="card">
            <h3>4️⃣ Servizi</h3>

            <p>✅ Pass ZTL Palermo</p>
            <p>✅ GPS auto</p>

            <h4 style={{ marginTop: 10 }}>Extra opzionali</h4>

            <label className="option-item">
              <input
                type="checkbox"
                checked={extras.babySeat}
                onChange={() => toggleExtra("babySeat")}
              />
              🧒 Seggiolino bimbi (+8€/giorno)
            </label>

            <label className="option-item">
              <input
                type="checkbox"
                checked={extras.snowChains}
                onChange={() => toggleExtra("snowChains")}
              />
              ❄️ Catene da neve (+5€/giorno)
            </label>

            <button className="btn-primary" onClick={() => setStep(5)}>Avanti</button>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {step === 5 && (
          <div className="card">
            <h3>5️⃣ Riepilogo</h3>

            <p>📅 {days} giorni</p>
            <p>🛡 Assicurazione: {insurance}</p>
            <p>✈️ Aeroporto: {airportDelivery ? "Sì" : "No"}</p>

            <div className="total-box">
              <span>Totale</span> <span>{total}€</span>
            </div>

            <button className="btn-primary" onClick={handleSubmit}>
              Conferma & vai al pagamento →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
