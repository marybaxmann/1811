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

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        // 🔹 Cerrar si el usuario hace clic en el overlay
        if (e.target.classList.contains("modal-overlay")) {
          onCerrar();
        }
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // 🔹 Evita cerrar si clickea dentro del modal
      >
        {/* BOTÓN DE CIERRE */}
        <button className="modal-close" onClick={onCerrar}>✖</button>

        {/* CONTENIDO */}
        <h2>{detalles.nombre}</h2>
        <h3>{detalles.universidad}</h3>

        <p><strong>Área:</strong> {detalles.area}</p>
        <p><strong>Duración:</strong> {detalles.duracion}</p>
        <p><strong>Vacantes:</strong> {detalles.vacantes}</p>
        <p><strong>Arancel:</strong> {detalles.arancel}</p>
        <p><strong>Acreditación:</strong> {detalles.acreditacion}</p>
        <p><strong>Tipo acreditación:</strong> {detalles.tipo_acreditacion}</p>

        <p>
          <strong>Sitio web:</strong>{" "}
          <a
            href={detalles.sitio_web}
            target="_blank"
            rel="noopener noreferrer"
          >
            {detalles.sitio_web}
          </a>
        </p>

        <p><strong>Región:</strong> {detalles.region}</p>

        <p>
          <strong>Dirección:</strong>{" "}
          <a
            href={`https://www.google.com/maps/search/${detalles.direccion}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {detalles.direccion}
          </a>
        </p>
      </div>
    </div>
  );
}

export default DetallesCarreraModal;
