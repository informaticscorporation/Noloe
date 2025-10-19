import {
  LayoutDashboard,
  Car,
  CalendarDays,
  Users,
  Wallet,
  BarChart3,
  Settings,
  ClipboardList,
} from "lucide-react";
import "../UIX/Dashboard.css";

export default function Sidebar({ menuOpen, setMenuOpen }) {
  const buttons = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "cars", label: "Auto", icon: <Car size={20} /> },
    { id: "bookings", label: "Prenotazioni", icon: <ClipboardList size={20} /> },
    { id: "clients", label: "Clienti", icon: <Users size={20} /> },
    { id: "payments", label: "Pagamenti", icon: <Wallet size={20} /> },
    { id: "calendar", label: "Calendario", icon: <CalendarDays size={20} /> },
    { id: "reports", label: "Report", icon: <BarChart3 size={20} /> },
    { id: "settings", label: "Impostazioni", icon: <Settings size={20} /> },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <img  className="logo" src="/logo.webp" alt=" Logo" />
      </div>

      <div className="sidebar-menu">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            className={`sidebar-btn ${menuOpen === btn.id ? "active" : ""}`}
            onClick={() => setMenuOpen(btn.id)}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
