import { useState, useEffect } from 'react';

export const useGastosForm = () => {
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    bus: '',
    chofer: '',
    ruta: '',
    kmInicial: 0,
    kmFinal: 0,
    recaudacionTotal: 0,
    diesel: 0,
    valorChofer: 0,
    valorOficial: 0,
    alimentacion: 0,
    peajes: 0,
    parqueo: 0,
    depositoCia: 0,
    multas: 0,
    faltantes: 0,
    recaudacionPrestamo: 0,
    otrosGastosList: []
  });

  const [totales, setTotales] = useState({
    recorrido: 0,
    totalGastos: 0,
    valorNeto: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addOtroGasto = () => {
    setForm(prev => ({
      ...prev,
      otrosGastosList: [...prev.otrosGastosList, { desc: '', valor: 0 }]
    }));
  };

  const updateOtroGasto = (index, field, value) => {
    const newList = [...form.otrosGastosList];
    newList[index][field] = value;
    setForm(prev => ({ ...prev, otrosGastosList: newList }));
  };

  const removeOtroGasto = (index) => {
    setForm(prev => ({
      ...prev,
      otrosGastosList: prev.otrosGastosList.filter((_, i) => i !== index)
    }));
  };

  // Cálculo automático de totales
  useEffect(() => {
    const otros = form.otrosGastosList.reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
    const gastosFijos = 
      Number(form.diesel) + Number(form.valorChofer) + Number(form.valorOficial) +
      Number(form.alimentacion) + Number(form.peajes) + Number(form.parqueo) +
      Number(form.depositoCia) + Number(form.multas) + Number(form.faltantes) +
      Number(form.recaudacionPrestamo);

    const totalG = gastosFijos + otros;
    const neto = Number(form.recaudacionTotal) - totalG;

    setTotales({
      recorrido: Number(form.kmFinal) - Number(form.kmInicial),
      totalGastos: totalG,
      valorNeto: neto
    });
  }, [form]);

  return { 
    form, 
    setForm, // <--- ESTO ES LO QUE FALTABA
    handleChange, 
    addOtroGasto, 
    updateOtroGasto, 
    removeOtroGasto, 
    totales 
  };
};