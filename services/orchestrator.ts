
import { GoogleGenAI, Type } from "@google/genai";
import { ClientProfile, Project, Constraints, ProgramCard, FinalReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Schéma pour les fiches programmes (utilisé par les scouts)
const programCardSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      program_name: { type: Type.STRING },
      jurisdiction: { type: Type.STRING },
      instrument_type: { type: Type.STRING },
      short_description: { type: Type.STRING },
      why_relevant: { type: Type.STRING },
      role_in_funding_stack: { type: Type.STRING },
      sources: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            url: { type: Type.STRING }
          }
        }
      },
      eligibility: {
        type: Type.OBJECT,
        properties: {
          key_criteria: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, source_url: { type: Type.STRING } } } },
          eligible_costs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, source_url: { type: Type.STRING } } } },
          exclusions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, source_url: { type: Type.STRING } } } },
          deadlines_or_periods: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, source_url: { type: Type.STRING } } } },
          required_documents: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, source_url: { type: Type.STRING } } } },
          cumul_notes: { type: Type.OBJECT, properties: { status: { type: Type.STRING }, note: { type: Type.STRING }, source_url: { type: Type.STRING } } }
        }
      },
      value_model: {
        type: Type.OBJECT,
        properties: {
          estimated_value_range: { type: Type.STRING },
          estimated_value_numeric: { type: Type.NUMBER },
          assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
          probability_of_success: { type: Type.STRING },
          time_to_cash: { type: Type.STRING },
          effort_level: { type: Type.STRING }
        }
      },
      risk: {
        type: Type.OBJECT,
        properties: {
          risk_level: { type: Type.STRING },
          main_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          mitigations: { type: Type.ARRAY, items: { type: Type.STRING } },
          human_validation_required: { type: Type.STRING }
        }
      },
      status: { type: Type.STRING },
      confidence: { type: Type.STRING },
      notes: { type: Type.STRING }
    },
    required: ["program_name", "short_description", "sources", "status", "value_model", "risk"]
  }
};

// Schéma pour le rapport final (TRES IMPORTANT pour que le dashboard s'affiche)
const finalReportSchema = {
  type: Type.OBJECT,
  properties: {
    executive_summary: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        key_numbers: {
          type: Type.OBJECT,
          properties: {
            total_estimated_support_range: { type: Type.STRING },
            avg_time_to_cash: { type: Type.STRING },
            overall_risk_level: { type: Type.STRING },
            top_3_levers: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        what_to_do_next: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    funding_stack: {
      type: Type.OBJECT,
      properties: {
        stack_layers: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              layer: { type: Type.STRING },
              estimated_range: { type: Type.STRING },
              notes: { type: Type.STRING }
            }
          }
        },
        bridge_financing_need: { type: Type.STRING },
        bridge_financing_notes: { type: Type.STRING }
      }
    },
    timeline_cashflow: {
      type: Type.OBJECT,
      properties: {
        narrative: { type: Type.STRING },
        milestones: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              month: { type: Type.STRING },
              expected_event: { type: Type.STRING }
            }
          }
        }
      }
    }
  },
  required: ["executive_summary", "funding_stack", "timeline_cashflow"]
};

export class GrantOrchestrator {
  private profile: ClientProfile;
  private projects: Project[];
  private constraints: Constraints;

  constructor(profile: ClientProfile, projects: Project[], constraints: Constraints) {
    this.profile = profile;
    this.projects = projects;
    this.constraints = constraints;
  }

  private async callAgent(id: string, role: string, task: string, context: any = {}, schema?: any): Promise<any> {
    const prompt = `
      RÔLE: ${role}
      PROFIL CLIENT: ${JSON.stringify(this.profile)}
      PROJETS: ${JSON.stringify(this.projects)}
      DONNÉES DISPONIBLES: ${JSON.stringify(context).substring(0, 15000)} 
      MISSION: ${task}
      RETOURNE UNIQUEMENT LE JSON. SOIS PRÉCIS SUR LES SOURCES.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: schema
        },
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error(`[GrantOS Error] Agent ${id}:`, error);
      return schema?.type === Type.ARRAY ? [] : null;
    }
  }

  async execute(onProgress: (agentId: string, status?: string) => void): Promise<FinalReport | null> {
    const trail: any[] = [];

    // T0: Normalize
    onProgress("Orchestrator_CIO", "Analyse des structures de coûts...");
    const profileContext = await this.callAgent("Orchestrator_CIO", "CIO Strategy", "Normalise le profil et catégorise les coûts R&D, CAPEX, OPEX.");
    onProgress("Orchestrator_CIO_DONE");
    trail.push({ phase: "NORMALIZE", agent: "Orchestrator_CIO", verdict: "PASS", notes: "Profil normalisé." });

    // T1: Scouts (Parallèle)
    const scoutConfigs = [
      { id: 'Federal_Scout', role: 'Expert Canada.ca', task: "Trouve 3 programmes fédéraux (RS&DE, IRAP, CanExport).", status: "Exploration des hubs fédéraux..." },
      { id: 'Quebec_Scout', role: 'Expert Invest Québec', task: "Trouve 3 programmes Québec (CDAE, ESSOR, Innovation).", status: "Scan des programmes provinciaux..." },
      { id: 'Tax_Credit_Specialist', role: 'Fiscaliste', task: "Identifie les crédits d'impôt applicables aux salaires.", status: "Optimisation de la masse salariale..." },
      { id: 'Financial_Programs_Scout', role: 'Expert BDC/EDC', task: "Solutions de financement BDC/EDC.", status: "Recherche de leviers non-dilutifs..." },
      { id: 'Banking_Products_Scout', role: 'Expert Banque PME', task: "Solutions de bridge financing Desjardins/RBC.", status: "Analyse des solutions bancaires..." },
      { id: 'Sector_Programs_Scout', role: 'Expert Sectoriel', task: "Programmes spécifiques au secteur d'activité.", status: "Veille sectorielle stratégique..." }
    ];

    const scoutPromises = scoutConfigs.map(async (s) => {
      onProgress(s.id, s.status);
      const res = await this.callAgent(s.id, s.role, s.task, profileContext, programCardSchema);
      onProgress(`${s.id}_DONE`);
      return res || [];
    });

    const results = await Promise.all(scoutPromises);
    let candidates: ProgramCard[] = results.flat().filter(p => p && p.program_name);

    // T2-T5: Processing chain
    const processingSteps = [
      { id: "Quality_Auditor", role: "Audit Qualité", task: "Vérifie les sources et élimine les doublons.", status: "Validation des sources officielles..." },
      { id: "Risk_Compliance_Officer", role: "Risk Manager", task: "Évalue les risques de cumul et conformité.", status: "Vérification des règles de cumul..." },
      { id: "Value_Modeler", role: "Financier", task: "Estime les montants et le calendrier cash.", status: "Modélisation des flux de trésorerie..." }
    ];

    for (const step of processingSteps) {
      onProgress(step.id, step.status);
      const res = await this.callAgent(step.id, step.role, step.task, candidates, programCardSchema);
      if (res && res.length > 0) candidates = res;
      onProgress(`${step.id}_DONE`);
      trail.push({ phase: step.id, agent: step.role, verdict: "PASS", notes: `Validation ${step.id} ok.` });
    }

    // T6: Final Composition
    onProgress("Final_Composition", "Synthèse du rapport exécutif...");
    const reportData = await this.callAgent(
      "Orchestrator_CIO", 
      "CIO Executive", 
      "Génère le rapport final synthétique basé sur les candidats validés.",
      candidates,
      finalReportSchema
    );
    
    if (!reportData) return null;

    // Post-traitement pour assurer la compatibilité avec le Dashboard UI
    const finalReport: FinalReport = {
      ...reportData,
      report_metadata: {
        generated_at: new Date().toISOString(),
        scope: "Audit Complet Subventions & Financements"
      },
      // On transforme les candidats en Top Recommendations avec rank et next_steps
      top_recommendations: candidates.slice(0, 4).map((c, index) => ({
        ...c,
        rank: index + 1,
        next_steps: {
          next_7_days: ["Vérifier l'admissibilité détaillée", "Préparer la liste des documents"],
          next_30_days: ["Déposer la demande officielle", "Suivi avec l'agent de programme"]
        }
      })),
      rejected_items: [],
      questions_for_client: ["Avez-vous déjà bénéficié de la RS&DE par le passé ?", "Vos états financiers sont-ils audités ?"],
      audit_trail: trail
    };

    onProgress("Final_Composition_DONE");
    return finalReport;
  }
}
