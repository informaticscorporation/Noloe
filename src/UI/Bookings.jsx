export default function Bookings({ openMenuButton, bookings, setBookings }) {
  const handleAddBooking = () => {
    const cliente = prompt("Nome cliente:");
    const auto = prompt("Modello auto:");
    const data = prompt("Data (YYYY-MM-DD):");
    if (!cliente || !auto || !data) return;
    setBookings([...bookings, { id: Date.now(), cliente, auto, data, stato: "In Attesa" }]);
  };

  return (
    <div className="section">
      {openMenuButton}
      <h2>Prenotazioni</h2>
      <button className="green-btn" onClick={handleAddBooking}>+ Nuova Prenotazione</button>
      <table className="data-table">
        <thead><tr><th>Cliente</th><th>Auto</th><th>Data</th><th>Stato</th></tr></thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.cliente}</td>
              <td>{b.auto}</td>
              <td>{b.data}</td>
              <td><span className="status-badge disponibile">{b.stato}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
