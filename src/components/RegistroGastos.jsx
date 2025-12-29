import React, { useState, useEffect } from 'react';
import { useGastosForm } from '../hooks/useGastosForm';

const RegistroGastos = ({ onBack, gastoId }) => {
  const { form, setForm, handleChange, addOtroGasto, updateOtroGasto, removeOtroGasto, totales } = useGastosForm();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  
  const [buses, setBuses] = useState([]);
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    const loadAllData = async () => {
      setFetchingData(true);
      try {
        // 1. Carga secuencial de catálogos
        const [resBuses, resRutas] = await Promise.all([
          fetch('https://busruta-backend.onrender.com/buses'),
          fetch('https://busruta-backend.onrender.com/rutas')
        ]);
        
        const dataBuses = await resBuses.json();
        const dataRutas = await resRutas.json();
        
        setBuses(dataBuses);
        setRutas(dataRutas);

        // 2. Poblado de datos si es edición
        if (gastoId) {
          const resGasto = await fetch(`https://busruta-backend.onrender.com/gastos/${gastoId}`);
          const g = await resGasto.json();

          setForm({
            ...g,
            bus: g.bus?._id || g.bus, 
            fecha: g.fecha ? g.fecha.split('T')[0] : "",
            otrosGastosList: g.otrosGastosList || []
          });
        }
      } catch (error) {
        console.error("Error en la carga:", error);
      } finally {
        setFetchingData(false);
      }
    };
    loadAllData();
  }, [gastoId, setForm]);

  const handleGuardar = async () => {
    if (!form.bus) return alert("Por favor, seleccione un bus.");
    setLoading(true);

    const datosAEnviar = {
      ...form,
      bus: String(form.bus),
      fecha: new Date(form.fecha).toISOString(),
      kmInicial: Number(form.kmInicial || 0),
      kmFinal: Number(form.kmFinal || 0),
      recaudacionTotal: Number(form.recaudacionTotal || 0),
      diesel: Number(form.diesel || 0),
      valorChofer: Number(form.valorChofer || 0),
      valorOficial: Number(form.valorOficial || 0),
      alimentacion: Number(form.alimentacion || 0),
      peajes: Number(form.peajes || 0),
      parqueo: Number(form.parqueo || 0),
      depositoCia: Number(form.depositoCia || 0),
      multas: Number(form.multas || 0),
      faltantes: Number(form.faltantes || 0),
      recaudacionPrestamo: Number(form.recaudacionPrestamo || 0),
      otrosGastosList: form.otrosGastosList.map(item => ({
        desc: String(item.desc),
        valor: Number(item.valor || 0)
      })),
      totalGastos: Number(totales.totalGastos),
      valorNeto: Number(totales.valorNeto)
    };

    const url = gastoId 
      ? `https://busruta-backend.onrender.com/gastos/${gastoId}` 
      : 'https://busruta-backend.onrender.com/gastos';
    
    try {
      const response = await fetch(url, {
        method: gastoId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });

      if (response.ok) {
        alert(gastoId ? "✅ Actualizado" : "✅ Guardado");
        onBack();
      }
    } catch (e) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (e) => e.target.select();

  if (fetchingData) return <div className="container text-center"><p>Cargando datos...</p></div>;

  return (
    <div className="registration-view">
      <header className="header-form">
        <button onClick={onBack} className="close-circle-btn">
          <span className="material-symbols-outlined">{gastoId ? 'arrow_back' : 'close'}</span>
        </button>
        <h2 className="title">{gastoId ? 'Detalle de Gasto' : 'Nuevo Registro'}</h2>
      </header>

      <div className="scroll-area container">
        {gastoId && (
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ color: '#888', fontSize: '11px', fontWeight: 'bold' }}>ID REGISTRO</label>
            <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', color: '#666', fontSize: '12px' }}>
              {gastoId}
            </div>
          </div>
        )}

        {/* INFORMACIÓN GENERAL */}
        <section>
          <h3 className="section-label">Información General</h3>
          <div className="form-group">
            <label>Fecha</label>
            <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className="custom-input" />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Bus / Unidad</label>
              <select name="bus" value={form.bus} onChange={handleChange} className="custom-input">
                <option value="">Seleccionar bus...</option>
                {buses.map(b => (
                  <option key={b._id} value={b._id}>{b.nombre} (#{b.numeroUnidad})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Chofer</label>
              <input type="text" name="chofer" value={form.chofer} onChange={handleChange} className="custom-input" />
            </div>
          </div>
        </section>

        {/* DATOS OPERATIVOS */}
        <section>
          <h3 className="section-label">Datos Operativos</h3>
          <div className="form-group">
            <label>Ruta</label>
            <input list="rutas-list" name="ruta" value={form.ruta} onChange={handleChange} className="custom-input" placeholder="Escriba o elija..." />
            <datalist id="rutas-list">
              {rutas.map(r => <option key={r._id} value={r.nombre} />)}
            </datalist>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Km Inicial</label>
              <input type="number" name="kmInicial" value={form.kmInicial} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
            </div>
            <div className="form-group">
              <label>Km Final</label>
              <input type="number" name="kmFinal" value={form.kmFinal} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
            </div>
          </div>
        </section>

        {/* FINANZAS */}
        <section>
          <h3 className="section-label">Finanzas</h3>
          <div className="recaudacion-box">
            <label>Recaudación Total</label>
            <div className="input-with-symbol">
              <span className="symbol-large">$</span>
              <input type="number" name="recaudacionTotal" value={form.recaudacionTotal} onChange={handleChange} onFocus={handleFocus} className="recaudacion-input" />
            </div>
          </div>

          <div className="space-y-gastos">
            <div className="form-group">
              <label>Diesel</label>
              <div className="input-with-symbol">
                <span className="symbol">$</span>
                <input type="number" name="diesel" value={form.diesel} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Valor Chofer</label>
                <div className="input-with-symbol"><span className="symbol">$</span>
                  <input type="number" name="valorChofer" value={form.valorChofer} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Valor Oficial</label>
                <div className="input-with-symbol"><span className="symbol">$</span>
                  <input type="number" name="valorOficial" value={form.valorOficial} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Alimentación</label>
              <div className="input-with-symbol"><span className="symbol">$</span>
                <input type="number" name="alimentacion" value={form.alimentacion} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Peajes</label>
                <div className="input-with-symbol"><span className="symbol">$</span>
                  <input type="number" name="peajes" value={form.peajes} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Parqueo</label>
                <div className="input-with-symbol"><span className="symbol">$</span>
                  <input type="number" name="parqueo" value={form.parqueo} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Depósito Cía</label>
                <div className="input-with-symbol"><span className="symbol">$</span>
                  <input type="number" name="depositoCia" value={form.depositoCia} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Multas</label>
                <div className="input-with-symbol"><span className="symbol">$</span>
                  <input type="number" name="multas" value={form.multas} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Faltantes</label>
                <div className="input-with-symbol"><span className="symbol">$</span>
                  <input type="number" name="faltantes" value={form.faltantes} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Préstamo</label>
                <div className="input-with-symbol"><span className="symbol">$</span>
                  <input type="number" name="recaudacionPrestamo" value={form.recaudacionPrestamo} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="others-section">
          <label className="section-label">Otros Gastos Detallados</label>
          {form.otrosGastosList.map((item, index) => (
            <div key={index} className="dynamic-row">
              <input type="text" value={item.desc} onChange={(e) => updateOtroGasto(index, 'desc', e.target.value)} className="custom-input" placeholder="Descripción" />
              <div className="input-with-symbol">
                <span className="symbol">$</span>
                <input type="number" value={item.valor} onChange={(e) => updateOtroGasto(index, 'valor', e.target.value)} onFocus={handleFocus} className="custom-input" />
              </div>
              <button onClick={() => removeOtroGasto(index)} className="delete-btn">×</button>
            </div>
          ))}
          <button className="add-others-btn" onClick={addOtroGasto}>+ Añadir Gasto Extra</button>
        </section>

        <div className="total-display-card">
          <div className="row"><span>Total Gastos</span><span>${totales.totalGastos.toFixed(2)}</span></div>
          <div className="row highlighted">
            <span>VALOR NETO</span>
            <span className="big-price">${totales.valorNeto.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="action-footer">
        <button className="main-save-btn" onClick={handleGuardar} disabled={loading}>
          <span className="material-symbols-outlined">{loading ? 'sync' : 'save'}</span>
          {loading ? 'PROCESANDO...' : gastoId ? 'ACTUALIZAR CAMBIOS' : 'GUARDAR REGISTRO'}
        </button>
      </div>
    </div>
  );
};

export default RegistroGastos;