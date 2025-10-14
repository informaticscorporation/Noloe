//import component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
//css
import "./App.css";
//component
import PrivateRoute from "./Component/PrivateRoute";
//Pagine 
import Home from "./Page/Home";
import About from "./Page/About";
import Contact from "./Page/Contact";
import Register from "./Page/Register";
import Login from "./Page/Login";
import Rents from "./Page/Rents";
import Rent from "./Page/Rent";
import Carrello from "./Page/Carrello";
import UserArea from "./Page/UserArea";
import Dashboard from "./Page/Dashboard";



function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rents" element={<Rents />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/carrello" element={<Carrello />} />
          <Route path="/userarea" element={
            <PrivateRoute isAuth={true}>
              <UserArea />
            </PrivateRoute>
          } />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isAuth={false} >
                <Dashboard />
              </PrivateRoute>
            }
          />
         
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;