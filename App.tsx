
import React, { useState } from 'react';
import { PremiumLayout } from './components/PremiumLayout';
import { ProfileForm } from './components/ProfileForm';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ReportDashboard } from './components/ReportDashboard';
import { GrantOrchestrator } from './services/orchestrator';
import { ClientProfile, Project, Constraints, FinalReport } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<'form' | 'loading' | 'report'>('form');
  const [report, setReport] = useState<FinalReport | null>(null);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, string>>({});

  const handleStartAnalysis = async (profile: ClientProfile, projects: Project[], constraints: Constraints) => {
    setStep('loading');
    setCompletedAgents([]);
    setActiveAgents([]);
    setAgentStatuses({});
    
    try {
      const orchestrator = new GrantOrchestrator(profile, projects, constraints);
      
      const onProgress = (agentId: string, status?: string) => {
        if (agentId.endsWith('_DONE')) {
          const id = agentId.replace('_DONE', '');
          setActiveAgents(prev => prev.filter(a => a !== id));
          setCompletedAgents(prev => [...prev, id]);
        } else {
          setActiveAgents(prev => [...prev, agentId]);
          if (status) {
            setAgentStatuses(prev => ({ ...prev, [agentId]: status }));
          }
        }
      };

      const result = await orchestrator.execute(onProgress);
      
      if (!result || !result.executive_summary) {
        throw new Error("Le rapport généré est vide ou mal formé.");
      }
      
      setReport(result);
      setStep('report');
      
    } catch (error) {
      console.error("Erreur Workflow:", error);
      alert("Échec du processus multi-agent. Détails: " + (error as Error).message);
      setStep('form');
    }
  };

  return (
    <PremiumLayout>
      {step === 'form' && <ProfileForm onSubmit={handleStartAnalysis} />}
      {step === 'loading' && (
        <div className="py-12">
          <AnalysisProgress 
            completedAgents={completedAgents} 
            activeAgents={activeAgents} 
            agentStatuses={agentStatuses}
          />
        </div>
      )}
      {step === 'report' && report && <ReportDashboard report={report} />}
      
      <div className="fixed -bottom-48 -left-48 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -top-48 -right-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
    </PremiumLayout>
  );
};

export default App;
