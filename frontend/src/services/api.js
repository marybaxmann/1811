import axios from "axios";

// usa localhost en vez de 127.0.0.1
const API_URL = "http://localhost:8000";

// ⚡ Crear instancia de axios con tamaño máximo aumentado
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  maxContentLength: Infinity,   // ← permite respuestas muy grandes
  maxBodyLength: Infinity,      // ← sin límite de tamaño de cuerpo
  timeout: 120000,              // ← 2 minutos de espera
});

export async function simularPAES(formData) {
  try {
    const response = await api.post("/simulador/", formData);
    console.log("✅ Carreras recibidas:", response.data.length);
    return response.data;
  } catch (error) {
    console.error("❌ Error al llamar al backend:", error);
    throw error;
  }
}

