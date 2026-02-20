
import React from 'react';

export const PremiumLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">G</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">GrantOS <span className="text-indigo-600">v7</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Aide</a>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-slate-400">System Ready</span>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2024 GrantOS System - Intelligence de Financement Institutionnel.</p>
          <div className="flex gap-6">
            <a href="#">Confidentialité</a>
            <a href="#">Conditions</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
