import React from "react";
import { Navigate } from "react-router-dom";

// "isAuth" sarà un boolean che controlla se l'utente è loggato
function PrivateRoute({ isAuth, children }) {
  if (!isAuth) {
    // Se non è autenticato, reindirizza al login
    return <Navigate to="/login" replace />;
  }

  // Se è autenticato, renderizza la pagina richiesta
  return children;
}

export default PrivateRoute;
