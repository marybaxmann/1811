import React, { useState, useEffect } from "react";
import "../App.css";
import DetallesCarreraModal from "../components/DetallesCarreraModal";

function Opciones() {
  const [resultados, setResultados] = useState([]);
  const [filtros, setFiltros] = useState({ carrera: "", universidad: "", area: "" });
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [listaAreas, setListaAreas] = useState([]);

  const [activeTab, setActiveTab] = useState("accesibles");

  const porPagina = 10;
  const [paginaAcc, setPaginaAcc] = useState(1);
  const [paginaNoAcc, setPaginaNoAcc] = useState(1);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);

  // Cargar resultados guardados
  useEffect(() => {
    const local = localStorage.getItem("resultadosSimulacion");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) setResultados(parsed);
      } catch (e) {
        console.error("Error parseando resultados:", e);
      }
    }
  }, []);

  // Cargar áreas desde API
  useEffect(() => {
    fetch("/simulador/areas")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setListaAreas(data))
      .catch(() => {});
  }, []);

  const abrirModal = (c) => {
    setCarreraSeleccionada(c);
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  const shorten = (text, max = 40) =>
    text && text.length > max ? text.slice(0, max) + "..." : text || "";

  // Aplicar filtros
  const carrerasFiltradas = resultados.filter((c) => {
    return (
      (!filtros.carrera || c.carrera === filtros.carrera) &&
      (!filtros.universidad || c.universidad === filtros.universidad) &&
      (!filtros.area || c.area === filtros.area)
    );
  });

  const accesibles = carrerasFiltradas.filter((c) => c.margen >= 0);
  const noAccesibles = carrerasFiltradas.filter((c) => c.margen < 0);

  const totalPagAcc = Math.max(1, Math.ceil(accesibles.length / porPagina));
  const totalPagNoAcc = Math.max(1, Math.ceil(noAccesibles.length / porPagina));

  const visiblesAcc = accesibles.slice((paginaAcc - 1) * porPagina, paginaAcc * porPagina);
  const visiblesNoAcc = noAccesibles.slice((paginaNoAcc - 1) * porPagina, paginaNoAcc * porPagina);

  useEffect(() => {
    setPaginaAcc(1);
    setPaginaNoAcc(1);
  }, [filtros]);

  return (
    <div className="opciones-wrapper">
      <h1>Opciones Universitarias</h1>

      {/* FILTROS */}
      {mostrarFiltros && (
        <div className="filtros-container">
          <div className="filtros-card">
            <button className="boton-filtros-ocultar" onClick={() => setMostrarFiltros(false)}>
              Ocultar filtros
            </button>

            <div className="fila-filtros">
              <div className="campo">
                <label>Carrera:</label>
                <select value={filtros.carrera} onChange={(e) => setFiltros({ ...filtros, carrera: e.target.value })}>
                  <option value="">Todas las carreras</option>
                  {[...new Set(resultados.map((r) => r.carrera))].map((c) => (
                    <option key={c} value={c}>{shorten(c)}</option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label>Universidad:</label>
                <select value={filtros.universidad} onChange={(e) => setFiltros({ ...filtros, universidad: e.target.value })}>
                  <option value="">Todas las universidades</option>
                  {[...new Set(resultados.map((r) => r.universidad))].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label>Área:</label>
                <select value={filtros.area} onChange={(e) => setFiltros({ ...filtros, area: e.target.value })}>
                  <option value="">Todas las áreas</option>
                  {listaAreas.map((a) => (
                    <option key={a} value={a}>{a}</option>
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

      {/* PANEL DE RESULTADOS (VENTANA + TABS) */}
      <div className="tabs-container">

        <div className="tabs">
          <button
              className={`tab accesible ${activeTab === "accesibles" ? "active" : ""}`}
            onClick={() => setActiveTab("accesibles")}
          >
            ✅ Carreras accesibles ({accesibles.length})
          </button>

          <button
              className={`tab no-accesible ${activeTab === "no-accesibles" ? "active" : ""}`}
            onClick={() => setActiveTab("no-accesibles")}
          >
            ❌ Carreras no accesibles ({noAccesibles.length})
          </button>
        </div>

        {/* CONTENIDO DE LA VENTANA */}
        <div className="tab-content">
          {/* TAB ACCESIBLES */}
          {activeTab === "accesibles" && (
            <>
              {visiblesAcc.length === 0 ? (
                <p>No hay carreras accesibles.</p>
              ) : (
                visiblesAcc.map((c, i) => (
                  <div key={i} className="resultado-card" onClick={() => abrirModal(c)}>
                    <h4>{c.carrera}</h4>
                    <p className="subtitulo"><strong>{c.universidad}</strong> — {c.area}</p>

                    <div className="meta">
                      <span>Corte: <strong>{c.puntaje_corte}</strong> pts</span>
                      <span>Tú: <strong>{c.puntaje_ponderado}</strong> pts</span>
                      <span className="margen positivo">+{c.margen.toFixed(1)} pts</span>
                    </div>
                  </div>
                ))
              )}

              {totalPagAcc > 1 && (
                <div className="paginacion-numeros">
                  {Array.from({ length: totalPagAcc }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`pagin-num ${paginaAcc === idx + 1 ? "current" : ""}`}
                      onClick={() => setPaginaAcc(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB NO ACCESIBLES */}
          {activeTab === "no-accesibles" && (
            <>
              {visiblesNoAcc.length === 0 ? (
                <p>No hay carreras no accesibles.</p>
              ) : (
                visiblesNoAcc.map((c, i) => (
                  <div key={i} className="resultado-card" onClick={() => abrirModal(c)}>
                    <h4>{c.carrera}</h4>
                    <p className="subtitulo"><strong>{c.universidad}</strong> — {c.area}</p>

                    <div className="meta">
                      <span>Corte: <strong>{c.puntaje_corte}</strong> pts</span>
                      <span>Tú: <strong>{c.puntaje_ponderado}</strong> pts</span>
                      <span className="margen negativo">{c.margen.toFixed(1)} pts</span>
                    </div>
                  </div>
                ))
              )}

              {totalPagNoAcc > 1 && (
                <div className="paginacion-numeros">
                  {Array.from({ length: totalPagNoAcc }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`pagin-num ${paginaNoAcc === idx + 1 ? "current" : ""}`}
                      onClick={() => setPaginaNoAcc(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL DETALLES */}
      <DetallesCarreraModal
        abierta={modalAbierto}
        onCerrar={cerrarModal}
        carrera={carreraSeleccionada}
      />
    </div>
  );
}

export default Opciones;
