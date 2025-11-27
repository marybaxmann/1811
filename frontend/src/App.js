import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Simulador from "./pages/Simulador";
import Opciones from "./pages/Opciones";
import Favoritos from "./pages/Favoritos";
import "./App.css";

function App() {
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [favoritosCount, setFavoritosCount] = useState(0);

  useEffect(() => {
    const userLocal = sessionStorage.getItem("usuarioRegistrado");
    setUsuarioRegistrado(!!userLocal);

    const favLocal = sessionStorage.getItem("usuarioFavoritos");
    if (favLocal) {
      try {
        const f = JSON.parse(favLocal);
        setFavoritosCount(Array.isArray(f) ? f.length : 0);
      } catch (e) {}
    }
  }, []);

  // Escuchar eventos personalizados para mantener el contador actualizado
  useEffect(() => {
    const onFavoritosUpdated = (e) => {
      if (e && e.detail !== undefined) setFavoritosCount(e.detail);
      else {
        const favLocal = localStorage.getItem("usuarioFavoritos");
        if (favLocal) {
          try {
            const f = JSON.parse(favLocal);
            setFavoritosCount(Array.isArray(f) ? f.length : 0);
          } catch (err) {}
        } else setFavoritosCount(0);
      }
    };

    const onUserRegistered = () => setUsuarioRegistrado(true);

    window.addEventListener("favoritosUpdated", onFavoritosUpdated);
    window.addEventListener("userRegistered", onUserRegistered);

    return () => {
      window.removeEventListener("favoritosUpdated", onFavoritosUpdated);
      window.removeEventListener("userRegistered", onUserRegistered);
    };
  }, []);

  return (
    <Router>
      <header className="navbar">
        <div className="navbar-content">
          <Link to="/" className="logo">SimuladorPAES</Link>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/simulador">Simular</Link></li>
              <li><Link to="/opciones">Opciones</Link></li>
              {usuarioRegistrado && (
                <li>
                  <Link to="/favoritos">Mis Favoritos ({favoritosCount})</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-container">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route path="/opciones" element={<Opciones />} />
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </main>

      <footer className="footer">
        <h4>Simulador PAES</h4>
        <p>
          Plataforma gratuita que te ayuda a descubrir las carreras universitarias
          a las que puedes acceder con tu puntaje PAES. Información actualizada
          basada en datos oficiales de cortes históricos.
        </p>
        <p>© 2025 simuladorpaes.cl — Todos los derechos reservados.</p>
      </footer>
    </Router>
  );
}

export default App;
