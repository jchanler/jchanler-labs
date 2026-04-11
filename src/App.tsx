import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Arcade from './pages/Arcade';
import Map from './pages/Map';
import Media from './pages/Media';
import OozeFlowGame from './games/OozeFlow';
import Tests from './pages/Tests';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
        <Navigation />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/arcade" element={<Arcade />} />
            <Route path="/arcade/oozeflow" element={<OozeFlowGame />} />
            <Route path="/map" element={<Map />} />
            <Route path="/media" element={<Media />} />
            <Route path="/tests" element={<Tests />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
