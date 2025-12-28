import { useState, useMemo } from 'react';

export const useGastosForm = () => {
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    unidad: '', chofer: '', ruta: '',
    kmInicial: 0, kmFinal: 0,
    recaudacionTotal: 0,
    diesel: 0, valorChofer: 0, valorOficial: 0, alimentacion: 0,
    peajes: 0, parqueo: 0, depositoCia: 0, multas: 0,
    faltantes: 0, recaudacionPrestamo: 0,
    otrosGastosList: [] 
  });

const handleChange = (e) => {
  const { name, value, type } = e.target;

  // Si es un campo numérico
  if (type === 'number') {
    // 1. Convertir a string para manipularlo
    let val = value;
    
    // 2. Si el usuario borra todo, dejarlo en 0 para que no explote la suma
    if (val === '') {
      setForm(prev => ({ ...prev, [name]: 0 }));
      return;
    }

    // 3. Eliminar ceros a la izquierda usando parseo numérico
    // Esto hace que si tienes "0" y escribes "5", se convierta en 5
    const numericValue = parseFloat(val);
    
    setForm(prev => ({ ...prev, [name]: numericValue }));
  } else {
    // Para textos (chofer, bus, ruta) se queda igual
    setForm(prev => ({ ...prev, [name]: value }));
  }
};

  const addOtroGasto = () => {
    setForm(prev => ({ ...prev, otrosGastosList: [...prev.otrosGastosList, { desc: '', valor: 0 }] }));
  };

  const updateOtroGasto = (index, field, value) => {
    const newList = [...form.otrosGastosList];
    newList[index][field] = field === 'valor' ? parseFloat(value) || 0 : value;
    setForm(prev => ({ ...prev, otrosGastosList: newList }));
  };

  const removeOtroGasto = (index) => {
    setForm(prev => ({ ...prev, otrosGastosList: prev.otrosGastosList.filter((_, i) => i !== index) }));
  };

  const totales = useMemo(() => {
    const sumaOtros = form.otrosGastosList.reduce((acc, curr) => acc + curr.valor, 0);
    const sumaFijos = 
      form.diesel + form.valorChofer + form.valorOficial + form.alimentacion +
      form.peajes + form.parqueo + form.depositoCia + form.multas +
      form.faltantes + form.recaudacionPrestamo;
    
    const totalG = sumaFijos + sumaOtros;
    return {
      totalGastos: totalG,
      valorNeto: form.recaudacionTotal - totalG,
      recorrido: form.kmFinal - form.kmInicial
    };
  }, [form]);

  return { form, handleChange, addOtroGasto, updateOtroGasto, removeOtroGasto, totales };
};