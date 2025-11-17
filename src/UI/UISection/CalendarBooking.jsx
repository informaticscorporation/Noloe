import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import "../../UIX/CalendarBooking.css";

export default function CalendarBooking() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [highlightedBookingIds, setHighlightedBookingIds] = useState(new Set());

  const HIGHLIGHT_COLOR = "#4da6ff"; // colore unico per tutte le prenotazioni

  useEffect(() => {
    async function fetchData() {
      const { data: bookingsData } = await supabase.from("Prenotazioni").select("*");
      const { data: vehiclesData } = await supabase.from("Vehicles").select("*");
      setBookings(bookingsData || []);
      setVehicles(vehiclesData || []);
    }
    fetchData();
  }, []);

  const parseDateOnly = (datetimeStr) => {
    if (!datetimeStr) return null;
    const d = new Date(datetimeStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDateRangeKeys = (start, end) => {
    const keys = [];
    let d = new Date(start);
    while (d <= end) {
      keys.push(formatDateKey(d));
      d.setDate(d.getDate() + 1);
    }
    return keys;
  };

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const filteredBookings = useMemo(() => {
    if (!selectedVehicle) return bookings;
    return bookings.filter((b) => String(b.veicolo_id) === String(selectedVehicle));
  }, [bookings, selectedVehicle]);

  const highlightedMap = useMemo(() => {
    const map = {};
    highlightedBookingIds.forEach((bid) => {
      const b = bookings.find((x) => String(x.id) === String(bid));
      if (!b) return;
      let start = parseDateOnly(b.check_in);
      let end = parseDateOnly(b.check_out);
      if (!start || !end) return;
      if (start > end) [start, end] = [end, start];
      getDateRangeKeys(start, end).forEach((k) => {
        if (!map[k]) map[k] = [];
        map[k].push({
          bookingId: b.id,
          color: HIGHLIGHT_COLOR,
          OraCheckin: b.OraCheckin,
          OraCheckOut: b.OraCheckOut
        });
      });
    });
    return map;
  }, [highlightedBookingIds, bookings]);

  const monthNames = [
    "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
    "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"
  ];

 const renderDays = () => {
  const days = [];
  const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();

  for (let i = 1; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
    const key = formatDateKey(date);
    const dots = highlightedMap[key] || [];

    // Se c'è almeno una prenotazione selezionata su questo giorno, coloriamo il giorno
    const isHighlighted = dots.length > 0;
    const dayStyle = isHighlighted ? { backgroundColor: HIGHLIGHT_COLOR, color: "#fff" } : {};

    days.push(
      <div key={key} className="calendar-day" style={dayStyle}>
        <span>{d}</span>
      </div>
    );
  }

  return days;
};

  const renderEventList = () => {
    const list = selectedVehicle ? filteredBookings : bookings;

    return (
      <div className="event-panel">
        <h3>{selectedVehicle ? `Prenotazioni veicolo ${selectedVehicle}` : "Tutte le prenotazioni"}</h3>
        {list.length === 0 && <p>Nessuna prenotazione.</p>}

        {list.map((b) => {
          const isHigh = highlightedBookingIds.has(String(b.id));
          return (
            <div key={b.id} className="booking-card">
              <div className="booking-title">
                <strong>{b.id}</strong>
              </div>
              <div className="booking-info">
                <p><strong>Check-in:</strong> {b.check_in} {b.OraCheckin}</p>
                <p><strong>Check-out:</strong> {b.check_out} {b.OraCheckOut}</p>
                <p><strong>Stato:</strong> {b.stato}</p>
              </div>
              <button
                className={`show-btn ${isHigh ? "active" : ""}`}
                onClick={() => {
                  setHighlightedBookingIds((prev) => {
                    const copy = new Set(prev);
                    const id = String(b.id);
                    if (copy.has(id)) copy.delete(id);
                    else copy.add(id);
                    return copy;
                  });
                }}
              >
                {isHigh ? "Nascondi sul calendario" : "Mostra sul calendario"}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="calendar-section">
      <h2>Calendario Prenotazioni</h2>

      <label className="vehicle-select">
        Veicolo:
        <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
          <option value="">Tutti i veicoli</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.modello || ""} {v.targa || ""} ({v.id})
            </option>
          ))}
        </select>
      </label>

      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-grid">{renderDays()}</div>
      {renderEventList()}
    </div>
  );
}
