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
  // DIRECCIONES CASA CENTRAL REALES
  // ================================
  const DIRECCIONES_CASA_CENTRAL = {
    "Universidad de Chile": "Av. Libertador Bernardo O'Higgins 1058, Santiago, Región Metropolitana",

    "Pontificia Universidad Cat├│lica de Chile":
      "Av. Libertador Bernardo O'Higgins 340, Santiago, Región Metropolitana",

    "Universidad de Concepci├│n":
      "Edmundo Larenas 120, Concepción, Región del Biobío",

    "Pontificia Universidad Cat├│lica de Valpara├¡so":
      "Av. Brasil 2950, Valparaíso, Región de Valparaíso",

    "Universidad T├®cnica Federico Santa Mar├¡a":
      "Av. España 1680, Valparaíso, Región de Valparaíso",

    "Universidad de Santiago de Chile":
      "Av. Libertador Bernardo O'Higgins 3363, Estación Central, Región Metropolitana",

    "Universidad Austral de Chile":
      "Independencia 641, Valdivia, Región de Los Ríos",

    "Universidad de Valpara├¡so":
      "Av. Blanco 951, Valparaíso, Región de Valparaíso",

    "Universidad Cat├│lica del Norte":
      "Av. Angamos 610, Antofagasta, Región de Antofagasta",

    "Universidad Metropolitana de Ciencias de la Educaci├│n":
      "Av. José Pedro Alessandri 774, Ñuñoa, Región Metropolitana",

    "Universidad Tecnol├│gica Metropolitana":
      "Av. Dieciocho 161, Santiago, Región Metropolitana",

    "Universidad de Tarapac├í":
      "Av. 18 de Septiembre 2222, Arica, Región de Arica y Parinacota",

    "Universidad Arturo Prat":
      "Av. Arturo Prat 2120, Iquique, Región de Tarapacá",

    "Universidad de Antofagasta":
      "Av. Angamos 601, Antofagasta, Región de Antofagasta",

    "Universidad de La Serena":
      "Amunátegui 851, La Serena, Región de Coquimbo",

    "Universidad de Atacama":
      "Av. Copayapu 485, Copiapó, Región de Atacama",

    "Universidad del B├¡o-B├¡o":
      "Av. Collao 1202, Concepción, Región del Biobío",

    "Universidad de La Frontera":
      "Av. Francisco Salazar 1145, Temuco, Región de La Araucanía",

    "Universidad de Los Lagos":
      "Av. Fuchslocher 1305, Osorno, Región de Los Lagos",

    "Universidad de Magallanes":
      "Av. Bulnes 01855, Punta Arenas, Región de Magallanes",

    "Universidad de Talca":
      "Avenida Lircay s/n, Talca, Región del Maule",

    "Universidad Cat├│lica del Maule":
      "Av. San Miguel 3605, Talca, Región del Maule",

    "Universidad Cat├│lica de la Sant├¡sima Concepci├│n":
      "Alonso de Ribera 2850, Concepción, Región del Biobío",

    "Universidad Cat├│lica de Temuco":
      "Manuel Montt 056, Temuco, Región de La Araucanía",

    "Universidad Diego Portales":
      "Av. Ejército Libertador 441, Santiago, Región Metropolitana",

    "Universidad Mayor":
      "Av. Manuel Montt 367, Providencia, Región Metropolitana",

    "Universidad Finis Terrae":
      "Av. Pedro de Valdivia 1509, Providencia, Región Metropolitana",

    "Universidad Andr├®s Bello":
      "Av. República 239, Santiago, Región Metropolitana",

    "Universidad Adolfo Ib├í├▒ez":
      "Av. Diagonal Las Torres 2640, Peñalolén, Región Metropolitana",

    "Universidad de los Andes":
      "Av. Mons. Álvaro del Portillo 12455, Las Condes, Región Metropolitana",

    "Universidad del Desarrollo":
      "Av. Plaza 680, Las Condes, Región Metropolitana",

    "Universidad Alberto Hurtado":
      "Almirante Barroso 10, Santiago, Región Metropolitana",

    "Universidad Cat├│lica Silva Henr├¡quez":
      "General Jofré 462, Santiago, Región Metropolitana",

    "Universidad Aut├│noma de Chile":
      "Av. Pedro de Valdivia 641, Providencia, Región Metropolitana",

    "Universidad San Sebasti├ín":
      "Lota 2465, Providencia, Región Metropolitana",

    "Universidad Central de Chile":
      "Av. Santa Isabel 1186, Santiago, Región Metropolitana",

    "Universidad Academia de Humanismo Cristiano":
      "Condell 343, Providencia, Región Metropolitana",

    "Universidad Bernardo O'Higgins":
      "Avenida Viel 1497, Santiago, Región Metropolitana",

    "Universidad Gabriela Mistral":
      "Ricardo Lyon 1177, Providencia, Región Metropolitana",

    "Universidad Santo Tom├ís":
      "Ejército 146, Santiago, Región Metropolitana",

    "Universidad de las Am├®ricas":
      "Av. Antonio Varas 880, Providencia, Región Metropolitana",

    "Universidad Adventista de Chile":
      "Avenida Libertador Bernardo O'Higgins 03434, Chillán, Región de Ñuble"
  };

  // Dirección final con " (Casa Central)"
  const direccionCompleta =
    (DIRECCIONES_CASA_CENTRAL[detalles.universidad] || "Casa Central") +
    " (Casa Central)";

  // GOOGLE MAPS
  const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccionCompleta
  )}`;

  // FORMATO ARANCEL
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
          <strong>Dirección:</strong>{" "}
          <a href={linkMaps} target="_blank" rel="noopener noreferrer">
            📍 {direccionCompleta}
          </a>
        </p>
      </div>
    </div>
  );
}

export default DetallesCarreraModal;
