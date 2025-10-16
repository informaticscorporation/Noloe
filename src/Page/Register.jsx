import { useEffect, useRef } from "react";
import { Mail, Lock, User, Smartphone, FileText,  } from "lucide-react";
import "../UIX/Register.css";

function Animation({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
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
   

  return (
    <div className="login-container">
      {/* Sezione sinistra */}
      <div className="login-left">
        <Animation>
          <h1 className="logo">Welcome!</h1>
          <p className="subtitle">Already have an account? Sign in to continue.</p>
          <button className="sign-btn">Sign up</button>
        </Animation>
      </div>

      {/* Sezione destra */}
      <div className="login-right">
        <Animation>
          <h2 className="title">Create Your Account</h2>
          <p className="welcome">Register now and upload your documents to speed up verification.</p>

          <div className="form">
            <div className="input-box">
              <User className="icon" />
              <input type="text" placeholder="Full Name" />
            </div>

            <div className="input-box">
              <Mail className="icon" />
              <input type="email" placeholder="Email Address" />
            </div>

            <div className="input-box">
              <Lock className="icon" />
              <input type="password" placeholder="Password" />
            </div>

            <div className="input-box">
              <Lock className="icon" />
              <input type="password" placeholder="Confirm Password" />
            </div>

            <div className="input-box">
              <Smartphone className="icon" />
              <input type="tel" placeholder="Phone Number" />
            </div>

            <div className="input-box">
              <input type="date" placeholder="Date of Birth" />
            </div>

            <div className="input-box">
              <input type="text" placeholder="Address" />
            </div>

            <div className="input-box">
              <input type="text" placeholder="Fiscal Code" />
            </div>

            <div className="input-box">
              <select>
                <option value="">Document Type</option>
                <option value="license">Driver License</option>
                <option value="id">ID Card</option>
                <option value="passport">Passport</option>
              </select>
            </div>

            <div className="input-box">
              <input type="text" placeholder="Document Number" />
            </div>

            <div className="input-box">
              <input type="date" placeholder="Document Expiry Date" />
            </div>

            <div className="input-box">
              <FileText className="icon" />
              <input placeholder="ID Card"  type="file" accept="image/*,application/pdf" multiple />
            </div>

            <div className="input-box">
              <FileText className="icon" />
              <input type="file" accept="image/*,application/pdf" multiple placeholder="Driver License" />
            </div>

            <div className="checkbox-box">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">I accept the Terms & Conditions and Privacy Policy</label>
            </div>

            <button className="sign-up" id="tre" translate="no">Sign in</button>
          </div>
        </Animation>
      </div>
    </div>
  );
}
