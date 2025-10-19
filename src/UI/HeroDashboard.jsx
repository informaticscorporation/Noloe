import { useState } from "react";
import "../UIX/Dashboard.css";

export default function HeroDashboard({ menuOpen }) {
  // Stato condiviso per il calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({
    "2025-10-20": ["Prenotazione: Mario Rossi - Fiat Panda"],
  });

  // Funzioni per il calendario
  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleAddEvent = () => {
    const text = prompt("Aggiungi prenotazione:");
    if (!text) return;
    const key = selectedDate.toISOString().split("T")[0];
    setEvents((prev) => ({
      ...prev,
      [key]: prev[key] ? [...prev[key], text] : [text],
    }));
  };

  const renderDays = () => {
    const days = [];
    const startDay = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
    const totalCells = daysInMonth + startDay - 1;

    for (let i = 1; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      const key = date.toISOString().split("T")[0];
      const hasEvent = events[key];
      const isSelected =
        selectedDate &&
        date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={d}
          className={`calendar-day ${isSelected ? "selected" : ""} ${
            hasEvent ? "has-event" : ""
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <span>{d}</span>
          {hasEvent && <div className="dot"></div>}
        </div>
      );
    }

    return days;
  };

  const renderEventList = () => {
    if (!selectedDate) return <p>Seleziona un giorno per visualizzare le prenotazioni.</p>;
    const key = selectedDate.toISOString().split("T")[0];
    const dayEvents = events[key] || [];
    return (
      <div className="event-panel">
        <h3>{selectedDate.toLocaleDateString("it-IT")}</h3>
        {dayEvents.length === 0 ? (
          <p>Nessuna prenotazione.</p>
        ) : (
          <ul>
            {dayEvents.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        )}
        <button className="green-btn" onClick={handleAddEvent}>+ Aggiungi</button>
      </div>
    );
  };

  // Contenuto dinamico per ciascuna sezione
  const renderContent = () => {
    switch (menuOpen) {
      case "dashboard":
        return (
          <div className="section">
            <h2>Benvenuto nella Dashboard</h2>
            <p>Qui potrai avere una panoramica generale della tua attività di autonoleggio.</p>
          </div>
        );
      case "cars":
        return (
          <div className="section">
            <h2>Gestione Auto</h2>
            <p>Visualizza, aggiungi e modifica i veicoli disponibili al noleggio.</p>
          </div>
        );
      case "bookings":
        return (
          <div className="section">
            <h2>Gestione Prenotazioni</h2>
            <p>Controlla le prenotazioni attive e passate, gestisci i clienti e i veicoli associati.</p>
          </div>
        );
      case "clients":
        return (
          <div className="section">
            <h2>Gestione Clienti</h2>
            <p>Consulta l’anagrafica dei clienti e le loro prenotazioni.</p>
          </div>
        );
      case "payments":
        return (
          <div className="section">
            <h2>Gestione Pagamenti</h2>
            <p>Monitora i pagamenti in sospeso, completati e le transazioni giornaliere.</p>
          </div>
        );
      case "calendar":
        return (
          <div className="section calendar-section">
            <h2>Calendario Prenotazioni</h2>
            <div className="calendar-header">
              <button onClick={prevMonth}>◀</button>
              <h3>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button onClick={nextMonth}>▶</button>
            </div>
            <div className="calendar-grid">{renderDays()}</div>
            {renderEventList()}
          </div>
        );
      case "reports":
        return (
          <div className="section">
            <h2>Report e Statistiche</h2>
            <p>Visualizza i dati statistici delle prenotazioni, guadagni e performance.</p>
          </div>
        );
      case "settings":
        return (
          <div className="section">
            <h2>Impostazioni del Sistema</h2>
            <p>Configura le opzioni del gestionale e le impostazioni utente.</p>
          </div>
        );
      default:
        return (
          <div className="section">
            <h2>Seleziona una sezione dal menu</h2>
          </div>
        );
    }
  };

  return <div className="hero-dashboard-container">{renderContent()}</div>;
}
