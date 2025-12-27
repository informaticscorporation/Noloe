import { useEffect, useRef, useState } from "react";
import { Mail, Lock, User, Smartphone, FileText, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../UIX/Register.css";

function Animation({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="fade-up">{children}</div>;
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hasPiva, setHasPiva] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    password: "",
    confirm: "",
    data_nascita: "",
    indirizzo: "",
    citta: "",
    cap: "",
    codice_fiscale: "",
    piva: "",
    business: "",
  });

  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
    licenseFront: null,
    licenseBack: null,
    taxFront: null,
    taxBack: null,
  });

  const documentSteps = [
    { key: "idFront", label: "ID Card Front" },
    { key: "idBack", label: "ID Card Back" },
    { key: "licenseFront", label: "Driver License Front" },
    { key: "licenseBack", label: "Driver License Back" },
    { key: "taxFront", label: "Tax Code Front" },
    { key: "taxBack", label: "Tax Code Back" },
  ];

  const handleFileUpload = (key, file) =>
    setFiles((prev) => ({ ...prev, [key]: file }));
  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const next = () => {
    const newErrors = {};

    if (step === 1) {
      if (!form.nome) newErrors.nome = "Required";
      if (!form.cognome) newErrors.cognome = "Required";
      if (!form.email.includes("@")) newErrors.email = "Invalid email";
      if (!form.password || form.password.length < 6) newErrors.password = "Min 6 chars";
      if (form.password !== form.confirm) newErrors.confirm = "Passwords do not match";
    } else if (step >= 2 && step <= 7) {
      const currentDoc = documentSteps[step - 2];
      if (!files[currentDoc.key]) newErrors[currentDoc.key] = "Required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);
  const progress = ((step - 1) / 8) * 100;

  const handleRegister = async () => {
    if (!acceptedTerms) {
      alert("You must accept the terms to register.");
      return;
    }

    setLoading(true);
    try {
      // Inserimento utente
      const { data: userData, error } = await supabase.from("Users").insert([{
        nome: form.nome,
        cognome: form.cognome,
        email: form.email,
        telefono: form.telefono,
        tipoUtente: "Cliente",
        password_hash: form.password,
        partita_iva: hasPiva ? form.piva : null,
        ragione_sociale: hasPiva ? form.business : null,
        data_nascita: form.data_nascita || null,
        indirizzo: form.indirizzo || null,
        citta: form.citta || null,
        cap: form.cap || null,
        codice_fiscale: form.codice_fiscale || null,
      }]).select().single();

      if (error) throw error;
      const userId = userData.id;

      // Map file names e colonne
      const colMap = {
        idFront: "idCARDFrontimg",
        idBack: "idCARDBackimg",
        licenseFront: "patenteFront",
        licenseBack: "patenteBack",
        taxFront: "taxiCardFront",
        taxBack: "taxiCardBack",
      };
      const fileNameMap = {
        idFront: "idcardfront",
        idBack: "idcardback",
        licenseFront: "licensefront",
        licenseBack: "licenseback",
        taxFront: "taxfront",
        taxBack: "taxback",
      };

      for (const [key, file] of Object.entries(files)) {
        if (!file) continue;

        const timestamp = Date.now();
        const extension = file.name.split(".").pop();
        const filePath = `documenti_utente/${userId}/${fileNameMap[key]}_${timestamp}.${extension}`;

        const { error: uploadError } = await supabase.storage.from("Archivio").upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from("Archivio").getPublicUrl(filePath);
        await supabase.from("Users").update({ [colMap[key]]: publicUrlData.publicUrl }).eq("id", userId);
      }

      setSuccessMessage("✅ Registrazione completata con successo!");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error(err);
      alert("Errore: " + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const FileUpload = ({ label, stateKey }) => (
    <div className="upload-box">
      <span>{label}</span>
      <div className="input-box doc-input">
        <FileText className="icon" />
        <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(stateKey, e.target.files[0])} />
      </div>
      {files[stateKey] && (
        <div className="preview-box">
          {files[stateKey].type.startsWith("image/") ? (
            <img src={URL.createObjectURL(files[stateKey])} alt="preview" className="doc-preview" />
          ) : (
            <p>📄 PDF selected</p>
          )}
        </div>
      )}
      {errors[stateKey] && <span className="err">{errors[stateKey]}</span>}
    </div>
  );

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="form">
          <div className="input-box"><User className="icon" /><input value={form.nome} onChange={(e) => update("nome", e.target.value)} type="text" placeholder="Nome" />{errors.nome && <span className="err">{errors.nome}</span>}</div>
          <div className="input-box"><User className="icon" /><input value={form.cognome} onChange={(e) => update("cognome", e.target.value)} type="text" placeholder="Cognome" />{errors.cognome && <span className="err">{errors.cognome}</span>}</div>
          <div className="input-box"><Mail className="icon" /><input value={form.email} onChange={(e) => update("email", e.target.value)} type="email" placeholder="Email" />{errors.email && <span className="err">{errors.email}</span>}</div>
          <div className="input-box"><Smartphone className="icon" /><input value={form.telefono} onChange={(e) => update("telefono", e.target.value)} type="tel" placeholder="Telefono" /></div>
          <div className="input-box"><Calendar className="icon" /><input type="date" value={form.data_nascita} onChange={(e) => update("data_nascita", e.target.value)} /></div>
          <div className="input-box"><input type="text" placeholder="Indirizzo" value={form.indirizzo} onChange={(e) => update("indirizzo", e.target.value)} /></div>
          <div className="input-box"><input type="text" placeholder="Città" value={form.citta} onChange={(e) => update("citta", e.target.value)} /></div>
          <div className="input-box"><input type="text" placeholder="CAP" value={form.cap} onChange={(e) => update("cap", e.target.value)} /></div>
          <div className="input-box"><input type="text" placeholder="Codice Fiscale" value={form.codice_fiscale} onChange={(e) => update("codice_fiscale", e.target.value)} /></div>
          <div className="input-box"><Lock className="icon" /><input value={form.password} onChange={(e) => update("password", e.target.value)} type="password" placeholder="Password" />{errors.password && <span className="err">{errors.password}</span>}</div>
          <div className="input-box"><Lock className="icon" /><input value={form.confirm} onChange={(e) => update("confirm", e.target.value)} type="password" placeholder="Conferma Password" />{errors.confirm && <span className="err">{errors.confirm}</span>}</div>
          <button className="sign-up" onClick={next}>Next</button>
        </div>
      );
    } else if (step >= 2 && step <= 7) {
      const currentDoc = documentSteps[step - 2];
      return (
        <div className="form fade-step">
          <FileUpload label={currentDoc.label} stateKey={currentDoc.key} />
          <div className="form-nav">
            <button className="back-btn" onClick={back}>Back</button>
            <button className="sign-up" onClick={next}>Next</button>
          </div>
        </div>
      );
    } else if (step === 8) {
      return (
        <div className="form fade-step">
          <div className="checkbox-box">
            <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
            <label htmlFor="terms">I accept the Terms and Conditions</label>
          </div>
          <div className="checkbox-box">
            <input type="checkbox" id="piva" onChange={(e) => setHasPiva(e.target.checked)} />
            <label htmlFor="piva">I have a VAT number (Partita IVA)</label>
          </div>
          {hasPiva && (
            <>
              <div className="input-box"><input value={form.piva} onChange={(e) => update("piva", e.target.value)} type="text" placeholder="VAT Number" /></div>
              <div className="input-box"><input value={form.business} onChange={(e) => update("business", e.target.value)} type="text" placeholder="Business Name" /></div>
            </>
          )}
          <div className="form-nav">
            <button className="back-btn" onClick={back}>Back</button>
            <button className="sign-up" onClick={handleRegister} disabled={!acceptedTerms || loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <Animation>
          <h1 className="logo">Welcome!</h1>
          <p className="subtitle">Already have an account? Sign in to continue.</p>
          <button className="sign-btn" onClick={() => navigate(-1)}>Sign in</button>
        </Animation>
      </div>
      <div className="login-right">
        <Animation>
          <h2 className="title">Create Your Account</h2>
          {successMessage && <div className="success-notice">{successMessage}</div>}
          <div className="progress-bar"><div className="progress" style={{ width: progress + "%" }} /></div>
          <p className="welcome">Step {step} of 8</p>
          {renderStep()}
        </Animation>
      </div>
    </div>
  );
}
