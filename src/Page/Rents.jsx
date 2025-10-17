import { useState, useEffect, useRef } from "react";
import { Filter, Car, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../UIX/Rents.css";

// --- COMPONENTE ANIMAZIONE ---
function AnimatedCard({ children, index = 0, from = "bottom", delay = 0.2 }) {
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const transformMap = {
    bottom: "translateY(30px)",
    top: "translateY(-30px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transformMap[from],
        transition: `opacity 0.6s ease ${index * delay}s, transform 0.6s ease ${
          index * delay
        }s`,
      }}
    >
      {children}
    </div>
  );
}

// --- COMPONENTE PRINCIPALE ---
export default function Rents() {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    price: "",
    category: "",
    available: "",
  });

  const carCollection = [
    { name: "BMW X5", img: "https://pngimg.com/d/bmw_PNG99543.png", price: "$120/day", category: "SUV", available: true },
    { name: "Audi A6", img: "https://www.pngarts.com/files/11/Audi-A6-PNG-High-Quality-Image.png", price: "$100/day", category: "Berlina", available: false },
    { name: "Tesla Model 3", img: "https://www.pngarts.com/files/11/Tesla-Model-S-PNG-Image-Background.png", price: "$150/day", category: "Elettrica", available: true },
    { name: "Ford Mustang", img: "https://www.pngarts.com/files/3/Ford-Mustang-PNG-High-Quality-Image.png", price: "$140/day", category: "Sportiva", available: true },
  ];

  // Moltiplica le auto per riempire la pagina
  const cars = Array(3).fill(null).flatMap(() => carCollection);

  const filteredCars = cars.filter(
    (car) =>
      (filters.name === "" ||
        car.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.price === "" || car.price.includes(filters.price)) &&
      (filters.category === "" ||
        car.category.toLowerCase().includes(filters.category.toLowerCase())) &&
      (filters.available === "" ||
        (filters.available === "yes" && car.available) ||
        (filters.available === "no" && !car.available))
  );

  return (
    <div className="rents-container">
      {/* Header */}
      <div className="rents-header">
        <div className="rents-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1>
            <Car size={26} /> Auto disponibili
          </h1>
        </div>

        <button
          className="filter-btn"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? <X className="close-filter" size={18} color="green" /> : <Filter size={18} color="green" hover="white" />}
          {showFilter ? "Chiudi Filtri" : "Filtra"}
        </button>
      </div>

      {/* Filtri */}
      {showFilter && (
        <div className="filters">
          <div className="filter-group">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Cerca per nome"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Prezzo</label>
            <input
              type="text"
              placeholder="es. $100"
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Categoria</label>
            <input
              type="text"
              placeholder="SUV, Sportiva..."
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            />
          </div>

          <div className="filter-group">
            <label>Disponibilità</label>
            <select
              value={filters.available}
              onChange={(e) =>
                setFilters({ ...filters, available: e.target.value })
              }
            >
              <option value="">Tutte</option>
              <option value="yes">Disponibili</option>
              <option value="no">Non disponibili</option>
            </select>
          </div>
        </div>
      )}

      {/* Lista Auto */}
      <div className="cars-grid">
        {filteredCars.map((car, i) => (
          <AnimatedCard key={i} index={i} from={i % 2 === 0 ? "left" : "right"}>
            <div className="car-card" onClick={() => navigate("/rents/teslamodel3")}
>
              <img className="car-image" src={car.img} alt={car.name} />
              <div className="car-info">
                <h3>{car.name}</h3>
                <p className="price">{car.price}</p>
                <p
                  className="availability"
                  style={{
                    color: car.available ? "#00b894" : "#d63031",
                    fontWeight: 600,
                    marginTop: "6px",
                  }}
                >
                  {car.available ? "Disponibile" : "Non disponibile"}


                </p>
              </div>
            </div>
          </AnimatedCard>
        ))}

        {filteredCars.length === 0 && (
          <p className="no-results">Nessuna auto trovata 😔</p>
        )}
      </div>
    </div>
  );
}
