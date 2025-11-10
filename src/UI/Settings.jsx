export default function Settings({ openMenuButton, settings, setSettings }) {
  const handleToggleTheme = () => {
    setSettings((prev) => ({ ...prev, tema: prev.tema === "Chiaro" ? "Scuro" : "Chiaro" }));
  };

  return (
    <div className="section">
      {openMenuButton}
      <h2>Impostazioni</h2>
      <div className="settings-box">
        <p><strong>Nome Azienda:</strong> {settings.nomeAzienda}</p>
        <p><strong>Email:</strong> {settings.email}</p>
        <p><strong>Tema:</strong> {settings.tema}</p>
        <button className="green-btn" onClick={handleToggleTheme}>Cambia Tema</button>
      </div>
    </div>
  );
}
