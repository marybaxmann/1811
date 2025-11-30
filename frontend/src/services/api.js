import axios from "axios";

// usa localhost en vez de 127.0.0.1
<<<<<<< HEAD
const API_URL = "http://1811-production.up.railway.app";
=======
const API_URL = "http://localhost:8000";
>>>>>>> 5f20d2a48d4719d8230b9f25f2f8270c731b931d

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

