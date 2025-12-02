import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import AuthModal from "./AuthModal";  // <<=== MODAL DE LOGIN/REGISTRO REAL

function Navbar() {
  const navigate = useNavigate();

  const [favoritosCount, setFavoritosCount] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [mostrarAuth, setMostrarAuth] = useState(false);
  const [modoAuth, setModoAuth] = useState("login"); // login | register
  const [search, setSearch] = useState("");

  // ==============================
  // CARGAR ESTADO INICIAL
  // ==============================
  useEffect(() => {
    // Cargar favoritos
    const fav = sessionStorage.getItem("usuarioFavoritos");
    if (fav) setFavoritosCount(JSON.parse(fav).length);

    // Cargar usuario
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setUsuario(JSON.parse(user));
    }

    // Eventos globales
    const favListener = (e) => setFavoritosCount(e.detail);
    const userListener = () => {
      const u = localStorage.getItem("user");
      if (u) setUsuario(JSON.parse(u));
    };

    window.addEventListener("favoritosUpdated", favListener);
    window.addEventListener("userLoggedIn", userListener);
    window.addEventListener("userRegistered", userListener);

    return () => {
      window.removeEventListener("favoritosUpdated", favListener);
      window.removeEventListener("userLoggedIn", userListener);
      window.removeEventListener("userRegistered", userListener);
    };
  }, []);

  // ==============================
  // LOGOUT
  // ==============================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("usuarioFavoritos");
    setUsuario(null);
    setFavoritosCount(0);
    navigate("/");
  };

  // ==============================
  // BUSCAR UNIVERSIDAD (NAVEGA A OPCIONES)
  // ==============================
  const onSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/opciones?u=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* IZQUIERDA */}
        <div className="navbar-left">
          <h2 className="navbar-title" onClick={() => navigate("/")}>
            SimuladorPAES
          </h2>

          <input
            type="text"
            className="navbar-search"
            placeholder="Buscar universidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onSearch}
          />
        </div>

        {/* ENLACES */}
        <nav className="navbar-links">
          <Link to="/">Inicio</Link>
          <Link to="/simular">Simular</Link>
          <Link to="/opciones">Opciones</Link>
        </nav>

        {/* DERECHA */}
        <div className="navbar-right">

          {/* FAVORITOS */}
          <button
            className="nav-favoritos-btn"
            onClick={() => navigate("/favoritos")}
          >
            ⭐ {favoritosCount}
          </button>

          {/* SI ESTÁ LOGEADO */}
          {usuario ? (
            <div className="navbar-user-section">
              <span className="navbar-user-name">
                Hola, {usuario.nombre || usuario.email}
              </span>
              <button className="navbar-logout-btn" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              {/* INICIAR SESIÓN */}
              <button
                className="navbar-login-btn"
                onClick={() => {
                  setModoAuth("login");
                  setMostrarAuth(true);
                }}
              >
                Iniciar sesión
              </button>

              {/* REGISTRARSE */}
              <button
                className="navbar-register-btn"
                onClick={() => {
                  setModoAuth("register");
                  setMostrarAuth(true);
                }}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>

      {/* MODAL AUTENTICACIÓN */}
      <AuthModal
        abierta={mostrarAuth}
        modo={modoAuth}
        onCerrar={() => setMostrarAuth(false)}
        onLoginSuccess={() => {
          const u = localStorage.getItem("user");
          if (u) setUsuario(JSON.parse(u));
          setMostrarAuth(false);
        }}
      />
    </header>
  );
}

export default Navbar;
