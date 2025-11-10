export default function Reports({ openMenuButton, reports }) {
  return (
    <div className="section">
      {openMenuButton}
      <h2>Report</h2>
      {reports.map((r) => (
        <div key={r.id} className="report-card">
          <h3>{r.titolo}</h3>
          <p>{r.descrizione}</p>
          <small>{r.data}</small>
        </div>
      ))}
    </div>
  );
}
