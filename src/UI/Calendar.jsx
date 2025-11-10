export default function Calendar({ openMenuButton, currentDate, setCurrentDate, selectedDate, setSelectedDate, events, setEvents }) {
  const monthNames = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleAddEvent = () => {
    const text = prompt("Aggiungi prenotazione:");
    if (!text || !selectedDate) return;
    const key = selectedDate.toISOString().split("T")[0];
    setEvents((prev) => ({ ...prev, [key]: prev[key] ? [...prev[key], text] : [text] }));
  };

  const renderDays = () => {
    const days = [];
    const startDay = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
    for (let i = 1; i < startDay; i++) days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      const key = date.toISOString().split("T")[0];
      const hasEvent = events[key];
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      days.push(
        <div key={d} className={`calendar-day ${isSelected ? "selected" : ""} ${hasEvent ? "has-event" : ""}`} onClick={() => setSelectedDate(date)}>
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
        {dayEvents.length === 0 ? <p>Nessuna prenotazione.</p> : <ul>{dayEvents.map((ev,i) => <li key={i}>{ev}</li>)}</ul>}
        <button className="green-btn" onClick={handleAddEvent}>+ Aggiungi</button>
      </div>
    );
  };

  return (
    <div className="section calendar-section">
      {openMenuButton}
      <h2>Calendario Prenotazioni</h2>
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
