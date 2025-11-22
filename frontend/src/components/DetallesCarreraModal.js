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
      </div>
    </div>
  );
}

export default DetallesCarreraModal;
