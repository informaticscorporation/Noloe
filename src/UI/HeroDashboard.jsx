import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import "../UIX/Dashboard.css";
import { supabase } from "../supabaseClient";

import Cars from "./Cars";
import Clients from "./Clients";
import Bookings from "./Bookings";
import Payments from "./Payments";
import Calendar from "./Calendar";
import Reports from "./Reports";
import Settings from "./Settings";

export default function HeroDashboard({ menuOpen, setMobileMenuOpen }) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const width = window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  })
 

  const openMenuButton = mobile ? (
    <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
      <Menu size={24} /> Apri Menu
    </button>
  ) : null;

  /* ======== STATE CONDIVISI ======== */
 const [cars, setCars] = useState([]);
 useEffect(() => {
    const dati = supabase.from("Macchine")
    .select("*")
    .then(({ data, error }) => {
      if (error) {
        console.error(error);
      } else {
        
        setCars(data);
      }
    })
  }, []);

  const [clients, setClients] = useState([]);
  useEffect(() => {
    const dati = supabase.from("Users")
    .select("*")
    .then(({ data, error }) => {
      if (error) {
        console.error(error);
      } else {
        
        setClients(data);
      }
    })
  }, []);

 
  const [bookings, setBookings] = useState([
    { id: 1, cliente: "Mario Rossi", auto: "Fiat Panda", data: "2025-11-01", stato: "Confermato" },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, cliente: "Mario Rossi", importo: 120, metodo: "Carta di credito", stato: "Completato" },
  ]);

  const reports = [
    { id: 1, titolo: "Report Mensile", descrizione: "Statistiche del mese di Ottobre 2025", data: "2025-10-31" },
    { id: 2, titolo: "Analisi Utilizzo Auto", descrizione: "Analisi tasso di utilizzo e guasti", data: "2025-10-20" },
  ];

  const [settings, setSettings] = useState({
    nomeAzienda: "Autonoleggi Rossi",
    email: "info@autonoleggiorossi.it",
    tema: "Chiaro",
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({
    "2025-11-01": ["Prenotazione: Mario Rossi - Fiat Panda"],
  });

  /* ======== RENDER COMPONENTI ======== */
  const renderContent = () => {
    switch (menuOpen) {
      
      case "cars":
        return <Cars openMenuButton={openMenuButton} cars={cars} setCars={setCars} />;
      case "clients":
        return <Clients openMenuButton={openMenuButton} clients={clients} setClients={setClients} />;
      case "bookings":
        return <Bookings openMenuButton={openMenuButton} bookings={bookings} setBookings={setBookings} />;
      case "payments":
        return <Payments openMenuButton={openMenuButton} payments={payments} setPayments={setPayments} />;
      case "calendar":
        return <Calendar openMenuButton={openMenuButton} currentDate={currentDate} setCurrentDate={setCurrentDate} selectedDate={selectedDate} setSelectedDate={setSelectedDate} events={events} setEvents={setEvents} />;
      case "reports":
        return <Reports openMenuButton={openMenuButton} reports={reports} />;
      case "settings":
        return <Settings openMenuButton={openMenuButton} settings={settings} setSettings={setSettings} />;
      default:
        return <div className="section">{openMenuButton}<h2>Seleziona una sezione dal menu</h2></div>;
    }
  };

  return <div className="hero-dashboard-container">
  
   
    {renderContent()}</div>;
}
