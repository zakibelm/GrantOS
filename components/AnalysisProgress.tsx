
import React from 'react';

const AGENT_LABELS: Record<string, string> = {
  "Orchestrator_CIO": "Normalisation du profil",
  "Federal_Scout": "Scout Fédéral (Canada.ca)",
  "Quebec_Scout": "Scout Québec (Invest QC)",
  "Tax_Credit_Specialist": "Spécialiste Crédits d'Impôt",
  "Financial_Programs_Scout": "Scout BDC / EDC",
  "Banking_Products_Scout": "Analyse Banques Commerciales",
  "Sector_Programs_Scout": "Recherche Sectorielle (NAICS)",
  "Quality_Auditor": "Audit Qualité & Sources",
  "Risk_Compliance_Officer": "Analyse Conformité & Risques",
  "Value_Modeler": "Modélisation Cashflow & ROI",
  "Final_Composition": "Génération du Rapport Premium"
};

interface Props {
  completedAgents: string[];
  activeAgents: string[];
  agentStatuses: Record<string, string>;
}

export const AnalysisProgress: React.FC<Props> = ({ completedAgents, activeAgents, agentStatuses }) => {
  const total = Object.keys(AGENT_LABELS).length;
  const progressPercent = Math.min(100, (completedAgents.length / total) * 100);

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden">
      {/* Animated Gradient Progress Bar */}
      <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all duration-700 ease-out" 
          style={{ width: `${progressPercent}%`, backgroundSize: '200% 100%' }}
        ></div>
      </div>
      
      <div className="text-center mb-8 pt-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Multi-Agents Active</h2>
        <p className="text-slate-500 text-sm mt-1">Analyse parallèle des hubs officiels et modélisation financière.</p>
      </div>

      <div className="space-y-2">
        {Object.entries(AGENT_LABELS).map(([id, label]) => {
          const isDone = completedAgents.includes(id);
          const isActive = activeAgents.includes(id);
          const statusText = agentStatuses[id];
          
          return (
            <div key={id} className={`flex flex-col px-5 py-3 rounded-xl border transition-all duration-300 ${
              isDone ? 'bg-green-50/50 border-green-100 opacity-100' : isActive ? 'bg-indigo-50 border-indigo-200 shadow-sm scale-[1.01]' : 'bg-slate-50/50 border-slate-100 opacity-40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isDone ? 'bg-green-500' : isActive ? 'bg-indigo-500 animate-pulse ring-4 ring-indigo-500/20' : 'bg-slate-300'
                  }`}></div>
                  <span className={`text-sm font-bold ${isDone ? 'text-green-900' : isActive ? 'text-indigo-900' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                <div className="flex items-center">
                  {isActive ? (
                    <span className="text-[10px] font-black text-indigo-600 animate-pulse tracking-widest">PROCESSING...</span>
                  ) : isDone ? (
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Queued</span>
                  )}
                </div>
              </div>
              {isActive && statusText && (
                <div className="mt-2 ml-6.5">
                  <p className="text-[11px] text-indigo-500 italic font-medium animate-in fade-in slide-in-from-left-1 duration-500">
                    {statusText}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
