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

  // ===== NUEVOS ESTADOS PARA FAVORITOS =====
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: "", apellido: "", edad: "" });
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

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

  // Cargar favoritos y usuario desde sessionStorage (persisten solo en la pestaña)
  useEffect(() => {
    const favLocal = sessionStorage.getItem("usuarioFavoritos");
    const userLocal = sessionStorage.getItem("usuarioRegistrado");

    if (favLocal) {
      try {
        setFavoritos(JSON.parse(favLocal));
      } catch (e) {
        console.error("Error cargando favoritos:", e);
      }
    }

    if (userLocal) {
      try {
        const userData = JSON.parse(userLocal);
        setUsuario(userData);
        setUsuarioRegistrado(true);
      } catch (e) {
        console.error("Error cargando usuario:", e);
      }
    }
  }, []);

  // Guardar favoritos en localStorage
  const guardarFavoritos = (nuevosFavoritos) => {
    setFavoritos(nuevosFavoritos);
    sessionStorage.setItem("usuarioFavoritos", JSON.stringify(nuevosFavoritos));
  };

  // Alternar favorito
  const toggleFavorito = (carrera) => {
    if (!usuarioRegistrado) {
      setMostrarModalRegistro(true);
      return;
    }

    const esFavorito = favoritos.some(f => f.carrera === carrera.carrera && f.universidad === carrera.universidad);
    
    if (esFavorito) {
      const nuevosFavoritos = favoritos.filter(f => !(f.carrera === carrera.carrera && f.universidad === carrera.universidad));
      guardarFavoritos(nuevosFavoritos);
      // Notificar a la app que los favoritos cambiaron
      try {
        const count = Array.isArray(nuevosFavoritos) ? nuevosFavoritos.length : 0;
        window.dispatchEvent(new CustomEvent("favoritosUpdated", { detail: count }));
      } catch (e) {}
    } else {
      const nuevos = [...favoritos, carrera];
      guardarFavoritos(nuevos);
      // Notificar a la app que los favoritos cambiaron
      try {
        const count = Array.isArray(nuevos) ? nuevos.length : 0;
        window.dispatchEvent(new CustomEvent("favoritosUpdated", { detail: count }));
      } catch (e) {}
    }
  };

  // Registrar usuario
  const registrarUsuario = () => {
    if (usuario.nombre.trim() && usuario.apellido.trim() && usuario.edad.trim()) {
      setUsuarioRegistrado(true);
      sessionStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
      setMostrarModalRegistro(false);
      // Notificar a la app que el usuario se registró (para mostrar enlace en navbar)
      window.dispatchEvent(new Event("userRegistered"));
    } else {
      alert("Por favor completa todos los campos");
    }
  };

  // Verificar si carrera es favorita
  const esFavorito = (carrera) => {
    return favoritos.some(f => f.carrera === carrera.carrera && f.universidad === carrera.universidad);
  };

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

  const shorten = (text, max = 30) =>
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

  // Paginador compacto: devuelve elementos para renderizar
  const renderPagination = (current, total, onPage) => {
    if (total <= 1) return null;

    const pages = [];
    const rangeSize = 2; // Mostrar 2 números a cada lado de la página actual

    // Siempre mostrar página 1
    if (current > 1) {
      pages.push(1);
      if (current > rangeSize + 2) pages.push("...");
    }

    // Mostrar rango alrededor de la página actual
    const start = Math.max(2, current - rangeSize);
    const end = Math.min(total - 1, current + rangeSize);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Siempre mostrar última página
    if (current < total) {
      if (current < total - rangeSize - 1) pages.push("...");
      pages.push(total);
    }

    return (
      <div className="paginacion" aria-label="Paginación">
        <button onClick={() => onPage(Math.max(1, current - 1))} disabled={current === 1} className="pagin-boton">
          « Anterior
        </button>

        <div className="paginacion-numeros">
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={`e-${idx}`} className="pagin-ellipsis">...</span>
            ) : (
              <button
                key={p}
                className={`pagin-num ${current === p ? "current" : ""}`}
                onClick={() => onPage(p)}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button onClick={() => onPage(Math.min(total, current + 1))} disabled={current === total} className="pagin-boton">
          Siguiente »
        </button>
      </div>
    );
  };

  return (
    <div className="opciones-wrapper">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <h1>Opciones Universitarias</h1>
      </div>

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
                  <div key={i} className="resultado-card-wrapper">
                    <div className="resultado-card" onClick={() => abrirModal(c)}>
                      <h4>{c.carrera}</h4>
                      <p className="subtitulo"><strong>{c.universidad}</strong> — {c.area}</p>

                      <div className="meta">
                        <span>Corte: <strong>{c.puntaje_corte}</strong> pts</span>
                        <span>Tú: <strong>{c.puntaje_ponderado}</strong> pts</span>
                        <span className="margen positivo">+{c.margen.toFixed(1)} pts</span>
                      </div>
                    </div>
                    <button 
                      className="btn-favorito"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(c);
                      }}
                      title="Agregar a favoritos"
                    >
                      {esFavorito(c) ? "⭐" : "☆"}
                    </button>
                  </div>
                ))
              )}

              {totalPagAcc > 1 && (
                renderPagination(paginaAcc, totalPagAcc, setPaginaAcc)
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
                  <div key={i} className="resultado-card-wrapper">
                    <div className="resultado-card" onClick={() => abrirModal(c)}>
                      <h4>{c.carrera}</h4>
                      <p className="subtitulo"><strong>{c.universidad}</strong> — {c.area}</p>

                      <div className="meta">
                        <span>Corte: <strong>{c.puntaje_corte}</strong> pts</span>
                        <span>Tú: <strong>{c.puntaje_ponderado}</strong> pts</span>
                        <span className="margen negativo">{c.margen.toFixed(1)} pts</span>
                      </div>
                    </div>
                    <button 
                      className="btn-favorito"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorito(c);
                      }}
                      title="Agregar a favoritos"
                    >
                      {esFavorito(c) ? "⭐" : "☆"}
                    </button>
                  </div>
                ))
              )}

              {totalPagNoAcc > 1 && (
                renderPagination(paginaNoAcc, totalPagNoAcc, setPaginaNoAcc)
              )}
            </>
          )}
        </div>
        </div>

      {/* MODAL DE REGISTRO */}
      {mostrarModalRegistro && (
        <div className="modal-overlay" onClick={() => setMostrarModalRegistro(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h2>Registrarse para Favoritos</h2>
            <p style={{ marginBottom: "20px" }}>Ingresa tus datos para acceder a tu lista de favoritos</p>
            
            <div className="modal-form">
              <div className="campo">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={usuario.nombre}
                  onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                  placeholder="Tu nombre"
                />
              </div>

              <div className="campo">
                <label>Apellido:</label>
                <input
                  type="text"
                  value={usuario.apellido}
                  onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
                  placeholder="Tu apellido"
                />
              </div>

              <div className="campo">
                <label>Edad:</label>
                <input
                  type="number"
                  value={usuario.edad}
                  onChange={(e) => setUsuario({ ...usuario, edad: e.target.value })}
                  placeholder="Tu edad"
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
              <button onClick={registrarUsuario} className="boton-simular">
                Registrarse
              </button>
              <button onClick={() => setMostrarModalRegistro(false)} style={{ background: "#999" }} className="boton-simular">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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
