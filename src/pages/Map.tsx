import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as MapIcon } from 'lucide-react';

export default function Map() {
  const position: [number, number] = [42.3561, -71.0655]; // Boston as default

  return (
    <div className="w-full h-full flex flex-col p-8 bg-bg-base relative text-text-main flex-grow">
      <div className="max-w-5xl mx-auto w-full h-[80vh] flex flex-col bg-bg-surface rounded-3xl border border-border shadow-xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-4 bg-bg-base">
          <div className="p-3 bg-secondary/10 text-secondary rounded-xl animate-pulse">
            <MapIcon size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black">The Broken Atlas</h2>
            <p className="text-text-muted mt-1">Charting coordinates in the digital nowhere.</p>
          </div>
        </div>
        <div className="flex-grow w-full relative z-0">
          <MapContainer center={position} zoom={12} scrollWheelZoom={true} className="w-full h-full min-h-[400px]">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                You are here. Probably.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
