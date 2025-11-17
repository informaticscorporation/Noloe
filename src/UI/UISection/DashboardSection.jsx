import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "../../UIX/DashboardSection.css";

export default function DashboardSection() {
  const [vehicles, setVehicles] = useState([]);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch dati
  const fetchVehicles = async () => {
    const { data } = await supabase.from("Vehicles").select("*");
    setVehicles(data || []);
  };

  const fetchPrenotazioni = async () => {
    const { data } = await supabase.from("Prenotazioni").select("*");
    setPrenotazioni(data || []);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("Users").select("*");
    setUsers(data || []);
  };

  useEffect(() => {
    fetchVehicles();
    fetchPrenotazioni();
    fetchUsers();
  }, []);

  // Statistiche principali
  const totalVehicles = vehicles.length;
  const totalPrenotazioni = prenotazioni.length;
  const totalUsers = users.length;

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-actions">
          <button className="btn-primary">Aggiungi veicolo</button>
          <button className="btn-secondary">Nuova prenotazione</button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Veicoli</h3>
          <p>{totalVehicles}</p>
        </div>
        <div className="stat-card">
          <h3>Prenotazioni</h3>
          <p>{totalPrenotazioni}</p>
        </div>
        <div className="stat-card">
          <h3>Clienti</h3>
          <p>{totalUsers}</p>
        </div>
      </div>

      <div className="dashboard-recent">
        <h3>Ultime prenotazioni</h3>
        <ul>
          {prenotazioni.slice(0, 5).map((p) => (
            <li key={p.id}>
              Veicolo: {p.veicolo_id} - Cliente: {p.cliente_id} - Check-in:{" "}
              {new Date(p.check_in).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
