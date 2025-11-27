import React, { useState, useEffect } from "react";
import "../App.css";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "", apellido: "", edad: "" });

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
      } catch (e) {
        console.error("Error cargando usuario:", e);
      }
    }
  }, []);

  const toggleFavorito = (carrera) => {
    const nuevosFavoritos = favoritos.filter(
      (f) => !(f.carrera === carrera.carrera && f.universidad === carrera.universidad)
    );
    setFavoritos(nuevosFavoritos);
    sessionStorage.setItem("usuarioFavoritos", JSON.stringify(nuevosFavoritos));
    
    // Notificar a la app que los favoritos cambiaron
    try {
      const count = Array.isArray(nuevosFavoritos) ? nuevosFavoritos.length : 0;
      window.dispatchEvent(new CustomEvent("favoritosUpdated", { detail: count }));
    } catch (e) {}
  };

  return (
    <div className="favoritos-wrapper">
      <div className="favoritos-content">
        <h1>Mis Favoritos</h1>
        <div className="bienvenida-card">
          <h2>
            Bienvenida {usuario.nombre} {usuario.apellido}
          </h2>
          <p style={{ fontSize: "16px", marginTop: "10px" }}>
            Aquí tienes tus carreras favoritas:
          </p>
        </div>

        {favoritos.length === 0 ? (
          <div className="sin-favoritos">
            <p>No tienes ni una carrera agregadas a favoritos</p>
          </div>
        ) : (
          <div className="favoritos-list">
            {favoritos.map((c, i) => (
              <div key={i} className="resultado-card">
                <h4>{c.carrera}</h4>
                <p className="subtitulo">
                  <strong>{c.universidad}</strong> — {c.area}
                </p>
                <div className="meta">
                  <span>
                    Corte: <strong>{c.puntaje_corte}</strong> pts
                  </span>
                  <span>
                    Tú: <strong>{c.puntaje_ponderado}</strong> pts
                  </span>
                  <span className={`margen ${c.margen >= 0 ? "positivo" : "negativo"}`}>
                    {c.margen >= 0 ? `+${c.margen.toFixed(1)}` : c.margen.toFixed(1)} pts
                  </span>
                </div>
                <button
                  onClick={() => toggleFavorito(c)}
                  style={{
                    marginTop: "10px",
                    background: "#ff6b6b",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ✕ Quitar de favoritos
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoritos;
