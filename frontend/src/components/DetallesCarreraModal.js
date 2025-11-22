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
  // DIRECCIONES REALES CASA CENTRAL
  // ================================
  const DIRECCIONES_CASA_CENTRAL = {
    "Universidad de Concepción": "Av. Paicaví 321, Concepción",
    "Universidad de Chile": "Av. Libertador Bernardo O'Higgins 1058, Santiago",
    "Pontificia Universidad Católica de Chile":
      "Av. Libertador Bernardo O'Higgins 340, Santiago",
    "Universidad de Santiago de Chile":
      "Av. Libertador Bernardo O'Higgins 3363, Estación Central",
    "Universidad Técnica Federico Santa María":
      "Av. España 1680, Valparaíso",
    "Universidad Austral de Chile": "Independencia 641, Valdivia",
    "Universidad Católica de la Santísima Concepción":
      "Alonso de Ribera 2850, Concepción",
    "Universidad Católica del Norte": "Av. Angamos 610, Antofagasta",
  };

  const direccionCompleta =
    DIRECCIONES_CASA_CENTRAL[detalles.universidad] || "Casa Central";

  // ================================
  // GOOGLE MAPS LINK
  // ================================
  const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccionCompleta
  )}`;

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
        {/* BOTÓN CERRAR CENTRADO */}
        <button className="modal-close" onClick={onCerrar}>
          ✖
        </button>

        <h2>{detalles.nombre}</h2>
        <h3>{detalles.universidad}</h3>

        <p>
          <strong>Área:</strong> {detalles.area ?? "No informada"}
        </p>

        <p>
          <strong>Duración:</strong>{" "}
          {detalles.duracion
            ? `${detalles.duracion} semestres`
            : "No informada"}
        </p>

        <p>
          <strong>Vacantes:</strong> {detalles.vacantes ?? "No informadas"}
        </p>

        <p>
          <strong>Arancel:</strong> {arancelFormateado ?? "No informado"}
        </p>

        <p>
          <strong>Acreditación:</strong> {detalles.acreditacion ?? "Sin datos"}
        </p>

        <p>
          <strong>Tipo acreditación:</strong>{" "}
          {detalles.tipo_acreditacion ?? "No informado"}
        </p>

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

        <p>
          <strong>Región:</strong> {detalles.region ?? "No informada"}
        </p>

        <p>
          <strong>Dirección:</strong>{" "}
          <a href={linkMaps} target="_blank" rel="noopener noreferrer">
            {direccionCompleta}
          </a>
        </p>
      </div>
    </div>
  );
}

export default DetallesCarreraModal;
