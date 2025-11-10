import { useEffect, useRef, useState } from "react";
import { Mail, Lock, User, Smartphone, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  return (
    <div ref={ref} className="fade-up">
      {children}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hasPiva, setHasPiva] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    piva: "",
    business: "",
  });

  const [errors, setErrors] = useState({});

  // Document states
  const [files, setFiles] = useState({
    idFront: null,
    idBack: null,
    licenseFront: null,
    licenseBack: null,
    taxFront: null,
    taxBack: null,
  });

  const handleFileUpload = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const next = () => {
    const newErrors = {};
    if (step === 1) {
      if (!form.name) newErrors.name = "Required";
      if (!form.email.includes("@")) newErrors.email = "Invalid email";
      if (!form.password || form.password.length < 6)
        newErrors.password = "Min 6 chars";
      if (form.password !== form.confirm)
        newErrors.confirm = "Passwords do not match";
    }
    if (step === 2) {
      const needed = [
        "idFront",
        "idBack",
        "licenseFront",
        "licenseBack",
        "taxFront",
        "taxBack",
      ];
      needed.forEach((doc) => {
        if (!files[doc]) newErrors[doc] = "Required";
      });
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);
  const update = (k, v) => setForm({ ...form, [k]: v });

  const progress = (step / 3) * 100;

  const FileUpload = ({ label, stateKey }) => (
    <div className="upload-box">
      <span>{label}</span>
      <div className="input-box doc-input">
        <FileText className="icon" />
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileUpload(stateKey, e.target.files[0])}
        />
      </div>

      {files[stateKey] && (
        <div className="preview-box">
          {files[stateKey].type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(files[stateKey])}
              alt="preview"
              className="doc-preview"
            />
          ) : (
            <p>📄 PDF selected</p>
          )}
        </div>
      )}

      {errors[stateKey] && <span className="err">{errors[stateKey]}</span>}
    </div>
  );

  return (
    <div className="login-container">
      <div className="login-left">
        <Animation>
          <h1 className="logo">Welcome!</h1>
          <p className="subtitle">Already have an account? Sign in to continue.</p>
          <button className="sign-btn" onClick={() => navigate(-1)}>
            Sign in
          </button>
        </Animation>
      </div>

      <div className="login-right">
        <Animation>
          <h2 className="title">Create Your Account</h2>
          <div className="progress-bar">
            <div className="progress" style={{ width: progress + "%" }} />
          </div>
          <p className="welcome">Step {step} of 3</p>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="form">
              <div className="input-box">
                <User className="icon" />
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  type="text"
                  placeholder="Full Name"
                />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>

              <div className="input-box">
                <Mail className="icon" />
                <input
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  type="email"
                  placeholder="Email Address"
                />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>

              <div className="input-box">
                <Smartphone className="icon" />
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  type="tel"
                  placeholder="Phone Number"
                />
              </div>

              <div className="input-box">
                <Lock className="icon" />
                <input
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  type="password"
                  placeholder="Password"
                />
                {errors.password && <span className="err">{errors.password}</span>}
              </div>

              <div className="input-box">
                <Lock className="icon" />
                <input
                  value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                  type="password"
                  placeholder="Confirm Password"
                />
                {errors.confirm && <span className="err">{errors.confirm}</span>}
              </div>

              <button className="sign-up" onClick={next}>Next</button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="form fade-step">
              <h2>Upload Documents (front & back)</h2>

              <FileUpload label="ID Card Front" stateKey="idFront" />
              <FileUpload label="ID Card Back" stateKey="idBack" />

              <FileUpload label="Driver License Front" stateKey="licenseFront" />
              <FileUpload label="Driver License Back" stateKey="licenseBack" />

              <FileUpload label="Tax Code Front" stateKey="taxFront" />
              <FileUpload label="Tax Code Back" stateKey="taxBack" />

              <div className="form-nav">
                <button className="back-btn" onClick={back}>Back</button>
                <button className="sign-up" onClick={next}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="form fade-step">
              <div className="checkbox-box">
                <input type="checkbox" id="piva" onChange={(e) => setHasPiva(e.target.checked)} />
                <label htmlFor="piva">I have a VAT number (Partita IVA)</label>
              </div>

              {hasPiva && (
                <>
                  <div className="input-box">
                    <input value={form.piva} onChange={(e) => update("piva", e.target.value)} type="text" placeholder="VAT Number" />
                  </div>
                  <div className="input-box">
                    <input value={form.business} onChange={(e) => update("business", e.target.value)} type="text" placeholder="Business Name" />
                  </div>
                </>
              )}

              <div className="checkbox-box">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">I accept the Terms & Conditions and Privacy Policy</label>
              </div>

              <div className="form-nav">
                <button className="back-btn" onClick={back}>Back</button>
                <button className="sign-up">Register</button>
              </div>
            </div>
          )}
        </Animation>
      </div>
    </div>
  );
}
