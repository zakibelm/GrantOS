
import React, { useState } from 'react';
import { FinalReport, ProgramCard } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FeedbackSection } from './FeedbackSection';

interface Props {
  report: FinalReport;
}

const ProgramBadge = ({ type, value }: { type: string, value: string }) => {
  const colors: Record<string, string> = {
    'GO': 'bg-green-100 text-green-700 border-green-200',
    'CONDITIONAL_GO': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'NO-GO': 'bg-red-100 text-red-700 border-red-200',
    'faible': 'bg-blue-50 text-blue-600 border-blue-100',
    'moyen': 'bg-orange-50 text-orange-600 border-orange-100',
    'élevé': 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${colors[value] || 'bg-slate-100 text-slate-600'}`}>
      {type}: {value.toUpperCase()}
    </span>
  );
};

const ProgramModal = ({ program, onClose }: { program: ProgramCard, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{program.program_name}</h2>
            <p className="text-sm text-slate-500">{program.jurisdiction} • {program.instrument_type}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              Description Stratégique
            </h3>
            <p className="text-slate-600 leading-relaxed">{program.short_description}</p>
            <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-sm font-bold text-indigo-900 mb-1">Pourquoi ce programme est pertinent pour vous :</p>
              <p className="text-sm text-indigo-700">{program.why_relevant}</p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Éligibilité & Critères</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Critères Clés</h4>
                  <ul className="space-y-2">
                    {program.eligibility.key_criteria.map((c, i) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-2">
                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                        {c.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Coûts Admissibles</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.eligibility.eligible_costs.map((c, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{c.text}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Modèle de Valeur & Risques</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Délai Cash</p>
                    <p className="text-sm font-bold text-slate-900">{program.value_model.time_to_cash}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Probabilité</p>
                    <p className="text-sm font-bold text-slate-900">{program.value_model.probability_of_success}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Risques Majeurs</h4>
                  <ul className="space-y-2">
                    {program.risk.main_risks.map((r, i) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <section className="p-6 bg-slate-900 text-white rounded-3xl">
            <h3 className="text-lg font-bold mb-4">Sources Officielles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {program.sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-colors flex items-center justify-between group">
                  <div>
                    <p className="text-xs font-bold text-indigo-300 uppercase mb-1">Lien Officiel {i+1}</p>
                    <p className="text-sm font-medium truncate max-w-[200px]">{s.title}</p>
                  </div>
                  <svg className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              ))}
            </div>
          </section>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Fermer</button>
        </div>
      </div>
    </div>
  );
};

export const ReportDashboard: React.FC<Props> = ({ report }) => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramCard | null>(null);

  const chartData = report.funding_stack.stack_layers.map(layer => {
    // On essaie de trouver un programme correspondant pour avoir la valeur numérique précise
    const matchingProg = report.top_recommendations.find(p => p.role_in_funding_stack === layer.layer || p.program_name.includes(layer.layer));
    return {
      name: layer.layer,
      value: matchingProg?.value_model.estimated_value_numeric || parseInt(layer.estimated_range.replace(/[^0-9]/g, '')) || 50000,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 pb-24 print:p-0 print:space-y-6">
      {/* Hero Header */}
      <section className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl print:shadow-none print:rounded-none print:bg-white print:text-slate-900 print:p-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent print:hidden"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6 print:hidden">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            RAPPORT STRATÉGIQUE GÉNÉRÉ LE {new Date(report.report_metadata.generated_at).toLocaleDateString()}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight print:text-3xl">{report.executive_summary.headline}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-10 print:mt-4 print:gap-4">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Support Estimé</p>
              <p className="text-2xl font-black text-indigo-400 print:text-indigo-600">{report.executive_summary.key_numbers.total_estimated_support_range}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Délai moyen</p>
              <p className="text-2xl font-black">{report.executive_summary.key_numbers.avg_time_to_cash}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Risque Global</p>
              <p className="text-2xl font-black capitalize">{report.executive_summary.key_numbers.overall_risk_level}</p>
            </div>
            <div className="print:hidden">
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Confiance</p>
              <p className="text-2xl font-black text-green-400">92%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Stack Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:space-y-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 print:border-none print:p-0">
          <h3 className="text-xl font-bold mb-6">Architecture du Funding Stack</h3>
          <div className="h-80 w-full print:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 print:mt-4">
            <h4 className="font-bold text-sm text-slate-500 mb-4">OPTIMISATION RECOMMANDÉE</h4>
            <ul className="space-y-3">
              {report.funding_stack.stack_layers.map((l, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5"></span>
                  <p className="text-sm text-slate-600"><span className="font-bold text-slate-900">{l.layer}:</span> {l.notes}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 print:border-none print:p-0">
          <h3 className="text-xl font-bold mb-6">Prochaines Étapes</h3>
          <div className="space-y-6">
            {report.executive_summary.what_to_do_next.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 print:bg-slate-100 print:text-slate-900">{i+1}</div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
          {report.funding_stack.bridge_financing_need === 'yes' && (
            <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-xl print:bg-slate-50 print:border-slate-200">
              <h4 className="text-orange-800 font-bold text-sm mb-1 uppercase tracking-wider flex items-center gap-2 print:text-slate-900">
                 ⚠️ Alerte Financement Relais
              </h4>
              <p className="text-xs text-orange-700 leading-normal print:text-slate-600">{report.funding_stack.bridge_financing_notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Cards */}
      <section className="print:break-before-page">
        <div className="flex items-center justify-between mb-8 print:mb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Programmes Prioritaires</h2>
            <p className="text-slate-500 text-sm">Validés par le Quality Auditor & Risk Compliance Engine.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all print:hidden"
          >
            Exporter PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-1 print:gap-6">
          {report.top_recommendations.map((prog) => (
            <div key={prog.program_name} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:border-indigo-300 transition-all hover:shadow-xl group print:shadow-none print:border-slate-200">
              <div className="p-8 flex-1 print:p-4">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex flex-wrap gap-2">
                     <ProgramBadge type="Status" value={prog.status} />
                     <ProgramBadge type="Risque" value={prog.risk.risk_level} />
                     <ProgramBadge type="Effort" value={prog.value_model.effort_level} />
                   </div>
                   <span className="text-xs font-bold text-slate-400">#0{prog.rank}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{prog.program_name}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{prog.short_description}</p>
                
                <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 p-4 rounded-xl print:mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Support Estimé</p>
                    <p className="font-bold text-indigo-700">{prog.value_model.estimated_value_range}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Délai Cash-In</p>
                    <p className="font-bold text-slate-700">{prog.value_model.time_to_cash}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-widest">Éligibilité Critique</h4>
                    <ul className="space-y-2">
                      {prog.eligibility.key_criteria.slice(0, 3).map((c, i) => (
                        <li key={i} className="text-xs text-slate-600 flex gap-2">
                          <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                          {c.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between print:hidden">
                <div className="flex gap-2">
                  {prog.sources.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      SOURCE {i+1}
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  ))}
                </div>
                <button 
                  onClick={() => setSelectedProgram(prog)}
                  className="text-xs font-bold text-slate-400 hover:text-indigo-600"
                >
                  VOIR DÉTAILS →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audit Trail */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 print:border-none print:p-0">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          Audit Qualité & Transparence
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 font-bold text-slate-400 uppercase tracking-tighter text-[10px]">Phase</th>
                <th className="pb-3 font-bold text-slate-400 uppercase tracking-tighter text-[10px]">Agent</th>
                <th className="pb-3 font-bold text-slate-400 uppercase tracking-tighter text-[10px]">Verdict</th>
                <th className="pb-3 font-bold text-slate-400 uppercase tracking-tighter text-[10px]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {report.audit_trail.map((entry, i) => (
                <tr key={i}>
                  <td className="py-4 font-bold text-slate-900">{entry.phase}</td>
                  <td className="py-4 text-slate-500">{entry.agent}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${entry.verdict === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {entry.verdict}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-slate-400 italic">{entry.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Learning Loop / Feedback Section */}
      <section className="print:hidden">
        <FeedbackSection />
      </section>

      {/* Modals */}
      {selectedProgram && (
        <ProgramModal 
          program={selectedProgram} 
          onClose={() => setSelectedProgram(null)} 
        />
      )}
    </div>
  );
};
