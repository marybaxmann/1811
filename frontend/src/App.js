import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Simulador from "./pages/Simulador";
import Opciones from "./pages/Opciones";
import "./App.css";

function App() {
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [favoritosCount, setFavoritosCount] = useState(0);

  useEffect(() => {
    const userLocal = localStorage.getItem("usuarioRegistrado");
    setUsuarioRegistrado(!!userLocal);

    const favLocal = localStorage.getItem("usuarioFavoritos");
    if (favLocal) {
      try {
        const f = JSON.parse(favLocal);
        setFavoritosCount(Array.isArray(f) ? f.length : 0);
      } catch (e) {}
    }
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
                <li className="nav-favorites">
                  <Link to="/opciones" state={{ mostrarFavoritos: true }}>
                    ⭐ Mis Favoritos ({favoritosCount})
                  </Link>
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
