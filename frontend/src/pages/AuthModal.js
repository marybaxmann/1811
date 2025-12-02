import React, { useState, useEffect } from "react";
import "./DetallesCarreraModal.css"; // usa mismo estilo del modal

function AuthModal({ abierta, onCerrar, onLoginSuccess, modo = "login" }) {

  const [tab, setTab] = useState(modo); // ← ahora respeta el modo inicial

  // Cuando se abre el modal, actualizar tab según el botón pulsado
  useEffect(() => {
    if (abierta) {
      setTab(modo);
    }
  }, [abierta, modo]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // --------------------------------
  // LOGIN
  // --------------------------------
  const login = async () => {
    const body = new URLSearchParams();
    body.append("username", form.email);
    body.append("password", form.password);

    const res = await fetch("/auth/token", {
      method: "POST",
      body,
    });

    if (!res.ok) {
      alert("Credenciales incorrectas");
      return;
    }

    const data = await res.json();

    localStorage.setItem("token", data.access_token);

    // Obtener datos del usuario autenticado
    const userRes = await fetch("/auth/me", {
      headers: { Authorization: `Bearer ${data.access_token}` }
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event("userLoggedIn"));
    }

    onLoginSuccess?.(data.access_token);
    onCerrar();
  };

  // --------------------------------
  // REGISTER
  // --------------------------------
  const register = async () => {
    if (!form.email || !form.password || !form.nombre || !form.apellido) {
      alert("Debes completar todos los campos");
      return;
    }

    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.detail || "Error al registrar");
      return;
    }

    alert("Registro exitoso. Ahora inicia sesión.");
    setTab("login");
  };

  if (!abierta) return null;

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close" onClick={onCerrar}>✖</button>

        <div className="tabs-auth">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Iniciar sesión
          </button>

          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            Crear cuenta
          </button>
        </div>

        {/* ------------------------- LOGIN ------------------------- */}
        {tab === "login" && (
          <>
            <h2>Iniciar sesión</h2>

            <div className="campo">
              <label>Email:</label>
              <input name="email" type="email" onChange={handleChange} />
            </div>

            <div className="campo">
              <label>Contraseña:</label>
              <input name="password" type="password" onChange={handleChange} />
            </div>

            <button className="boton-simular" onClick={login}>
              Entrar
            </button>
          </>
        )}

        {/* ------------------------- REGISTRO ------------------------- */}
        {tab === "register" && (
          <>
            <h2>Crear cuenta</h2>

            <div className="campo">
              <label>Email:</label>
              <input name="email" type="email" onChange={handleChange} />
            </div>

            <div className="campo">
              <label>Contraseña:</label>
              <input name="password" type="password" onChange={handleChange} />
            </div>

            <div className="campo">
              <label>Nombre:</label>
              <input name="nombre" type="text" onChange={handleChange} />
            </div>

            <div className="campo">
              <label>Apellido:</label>
              <input name="apellido" type="text" onChange={handleChange} />
            </div>

            <button className="boton-simular" onClick={register}>
              Registrarse
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
