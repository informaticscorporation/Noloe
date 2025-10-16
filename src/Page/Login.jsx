import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import "../UIX/Login.css";

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

  return (
    <div ref={ref} className="fade-up">
      {children}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  return (   
    <div className="login-container">
      {/* Sezione sinistra */}
      <div className="login-left">
        <Animation>
          <h1 className="logo">Create Your Account</h1>
          <p className="subtitle">Register now and manage your car rentals with ease.</p>
          <button className="sign-btn" onClick={() => navigate("/register")}>Sign In</button>
        </Animation>
      </div>

      {/* Sezione destra */}
      <div className="login-right">
        <Animation>
          <h2 className="title">Hello Again!</h2>
          <p className="welcome">Welcome Back</p>

          <div className="form">
            <div className="input-box">
              <Mail className="icon" />
              <input type="email" placeholder="Email Address" />
            </div>

            <div className="input-box">
              <Lock className="icon" />
              <input type="password" placeholder="Password" />
            </div>

            <button className="sign-up">Sign Up</button>
            <a href="#" className="forgot">
              Forgot Password
            </a>
          </div>
        </Animation>
      </div>
    </div>
  );
}
