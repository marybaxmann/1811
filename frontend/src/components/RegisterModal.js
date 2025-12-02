import React, { useState } from "react";

function RegisterModal({ abierta, onCerrar, onSuccess }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const registrar = async () => {
    if (!form.email || !form.password) {
      return alert("Debes ingresar email y contraseña");
    }

    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return alert(data.detail || "Error al registrar");
    }

    alert("Registro exitoso. Ahora inicia sesión.");
    onSuccess();
    onCerrar();
  };

  if (!abierta) return null;

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Crear cuenta</h2>

        <div className="campo">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Contraseña:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Nombre:</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input type="text" name="apellido" value={form.apellido} onChange={handleChange} />
        </div>

        <button className="boton-simular" onClick={registrar}>
          Registrarse
        </button>
      </div>
    </div>
  );
}

export default RegisterModal;
