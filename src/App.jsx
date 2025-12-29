import React, { useState, useEffect } from 'react';
import './App.css';
import RegistroGastos from './components/RegistroGastos';
import HistorialGastos from './components/HistorialGastos';

function App() {
  const [view, setView] = useState('dashboard');
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [resumen, setResumen] = useState({
    totalGastosAcumulados: 0,
    totalValorNetoAcumulado: 0,
    cantidadRegistros: 0,
    fechaInicio: '',
    fechaFin: ''
  });

  // Función para obtener los datos del resumen mensual
  const fetchResumen = async () => {
    try {
      const res = await fetch('https://busruta-backend.onrender.com/gastos/resumen/mensual');
      const data = await res.json();
      setResumen(data);
    } catch (err) {
      console.error("Error cargando resumen:", err);
    }
  };

  useEffect(() => {
    if (view === 'dashboard') {
      fetchResumen();
    }
  }, [view]);

  // Formateador de fechas corto (ej: 01 dic - 29 dic)
  const formatearPeriodo = (inicio, fin) => {
    if (!inicio || !fin) return "Cargando periodo...";
    const opciones = { day: '2-digit', month: 'short' };
    const f1 = new Date(inicio).toLocaleDateString('es-ES', opciones);
    const f2 = new Date(fin).toLocaleDateString('es-ES', opciones);
    return `${f1} — ${f2}`;
  };

  const handleEdit = (gasto) => {
    setIdSeleccionado(gasto._id);
    setView('editar-gasto');
  };

  if (view === 'registro-diario' || view === 'editar-gasto') {
    return (
      <RegistroGastos 
        onBack={() => {
          setView(view === 'editar-gasto' ? 'historial' : 'dashboard');
          setIdSeleccionado(null);
        }} 
        gastoId={idSeleccionado} 
      />
    );
  }

  if (view === 'historial') {
    return <HistorialGastos onBack={() => setView('dashboard')} onEdit={handleEdit} />;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="profile">
          <div className="avatar"><span className="material-symbols-outlined">person</span></div>
          <div><p className="welcome">DASHBOARD</p><p className="name">Wlady</p></div>
        </div>
      </header>

      <div className="unit-info">
        <h1>Estado Financiero</h1>
        {/* Mostramos el periodo de fechas aquí */}
        <span className="badge" style={{ background: '#f0f4f8', color: '#546e7a', fontWeight: 'bold' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>calendar_today</span>
          {formatearPeriodo(resumen.fechaInicio, resumen.fechaFin)}
        </span>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ width: '100%' }}>
            <p className="card-label">Gasto Acumulado Mensual</p>
            <p className="amount">${resumen.totalGastosAcumulados.toFixed(2)}</p>
            
            {/* Valor Neto en gris claro */}
            <p style={{ color: '#90a4ae', fontSize: '14px', margin: '4px 0 0 0', fontWeight: '500' }}>
              Valor Neto: ${(resumen.totalValorNetoAcumulado || 0).toFixed(2)}
            </p>
            
            {/* Cantidad de registros */}
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', color: '#b0bec5', fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>analytics</span>
              {resumen.cantidadRegistros} registros encontrados
            </div>
          </div>
          <div className="card-icon-wrapper"><span className="material-symbols-outlined">monitoring</span></div>
        </div>
      </div>

      <h2 className="section-title">Registrar Nuevo Gasto</h2>
      <div className="registration-grid">
        <button className="reg-card white-btn" onClick={() => { setIdSeleccionado(null); setView('registro-diario'); }}>
          <div className="reg-icon daily-icon"><span className="material-symbols-outlined">receipt</span></div>
          <span className="btn-text">Diario</span>
        </button>
        
        <button className="reg-card white-btn">
          <div className="reg-icon monthly-icon"><span className="material-symbols-outlined">calendar_month</span></div>
          <span className="btn-text">Mensual</span>
        </button>
        
        <button className="reg-card white-btn">
          <div className="reg-icon yearly-icon"><span className="material-symbols-outlined">account_balance</span></div>
          <span className="btn-text">Anual</span>
        </button>
      </div>

      <h2 className="section-title">Consultar</h2>
      <div className="menu">
        <button className="menu-item" onClick={() => setView('historial')}>
          <span className="material-symbols-outlined menu-icon">history</span>
          <div className="menu-text">
            <strong>Historial de Gastos</strong>
            <span>Ver registros pasados</span>
          </div>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <nav className="bottom-nav">
        <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
          <span className="material-symbols-outlined">grid_view</span><span>Panel</span>
        </div>
        <div className={`nav-item ${view === 'historial' || view === 'editar-gasto' ? 'active' : ''}`} onClick={() => setView('historial')}>
          <span className="material-symbols-outlined">history</span><span>Historial</span>
        </div>
      </nav>
    </div>
  );
}

export default App;