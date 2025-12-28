import { useState, useMemo } from 'react';

export const useGastosForm = () => {
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    unidad: '',
    chofer: '',
    ruta: '',
    kmInicial: 0,
    kmFinal: 0,
    recaudacionTotal: 0, // Este es el campo principal de entrada
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
    otrosGastos: 0
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const totales = useMemo(() => {
    const sumaGastos = 
      form.diesel + form.valorChofer + form.valorOficial + 
      form.alimentacion + form.peajes + form.parqueo + 
      form.depositoCia + form.multas + form.faltantes + 
      form.recaudacionPrestamo + form.otrosGastos;
    
    return {
      totalGastos: sumaGastos,
      valorNeto: form.recaudacionTotal - sumaGastos,
      recorrido: form.kmFinal - form.kmInicial
    };
  }, [form]);

  return { form, handleChange, totales };
};