import { Music } from 'lucide-react';

export default function Media() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-bg-base relative text-text-main flex-grow">
      <div className="max-w-2xl w-full flex flex-col gap-8 h-full justify-center">
        <div className="bg-bg-surface rounded-3xl border border-border shadow-xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {/* Decorative rings for "radio" waves */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square border-[40px] border-primary/5 rounded-full animate-[ping_4s_ease-out_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] aspect-square border-[20px] border-primary/5 rounded-full animate-[ping_3s_ease-out_infinite] animation-delay-1000"></div>

          <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-8 relative z-10 hover:scale-110 transition-transform cursor-pointer">
            <Music size={56} className="animate-pulse" />
          </div>
          
          <h2 className="text-4xl font-black mb-4 relative z-10">Pirate Radio</h2>
          <p className="text-text-muted text-lg mb-10 max-w-sm relative z-10">
            Tune into the frequency. Connect to Spotify, YouTube, or maybe just some static noise from deep space.
          </p>
          
          <button className="px-10 py-4 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-primary/80 hover:shadow-primary/30 hover:-translate-y-1 transition-all z-10">
            Turn the Dial
          </button>
        </div>
        
        <div className="bg-bg-surface rounded-3xl border border-border p-6 shadow-md max-w-lg mx-auto w-full">
          <div className="flex justify-between items-center bg-bg-base p-4 rounded-xl">
            <span className="font-mono text-text-muted">Bandwidth:</span>
            <span className="font-mono text-accent flex items-center gap-2 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping"></span>
              Awaiting Signal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
