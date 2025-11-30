import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Simulador PAES</h3>
        <p>
          Plataforma gratuita que te ayuda a descubrir las carreras universitarias
          a las que puedes acceder con tu puntaje PAES. Información actualizada
          basada en datos oficiales de cortes históricos.
        </p>
        <p className="footer-copy">
          © 2025 simuladorpaes.cl – Todos los derechos reservados. Los datos de puntajes
          de corte son referenciales y pueden variar.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
