import React, { useState, useEffect } from "react";
import "../App.css";
import DetallesCarreraModal from "../components/DetallesCarreraModal";
import AuthModal from "../components/AuthModal";   // <<=== NUEVO

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

  // ===== FAVORITOS Y AUTENTICACIÓN =====
  const [favoritos, setFavoritos] = useState([]);
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [mostrarAuthModal, setMostrarAuthModal] = useState(false);

  // Cargar resultados guardados
  useEffect(() => {
    const local = localStorage.getItem("resultadosSimulacion");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) setResultados(parsed);
      } catch (e) {}
    }
  }, []);

  // Al cargar, revisar si existe un token (usuario conectado)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUsuarioRegistrado(true);
    }

    const favLocal = sessionStorage.getItem("usuarioFavoritos");
    if (favLocal) {
      try {
        setFavoritos(JSON.parse(favLocal));
      } catch {}
    }
  }, []);

  // Guardar favoritos en sessionStorage
  const guardarFavoritos = (nuevosFavoritos) => {
    setFavoritos(nuevosFavoritos);
    sessionStorage.setItem("usuarioFavoritos", JSON.stringify(nuevosFavoritos));

    const count = nuevosFavoritos.length;
    window.dispatchEvent(new CustomEvent("favoritosUpdated", { detail: count }));
  };

  // Alternar favorito
  const toggleFavorito = (carrera) => {
    // Si NO está autenticado → mostrar modal real
    if (!usuarioRegistrado) {
      setMostrarAuthModal(true);
      return;
    }

    const esFavorito = favoritos.some(
      f => f.carrera === carrera.carrera && f.universidad === carrera.universidad
    );

    if (esFavorito) {
      const nuevosFavoritos = favoritos.filter(
        f => !(f.carrera === carrera.carrera && f.universidad === carrera.universidad)
      );
      guardarFavoritos(nuevosFavoritos);
    } else {
      const nuevos = [...favoritos, carrera];
      guardarFavoritos(nuevos);
    }
  };

  const esFavorito = (carrera) =>
    favoritos.some(f => f.carrera === carrera.carrera && f.universidad === carrera.universidad);

  // Cargar áreas desde backend
  useEffect(() => {
    fetch("/simulador/areas")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setListaAreas(data))
      .catch(() => {});
  }, []);

  const abrirModal = (c) => {
    setCarreraSeleccionada({
      ...c,
      id: c.carrera_id,
      carrera_id: c.carrera_id,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  const shorten = (text, max = 30) =>
    text && text.length > max ? text.slice(0, max) + "..." : text || "";

  // Filtrado
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

  // Paginación
  const renderPagination = (current, total, onPage) => {
    if (total <= 1) return null;

    const pages = [];
    const rangeSize = 2;

    if (current > 1) {
      pages.push(1);
      if (current > rangeSize + 2) pages.push("...");
    }

    const start = Math.max(2, current - rangeSize);
    const end = Math.min(total - 1, current + rangeSize);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total) {
      if (current < total - rangeSize - 1) pages.push("...");
      pages.push(total);
    }

    return (
      <div className="paginacion">
        <button onClick={() => onPage(Math.max(1, current - 1))} disabled={current === 1}>
          « Anterior
        </button>

        <div className="paginacion-numeros">
          {pages.map((p, idx) =>
            p === "..."
              ? <span key={idx} className="pagin-ellipsis">...</span>
              : (
                <button
                  key={p}
                  className={current === p ? "current" : ""}
                  onClick={() => onPage(p)}
                >
                  {p}
                </button>
              )
          )}
        </div>

        <button onClick={() => onPage(Math.min(total, current + 1))} disabled={current === total}>
          Siguiente »
        </button>
      </div>
    );
  };

  return (
    <div className="opciones-wrapper">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Opciones Universitarias</h1>

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

      {/* TABS */}
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

        {/* TAB CONTENT */}
        <div className="tab-content">
          {activeTab === "accesibles" && (
            <>
              {visiblesAcc.length === 0 ? (
                <p>No hay carreras accesibles.</p>
              ) : (
                visiblesAcc.map((c, i) => (
                  <div key={i} className="resultado-card-wrapper">
                    <div className="resultado-card" onClick={() => abrirModal(c)}>
                      <h4>{c.carrera}</h4>
                      <p className="subtitulo"><strong>{c.universidad}</strong> — {c.area}</p>

                      <div className="meta">
                        <span>Corte: <strong>{c.puntaje_corte}</strong></span>
                        <span>Tú: <strong>{c.puntaje_ponderado}</strong></span>
                        <span className="margen positivo">+{c.margen.toFixed(1)}</span>
                      </div>
                    </div>

                    <button
                      className="btn-favorito"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(c);
                      }}
                    >
                      {esFavorito(c) ? "⭐" : "☆"}
                    </button>
                  </div>
                ))
              )}

              {totalPagAcc > 1 && renderPagination(paginaAcc, totalPagAcc, setPaginaAcc)}
            </>
          )}

          {activeTab === "no-accesibles" && (
            <>
              {visiblesNoAcc.length === 0 ? (
                <p>No hay carreras no accesibles.</p>
              ) : (
                visiblesNoAcc.map((c, i) => (
                  <div key={i} className="resultado-card-wrapper">
                    <div className="resultado-card" onClick={() => abrirModal(c)}>
                      <h4>{c.carrera}</h4>
                      <p className="subtitulo"><strong>{c.universidad}</strong> — {c.area}</p>

                      <div className="meta">
                        <span>Corte: <strong>{c.puntaje_corte}</strong></span>
                        <span>Tú: <strong>{c.puntaje_ponderado}</strong></span>
                        <span className="margen negativo">{c.margen.toFixed(1)}</span>
                      </div>
                    </div>

                    <button
                      className="btn-favorito"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(c);
                      }}
                    >
                      {esFavorito(c) ? "⭐" : "☆"}
                    </button>
                  </div>
                ))
              )}

              {totalPagNoAcc > 1 && renderPagination(paginaNoAcc, totalPagNoAcc, setPaginaNoAcc)}
            </>
          )}
        </div>
      </div>

      {/* MODAL AUTENTICACIÓN */}
      <AuthModal
        abierta={mostrarAuthModal}
        onCerrar={() => setMostrarAuthModal(false)}
        onLoginSuccess={() => {
          setUsuarioRegistrado(true);
          window.dispatchEvent(new Event("userRegistered"));
        }}
      />

      {/* MODAL DETALLE CARRERA */}
      <DetallesCarreraModal
        abierta={modalAbierto}
        onCerrar={cerrarModal}
        carrera={carreraSeleccionada}
      />

    </div>
  );
}

export default Opciones;
