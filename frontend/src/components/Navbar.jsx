import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h2 className="navbar-title">SimuladorPAES</h2>
          <input
            type="text"
            className="navbar-search"
            placeholder="Buscar universidad..."
          />
        </div>

        <nav className="navbar-links">
          <a href="#inicio">Inicio</a>
          <a href="#simular">Simular</a>
          <a href="#opciones">Opciones</a>
          <a href="#detalles">Detalles</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
