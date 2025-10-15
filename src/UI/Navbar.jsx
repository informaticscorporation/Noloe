import { useState, useEffect} from "react";
import "../UIX/Navbar.css";

export default function Navbar({setMenuOpen, menuOpen}) {
  
  const [mobile, setMobile] = useState(false);
   const [widthWindow, setWidthWindow] = useState(window.innerWidth);
  useEffect(() => {
    const checkScreenSize = () => {
      setWidthWindow(window.innerWidth);
      if (window.innerWidth <= 768) {

        setMobile(true);
      } else {
        setMobile(false);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [widthWindow ]);
  
  

  return (
    <nav className="navbar">
      {/* HAMBURGER MENU */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="line top"></span>
        <span className="line bottom"></span>
      </div>

      {/* LOGO CENTRALE */}
      <div className="logo-container">
        <img src="/logo.webp" alt="logo autonoleggio" />
      </div>

      {/* SIGN IN / SIGN UP */}
      <div className="signin-container">
        <button className="signin-btn">{mobile === true ? "Sign In" : "Sign In / Sign Up" }</button>
      </div>

     
    </nav>
  );
}
