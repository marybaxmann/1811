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

const DIRECCIONES_CASA_CENTRAL = {
  "Universidad de Chile":
    "Av. Libertador Bernardo O'Higgins 1058, Santiago",

  "Pontificia Universidad Católica de Chile":
    "Av. Libertador Bernardo O'Higgins 340, Santiago",

  "Universidad de Concepción":
    "Edmundo Larenas 120, Concepción",

  "Pontificia Universidad Católica de Valparaíso":
    "Av. Brasil 2950, Valparaíso",

  "Universidad Técnica Federico Santa María":
    "Av. España 1680, Valparaíso",

  "Universidad de Santiago de Chile":
    "Av. Libertador Bernardo O'Higgins 3363, Estación Central, Santiago",

  "Universidad Austral de Chile":
    "Independencia 641, Valdivia",

  "Universidad de Valparaíso":
    "Av. Blanco 951, Valparaíso",

  "Universidad Católica del Norte":
    "Av. Angamos 610, Antofagasta",

  "Universidad Metropolitana de Ciencias de la Educación":
    "Av. José Pedro Alessandri 774, Ñuñoa",

  "Universidad Tecnológica Metropolitana":
    "Av. Dieciocho 161, Santiago",

  "Universidad de Tarapacá":
    "Av. 18 de Septiembre 2222, Arica",

  "Universidad Arturo Prat":
    "Av. Arturo Prat 2120, Iquique",

  "Universidad de Antofagasta":
    "Av. Angamos 601, Antofagasta",

  "Universidad de La Serena":
    "Amunátegui 851, La Serena",

  "Universidad de Atacama":
    "Av. Copayapu 485, Copiapó",

  "Universidad del Bío-Bío":
    "Av. Collao 1202, Concepción",

  "Universidad de La Frontera":
    "Av. Francisco Salazar 01145, Temuco",

  "Universidad de Los Lagos":
    "Av. Fuchslocher 1305, Osorno",

  "Universidad de Magallanes":
    "Av. Bulnes 01855, Punta Arenas",

  "Universidad de Talca":
    "Avenida Lircay s/n, Talca",

  "Universidad Católica del Maule":
    "Av. San Miguel 3605, Talca",

  "Universidad Católica de la Santísima Concepción":
    "Alonso de Ribera 2850, Concepción",

  "Universidad Católica de Temuco":
    "Manuel Montt 056, Temuco",

  "Universidad Diego Portales":
    "Av. Ejército Libertador 441, Santiago",

  "Universidad Mayor":
    "Av. Manuel Montt 367, Providencia, Santiago",

  "Universidad Finis Terrae":
    "Av. Pedro de Valdivia 1509, Providencia, Santiago",

  "Universidad Andrés Bello":
    "Av. República 239, Santiago",

  "Universidad Adolfo Ibáñez":
    "Av. Diagonal Las Torres 2640, Peñalolén, Santiago",

  "Universidad de los Andes":
    "Av. Mons. Álvaro del Portillo 12455, Las Condes, Santiago",

  "Universidad del Desarrollo":
    "Av. Plaza 680, Las Condes, Santiago",

  "Universidad Alberto Hurtado":
    "Almirante Barroso 10, Santiago",

  "Universidad Católica Silva Henríquez":
    "General Jofré 462, Santiago",

  "Universidad Autónoma de Chile":
    "Av. Pedro de Valdivia 641, Providencia, Santiago",

  "Universidad San Sebastián":
    "Lota 2465, Providencia, Santiago",

  "Universidad Central de Chile":
    "Av. Santa Isabel 1186, Santiago",

  "Universidad Academia de Humanismo Cristiano":
    "Condell 343, Providencia, Santiago",

  "Universidad Bernardo O'Higgins":
    "Avenida Viel 1497, Santiago",

  "Universidad Gabriela Mistral":
    "Ricardo Lyon 1177, Providencia, Santiago",

  "Universidad Santo Tomás":
    "Ejército 146, Santiago",

  "Universidad de las Américas":
    "Av. Antonio Varas 880, Providencia, Santiago",

  "Universidad Adventista de Chile":
    "Avenida Libertador Bernardo O'Higgins 03434, Chillán"
};


  // Dirección real o default
  const direccionReal =
    DIRECCIONES_CASA_CENTRAL[detalles.universidad] || "Casa Central";

  // LO QUE PEDISTE EXACTAMENTE:
  // 📍 Calle y ciudad (Casa Central)
  const direccionEtiqueta = `${direccionReal} (Casa Central)`;

  const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccionReal
  )}`;

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

        <p>
          <strong>📍 Dirección:</strong>{" "}
          <a href={linkMaps} target="_blank" rel="noopener noreferrer">
            {direccionEtiqueta}
          </a>
        </p>
      </div>
    </div>
  );
}

export default DetallesCarreraModal;
