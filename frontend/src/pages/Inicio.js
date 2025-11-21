// src/pages/Inicio.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Inicio.css"; // Usa tu carpeta de estilos

function Inicio() {
  return (
    <div className="landing-container">

      {/* HERO SECTION */}
      <section className="hero">
        <h1 className="hero-title">Simulador de Puntaje PAES</h1>

        <p className="hero-subtitle">
          Compara tus puntajes, analiza tus opciones universitarias y toma
          decisiones informadas para tu futuro académico.
        </p>

        <Link to="/simulador" className="hero-button">
          🚀 Comenzar Simulación
        </Link>
      </section>

      {/* DATOS DESTACADOS */}
      <section className="stats-section">
        <h2 className="section-title">Datos Destacados</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <img
              src={process.env.PUBLIC_URL + "/img/estudiantes1.jpg"}
              alt="Estudiantes 1"
              className="stat-img"
            />
            <p>
              El <strong>77.3%</strong> de los estudiantes de pregrado continúan
              sus estudios tras el primer año.
            </p>
          </div>

          <div className="stat-card">
            <img
              src={process.env.PUBLIC_URL + "/img/estudiantes2.jpg"}
              alt="Estudiantes 2"
              className="stat-img"
            />
            <p>
              La matrícula en Educación Superior en Chile aumentó un
              <strong> 5%</strong> en 2025.
            </p>
          </div>

          <div className="stat-card">
            <img
              src={process.env.PUBLIC_URL + "/img/estudiantes3.jpg"}
              alt="Estudiantes 3"
              className="stat-img"
            />
            <p>
              Más de <strong>250.000</strong> jóvenes postulan al sistema PAES
              cada año.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Inicio;
