import React, { useState } from "react";
import "./ResultadosTable.css";

function ResultadosTable({ resultados }) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroCarrera, setFiltroCarrera] = useState("");
  const [filtroUniversidad, setFiltroUniversidad] = useState("");
  const [filtroArea, setFiltroArea] = useState("");

  if (!resultados || resultados.length === 0) return null;

  // ===== Función para inferir el área según la carrera =====
  const inferirArea = (nombreCarrera) => {
    const carrera = nombreCarrera.toLowerCase();

    if (carrera.includes("ingeniería")) return "Ingeniería";
    if (carrera.includes("civil") || carrera.includes("industrial"))
      return "Ingeniería";
    if (carrera.includes("educación") || carrera.includes("pedagogía"))
      return "Educación";
    if (
      carrera.includes("medicina") ||
      carrera.includes("enfermería") ||
      carrera.includes("odontología") ||
      carrera.includes("nutrición") ||
      carrera.includes("fonoaudiología")
    )
      return "Salud";
    if (
      carrera.includes("biología") ||
      carrera.includes("química") ||
      carrera.includes("física") ||
      carrera.includes("matemática")
    )
      return "Ciencias";
    if (carrera.includes("derecho") || carrera.includes("legal")) return "Derecho";
    if (
      carrera.includes("arquitectura") ||
      carrera.includes("arte") ||
      carrera.includes("diseño") ||
      carrera.includes("música")
    )
      return "Artes y Humanidades";
    if (carrera.includes("psicología") || carrera.includes("sociología"))
      return "Ciencias Sociales";
    if (
      carrera.includes("contabilidad") ||
      carrera.includes("auditor") ||
      carrera.includes("administración") ||
      carrera.includes("comercial")
    )
      return "Economía y Negocios";
    if (
      carrera.includes("computación") ||
      carrera.includes("informática") ||
      carrera.includes("software") ||
      carrera.includes("programación")
    )
      return "Tecnología";
    if (carrera.includes("agronomía") || carrera.includes("ambiental"))
      return "Agronomía y Medio Ambiente";

    return "General";
  };

  // ===== Aplicar filtros =====
  const filtrados = resultados.filter((r) => {
    const coincideCarrera = filtroCarrera
      ? r.carrera.toLowerCase().includes(filtroCarrera.toLowerCase())
      : true;
    const coincideUniversidad = filtroUniversidad
      ? r.universidad.toLowerCase().includes(filtroUniversidad.toLowerCase())
      : true;
    const coincideArea = filtroArea
      ? (r.area
          ? r.area.toLowerCase().includes(filtroArea.toLowerCase())
          : inferirArea(r.carrera)
              .toLowerCase()
              .includes(filtroArea.toLowerCase()))
      : true;

    return coincideCarrera && coincideUniversidad && coincideArea;
  });

  // ===== Separar accesibles y no accesibles =====
  const accesibles = filtrados.filter((r) => r.margen >= 0);
  const noAccesibles = filtrados.filter((r) => r.margen < 0);

  return (
    <div className="resultados-container">
      <h2>Opciones Universitarias</h2>

      {/* Botón mostrar/ocultar filtros */}
      <button
        className="btn-filtros"
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
      >
        {mostrarFiltros ? "🔽 Ocultar filtros" : "🔍 Mostrar filtros"}
      </button>

      {/* Filtros */}
      {mostrarFiltros && (
        <div className="filtros-container">
          <h3>🎓 Filtros</h3>
          <div className="filtros">
            <div className="filtro-item">
              <label>Carrera:</label>
              <select
                value={filtroCarrera}
                onChange={(e) => setFiltroCarrera(e.target.value)}
              >
                <option value="">Todas las carreras</option>
                {[...new Set(resultados.map((r) => r.carrera))].map(
                  (carrera, i) => (
                    <option key={i} value={carrera}>
                      {carrera}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="filtro-item">
              <label>Universidad:</label>
              <select
                value={filtroUniversidad}
                onChange={(e) => setFiltroUniversidad(e.target.value)}
              >
                <option value="">Todas las universidades</option>
                {[...new Set(resultados.map((r) => r.universidad))].map(
                  (universidad, i) => (
                    <option key={i} value={universidad}>
                      {universidad}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="filtro-item">
              <label>Área:</label>
              <select
                value={filtroArea}
                onChange={(e) => setFiltroArea(e.target.value)}
              >
                <option value="">Todas las áreas</option>
                {[...new Set(
                  resultados.map((r) =>
                    r.area ? r.area.trim() : inferirArea(r.carrera)
                  )
                )].map((area, i) => (
                  <option key={i} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Contador Global */}
      <div className="contador-global">
        <p>
          {resultados.length} opciones analizadas (
          <strong>{accesibles.length}</strong> accesibles)
        </p>
      </div>

      {/* Secciones de Accesibles y No Accesibles */}
      <div className="seccion-resultados">
        {/* Accesibles */}
        <div className="columna-accesibles">
          <h3 className="titulo-verde">
            ✅ Carreras accesibles ({accesibles.length})
          </h3>
          <div className="tarjetas-grid">
            {accesibles.map((r, i) => (
              <div key={i} className="tarjeta accesible">
                <h3>{r.carrera}</h3>
                <p className="universidad">{r.universidad}</p>

                <div className="detalle">
                  <span className="puntaje">
                    🟢 {r.puntaje_ponderado} pts ponderado
                  </span>
                  <span className="puntaje-corte">
                    Corte: {r.puntaje_corte} pts
                  </span>
                </div>

                <p className="comparacion verde">
                  ✅ Por encima del corte por {r.margen} pts
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* No accesibles */}
        <div className="columna-noaccesibles">
          <h3 className="titulo-rojo">
            ❌ Carreras no accesibles ({noAccesibles.length})
          </h3>
          <div className="tarjetas-grid">
            {noAccesibles.map((r, i) => (
              <div key={i} className="tarjeta no-accesible">
                <h3>{r.carrera}</h3>
                <p className="universidad">{r.universidad}</p>

                <div className="detalle">
                  <span className="puntaje-rojo">
                    🔴 {r.puntaje_ponderado} pts ponderado
                  </span>
                  <span className="puntaje-corte">
                    Corte: {r.puntaje_corte} pts
                  </span>
                </div>

                <p className="comparacion rojo">
                  ❌ Por debajo del corte por {Math.abs(r.margen)} pts
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultadosTable;
