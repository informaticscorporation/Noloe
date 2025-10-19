import { useState } from "react";
import Sidebar from "../UI/Sidebar";
import HeroDashboard from "../UI/HeroDashboard";
import "../UIX/Dashboard.css";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState("dashboard");

  return (
    <div className="dashboard-container">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <HeroDashboard menuOpen={menuOpen} />
    </div>
  );
}
