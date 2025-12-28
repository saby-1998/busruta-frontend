import { ActionButton } from "../components/ActionButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-dark text-white pb-24">
      {/* Header */}
      <header className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full border-2 border-primary bg-gray-500" />
            <div>
              <p className="text-text-muted text-xs uppercase">Bienvenido</p>
              <p className="text-lg font-bold">Roberto G.</p>
            </div>
          </div>
          <button className="size-10 bg-card-dark rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
        <div className="flex justify-between items-end">
          <h1 className="text-4xl font-bold">Unidad #45</h1>
          <span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">En servicio</span>
        </div>
      </header>

      {/* Summary Card */}
      <section className="px-4">
        <div className="bg-card-dark p-5 rounded-xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Resumen de Hoy
              </div>
              <p className="text-4xl font-bold">$120.00</p>
            </div>
            <div className="size-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-primary text-black font-bold py-3 rounded-lg flex justify-between px-4">
            Ver Detalle <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Menu Grid */}
      <main className="p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Menú Principal</h2>
        <ActionButton 
          icon="receipt_long" 
          title="Registrar Gasto Diario" 
          description="Combustible, alimentación..." 
        />
        <ActionButton 
          icon="build_circle" 
          title="Gastos Mensuales" 
          description="Mantenimiento, seguros..." 
        />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0c1a0c]/95 backdrop-blur-md border-t border-white/10 p-4 flex justify-around">
        <NavItem icon="home" label="Inicio" active />
        <NavItem icon="history" label="Historial" />
        <NavItem icon="directions_bus" label="Mi Bus" />
        <NavItem icon="settings" label="Ajustes" />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button className={`flex flex-col items-center gap-1 ${active ? 'text-primary' : 'text-text-muted'}`}>
      <span className={`material-symbols-outlined ${active && 'fill-1'}`}>{icon}</span>
      <span className="text-[10px]">{label}</span>
    </button>
  );
}