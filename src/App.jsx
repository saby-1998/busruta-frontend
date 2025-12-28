import React, { useState } from 'react';
import './App.css';
import RegistroGastos from './components/RegistroGastos';

function App() {
  // Estado para controlar qué pantalla vemos: 'dashboard' o 'registro-diario'
  const [view, setView] = useState('dashboard');

  // Si la vista actual es el registro, renderizamos ese componente
  if (view === 'registro-diario') {
    return <RegistroGastos onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="profile">
          <div className="avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <p className="welcome">DASHBOARD</p>
            <p className="name">Wlady</p>
          </div>
        </div>
        <button className="notification-btn">
          <span className="material-symbols-outlined">notifications</span>
          <span className="notification-dot"></span>
        </button>
      </header>

      <div className="unit-info">
        <h1>Estado Financiero</h1>
        <span className="badge">Unidad #45</span>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <p className="card-label">Gasto Acumulado (Mes)</p>
            <p className="amount">$1,240.00</p>
          </div>
          <div className="card-icon-wrapper">
            <span className="material-symbols-outlined">monitoring</span>
          </div>
        </div>
        <div className="card-footer-info">
          <p>Presupuesto restante: <strong>$450.00</strong></p>
          <div className="progress-bar"><div className="progress-fill"></div></div>
        </div>
      </div>

      <h2 className="section-title">Registrar Nuevo Gasto</h2>
      <div className="registration-grid">
        {/* CONEXIÓN AQUÍ: Al hacer clic, cambiamos a la vista de registro */}
        <button className="reg-card daily" onClick={() => setView('registro-diario')}>
          <div className="reg-icon"><span className="material-symbols-outlined">receipt</span></div>
          <span>Diario</span>
        </button>
        
        <button className="reg-card monthly">
          <div className="reg-icon"><span className="material-symbols-outlined">calendar_month</span></div>
          <span>Mensual</span>
        </button>
        
        <button className="reg-card yearly">
          <div className="reg-icon"><span className="material-symbols-outlined">account_balance</span></div>
          <span>Anual</span>
        </button>
      </div>

      <h2 className="section-title">Consultar</h2>
      <div className="menu">
        <button className="menu-item">
          <span className="material-symbols-outlined menu-icon">history</span>
          <div className="menu-text">
            <strong>Historial de Gastos</strong>
            <span>Ver registros pasados</span>
          </div>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item active"><span className="material-symbols-outlined">grid_view</span><span>Panel</span></div>
        <div className="nav-item"><span className="material-symbols-outlined">history</span><span>Historial</span></div>
        <div className="nav-item"><span className="material-symbols-outlined">person</span><span>Perfil</span></div>
      </nav>
    </div>
  );
}

export default App;