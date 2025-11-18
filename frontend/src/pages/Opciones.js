import React, { useState, useEffect } from "react";
import "../App.css";
import DetallesCarreraModal from "../components/DetallesCarreraModal";

function Opciones() {
  const [resultados, setResultados] = useState([]);
  const [filtros, setFiltros] = useState({ carrera: "", universidad: "", area: "" });
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const [listaAreas, setListaAreas] = useState([]);

  const [paginaAccesibles, setPaginaAccesibles] = useState(1);
  const [paginaNoAccesibles, setPaginaNoAccesibles] = useState(1);
  const porPagina = 10;

  // ============================================================
  // 🔹 Modal de detalles
  // ============================================================
  const [modalAbierto, setModalAbierto] = useState(false);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);

  const abrirModal = (carrera) => {
    setCarreraSeleccionada(carrera);
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  // ============================================================
  // 🔹 Función para recortar textos largos
  // ============================================================
  const shorten = (text, max = 40) => {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "..." : text;
  };

  // ============================================================
  // Cargar resultados guardados
  // ============================================================
  useEffect(() => {
    const local = localStorage.getItem("resultadosSimulacion");
    if (local) {
      try {
        const parsedData = JSON.parse(local);
        if (Array.isArray(parsedData)) {
          setResultados(parsedData);
        }
      } catch (error) {
        console.error("Error al parsear resultados:", error);
      }
    }
  }, []);

  // ============================================================
  // Cargar ÁREAS desde backend
  // ============================================================
  useEffect(() => {
    fetch("http://localhost:8000/simulador/areas")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setListaAreas(data);
      })
      .catch((err) => console.error("Error cargando áreas:", err));
  }, []);

  // ============================================================
  // Filtrar resultados
  // ============================================================
  const carrerasFiltradas = resultados.filter((c) => {
    return (
      (!filtros.carrera || c.carrera === filtros.carrera) &&
      (!filtros.universidad || c.universidad === filtros.universidad) &&
      (!filtros.area || c.area === filtros.area)
    );
  });

  const accesibles = carrerasFiltradas.filter((c) => c.margen >= 0);
  const noAccesibles = carrerasFiltradas.filter((c) => c.margen < 0);

  const totalPagAcc = Math.ceil(accesibles.length / porPagina);
  const totalPagNoAcc = Math.ceil(noAccesibles.length / porPagina);

  const visiblesAccesibles = accesibles.slice(
    (paginaAccesibles - 1) * porPagina,
    paginaAccesibles * porPagina
  );

  const visiblesNoAccesibles = noAccesibles.slice(
    (paginaNoAccesibles - 1) * porPagina,
    paginaNoAccesibles * porPagina
  );

  useEffect(() => {
    setPaginaAccesibles(1);
    setPaginaNoAccesibles(1);
  }, [filtros]);

  return (
    <div className="opciones-wrapper">
      <h1>Opciones Universitarias</h1>

      {mostrarFiltros && (
        <div className="filtros-container">
          <div className="filtros-card">
            <button
              className="boton-filtros-ocultar"
              onClick={() => setMostrarFiltros(false)}
            >
              Ocultar filtros
            </button>

            <div className="fila-filtros">
              {/* ================== SELECT CARRERA ================== */}
              <div className="campo">
                <label>Carrera:</label>
                <select
                  value={filtros.carrera}
                  onChange={(e) => setFiltros({ ...filtros, carrera: e.target.value })}
                >
                  <option value="">Todas las carreras</option>

                  {[...new Set(resultados.map((r) => r.carrera))].map((c) => (
                    <option key={c} value={c}>
                      {shorten(c, 40)}
                    </option>
                  ))}
                </select>
              </div>

              {/* ================== SELECT UNIVERSIDAD ================== */}
              <div className="campo">
                <label>Universidad:</label>
                <select
                  value={filtros.universidad}
                  onChange={(e) =>
                    setFiltros({ ...filtros, universidad: e.target.value })
                  }
                >
                  <option value="">Todas las universidades</option>
                  {[...new Set(resultados.map((r) => r.universidad))].map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* ================== SELECT ÁREA ================== */}
              <div className="campo">
                <label>Área:</label>
                <select
                  value={filtros.area}
                  onChange={(e) => setFiltros({ ...filtros, area: e.target.value })}
                >
                  <option value="">Todas las áreas</option>
                  {listaAreas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {!mostrarFiltros && (
        <button className="boton-filtros-mostrar" onClick={() => setMostrarFiltros(true)}>
          Mostrar filtros
        </button>
      )}

      {/* ========================================================
                  BLOQUES DE RESULTADOS
      ======================================================== */}
      <div className="bloques-opciones">
        
        {/* ================= ACCESIBLES ================= */}
        <div className="bloque accesibles">
          <h3>✅ Carreras accesibles ({accesibles.length})</h3>

          {visiblesAccesibles.length === 0 ? (
            <p>No hay carreras accesibles.</p>
          ) : (
            visiblesAccesibles.map((c, i) => (
              <div
                key={i}
                className="resultado-card"
                onClick={() => abrirModal(c)}
              >
                <h4>{c.carrera}</h4>
                <p>
                  <strong>{c.universidad}</strong> — {c.area}
                </p>
                <p>
                  Corte: {c.puntaje_corte} pts | Tú: {c.puntaje_ponderado} pts |{" "}
                  <span className="margen positivo">
                    +{c.margen.toFixed(1)} pts
                  </span>
                </p>
              </div>
            ))
          )}

          {totalPagAcc > 1 && (
            <div className="paginacion">
              <button
                onClick={() => setPaginaAccesibles((p) => Math.max(p - 1, 1))}
                disabled={paginaAccesibles === 1}
              >
                ← Anterior
              </button>

              <span>
                Página {paginaAccesibles} de {totalPagAcc}
              </span>

              <button
                onClick={() => setPaginaAccesibles((p) => Math.min(p + 1, totalPagAcc))}
                disabled={paginaAccesibles === totalPagAcc}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>

        {/* ================= NO ACCESIBLES ================= */}
        <div className="bloque no-accesibles">
          <h3>❌ Carreras no accesibles ({noAccesibles.length})</h3>

          {visiblesNoAccesibles.length === 0 ? (
            <p>No hay carreras no accesibles.</p>
          ) : (
            visiblesNoAccesibles.map((c, i) => (
              <div
                key={i}
                className="resultado-card"
                onClick={() => abrirModal(c)}
              >
                <h4>{c.carrera}</h4>
                <p>
                  <strong>{c.universidad}</strong> — {c.area}
                </p>
                <p>
                  Corte: {c.puntaje_corte} pts | Tú: {c.puntaje_ponderado} pts |{" "}
                  <span className="margen negativo">{c.margen.toFixed(1)} pts</span>
                </p>
              </div>
            ))
          )}

          {totalPagNoAcc > 1 && (
            <div className="paginacion">
              <button
                onClick={() => setPaginaNoAccesibles((p) => Math.max(p - 1, 1))}
                disabled={paginaNoAccesibles === 1}
              >
                ← Anterior
              </button>
              <span>
                Página {paginaNoAccesibles} de {totalPagNoAcc}
              </span>
              <button
                onClick={() =>
                  setPaginaNoAccesibles((p) => Math.min(p + 1, totalPagNoAcc))
                }
                disabled={paginaNoAccesibles === totalPagNoAcc}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
                  MODAL DETALLES
      ======================================================== */}
      <DetallesCarreraModal
        abierta={modalAbierto}
        onCerrar={cerrarModal}
        carrera={carreraSeleccionada}
      />
    </div>
  );
}

export default Opciones;
