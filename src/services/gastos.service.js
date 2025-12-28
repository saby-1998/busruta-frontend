const API_URL = 'https://busruta-backend.onrender.com/gastos';

export const saveGasto = async (datos) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al guardar el registro');
  }

  return await response.json();
};