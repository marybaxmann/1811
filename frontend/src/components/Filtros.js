import React from "react";
import "./Filtros.css";

function Filtros({ filtros, setFiltros }) {
  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setFiltros({ ...filtros, ocultarSinCorte: !filtros.ocultarSinCorte });
  };

  return (
    <div className="filtros-container">
      <h2>Opciones</h2>
      <div className="filtros-box">
        <h3>Filtros</h3>
        <div className="filtros-grid">
          <div>
            <label>Carrera:</label>
            <select name="carrera" onChange={handleChange} value={filtros.carrera}>
              <option value="">Todas las carreras</option>
              <option value="Ingeniería">Ingeniería</option>
              <option value="Medicina">Medicina</option>
              <option value="Derecho">Derecho</option>
              <option value="Arquitectura">Arquitectura</option>
            </select>
          </div>

          <div>
            <label>Universidad:</label>
            <select name="universidad" onChange={handleChange} value={filtros.universidad}>
              <option value="">Todas las universidades</option>
              <option value="Universidad de Chile">Universidad de Chile</option>
              <option value="Universidad de Concepción">Universidad de Concepción</option>
              <option value="Universidad Católica">Pontificia Universidad Católica de Chile</option>
            </select>
          </div>

          <div>
            <label>Área:</label>
            <select name="area" onChange={handleChange} value={filtros.area}>
              <option value="">Todas las áreas</option>
              <option value="Salud">Salud</option>
              <option value="Ciencias">Ciencias</option>
              <option value="Educación">Educación</option>
            </select>
          </div>
        </div>

        <div className="switch-container">
          <label className="switch">
            <input
              type="checkbox"
              checked={filtros.ocultarSinCorte}
              onChange={handleToggle}
            />
            <span className="slider"></span>
          </label>
          <span>Ocultar carreras sin datos de corte</span>
        </div>
      </div>
    </div>
  );
}

export default Filtros;
