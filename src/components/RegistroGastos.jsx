import React, { useState, useEffect } from 'react';
import { useGastosForm } from '../hooks/useGastosForm';

const RegistroGastos = ({ onBack }) => {
  const { form, handleChange, addOtroGasto, updateOtroGasto, removeOtroGasto, totales } = useGastosForm();
  const [loading, setLoading] = useState(false);
  
  // Estados para datos del Backend
  const [buses, setBuses] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  // Cargar Buses y Rutas desde Render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBuses, resRutas] = await Promise.all([
          fetch('https://busruta-backend.onrender.com/buses'),
          fetch('https://busruta-backend.onrender.com/rutas')
        ]);
        
        const dataBuses = await resBuses.json();
        const dataRutas = await resRutas.json();
        
        setBuses(dataBuses);
        setRutas(dataRutas);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  const handleGuardar = async () => {
    if (!form.bus) return alert("Por favor seleccione un bus");
    if (form.recaudacionTotal <= 0) return alert("Ingrese la recaudación");
    
    setLoading(true);

    // LIMPIEZA DE DATOS ANTES DE ENVIAR (Conversión de tipos)
    const datosAEnviar = {
      ...form,
      bus: String(form.bus),
      ruta: String(form.ruta || ""),
      chofer: String(form.chofer || ""),
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

    try {
      const response = await fetch('https://busruta-backend.onrender.com/gastos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(datosAEnviar)
      });

      const resData = await response.json();

      if (response.ok) {
        alert("✅ Registro guardado exitosamente");
        onBack();
      } else {
        const errorMsg = Array.isArray(resData.message) ? resData.message.join(", ") : resData.message;
        alert(`❌ Error: ${errorMsg}`);
      }
    } catch (error) {
      alert("⚠️ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para seleccionar texto al hacer clic (Evita el problema del 0)
  const handleFocus = (e) => e.target.select();

  return (
    <div className="registration-view">
      <header className="header-form">
        <button onClick={onBack} className="close-circle-btn">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="title">Nuevo Registro</h2>
      </header>

      <div className="scroll-area container">
        <section>
          <h3 className="section-label">Información General</h3>
          <div className="form-group">
            <label>Fecha</label>
            <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className="custom-input" />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Bus / Unidad</label>
              <select name="bus" value={form.bus} onChange={handleChange} className="custom-input custom-select">
                <option value="">{fetchingData ? 'Cargando...' : 'Seleccionar unidad'}</option>
                {buses.map((bus) => (
                  <option key={bus._id} value={bus._id}>{bus.nombre} (#{bus.numeroUnidad})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Chofer</label>
              <input type="text" name="chofer" value={form.chofer} onChange={handleChange} placeholder="Nombre del chofer" className="custom-input" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="section-label">Datos Operativos</h3>
          <div className="form-group">
            <label>Ruta (Seleccione o escriba)</label>
            <input list="rutas-list" name="ruta" value={form.ruta} onChange={handleChange} placeholder="Escriba o elija..." className="custom-input" autoComplete="off" />
            <datalist id="rutas-list">
              {rutas.map((ruta) => <option key={ruta._id} value={ruta.nombre} />)}
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
          <p className="km-info text-right">Recorrido: <strong>{totales.recorrido} km</strong></p>
        </section>

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

            {[
              { label: 'Depósito Compañía', name: 'depositoCia' },
              { label: 'Multas', name: 'multas' },
              { label: 'Valor Faltantes', name: 'faltantes' },
              { label: 'Recaudación Préstamo', name: 'recaudacionPrestamo' }
            ].map(item => (
              <div className="form-group" key={item.name}>
                <label>{item.label}</label>
                <div className="input-with-symbol">
                  <span className="symbol">$</span>
                  <input type="number" name={item.name} value={form[item.name]} onChange={handleChange} onFocus={handleFocus} className="custom-input" />
                </div>
              </div>
            ))}

            <div className="others-section">
              <label className="section-label" style={{border: 'none'}}>Otros Gastos Detallados</label>
              {form.otrosGastosList.map((item, index) => (
                <div key={index} className="dynamic-row">
                  <input type="text" placeholder="Descripción" value={item.desc} onChange={(e) => updateOtroGasto(index, 'desc', e.target.value)} className="custom-input" />
                  <div className="input-with-symbol">
                    <span className="symbol">$</span>
                    <input type="number" value={item.valor} onChange={(e) => updateOtroGasto(index, 'valor', e.target.value)} onFocus={handleFocus} className="custom-input" />
                  </div>
                  <button onClick={() => removeOtroGasto(index)} className="delete-btn">×</button>
                </div>
              ))}
              <button className="add-others-btn" onClick={(e) => { e.preventDefault(); addOtroGasto(); }}>+ Añadir Gasto Extra</button>
            </div>
          </div>
        </section>

        <div className="total-display-card" style={{marginTop: '40px'}}>
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
          {loading ? 'GUARDANDO...' : 'GUARDAR REGISTRO'}
        </button>
      </div>
    </div>
  );
};

export default RegistroGastos;