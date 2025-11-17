import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "../../UIX/CarSection.css";
import { FiFilter } from "react-icons/fi";

export default function CarsSection() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [filters, setFilters] = useState({ marca: "", modello: "", categoria: "" });
  const [vehicles, setVehicles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const initialVehicleState = {
    id: "",
    immaggineauto: null,
    marca: "",
    modello: "",
    targa: "",
    colore: "",
    alimentazione: "",
    cambio: "",
    porte: "",
    kmattuali: "",
    prezzogiornaliero: "",
    valoreattualestimato: "",
    franchigia: "",
    numeroassistenzastradale: "",
    assicurazionebasic: "",
    assicurazioneconfort: "",
    assicurazionepremium: "",
    assicurazionesupertotal: "",
    ultimamanutenzione: "",
    prossimamanutenzione: "",
    ultimaprenotazione: "",
    inmanutenzione: false,
    dataingressoflotta: "",
    datadismissioneprevista: "",
    valoredacquisto: "",
    fornitoreoleasing: "",
    noteinterne: "",
    categoria: "",
    statofreni: "",
    statooliomotore: "",
    statoliquidodiraffredamento: "",
    statoliquidofreni: "",
    statocarrozzeria: "",
    statovetrispecchietti: "",
    statointerni: "",
    statoclimatizzazione: "",
    statoluci: "",
    statosospenzioni: ""
  };

  const [newVehicle, setNewVehicle] = useState(initialVehicleState);

  // ===== COMPONENTE INTERNO FormField =====
  const FormField = ({ label, type = "text", name, value, onChange, placeholder, options, accept }) => {
    if (type === "checkbox") {
      return (
        <label className="checkbox-label">
          <input type="checkbox" name={name} checked={value} onChange={onChange} />
          {label}
        </label>
      );
    }

    return (
      <div className="form-field">
        {label && <label htmlFor={name}>{label}</label>}
        {type === "select" ? (
          <select name={name} id={name} value={value} onChange={onChange}>
            {options?.map((opt, idx) => (
              <option key={idx} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            id={name}
            value={type !== "file" ? value : undefined}
            onChange={onChange}
            placeholder={placeholder}
            accept={accept}
          />
        )}
      </div>
    );
  };

  // ===== FETCH VEHICLES =====
  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("Vehicles")
      .select("*")
      .order("datacreazione", { ascending: false });
    if (error) console.log(error);
    else setVehicles(data || []);
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = vehicles.filter(
    (v) =>
      (filters.marca === "" || v.marca?.toLowerCase().includes(filters.marca.toLowerCase())) &&
      (filters.modello === "" || v.modello?.toLowerCase().includes(filters.modello.toLowerCase())) &&
      (filters.categoria === "" || v.categoria?.toLowerCase().includes(filters.categoria.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files) setNewVehicle({ ...newVehicle, [name]: files[0] });
    else setNewVehicle({ ...newVehicle, [name]: type === "checkbox" ? checked : value });
  };

  const generateVehicleId = () => {
    const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
    const numbers = Math.floor(100 + Math.random() * 900);
    return letters + numbers;
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSaveVehicle = async () => {
    let vehicleToInsert = { ...newVehicle };
    if (!vehicleToInsert.id) vehicleToInsert.id = generateVehicleId(); // nuovo veicolo

    const numericFields = [
      "porte","kmattuali","prezzogiornaliero","valoreattualestimato",
      "franchigia","numeroassistenzastradale","assicurazionebasic",
      "assicurazioneconfort","assicurazionepremium","assicurazionesupertotal",
      "valoredacquisto"
    ];
    numericFields.forEach(f => {
      if (vehicleToInsert[f] === "" || vehicleToInsert[f] === null) vehicleToInsert[f] = null;
      else vehicleToInsert[f] = Number(vehicleToInsert[f]);
    });

    const dateFields = [
      "ultimamanutenzione","prossimamanutenzione","ultimaprenotazione",
      "dataingressoflotta","datadismissioneprevista"
    ];
    dateFields.forEach(f => { if (!vehicleToInsert[f]) vehicleToInsert[f] = null; });

    if (vehicleToInsert.immaggineauto instanceof File) {
      const file = vehicleToInsert.immaggineauto;
      const extension = file.name.split(".").pop();
      const filePath = `${vehicleToInsert.id}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("Archivio/Auto").upload(filePath, file, { upsert: true });
      if (uploadError) console.log(uploadError);
      else vehicleToInsert.immaggineauto = filePath;
    }

    const { error } = vehicleToInsert.id && vehicles.some(v => v.id === vehicleToInsert.id)
      ? await supabase.from("Vehicles").update(vehicleToInsert).eq("id", vehicleToInsert.id) // modifica
      : await supabase.from("Vehicles").insert([vehicleToInsert]); // nuovo

    if (error) console.log(error);
    else {
      fetchVehicles();
      setPopupOpen(false);
      setNewVehicle(initialVehicleState);
      setCurrentStep(1);
    }
  };

  return (
    <div className="cars-section-container">
      {/* HEADER */}
      <div className="cars-header">
        <h1>Auto</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="btn-add" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter size={20} /> Filtri
          </button>
          <button className="btn-add" onClick={() => { setNewVehicle(initialVehicleState); setPopupOpen(true); }}>
            Aggiungi Auto
          </button>
        </div>
      </div>

      {/* FILTRI */}
      {showFilters && (
        <div className="cars-filters">
          <input type="text" name="marca" placeholder="Marca" onChange={handleFilterChange} />
          <input type="text" name="modello" placeholder="Modello" onChange={handleFilterChange} />
          <input type="text" name="categoria" placeholder="Categoria" onChange={handleFilterChange} />
        </div>
      )}

      {/* TABELLA */}
      <div className="cars-table-container">
        <table className="cars-table">
          <thead>
            <tr>
              <th>Immagine</th>
              <th>ID</th>
              <th>Marca</th>
              <th>Modello</th>
              <th>Targa</th>
              <th>Colore</th>
              <th>Alimentazione</th>
              <th>Cambio</th>
              <th>Prezzo</th>
              <th>Valore</th>
              <th>In Manut.</th>
              <th>Ult. Manut.</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((v) => (
              <tr
                key={v.id}
                className={newVehicle.id === v.id ? "selected" : ""}
                onClick={() => { setNewVehicle(v); setPopupOpen(true); setCurrentStep(1); }}
              >
                <td>
                  {v.immaggineauto ? <img src={`https://jurzdzkpkfxsoehfxgeg.supabase.co/storage/v1/object/public/Archivio/Auto/${v.immaggineauto}`} width={50} /> : "-"}
                </td>
                <td>{v.id}</td>
                <td>{v.marca}</td>
                <td>{v.modello}</td>
                <td>{v.targa}</td>
                <td>{v.colore}</td>
                <td>{v.alimentazione}</td>
                <td>{v.cambio}</td>
                <td>{v.prezzogiornaliero}</td>
                <td>{v.valoreattualestimato}</td>
                <td>{v.inmanutenzione ? "Sì" : "No"}</td>
                <td>{v.ultimamanutenzione}</td>
                <td>{v.categoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      {popupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={() => setPopupOpen(false)}>×</button>
            <h2>{newVehicle.id ? "Modifica Auto" : "Aggiungi Auto"}</h2>

             {/* STEP 1: immagine */}
      {currentStep === 1 && (
        <div className="form-step active">
          <div
            className={`custom-file-input ${dragOver ? "drag-over" : ""}`}
            onClick={() => document.getElementById("fileInput").click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleInputChange({ target: { name: "immaggineauto", files: e.dataTransfer.files } });
              }
            }}
          >
            {newVehicle.immaggineauto ? (
              <img
                src={
                  newVehicle.immaggineauto instanceof File
                    ? URL.createObjectURL(newVehicle.immaggineauto)
                    : `https://jurzdzkpkfxsoehfxgeg.supabase.co/storage/v1/object/public/Archivio/Auto/${newVehicle.immaggineauto}`
                }
                alt="Anteprima Auto"
              />
            ) : (
              <span>Clicca o trascina un'immagine qui</span>
            )}
            <input
              type="file"
              id="fileInput"
              name="immaggineauto"
              accept="image/*"
              onChange={handleInputChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      )}

      {/* STEP 2: dettagli base */}
      {currentStep === 2 && (
        <div className="form-step active">
          <FormField label="Marca" name="marca" value={newVehicle.marca} onChange={handleInputChange} />
          <FormField label="Modello" name="modello" value={newVehicle.modello} onChange={handleInputChange} />
          <FormField label="Targa" name="targa" value={newVehicle.targa} onChange={handleInputChange} />
          <FormField label="Colore" name="colore" value={newVehicle.colore} onChange={handleInputChange} />
          <FormField
            label="Alimentazione"
            type="select"
            name="alimentazione"
            value={newVehicle.alimentazione}
            onChange={handleInputChange}
            options={[
              { value: "", label: "Seleziona" },
              { value: "benzina", label: "Benzina" },
              { value: "diesel", label: "Diesel" },
              { value: "elettrico", label: "Elettrico" },
              { value: "ibrido", label: "Ibrido" }
            ]}
          />
          <FormField
            label="Cambio"
            type="select"
            name="cambio"
            value={newVehicle.cambio}
            onChange={handleInputChange}
            options={[
              { value: "", label: "Seleziona" },
              { value: "manuale", label: "Manuale" },
              { value: "automatico", label: "Automatico" }
            ]}
          />
        </div>
      )}

      {/* STEP 3: dettagli tecnici */}
      {currentStep === 3 && (
        <div className="form-step active">
          <FormField label="Porte" type="number" name="porte" value={newVehicle.porte} onChange={handleInputChange} />
          <FormField label="KM Attuali" type="number" name="kmattuali" value={newVehicle.kmattuali} onChange={handleInputChange} />
          <FormField label="Prezzo Giornaliero" type="number" name="prezzogiornaliero" value={newVehicle.prezzogiornaliero} onChange={handleInputChange} />
          <FormField label="Valore Attuale Stimato" type="number" name="valoreattualestimato" value={newVehicle.valoreattualestimato} onChange={handleInputChange} />
          <FormField label="Franchigia" type="number" name="franchigia" value={newVehicle.franchigia} onChange={handleInputChange} />
          <FormField label="Valore d'acquisto" type="number" name="valoredacquisto" value={newVehicle.valoredacquisto} onChange={handleInputChange} />
          <FormField label="In Manutenzione" type="checkbox" name="inmanutenzione" value={newVehicle.inmanutenzione} onChange={handleInputChange} />
        </div>
      )}

      {/* STEP 4: date e assicurazioni */}
      {currentStep === 4 && (
        <div className="form-step active">
          <FormField label="Ultima Manutenzione" type="date" name="ultimamanutenzione" value={newVehicle.ultimamanutenzione} onChange={handleInputChange} />
          <FormField label="Prossima Manutenzione" type="date" name="prossimamanutenzione" value={newVehicle.prossimamanutenzione} onChange={handleInputChange} />
          <FormField label="Ultima Prenotazione" type="date" name="ultimaprenotazione" value={newVehicle.ultimaprenotazione} onChange={handleInputChange} />
          <FormField label="Data Ingresso Flotta" type="date" name="dataingressoflotta" value={newVehicle.dataingressoflotta} onChange={handleInputChange} />
          <FormField label="Data Dismissione Prevista" type="date" name="datadismissioneprevista" value={newVehicle.datadismissioneprevista} onChange={handleInputChange} />
          <FormField label="Assistenza Stradale" type="number" name="numeroassistenzastradale" value={newVehicle.numeroassistenzastradale} onChange={handleInputChange} />
          <FormField label="Ass. Basic" type="number" name="assicurazionebasic" value={newVehicle.assicurazionebasic} onChange={handleInputChange} />
          <FormField label="Ass. Confort" type="number" name="assicurazioneconfort" value={newVehicle.assicurazioneconfort} onChange={handleInputChange} />
          <FormField label="Ass. Premium" type="number" name="assicurazionepremium" value={newVehicle.assicurazionepremium} onChange={handleInputChange} />
          <FormField label="Ass. Super Total" type="number" name="assicurazionesupertotal" value={newVehicle.assicurazionesupertotal} onChange={handleInputChange} />
          <FormField label="Fornitore / Leasing" name="fornitoreoleasing" value={newVehicle.fornitoreoleasing} onChange={handleInputChange} />
          <FormField label="Note Interno" name="noteinterne" value={newVehicle.noteinterne} onChange={handleInputChange} />
          <FormField label="Categoria" name="categoria" value={newVehicle.categoria} onChange={handleInputChange} />
        </div>
      )}

      {/* STEP 5: stato veicolo */}
      {currentStep === 5 && (
        <div className="form-step active">
          <FormField label="Stato Freni" name="statofreni" value={newVehicle.statofreni} onChange={handleInputChange} />
          <FormField label="Stato Olio Motore" name="statooliomotore" value={newVehicle.statooliomotore} onChange={handleInputChange} />
          <FormField label="Stato Liquido Raffreddamento" name="statoliquidodiraffredamento" value={newVehicle.statoliquidodiraffredamento} onChange={handleInputChange} />
          <FormField label="Stato Liquido Freni" name="statoliquidofreni" value={newVehicle.statoliquidofreni} onChange={handleInputChange} />
          <FormField label="Stato Carrozzeria" name="statocarrozzeria" value={newVehicle.statocarrozzeria} onChange={handleInputChange} />
          <FormField label="Vetri / Specchietti" name="statovetrispecchietti" value={newVehicle.statovetrispecchietti} onChange={handleInputChange} />
          <FormField label="Interni" name="statointerni" value={newVehicle.statointerni} onChange={handleInputChange} />
          <FormField label="Climatizzazione" name="statoclimatizzazione" value={newVehicle.statoclimatizzazione} onChange={handleInputChange} />
          <FormField label="Luci" name="statoluci" value={newVehicle.statoluci} onChange={handleInputChange} />
          <FormField label="Sospensioni" name="statosospenzioni" value={newVehicle.statosospenzioni} onChange={handleInputChange} />
        </div>
      )}

            <div className="step-navigation">
              {currentStep > 1 && <button className="popup-btn" onClick={prevStep}>Indietro</button>}
              {currentStep < 5 && <button className="popup-btn" onClick={nextStep}>Avanti</button>}
              {currentStep === 5 && (
                <>
                  <button className="popup-btn" type="submit" onClick={handleSaveVehicle}>Salva</button>
                  {newVehicle.id && (
                    <button
                      className="popup-btn delete"
                      onClick={async () => {
                        if (window.confirm("Sei sicuro di voler eliminare questo veicolo?")) {
                          const { error } = await supabase.from("Vehicles").delete().eq("id", newVehicle.id);
                          if (error) console.log(error);
                          else {
                            fetchVehicles();
                            setPopupOpen(false);
                            setNewVehicle(initialVehicleState);
                          }
                        }
                      }}
                    >
                      Elimina
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
