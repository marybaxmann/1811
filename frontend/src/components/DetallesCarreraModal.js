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

  const linkMaps = detalles.universidad
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${detalles.universidad} casa central`
      )}`
    : null;

  const linkSitio =
    detalles.sitio_web && detalles.sitio_web !== ""
      ? detalles.sitio_web.startsWith("http")
        ? detalles.sitio_web
        : "https://" + detalles.sitio_web
      : null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botón X centrado */}
        <button className="modal-close" onClick={onCerrar}>✖</button>

        <h2>{detalles.nombre}</h2>
        <h3>{detalles.universidad}</h3>

        <p><strong>Área:</strong> {detalles.area ?? "No informada"}</p>
        <p><strong>Duración:</strong> {detalles.duracion} semestres</p>
        <p><strong>Vacantes:</strong> {detalles.vacantes}</p>
        <p><strong>Arancel:</strong> ${detalles.arancel?.toLocaleString()}</p>

        <p><strong>Acreditación:</strong> {detalles.acreditacion}</p>
        <p><strong>Tipo acreditación:</strong> {detalles.tipo_acreditacion}</p>

        <p>
          <strong>Sitio web:</strong>{" "}
          {linkSitio ? (
            <a href={linkSitio} target="_blank" rel="noopener noreferrer">
              {linkSitio}
            </a>
          ) : (
            "No informado"
          )}
        </p>

        <p><strong>Región:</strong> {detalles.region}</p>

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
