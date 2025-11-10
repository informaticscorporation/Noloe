export default function Cars({ openMenuButton, cars, setCars }) {
  const handleAddCar = () => {
    const modello = prompt("Modello auto:");
    const targa = prompt("Targa:");
    if (!modello || !targa) return;
    setCars([...cars, { id: Date.now(), modello, targa, stato: "Disponibile" }]);
  };

  return (
    <div className="section">
      {openMenuButton}
      <div className="cars-header">
        <h2>Gestione Auto</h2>
        <button className="green-btn" onClick={handleAddCar}>+ Aggiungi Auto</button>
      </div>

      <table className="data-table">
        <thead>
          <tr><th>Modello</th><th>Targa</th><th>Stato</th></tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.modello}</td>
              <td>{car.targa}</td>
              <td><span className={`status-badge ${car.stato.toLowerCase()}`}>{car.stato}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
