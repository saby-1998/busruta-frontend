import React, { useState, useEffect, useCallback } from 'react';

const HistorialGastos = ({ onBack, onEdit }) => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Usamos useCallback para poder refrescar la lista fácilmente
  const fetchGastos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://busruta-backend.onrender.com/gastos');
      const data = await res.json();
      // Ordenamos por fecha (más reciente primero) por si el backend no lo hace
      const sortedData = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setGastos(sortedData);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGastos();
  }, [fetchGastos]);

  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    if (!window.confirm("¿Está seguro de eliminar este registro permanente?")) return;

    try {
      const res = await fetch(`https://busruta-backend.onrender.com/gastos/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setGastos(prev => prev.filter(g => g._id !== id));
      } else {
        alert("No se pudo eliminar el registro");
      }
    } catch (err) {
      alert("Error de conexión al eliminar");
    }
  };

  return (
    <div className="registration-view">
      <header className="header-form">
        <button onClick={onBack} className="close-circle-btn">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="title">Historial de Gastos</h2>
        <button onClick={fetchGastos} className="close-circle-btn" style={{ marginLeft: 'auto' }}>
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </header>

      <div className="scroll-area container" style={{ paddingBottom: '100px' }}>
        {loading ? (
          <div className="text-center" style={{ marginTop: '40px' }}>
            <div className="spinner"></div> {/* Asegúrate de tener un spinner en tu CSS */}
            <p>Cargando registros...</p>
          </div>
        ) : gastos.length === 0 ? (
          <p className="text-center" style={{ marginTop: '40px', color: '#666' }}>No hay gastos registrados aún.</p>
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
                background: '#fff' 
              }} 
              onClick={() => onEdit(g)} // Aquí pasamos el objeto g, App.jsx sacará el ID
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
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'bottom', marginRight: '4px' }}>route</span>
                  {g.ruta || 'Ruta no especificada'}
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
                    <span style={{ color: '#95a5a6', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Valor Neto</span>
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
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span className="material-symbols-outlined">delete</span>
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