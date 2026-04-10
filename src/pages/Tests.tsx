import { Terminal, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function Tests() {
  return (
    <div className="w-full min-h-full flex flex-col items-center p-8 bg-bg-base">
      <div className="max-w-6xl w-full">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-text-main flex items-center gap-4">
            <Terminal className="text-primary" size={40} />
            The Laboratory
          </h1>
          <p className="text-xl text-text-muted">
            Breaking things on purpose. Test infrastructure, bots, and automated chaos.
          </p>
        </header>

        {/* Dashboard Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Passed', val: '142', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Failed', val: '3', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
            { label: 'Skipped', val: '1', icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-bg-surface border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-text-muted font-medium mb-1">{stat.label}</p>
                <p className="text-4xl font-bold text-text-main">{stat.val}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={32} />
              </div>
            </div>
          ))}
        </div>

        {/* Iframe Placeholder for Allure Report */}
        <div className="w-full h-[600px] bg-bg-surface border border-border rounded-3xl shadow-xl flex flex-col overflow-hidden relative">
          <div className="h-12 bg-border/50 border-b border-border flex items-center px-4 gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mx-auto px-12 py-1 bg-bg-base rounded text-xs text-text-muted font-mono border border-border/50">
              allure-report/index.html
            </div>
          </div>
          <div className="flex-grow flex items-center justify-center p-8 text-center bg-bg-base/50">
            <div className="space-y-4">
              <Terminal size={48} className="text-text-muted mx-auto opacity-50" />
              <p className="text-text-muted font-mono text-lg">Iframe Mount Point</p>
              <p className="text-text-muted text-sm max-w-md">
                Configure your CI/CD pipeline to serve the generated Allure HTML report inside this container.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
