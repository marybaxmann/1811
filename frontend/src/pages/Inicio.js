// src/pages/Inicio.js
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Inicio() {
  return (
    <div className="inicio-container">
      <section className="intro">
        <h1 className="titulo">Bienvenido a Simulador de Puntaje PAES</h1>
        <p className="descripcion">
          Simulador PAES es una plataforma educativa que permite comparar tus puntajes 
          con los requisitos de universidades y carreras en Chile. 
          Una herramienta práctica para planificar tu futuro académico 
          y tomar decisiones informadas sobre tu educación.
        </p>
        <p className="invitacion">
          ¡Únete a nosotros y prepárate para alcanzar tus metas académicas!
        </p>

        {/* 🔹 BOTÓN CENTRAL GRANDE */}
        <div className="boton-central-container">
          <Link to="/simulador" className="boton-central">
            🚀 Comenzar Simulación
          </Link>
        </div>
      </section>

      <section className="destacados">
        <h2>Datos destacados</h2>

        <div className="cards-container">
          <div className="card">
<<<<<<< HEAD
            <img src={'/static/img/estudiantes1.jpg'} alt="Estudiantes 1" />
=======
            <img src="/img/estudiantes1.jpg" alt="Estudiantes 1" />
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
            <p>
              El <strong>77.3%</strong> de los estudiantes de pregrado 
              permanecen en sus carreras tras el primer año.
            </p>
          </div>

          <div className="card">
<<<<<<< HEAD
            <img src={'/static/img/estudiantes2.jpg'} alt="Estudiantes 2" />
=======
            <img src="/img/estudiantes2.jpg" alt="Estudiantes 2" />
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
            <p>
              El sistema de Educación Superior en Chile aumentó 
              sus matrículas en <strong>5%</strong> en 2025.
            </p>
          </div>

          <div className="card">
<<<<<<< HEAD
            <img src={'/static/img/estudiantes3.jpg'} alt="Estudiantes 3" />
=======
            <img src="/img/estudiantes3.jpg" alt="Estudiantes 3" />
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
            <p>
              Más de <strong>250.000</strong> jóvenes postulan cada año 
              a través del sistema PAES.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
