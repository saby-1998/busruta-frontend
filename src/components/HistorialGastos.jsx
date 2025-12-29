import React, { useState, useEffect, useCallback } from 'react';

const HistorialGastos = ({ onBack, onEdit }) => {
  const [gastos, setGastos] = useState([]);
  const [buses, setBuses] = useState([]);
  const [busSeleccionado, setBusSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Cargar catálogo de buses para el filtro
  useEffect(() => {
    fetch('https://busruta-backend.onrender.com/buses')
      .then(res => res.json())
      .then(data => setBuses(data))
      .catch(err => console.error("Error cargando buses:", err));
  }, []);

  // 2. Cargar gastos (General o filtrado por Bus)
  const fetchGastos = useCallback(async () => {
    setLoading(true);
    try {
      // Si hay un bus seleccionado usamos el endpoint de filtro, sino el general
      const url = busSeleccionado 
        ? `https://busruta-backend.onrender.com/gastos/bus/${busSeleccionado}`
        : 'https://busruta-backend.onrender.com/gastos';
        
      const res = await fetch(url);
      const data = await res.json();
      
      // Ordenar por fecha reciente
      const sortedData = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setGastos(sortedData);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    } finally {
      setLoading(false);
    }
  }, [busSeleccionado]);

  useEffect(() => {
    fetchGastos();
  }, [fetchGastos]);

  // 3. Borrado Lógico (Soft Delete)
  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    if (!window.confirm("¿Mover este registro a la papelera?")) return;

    try {
      const res = await fetch(`https://busruta-backend.onrender.com/gastos/${id}/soft-delete`, {
        method: 'PATCH', // Cambiado a PATCH según tu curl
        headers: { 'accept': '*/*' }
      });
      
      if (res.ok) {
        // Removemos de la vista localmente
        setGastos(prev => prev.filter(g => g._id !== id));
      } else {
        alert("No se pudo mover a la papelera");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  return (
    <div className="registration-view">
      <header className="header-form">
        <button onClick={onBack} className="close-circle-btn">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="title">Historial</h2>
        <button onClick={fetchGastos} className="close-circle-btn" style={{ marginLeft: 'auto' }}>
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </header>

      {/* SECCIÓN DE FILTRO */}
      <div className="container" style={{ marginTop: '15px' }}>
        <div className="form-group">
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>FILTRAR POR UNIDAD</label>
          <select 
            className="custom-input" 
            value={busSeleccionado} 
            onChange={(e) => setBusSeleccionado(e.target.value)}
            style={{ border: '2px solid #3498db' }}
          >
            <option value="">Mostrar todas las unidades</option>
            {buses.map(b => (
              <option key={b._id} value={b._id}>
                #{b.numeroUnidad} - {b.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="scroll-area container" style={{ paddingBottom: '100px', marginTop: '10px' }}>
        {loading ? (
          <div className="text-center" style={{ marginTop: '40px' }}>
            <p>Buscando registros...</p>
          </div>
        ) : gastos.length === 0 ? (
          <div className="text-center" style={{ marginTop: '40px', color: '#999' }}>
             <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>search_off</span>
             <p>No se encontraron registros para esta unidad.</p>
          </div>
        ) : (
          gastos.map(g => (
            <div 
              key={g._id} 
              className="menu-item" 
              style={{ 
                marginBottom: '12px', 
                padding: '16px', 
                borderRadius: '16px',
                border: '1px solid #eee',
                background: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }} 
              onClick={() => onEdit(g)}
            >
              <div className="menu-text" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: '#2c3e50' }}>
                      {g.bus?.nombre || 'Unidad'}
                    </strong>
                    <span style={{ 
                      marginLeft: '8px', 
                      padding: '2px 8px', 
                      background: '#e8f4fd', 
                      color: '#3498db', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      #{g.bus?.numeroUnidad || '??'}
                    </span>
                  </div>
                  <span style={{ color: '#95a5a6', fontSize: '12px' }}>
                    {new Date(g.fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })}
                  </span>
                </div>

                <p style={{ margin: '8px 0', fontSize: '14px', color: '#7f8c8d' }}>
                   <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '5px' }}>person</span>
                   {g.chofer || 'Sin chofer'}
                </p>
                <p style={{ margin: '0', fontSize: '13px', color: '#95a5a6' }}>
                   <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '5px' }}>route</span>
                   {g.ruta}
                </p>

                <div style={{ 
                  marginTop: '12px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: '1px dashed #eee',
                  paddingTop: '10px'
                }}>
                  <div>
                    <span style={{ color: '#95a5a6', fontSize: '11px', display: 'block' }}>NETO A RECIBIR</span>
                    <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.3rem' }}>
                      ${(g.valorNeto || 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={(e) => handleDelete(g._id, e)} 
                    className="delete-btn-circle"
                    style={{ 
                      background: '#fff0f0', 
                      color: '#e74c3c', 
                      border: 'none', 
                      width: '38px', 
                      height: '38px', 
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span className="material-symbols-outlined">delete_sweep</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorialGastos;