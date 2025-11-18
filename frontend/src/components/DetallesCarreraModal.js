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

  if (!abierta) return null;
  if (!detalles) return null;

  const linkMaps = detalles.latitud && detalles.longitud
    ? `https://www.google.com/maps?q=${detalles.latitud},${detalles.longitud}`
    : null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="cerrar" onClick={onCerrar}>✖</button>

        <h2>{detalles.nombre}</h2>
        <h3>{detalles.universidad}</h3>

        <p><strong>Área:</strong> {detalles.area ?? "No informada"}</p>
        <p><strong>Duración:</strong> {detalles.duracion ? `${detalles.duracion} semestres` : "No informada"}</p>
        <p><strong>Vacantes:</strong> {detalles.vacantes ?? "No informadas"}</p>
        <p><strong>Arancel:</strong> {detalles.arancel ? `$${detalles.arancel.toLocaleString()}` : "No informado"}</p>

        <p><strong>Acreditación:</strong> {detalles.acreditacion ?? "Sin información"}</p>
        <p><strong>Tipo acreditación:</strong> {detalles.tipo_acreditacion ?? "No informado"}</p>

        <p><strong>Sitio web:</strong> {detalles.sitio_web ?? "No informado"}</p>
        <p><strong>Región:</strong> {detalles.region ?? "No informada"}</p>

        <p>
          <strong>Dirección:</strong>{" "}
          {detalles.direccion ? (
            linkMaps ? (
              <a href={linkMaps} target="_blank" rel="noopener noreferrer">{detalles.direccion}</a>
            ) : detalles.direccion
          ) : "No informada"}
        </p>

        <p>
          <strong>Coordenadas:</strong>{" "}
          {detalles.latitud && detalles.longitud
            ? `${detalles.latitud}, ${detalles.longitud}`
            : "No disponibles"}
        </p>
      </div>
    </div>
  );
}

export default DetallesCarreraModal;
