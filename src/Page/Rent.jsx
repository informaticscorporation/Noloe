import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, CarFront, Gauge, Users, Fuel, Settings } from "lucide-react";
import "../UIX/Rent.css";

// --- COMPONENTE ANIMAZIONE ---
function AnimatedSection({ children, from = "bottom", delay = 0.2 }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const transformMap = {
    bottom: "translateY(40px)",
    top: "translateY(-40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transformMap[from],
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// --- COMPONENTE PRINCIPALE ---
export default function Rent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const cars = [
    {
      id: "bmw-x5",
      name: "BMW X5",
      img: "https://pngimg.com/d/bmw_PNG99543.png",
      price: "€120/giorno",
      category: "SUV",
      available: true,
      description:
        "Potente SUV con comfort di lusso e prestazioni elevate, perfetto per lunghi viaggi o noleggi premium.",
      details: {
        motore: "3.0L Turbo",
        posti: 5,
        porte: 5,
        carburante: "Diesel",
        cambio: "Automatico",
        anno: 2023,
        km: "15.000 km",
        colore: "Nero metallizzato",
      },
      optional: ["Navigatore GPS", "Bluetooth", "Sensori di parcheggio", "Telecamera posteriore"],
      sicurezza: ["Airbag frontali e laterali", "ABS", "Controllo stabilità"],
      tecnologia: ["Display touch 12\"", "Apple CarPlay", "Android Auto"],
      comfort: ["Climatizzatore automatico", "Sedili riscaldati", "Interni in pelle"],
    },
    {
      id: "audi-a6",
      name: "Audi A6",
      img: "https://www.pngarts.com/files/11/Audi-A6-PNG-High-Quality-Image.png",
      price: "€100/giorno",
      category: "Berlina",
      available: false,
      description:
        "Elegante berlina tedesca, ideale per viaggi d'affari e spostamenti confortevoli.",
      details: {
        motore: "2.0L TFSI",
        posti: 5,
        porte: 4,
        carburante: "Benzina",
        cambio: "Automatico",
        anno: 2022,
        km: "22.000 km",
        colore: "Grigio chiaro",
      },
      optional: ["Navigatore GPS", "Bluetooth", "Sensori di parcheggio"],
      sicurezza: ["Airbag frontali e laterali", "ABS"],
      tecnologia: ["Display touch 10\"", "Apple CarPlay"],
      comfort: ["Climatizzatore automatico", "Sedili riscaldati"],
    },
    {
      id: "teslamodel3",
      name: "Tesla Model 3",
      img: "https://www.pngarts.com/files/11/Tesla-Model-S-PNG-Image-Background.png",
      price: "€150/giorno",
      category: "Elettrica",
      available: true,
      description:
        "Auto elettrica con autonomia estesa, tecnologia avanzata e prestazioni eccezionali.",
      details: {
        motore: "Dual Motor",
        posti: 5,
        porte: 4,
        carburante: "Elettrico",
        cambio: "Automatico",
        anno: 2023,
        km: "5.000 km",
        colore: "Bianco perla",
      },
      optional: ["Autopilot", "Bluetooth", "Telecamera posteriore"],
      sicurezza: ["Airbag frontali e laterali", "ABS", "Controllo stabilità"],
      tecnologia: ["Display touch 15\"", "Apple CarPlay", "Android Auto"],
      comfort: ["Climatizzatore automatico", "Sedili riscaldati"],
    },
    {
      id: "ford-mustang",
      name: "Ford Mustang",
      img: "https://www.pngarts.com/files/3/Ford-Mustang-PNG-High-Quality-Image.png",
      price: "€140/giorno",
      category: "Sportiva",
      available: true,
      description:
        "La leggendaria muscle car americana, potenza pura e design inconfondibile.",
      details: {
        motore: "5.0L V8",
        posti: 4,
        porte: 2,
        carburante: "Benzina",
        cambio: "Manuale",
        anno: 2021,
        km: "12.000 km",
        colore: "Rosso metallizzato",
      },
      optional: ["Bluetooth", "Sensori di parcheggio"],
      sicurezza: ["Airbag frontali e laterali", "ABS"],
      tecnologia: ["Display touch 8\"", "Apple CarPlay"],
      comfort: ["Climatizzatore manuale", "Sedili sportivi"],
    },
  ];

  const car = cars.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="rent-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h2>Auto non trovata 😔</h2>
      </div>
    );
  }

  return (
    <div className="rent-container">
      <div className="rent-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>
          <CarFront size={26} /> {car.name}
        </h1>
      </div>

      <AnimatedSection>
        <div className="rent-card">
          <img src={car.img} alt={car.name} className="rent-img" />

          <div className="rent-info">
            <h2>{car.name}</h2>
            <p className="rent-category">{car.category}</p>
            <p className="rent-desc">{car.description}</p>

            <div className="rent-section">
              <h3>Dettagli tecnici</h3>
              <div className="rent-details">
                <p><Gauge size={16} /> Motore: {car.details.motore}</p>
                <p><Users size={16} /> Posti: {car.details.posti}</p>
                <p><Users size={16} /> Porte: {car.details.porte}</p>
                <p><Fuel size={16} /> Carburante: {car.details.carburante}</p>
                <p><Settings size={16} /> Cambio: {car.details.cambio}</p>
                <p>Anno: {car.details.anno}</p>
                <p>Chilometri: {car.details.km}</p>
                <p>Colore: {car.details.colore}</p>
              </div>
            </div>

            {car.optional?.length > 0 && (
              <div className="rent-section">
                <h3>Optional & Comfort</h3>
                <ul>
                  {car.optional.map((opt, i) => <li key={i}>{opt}</li>)}
                </ul>
              </div>
            )}

           

            {car.sicurezza?.length > 0 && (
              <div className="rent-section">
                <h3>Sicurezza</h3>
                <ul>
                  {car.sicurezza.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            {car.tecnologia?.length > 0 && (
              <div className="rent-section">
                <h3>Tecnologia</h3>
                <ul>
                  {car.tecnologia.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            <p className="rent-price">{car.price}</p>

            <p
              className="rent-availability"
              style={{ color: car.available ? "#00b894" : "#d63031" }}
            >
              {car.available ? "Disponibile" : "Non disponibile"}
            </p>

            <button
              className={`rent-btn ${!car.available ? "disabled" : ""}`}
              disabled={!car.available}
              onClick={() => car.available && navigate(`/prenotation/${id}`)}
            >
              {car.available ? "Prenota ora" : "Non disponibile"}
            </button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
