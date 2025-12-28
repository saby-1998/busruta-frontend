export const ActionButton = ({ icon, title, description, bgImage }) => (
  <button className="relative flex items-center gap-4 rounded-xl bg-card-dark p-4 text-left border border-white/5 hover:border-primary/50 transition-colors group active:bg-white/5 overflow-hidden">
    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-black/80 to-transparent z-10"></div>
    <div 
      className="absolute right-0 top-0 h-full w-1/3 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
      style={{ backgroundImage: `url(${bgImage})` }}
    />
    <div className="relative z-20 flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-background-dark shadow-[0_0_15px_rgba(19,236,19,0.4)]">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div className="relative z-20 flex-1">
      <p className="text-lg font-bold text-white group-hover:text-primary transition-colors">{title}</p>
      <p className="text-text-muted text-sm">{description}</p>
    </div>
    <span className="material-symbols-outlined relative z-20 text-white/50">chevron_right</span>
  </button>
);