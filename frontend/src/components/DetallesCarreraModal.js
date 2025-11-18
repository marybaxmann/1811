import React from "react";
import "./DetallesCarreraModal.css";

export default function DetallesCarreraModal({ abierta, onCerrar, carrera }) {
  if (!abierta || !carrera) return null;

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCerrar}>✖</button>

        <h2>{carrera.carrera}</h2>
        <h3>{carrera.universidad}</h3>

        <div className="modal-grid">
          <p><strong>Área:</strong> {carrera.area}</p>
          <p><strong>Duración:</strong> {carrera.duracion || "No informada"}</p>
          <p><strong>Vacantes:</strong> {carrera.vacantes || "No informadas"}</p>
          <p><strong>Arancel:</strong> {carrera.arancel ? `$${carrera.arancel}` : "No informado"}</p>

          <p><strong>Acreditación:</strong> {carrera.acreditacion || "Sin información"}</p>
          <p><strong>Tipo acreditación:</strong> {carrera.tipo_acreditacion || "No informado"}</p>

          <p><strong>Sitio web:</strong> 
            {carrera.sitio_web ? (
              <a href={carrera.sitio_web} target="_blank" rel="noreferrer">
                Visitar
              </a>
            ) : "No informado"}
          </p>

          <p><strong>Región:</strong> {carrera.region || "No informada"}</p>
          <p><strong>Dirección:</strong> {carrera.direccion || "No informada"}</p>

          <p><strong>Coordenadas:</strong>  
            {carrera.latitud && carrera.longitud
              ? `${carrera.latitud}, ${carrera.longitud}`
              : "No disponibles"}
          </p>

          {carrera.latitud && carrera.longitud && (
            <a
              className="btn-mapa"
              href={`https://www.google.com/maps?q=${carrera.latitud},${carrera.longitud}`}
              target="_blank"
              rel="noreferrer"
            >
              📍 Ver en Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
