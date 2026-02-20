
import React, { useState } from 'react';
import { ClientProfile, Project, Constraints } from '../types';

interface Props {
  onSubmit: (profile: ClientProfile, projects: Project[], constraints: Constraints) => void;
}

export const ProfileForm: React.FC<Props> = ({ onSubmit }) => {
  const [profile, setProfile] = useState<ClientProfile>({
    legal_structure: 'INC',
    province: 'QC',
    city: 'Montréal',
    industry: 'Technologies de l\'information',
    employees: '1-10',
    stage: 'startup',
    export: 'non',
    rd_innovation: 'oui',
    digital_transformation: 'oui',
    training: 'non',
    hiring: 'oui',
    capex: 'non',
    clean_tech: 'non'
  });

  const [project, setProject] = useState<Project>({
    name: 'Expansion Innovation 2025',
    objective: 'Développement d\'une nouvelle plateforme IA pour le secteur financier.',
    timeline: { start: '2025-01', end: '2025-12' },
    costs: {
      salaries: 250000,
      contractors: 50000,
      software: 15000,
      equipment: 10000,
      training: 5000,
      marketing_export: 20000,
      other: 0
    }
  });

  const [constraints, setConstraints] = useState<Constraints>({
    time_horizon_months: 12,
    need_cash_fast: 'non',
    risk_tolerance: 'moyen',
    documentation_readiness: 'élevé'
  });

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">Initialisation du Système Agentic</h2>
        <p className="mt-2 text-slate-500">Configurez le profil pour lancer les 6 scouts en parallèle.</p>
      </div>

      <div className="space-y-10">
        {/* Profile Section */}
        <section>
          <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-xs">1</span>
            Profil de l'Entreprise
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Province</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                value={profile.province}
                onChange={(e) => setProfile({...profile, province: e.target.value})}
              >
                <option value="QC">Québec</option>
                <option value="ON">Ontario</option>
                <option value="BC">Colombie-Britannique</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Employés</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                value={profile.employees}
                onChange={(e) => setProfile({...profile, employees: e.target.value})}
              >
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-250">51-250</option>
                <option value="250+">250+</option>
              </select>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['rd_innovation', 'export', 'hiring', 'clean_tech'].map(key => (
                <div key={key}>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{key.replace('_', ' ')}</label>
                  <button 
                    onClick={() => setProfile({...profile, [key]: (profile as any)[key] === 'oui' ? 'non' : 'oui'})}
                    className={`w-full py-2 rounded-lg text-sm font-medium border transition-all ${
                      (profile as any)[key] === 'oui' 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    {(profile as any)[key].toUpperCase()}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Section */}
        <section>
          <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-xs">2</span>
            Projet & Dépenses
          </h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Nom du projet" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              value={project.name}
              onChange={(e) => setProject({...project, name: e.target.value})}
            />
            <textarea 
              placeholder="Objectif stratégique..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500"
              value={project.objective}
              onChange={(e) => setProject({...project, objective: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Salaires R&D ($)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none"
                  value={project.costs.salaries}
                  onChange={(e) => setProject({...project, costs: {...project.costs, salaries: Number(e.target.value)}})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Marketing/Export ($)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none"
                  value={project.costs.marketing_export}
                  onChange={(e) => setProject({...project, costs: {...project.costs, marketing_export: Number(e.target.value)}})}
                />
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={() => onSubmit(profile, [project], constraints)}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]"
        >
          Générer la Stratégie Multi-Agents
        </button>
      </div>
    </div>
  );
};
