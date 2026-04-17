import { ArrowRight, Link2, Camera, Aperture, Palette, Pointer } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Tests() {
  return (
    <div className="w-full min-h-full flex flex-col items-center p-8 bg-bg-base">
      <div className="max-w-6xl w-full">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-text-main flex items-center gap-4">
            <Link2 className="text-primary" size={40} />
            Links
          </h1>
          <p className="text-xl text-text-muted">
            Some helpful websites and resources.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-8">
          {[
            { tag: 'Unsplash', label: 'The internet’s source for visuals', path: 'https://unsplash.com/', icon: Camera, color: 'text-primary' },
            { tag: 'Pexels', label: 'The best free stock photos, royalty free images', path: 'https://www.pexels.com/', icon: Aperture, color: 'text-secondary' },
            { tag: 'Lucide', label: 'Beautiful & consistent icons', path: 'https://lucide.dev/', icon: Pointer, color: 'text-accent' },
            { tag: 'Coolors', label: 'The super fast color palette generator', path: 'https://coolors.co/', icon: Palette, color: 'text-primary' },
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
