import { Gamepad } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Arcade() {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center p-8 bg-bg-base relative">
      <div className="max-w-5xl w-full">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 flex items-center justify-center gap-4 text-text-main">
            <Gamepad size={48} className="text-secondary" />
            THE ARCADE
            <Gamepad size={48} className="text-secondary" />
          </h1>
          <p className="text-xl text-text-muted">Select your game to play.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Othello', 'Connect Four', 'Minesweeper'].map((game) => (
            <div 
              key={game}
              className="group aspect-square bg-bg-surface border-4 border-border rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary hover:scale-105 transition-all cursor-pointer shadow-lg"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full mb-4 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary transition-colors">
                <Gamepad size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-main">{game}</h3>
              <div className="mt-4 px-4 py-1 bg-secondary text-bg-surface font-black text-sm rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Play
              </div>
            </div>
          ))}

          {/* Navigable Ooze Flow Card */}
          <Link to="/arcade/oozeflow" className="group aspect-square bg-bg-surface border-4 border-border rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary hover:scale-105 transition-all cursor-pointer shadow-lg">
            <div className="w-20 h-20 bg-primary/20 rounded-full mb-4 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary transition-colors">
              <Gamepad size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-main">Ooze Flow</h3>
            <div className="mt-4 px-4 py-1 bg-secondary text-bg-surface font-black text-sm rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Play
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
