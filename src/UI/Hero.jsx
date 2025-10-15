import { Car, MapPin, CalendarDays, Star, Smartphone, ShieldCheck, DollarSign, } from "lucide-react";
import "../UIX/Hero.css";

export default function Hero({ menuOpen, setMenuOpen }) {
  const closeMenu = () => setMenuOpen(false);

 const brands = [
  { name: "BMW", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" alt="BMW" width={35} /> },
  { name: "Audi", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/1199px-Audi-Logo_2016.svg.png" alt="Audi" width={35} /> },
  { name: "Tesla", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" alt="Tesla" width={35} /> },
  { name: "Ford", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" alt="Ford" width={35} /> },
  { name: "Mercedes", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" alt="Mercedes" width={35} /> },
  { name: "Kia", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia-logo.png/1200px-Kia-logo.png" alt="Kia" width={35} /> },
];


const bodyTypes = [
  { name: "SUV", icon: <Car size={35} /> },
  { name: "Sedan", icon: <Car size={35} /> },
  { name: "Coupe", icon: <Car size={35} /> },
  { name: "Convertible", icon: <Car size={35} /> },
  { name: "Hatchback", icon: <Car size={35} /> },
  { name: "Sport", icon: <Car size={35} /> },
  { name: "Electric", icon: <Car size={35} /> },
];

  return (
    <div className="hero-container">
      {/* MENU SLIDE */}
      <div className={`menu-popup ${menuOpen ? "show" : ""}`}>
        <ul>
          <li onClick={closeMenu}>Home</li>
          <li onClick={closeMenu}>Servizi</li>
          <li onClick={closeMenu}>Flotta</li>
          <li onClick={closeMenu}>Contatti</li>
        </ul>
      </div>

      <div className="separatore">

      </div>

      {/* --- HERO --- */}
      <section className="hero-wrapper">
        <h1 className="hero-title">
          Discover the world on wheels <br />
          with our <span className="highlight">luxury car rental</span>
        </h1>

        <div className="hero-image">
          <img src="https://pngimg.com/d/bmw_PNG99543.png" alt="Car" />
        </div>

        <div className="hero-search">
            <div className="search-grid">
              <div className="search-item">
                <label><MapPin size={16} /> Pick-up Location</label>
                <input type="text" placeholder="Search a location" />
              </div>
              <div className="search-item">
                <label><CalendarDays size={16} /> Pick-up Date</label>
                <input type="date" />
              </div>
              <div className="search-item">
                <label><MapPin size={16} /> Drop-off Location</label>
                <input type="text" placeholder="Search a location" />
              </div>
              <div className="search-item">
                <label><CalendarDays size={16} /> Drop-off Date</label>
                <input type="date" />
              </div>
               <button className="find-btn">Find a Vehicle</button>
            </div>
          
         
        </div>
      </section>

      {/* --- RENT BY BRANDS --- */}
      <section className="brands-section">
        <h2>Rent by Brands</h2>
        <div className="brands-grid">
          {brands.map((b) => (
            <div key={b.name} className="brand-card">
              {b.icon}
              <p>{b.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- BODY TYPE --- */}
      <section className="bodytype-section">
        <h2>Rent by Body Type</h2>
        <div className="bodytype-grid">
          {bodyTypes.map((t) => (
            <div key={t.name} className="bodytype-card">
              {t.icon}
              <p>{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    
      {/* --- CAR COLLECTION --- */}
 <section className="collection-section">
  <h2 className="collection-title">Our Impressive Collection of Cars</h2>
  <p className="collection-subtitle">
    Ranging from elegant sedans to powerful sports cars, all carefully selected to provide our
    customers with the ultimate driving experience.
  </p>

  <div className="collection-filters">
    {["Popular Car", "Luxury Car", "Vintage Car", "Family Car", "Off-Road Car"].map((filter) => (
      <button  key={filter} className="filter-btn">{filter}</button>
    ))}
  </div>

  <div className="car-grid">
    {[
      { name: "BMW X5", img: "https://pngimg.com/d/bmw_PNG99543.png", price: "$120/day" },
      { name: "Audi A6", img: "https://www.pngarts.com/files/11/Audi-A6-PNG-High-Quality-Image.png", price: "$100/day" },
      { name: "Tesla Model 3", img: "https://www.pngarts.com/files/11/Tesla-Model-S-PNG-Image-Background.png", price: "$150/day" },
      { name: "Ford Mustang", img: "https://www.pngarts.com/files/3/Ford-Mustang-PNG-High-Quality-Image.png", price: "$140/day" },
    ].map((car) => (
      <div key={car.name} className="car-card">
        <img src={car.img} alt={car.name} />
        <h3>{car.name}</h3>
        <p className="price">{car.price}</p>

        <div className="specs">
          <span>🚗 Auto</span>
          <span>👨‍👩‍👦 4 Person</span>
          <span>⚡ Electric</span>
        </div>

        <button className="rent-btn">Rent Now</button>
      </div>
    ))}
  </div>

  <div className="see-all-container">
    <button className="see-all-btn">See all Cars</button>
  </div>
</section>


      {/* --- HOW IT WORKS --- */}
      <section className="how-section">
        <h2>How it Works</h2>
        <div className="how-grid">
          <div className="how-card">
            <MapPin size={32} />
            <h3>Choose Location</h3>
            <p>Select where you want to pick up and drop off your car.</p>
          </div>
          <div className="how-card">
            <CalendarDays size={32} />
            <h3>Select Dates</h3>
            <p>Pick your rental start and end dates in seconds.</p>
          </div>
          <div className="how-card">
            <Car size={32} />
            <h3>Enjoy the Drive</h3>
            <p>Drive in comfort and style with premium vehicles.</p>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section className="services-section">
        <h2>Why Choose Us</h2>
        <div className="service-grid">
          <div className="service-card">
            <ShieldCheck size={32} />
            <h3>Trusted Service</h3>
            <p>Professional assistance and 24/7 support.</p>
          </div>
          <div className="service-card">
            <DollarSign size={32} />
            <h3>Transparent Pricing</h3>
            <p>No hidden costs, pay only what you see.</p>
          </div>
          <div className="service-card">
            <Smartphone size={32} />
            <h3>Book Anywhere</h3>
            <p>Our app makes booking fast and convenient.</p>
          </div>
        </div>
      </section>

     

      {/* --- FOOTER --- */}
      <footer className="footer">
        <p className="footer-text">© 2025 Luxedrive. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
