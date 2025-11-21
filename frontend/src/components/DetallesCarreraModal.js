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

  // --- LINK GOOGLE MAPS (Casa Central exacto) ---
  const linkMaps = detalles.latitud && detalles.longitud
    ? `https://www.google.com/maps?q=${detalles.latitud},${detalles.longitud}`
    : null;

  // --- Cerrar modal haciendo click fuera ---
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onCerrar();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onCerrar}>✖</button>

        <h2>{detalles.nombre}</h2>
        <h3>{detalles.universidad}</h3>

        <p><strong>Área:</strong> {detalles.area ?? "No informada"}</p>
        <p><strong>Duración:</strong> {detalles.duracion ? `${detalles.duracion} semestres` : "No informada"}</p>
        <p><strong>Vacantes:</strong> {detalles.vacantes ?? "No informadas"}</p>
        <p><strong>Arancel:</strong> {detalles.arancel ? `$${detalles.arancel.toLocaleString()}` : "No informado"}</p>

        <p><strong>Acreditación:</strong> {detalles.acreditacion ?? "Sin información"}</p>
        <p><strong>Tipo acreditación:</strong> {detalles.tipo_acreditacion ?? "No informado"}</p>

        {/* Sitio web clickeable */}
        <p>
          <strong>Sitio web:</strong>{" "}
          {detalles.sitio_web ? (
            <a href={detalles.sitio_web} target="_blank" rel="noopener noreferrer">
              {detalles.sitio_web}
            </a>
          ) : "No informado"}
        </p>

        <p><strong>Región:</strong> {detalles.region ?? "No informada"}</p>

        {/* Dirección con link a Google Maps */}
        <p>
          <strong>Dirección:</strong>{" "}
          {linkMaps ? (
            <a href={linkMaps} target="_blank" rel="noopener noreferrer">
              Casa Central
            </a>
          ) : (
            "Casa Central"
          )}
        </p>

      </div>
    </div>
  );
}

export default DetallesCarreraModal;
