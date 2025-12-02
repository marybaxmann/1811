import React, { useState } from "react";

function LoginModal({ abierta, onCerrar, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const login = async () => {
    const body = new URLSearchParams();
    body.append("username", form.email);
    body.append("password", form.password);

    const res = await fetch("/auth/token", {
      method: "POST",
      body,
    });

    if (!res.ok) {
      return alert("Email o contraseña incorrectos");
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    onLogin(data.access_token);
    onCerrar();
  };

  if (!abierta) return null;

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Iniciar sesión</h2>

        <div className="campo">
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Contraseña:</label>
          <input type="password" name="password" onChange={handleChange} />
        </div>

        <button className="boton-simular" onClick={login}>
          Entrar
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
