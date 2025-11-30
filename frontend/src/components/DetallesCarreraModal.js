<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import "./DetallesCarreraModal.css";

function DetallesCarreraModal({ abierta, onCerrar, carrera }) {
  const [detalles, setDetalles] = useState(null);

  useEffect(() => {
    if (!abierta || !carrera) return;

    fetch(`/simulador/detalle/${carrera.carrera_id}`)
      .then((r) => r.json())
      .then(setDetalles);
  }, [abierta, carrera]);

  if (!abierta || !detalles) return null;

  // ================================
  // FORMATO ARANCEL
  // ================================
  const arancelFormateado =
    detalles.arancel && !isNaN(detalles.arancel)
      ? `$${detalles.arancel.toLocaleString("es-CL")}`
      : detalles.arancel;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target.classList.contains("modal-overlay")) {
          onCerrar();
        }
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCerrar}>✖</button>

        <h2>{detalles.nombre}</h2>
        <h3>{detalles.universidad}</h3>

        <p><strong>Área:</strong> {detalles.area ?? "No informada"}</p>

        <p>
          <strong>Duración:</strong>{" "}
          {detalles.duracion ? `${detalles.duracion} semestres` : "No informada"}
        </p>

        <p><strong>Vacantes:</strong> {detalles.vacantes ?? "No informadas"}</p>

        <p><strong>Arancel:</strong> {arancelFormateado ?? "No informado"}</p>

        <p>
          <strong>Acreditación:</strong>{" "}
          {detalles.acreditacion ? `${detalles.acreditacion} años` : "Sin datos"}
        </p>

        <p>
          <strong>Tipo acreditación:</strong>{" "}
          {detalles.tipo_acreditacion ?? "No informado"}
        </p>

        <p>
          <strong>Sitio web:</strong>{" "}
          <a href={detalles.sitio_web} target="_blank" rel="noopener noreferrer">
            {detalles.sitio_web}
          </a>
        </p>

        <p><strong>Región:</strong> {detalles.region ?? "No informada"}</p>
=======
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
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
      </div>
    </div>
  );
}
<<<<<<< HEAD

export default DetallesCarreraModal;
=======
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d
