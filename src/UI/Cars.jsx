import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { FiFilter } from "react-icons/fi";

export default function Cars({ openMenuButton, cars, setCars }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [editingCar, setEditingCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null); // {type: 'success'|'error', message: string}
  const [confirmDelete, setConfirmDelete] = useState(false); // gestione popup conferma

  const fileInputRef = useRef(null);

  const initialForm = {
    marca: "",
    modello: "",
    targa: "",
    numeroTelaio: "",
    alimentazione: "",
    cambio: "",
    porte: "",
    posti: "",
    categoria: "",
    serbatoio: "",
    prezzoGiornaliero: "",
    immaggineAuto: "",
    disponibilita: true,
    annoImmatricolazione: "",
    franchiggiaDanni: "",
    franchiggiaFurto: "",
    valoreDacquisto: "",
    valoreAttualeStimato: "",
    kmAttuali: "",
    numeroAssistenzaStradale: "",
    quantitaAuto: "",
    assicurazioneBasic: "",
    assicurazioneConfort: "",
    assicurazionePremium: "",
    assicurazioneSuperTotal: "",
    statoOlioMotore: "",
    statoLiquidoDiRaffredamento: "",
    statoLiquidoFreni: "",
    statoCarrozzeria: "",
    statoVetriSpecchietti: "",
    statoInterni: "",
    statoClimatizzazione: "",
    statoLuci: "",
    statoSospenzioni: "",
    prossimaManutenzione: "",
    inManutenzione: "",
    fornitoreOleasing: "",
    dataIngressoFlotta: "",
    dataDismissionePrevista: "",
    dataCreazione: "",
    ultimaModifica: "",
    creatoDa: "",
    modificatoDa: "",
    aziendaMacchina: "",
    immaggine: "",
    ultimoTagliano: "",
    scadenzaRevisione: "",
    assicurarione: "",
    ultimaPrenotazione: "",
    prenotazioneDal: "",
    prenotazioneAl: "",
    noteInterne: "",
    statoFreni: "",
    statoBatteriaElettrico: "",
  };

  const [form, setForm] = useState(initialForm);

  const numericFields = [
    "porte", "posti", "serbatoio", "prezzoGiornaliero", "annoImmatricolazione",
    "franchiggiaDanni", "franchiggiaFurto", "valoreDacquisto", "valoreAttualeStimato",
    "kmAttuali", "numeroAssistenzaStradale", "quantitaAuto",
    "assicurazioneBasic", "assicurazioneConfort", "assicurazionePremium", "assicurazioneSuperTotal"
  ];

  const openEditModal = (car) => {
    if (car) {
      setEditingCar(car);
      setForm(car);
      setPreviewImg(car.immaggineAuto || null);
    } else {
      setEditingCar(null);
      setForm(initialForm);
      setPreviewImg(null);
    }
    setIsOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewImg(URL.createObjectURL(file));
  };

  const showNotification = (type, message, duration = 3000) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), duration);
  };

  const handleSaveCar = async () => {
    try {
      setLoading(true);
      let publicUrl = form.immaggineAuto || "";
      const file = fileInputRef.current?.files[0];
      if (file) {
        if (form.immaggineAuto) {
          const path = form.immaggineAuto.split("/storage/v1/object/public/")[1];
          await supabase.storage.from("Archivio").remove([path]);
        }
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `Auto/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("Archivio").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("Archivio").getPublicUrl(filePath);
        publicUrl = publicUrlData.publicUrl;
      }

      const carData = { ...form, immaggineAuto: publicUrl };
      numericFields.forEach(f => carData[f] = form[f] ? parseFloat(form[f]) : null);

      let res;
      if (editingCar) {
        const { data, error } = await supabase.from("Macchine").update(carData).eq("id", editingCar.id).select();
        if (error) throw error;
        res = data[0];
        setCars(prev => prev.map(c => c.id === editingCar.id ? res : c));
        showNotification("success", "Auto modificata con successo!");
      } else {
        const { data, error } = await supabase.from("Macchine").insert([carData]).select();
        if (error) throw error;
        res = data[0];
        setCars(prev => [...prev, res]);
        showNotification("success", "Auto aggiunta con successo!");
      }

      setIsOpen(false);
      setLoading(false);
      setPreviewImg(null);
      setEditingCar(null);
    } catch (err) {
      console.error(err);
      showNotification("error", "Errore: " + (err.message || JSON.stringify(err)));
      setLoading(false);
    }
  };

  const handleDeleteCar = async () => {
    if (!editingCar) return;
    setConfirmDelete(true);
  };

  const confirmDeleteCar = async () => {
    try {
      setLoading(true);
      if (editingCar.immaggineAuto) {
        const path = editingCar.immaggineAuto.split("/storage/v1/object/public/")[1];
        await supabase.storage.from("Archivio").remove([path]);
      }
      await supabase.from("Macchine").delete().eq("id", editingCar.id);
      setCars(prev => prev.filter(c => c.id !== editingCar.id));
      setIsOpen(false);
      setLoading(false);
      setEditingCar(null);
      setConfirmDelete(false);
      showNotification("success", "Auto eliminata con successo!");
    } catch (err) {
      console.error(err);
      showNotification("error", "Errore durante eliminazione: " + (err.message || JSON.stringify(err)));
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const filteredCars = cars.filter(car =>
    Object.values(car).some(val =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="section">
      {openMenuButton}

      {/* Notifica */}
      {notification && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          padding: "12px 20px",
          backgroundColor: notification.type === "success" ? "#4caf50" : "#f44336",
          color: "#fff",
          borderRadius: "6px",
          zIndex: 9999,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
        }}>
          {notification.message}
        </div>
      )}

      {/* Popup conferma eliminazione */}
      {confirmDelete && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Conferma Eliminazione</h3>
            <p>Sei sicuro di voler eliminare questa auto?</p>
            <div className="popup-actions">
              <button className="red-btn" onClick={confirmDeleteCar} disabled={loading}>
                {loading ? "Eliminando..." : "Elimina"}
              </button>
              <button onClick={() => setConfirmDelete(false)}>Annulla</button>
            </div>
          </div>
        </div>
      )}

      <div className="cars-header">
        <h2>Gestione Auto</h2>
        <button className="green-btn" onClick={() => openEditModal(null)}>+ Aggiungi Auto</button>
      </div>

      {/* Filtro globale */}
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <FiFilter />
        <input
          type="text"
          placeholder="Cerca in tutte le colonne..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
        />
      </div>

      {/* Tabella */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {["ID","Marca","Modello","Targa","QuantitaAuto","PrezzoGiornaliero","Disponibilita",
                "KM Attuali","Carburante","AssicurazioneBasic","AssicurazioneConfort","AssicurazionePremium",
                "AssicurazioneSuperTotal","UltimaPrenotazione","DataCreazione","UltimaModifica","ImmagineAuto"]
                .map(col => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredCars.map(car => (
              <tr key={car.id} onClick={() => openEditModal(car)} style={{ cursor: "pointer" }}>
                <td>{car.id}</td>
                <td>{car.marca}</td>
                <td>{car.modello}</td>
                <td>{car.targa}</td>
                <td>{car.quantitaAuto}</td>
                <td>{car.prezzoGiornaliero}</td>
                <td>{car.disponibilita ? "✔️" : "❌"}</td>
                <td>{car.kmAttuali}</td>
                <td>{car.serbatoio}</td>
                <td>{car.assicurazioneBasic}</td>
                <td>{car.assicurazioneConfort}</td>
                <td>{car.assicurazionePremium}</td>
                <td>{car.assicurazioneSuperTotal}</td>
                <td>{car.ultimaPrenotazione || "-"}</td>
                <td>{car.dataCreazione || "-"}</td>
                <td>{car.ultimaModifica || "-"}</td>
                <td>{car.immaggineAuto && <img src={car.immaggineAuto} alt="auto" style={{ width: 80 }} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modifica / Aggiungi */}
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{editingCar ? "Modifica Auto" : "Aggiungi Nuova Auto"}</h3>
            <div className="popup-form">
              {Object.keys(form).map(key => {
                if (key === "disponibilita") {
                  return <label key={key}>{key}<input type="checkbox" name={key} checked={form[key]} onChange={handleChange} /></label>;
                } else if (numericFields.includes(key)) {
                  return <label key={key}>{key}<input type="number" name={key} value={form[key]} onChange={handleChange} /></label>;
                } else if (key === "immaggineAuto") {
                  return <label key={key}>{key}
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
                    {previewImg && <img src={previewImg} alt="preview" style={{ width: "100%", maxHeight: "200px", objectFit: "contain", marginTop: 10 }} />}
                  </label>;
                } else {
                  return <label key={key}>{key}<input type="text" name={key} value={form[key]} onChange={handleChange} /></label>;
                }
              })}
            </div>
            <div className="popup-actions">
              {editingCar && <button className="red-btn" onClick={handleDeleteCar} disabled={loading}>{loading ? "Eliminando..." : "Elimina Auto"}</button>}
              <button className="green-btn" onClick={handleSaveCar} disabled={loading}>{loading ? "Caricamento..." : "Salva Auto"}</button>
              <button onClick={() => setIsOpen(false)}>Chiudi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
