import { useState } from "react";

export default function CalendarioInterno() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notesMap, setNotesMap] = useState({}); // key: "YYYY-MM-DD" -> note
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();

  const monthNames = [
    "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
    "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"
  ];

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDayClick = (date) => {
    const key = formatDateKey(date);
    setSelectedDate(key);
    setNoteInput(notesMap[key] || "");
  };

  const handleSaveNote = () => {
    if (!selectedDate) return;
    setNotesMap((prev) => ({ ...prev, [selectedDate]: noteInput }));
    setSelectedDate(null);
    setNoteInput("");
  };

  const renderDays = () => {
    const days = [];
    const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();

    for (let i = 1; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      const key = formatDateKey(date);
      const noteExists = notesMap[key];
      const isSelected = selectedDate === key;

      days.push(
        <div
          key={key}
          onClick={() => handleDayClick(date)}
          className="calendar-day"
          style={{
            backgroundColor: isSelected ? "#4da6ff" : noteExists ? "#ffe599" : "#f9fafb",
            color: isSelected ? "#fff" : "#000"
          }}
        >
          <span>{d}</span>
          {noteExists && !isSelected && <span style={{ fontSize: 10 }}>📝</span>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-section">
      <h2>Calendario Note</h2>

      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-grid">{renderDays()}</div>

      {selectedDate && (
        <div className="event-panel">
          <h4>Nota per {selectedDate}</h4>
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            rows={4}
            style={{ width: "100%", borderRadius: 6, padding: 4 }}
          />
          <button
            onClick={handleSaveNote}
            className="show-btn"
            style={{ marginTop: 8 }}
          >
            Salva Nota
          </button>
        </div>
      )}
    </div>
  );
}
