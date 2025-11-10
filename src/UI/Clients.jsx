export default function Clients({ openMenuButton, clients, setClients }) {
  const handleAddClient = () => {
    const nome = prompt("Nome cliente:");
    const telefono = prompt("Telefono:");
    const email = prompt("Email:");
    if (!nome) return;
    setClients([...clients, { id: Date.now(), nome, telefono, email }]);
  };

  return (
    <div className="section">
      {openMenuButton}
      <h2>Clienti</h2>
      <button className="green-btn" onClick={handleAddClient}>+ Aggiungi Cliente</button>
      <table className="data-table">
        <thead><tr><th>Nome</th><th>Telefono</th><th>Email</th></tr></thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}><td>{c.nome}</td><td>{c.telefono}</td><td>{c.email}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
