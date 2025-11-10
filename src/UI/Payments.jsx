export default function Payments({ openMenuButton, payments, setPayments }) {
  const handleAddPayment = () => {
    const cliente = prompt("Nome cliente:");
    const importo = prompt("Importo (€):");
    const metodo = prompt("Metodo di pagamento:");
    if (!cliente || !importo) return;
    setPayments([...payments, { id: Date.now(), cliente, importo, metodo, stato: "In Elaborazione" }]);
  };

  return (
    <div className="section">
      {openMenuButton}
      <h2>Pagamenti</h2>
      <button className="green-btn" onClick={handleAddPayment}>+ Aggiungi Pagamento</button>
      <table className="data-table">
        <thead><tr><th>Cliente</th><th>Importo (€)</th><th>Metodo</th><th>Stato</th></tr></thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.cliente}</td>
              <td>{p.importo}</td>
              <td>{p.metodo}</td>
              <td><span className="status-badge disponibile">{p.stato}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
