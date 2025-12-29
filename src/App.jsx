import React, { useState } from 'react';
import './App.css';
import RegistroGastos from './components/RegistroGastos';
import HistorialGastos from './components/HistorialGastos';

function App() {
  const [view, setView] = useState('dashboard');
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  // Al hacer clic en un registro del historial
  const handleEdit = (gasto) => {
    setIdSeleccionado(gasto._id);
    setView('editar-gasto');
  };

  // Vistas de Formulario (Nuevo o Editar)
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

  // Vista de Historial
  if (view === 'historial') {
    return (
      <HistorialGastos 
        onBack={() => setView('dashboard')} 
        onEdit={handleEdit}
      />
    );
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
        <span className="badge">Unidad #45</span>
      </div>

      <div className="card">
        <div className="card-header">
          <div><p className="card-label">Gasto Acumulado</p><p className="amount">$1,240.00</p></div>
          <div className="card-icon-wrapper"><span className="material-symbols-outlined">monitoring</span></div>
        </div>
      </div>

      <h2 className="section-title">Registrar Nuevo Gasto</h2>
      <div className="registration-grid">
        {/* BOTONES CON FONDO BLANCO PARA MEJOR VISIBILIDAD */}
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
        <div className={`nav-item ${view === 'historial' ? 'active' : ''}`} onClick={() => setView('historial')}>
          <span className="material-symbols-outlined">history</span><span>Historial</span>
        </div>
      </nav>
    </div>
  );
}

export default App;