import React, { useState } from 'react';
import { useGastosForm } from '../hooks/useGastosForm';

const RegistroGastos = ({ onBack }) => {
  const { form, handleChange, totales } = useGastosForm();
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://busruta-backend.onrender.com/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion: `Ruta: ${form.ruta} | Unidad: ${form.unidad}`,
          monto: totales.valorNeto,
          tipo: "diario",
          categoria: "Operativo",
          unidad: form.unidad,
          notas: JSON.stringify({
            recorrido: totales.recorrido,
            recaudacion: form.recaudacionTotal,
            detalleGastos: totales.totalGastos
          }),
          fechaGasto: new Date(form.fecha).toISOString()
        })
      });

      if (response.ok) {
        alert("¡Registro guardado exitosamente!");
        onBack();
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container registration-view">
      <header className="header">
        <button onClick={onBack} className="back-btn">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="title">Nuevo Registro</h2>
      </header>

      <div className="scroll-content">
        <h3 className="section-subtitle">Información General</h3>
        <div className="form-group">
          <label>Fecha</label>
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Bus / Unidad</label>
          <select name="unidad" onChange={handleChange}>
            <option value="">Seleccionar unidad</option>
            <option value="Unidad #45">Bus #45 - Transplaneta</option>
          </select>
        </div>

        <h3 className="section-subtitle">Datos Operativos</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Km Inicial</label>
            <input type="number" name="kmInicial" onChange={handleChange} placeholder="0" />
          </div>
          <div className="form-group">
            <label>Km Final</label>
            <input type="number" name="kmFinal" onChange={handleChange} placeholder="0" />
          </div>
        </div>
        <p className="recorrido-txt">Recorrido: <strong>{totales.recorrido} km</strong></p>

        <h3 className="section-subtitle">Finanzas</h3>
        <div className="recaudacion-card">
           <label>Recaudación Total</label>
           <input type="number" name="recaudacionTotal" className="large-input" onChange={handleChange} placeholder="$ 0.00" />
        </div>

        <div className="gastos-list">
          <div className="form-group">
            <label>Diesel</label>
            <input type="number" name="diesel" onChange={handleChange} placeholder="$ 0.00" />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Valor Chofer</label>
              <input type="number" name="valorChofer" onChange={handleChange} placeholder="$ 0.00" />
            </div>
            <div className="form-group">
              <label>Valor Oficial</label>
              <input type="number" name="valorOficial" onChange={handleChange} placeholder="$ 0.00" />
            </div>
          </div>

          {/* Repite este patrón para Peajes, Parqueo, Depósito, etc. */}
          <div className="form-group">
            <label>Alimentación</label>
            <input type="number" name="alimentacion" onChange={handleChange} placeholder="$ 0.00" />
          </div>
          
          <div className="form-group">
            <label>Otros Gastos</label>
            <input type="number" name="otrosGastos" onChange={handleChange} placeholder="$ 0.00" />
          </div>
        </div>

        <div className="final-card">
          <div className="row"><span>Total Gastos</span><span>${totales.totalGastos.toFixed(2)}</span></div>
          <div className="row main"><span>Valor Neto</span><span className="net-price">${totales.valorNeto.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="footer-action">
        <button className="btn-save" onClick={handleGuardar} disabled={loading}>
          <span className="material-symbols-outlined">save</span>
          {loading ? 'Guardando...' : 'Guardar Registro'}
        </button>
      </div>
    </div>
  );
};

export default RegistroGastos;