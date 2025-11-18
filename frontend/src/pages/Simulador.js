import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Simulador() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lenguaje: "",
    matematicas: "",
    matematicas2: "",
    ciencias: "",
    historia: "",
    nem: "50",       // valor recomendado por defecto
    ranking: "50",   // valor recomendado por defecto
  });

  const [loading, setLoading] = useState(false);

  // Recuperar datos almacenados
  useEffect(() => {
    const saved = localStorage.getItem("simuladorData");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem("simuladorData", JSON.stringify(formData));
  }, [formData]);

  // Manejo de inputs
  const handleChange = (e) => {
    let value = e.target.value;

    // Validación de porcentajes
    if (e.target.name === "nem" || e.target.name === "ranking") {
      if (value < 0) value = 0;
      if (value > 100) value = 100;
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  // Botón para rellenar NEM/Ranking automáticamente
  const usarValoresDefault = () => {
    setFormData({
      ...formData,
      nem: "50",
      ranking: "50",
    });
  };

  // Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        lenguaje: parseFloat(formData.lenguaje) || 0,
        matematicas: parseFloat(formData.matematicas) || 0,
        matematicas2: parseFloat(formData.matematicas2) || 0,
        ciencias: parseFloat(formData.ciencias) || 0,
        historia: parseFloat(formData.historia) || 0,

        // NEM y Ranking (0–100%), el backend hace la conversión PAES
        nem: parseFloat(formData.nem) || 50,
        ranking: parseFloat(formData.ranking) || 50,
      };

      // Validación mínima
      if (!payload.lenguaje && !payload.matematicas) {
        alert("Debes ingresar al menos Lenguaje o Matemáticas.");
        setLoading(false);
        return;
      }

      const res = await fetch("/simulador/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al contactar el backend.");

      const data = await res.json();

      localStorage.setItem("resultadosSimulacion", JSON.stringify(data));
      navigate("/opciones");

    } catch (error) {
      console.error(error);
      alert("Hubo un error en la simulación. Revisa el backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulador-wrapper">
      <h1 className="titulo-principal">Simulador de Puntaje</h1>

      <div className="simulador-form-container">
        <form onSubmit={handleSubmit}>

          {/* PUNTAJES PAES */}
          <div className="fila-inputs">
            <div className="campo">
              <label>Lenguaje:</label>
              <input
                type="number"
                name="lenguaje"
                value={formData.lenguaje}
                onChange={handleChange}
                min="200"
                max="1000"
              />
            </div>

            <div className="campo">
              <label>Matemática 1:</label>
              <input
                type="number"
                name="matematicas"
                value={formData.matematicas}
                onChange={handleChange}
                min="200"
                max="1000"
              />
            </div>

            <div className="campo">
              <label>Matemática 2:</label>
              <input
                type="number"
                name="matematicas2"
                value={formData.matematicas2}
                onChange={handleChange}
                min="200"
                max="1000"
              />
            </div>
          </div>

          <div className="fila-inputs">
            <div className="campo">
              <label>Ciencias:</label>
              <input
                type="number"
                name="ciencias"
                value={formData.ciencias}
                onChange={handleChange}
                min="200"
                max="1000"
              />
            </div>

            <div className="campo">
              <label>Historia:</label>
              <input
                type="number"
                name="historia"
                value={formData.historia}
                onChange={handleChange}
                min="200"
                max="1000"
              />
            </div>
          </div>

          <hr/>

          {/* NEM + RANKING */}
          <h3>📝 NEM y Ranking (0–100%)</h3>
          <p>Si no los conoces, usa los valores sugeridos (50%).</p>

          <div className="fila-inputs">
            <div className="campo">
              <label>NEM (%):</label>
              <input
                type="number"
                name="nem"
                value={formData.nem}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>

            <div className="campo">
              <label>Ranking (%):</label>
              <input
                type="number"
                name="ranking"
                value={formData.ranking}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>
          </div>

          <button
            type="button"
            className="boton-secundario"
            onClick={usarValoresDefault}
          >
            No sé mi NEM/Ranking
          </button>

          <button
            type="submit"
            className="boton-simular"
            disabled={loading}
          >
            {loading ? "Simulando..." : "Mostrar Opciones"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Simulador;
