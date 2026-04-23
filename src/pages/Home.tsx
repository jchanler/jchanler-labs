import { ArrowRight, Play, Box, Layers, LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-bg-base to-bg-surface flex-grow">
      <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20">
            <Box size={16} />
            <span>Welcome to JChanler Labs</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-main">
            A site with some <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              fun projects to share.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Welcome to my digital laboratory. Part arcade, part sandbox, part excuse to play with new code.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-8">
          {[
            { tag: 'Arcade', label: 'Play Retro Games', path: '/arcade', icon: Layers, color: 'text-primary' },
            { tag: 'Map', label: 'Explore the Atlas', path: '/map', icon: Box, color: 'text-secondary' },
            { tag: 'Media', label: 'Tune the Signal', path: '/media', icon: Play, color: 'text-accent' },
            { tag: 'Lab', label: 'Experiments & Tests', path: '/tests', icon: Layers, color: 'text-primary' },
            { tag: 'Links', label: 'Useful Links', path: '/links', icon: LinkIcon, color: 'text-primary' },
          ].map((item, i) => (
            <Link
              to={item.path}
              key={i}
              className="group p-8 rounded-3xl bg-bg-surface border border-border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col"
            >
              <div className={`p-4 rounded-2xl bg-bg-base w-fit ${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-text-main mb-2">{item.tag}</h3>
              <p className="text-text-muted flex-grow mb-6">{item.label}</p>
              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                Explore <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
