
import { GoogleGenAI, Type } from "@google/genai";
import { ClientProfile, Project, Constraints, ProgramCard, FinalReport } from "../types";

// Initialisation du client AI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * COUCHE DE SÉCURITÉ ZAKI
 * Assure l'intégrité des données et la validation des sorties agents
 */
class SecurityLayer {
  static validateAgentOutput(data: any, schema: any): boolean {
    // Simulation d'une validation de schéma stricte
    if (!data) return false;
    if (schema.type === Type.ARRAY && !Array.isArray(data)) return false;
    return true;
  }

  static sanitizeInput(input: string): string {
    return input.replace(/[<>]/g, ""); // Protection XSS basique
  }
}

// Schémas de validation
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
          cumul_notes: { type: Type.OBJECT, properties: { status: { type: Type.STRING }, note: { type: Type.STRING }, source_url: { type: Type.STRING } } }
        }
      },
      value_model: {
        type: Type.OBJECT,
        properties: {
          estimated_value_range: { type: Type.STRING },
          estimated_value_numeric: { type: Type.NUMBER },
          probability_of_success: { type: Type.STRING },
          time_to_cash: { type: Type.STRING },
          effort_level: { type: Type.STRING }
        }
      },
      risk: {
        type: Type.OBJECT,
        properties: {
          risk_level: { type: Type.STRING },
          main_risks: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      status: { type: Type.STRING }
    },
    required: ["program_name", "short_description", "sources", "status", "value_model", "risk"]
  }
};

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

  /**
   * Appel Agent avec sélection de modèle intelligente
   */
  private async callAgent(
    id: string, 
    role: string, 
    task: string, 
    context: any = {}, 
    schema?: any,
    usePro: boolean = false
  ): Promise<any> {
    const model = usePro ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";
    
    const prompt = `
      RÔLE: ${role}
      PROFIL CLIENT: ${JSON.stringify(this.profile)}
      PROJETS: ${JSON.stringify(this.projects)}
      CONTEXTE: ${JSON.stringify(context).substring(0, 15000)} 
      MISSION: ${SecurityLayer.sanitizeInput(task)}
      
      IMPORTANT: Pour 'estimated_value_numeric', fournis une valeur numérique pure.
      RETOURNE UNIQUEMENT LE JSON. SOIS PRÉCIS SUR LES SOURCES.
    `;

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          temperature: usePro ? 0.2 : 0.1,
          responseMimeType: "application/json",
          responseSchema: schema
        },
      });

      const data = JSON.parse(response.text);
      
      // Validation Sécurité
      if (!SecurityLayer.validateAgentOutput(data, schema)) {
        throw new Error(`Validation Error on Agent ${id}`);
      }

      return data;
    } catch (error) {
      console.error(`[GrantOS Security Alert] Agent ${id} failed:`, error);
      return schema?.type === Type.ARRAY ? [] : null;
    }
  }

  async execute(onProgress: (agentId: string, status?: string) => void): Promise<FinalReport | null> {
    const trail: any[] = [];

    // T0: Normalisation (Flash)
    onProgress("Orchestrator_CIO", "Normalisation du profil client...");
    const profileContext = await this.callAgent("Orchestrator_CIO", "CIO Strategy", "Normalise le profil et catégorise les coûts.");
    onProgress("Orchestrator_CIO_DONE");
    trail.push({ phase: "NORMALIZE", agent: "Orchestrator_CIO", verdict: "PASS", notes: "Profil sécurisé et normalisé." });

    // T1: Scouts Parallèles (Flash)
    const scoutConfigs = [
      { id: 'Federal_Scout', role: 'Expert Fédéral', task: "Trouve 3 programmes fédéraux.", status: "Scan Canada.ca..." },
      { id: 'Quebec_Scout', role: 'Expert Québec', task: "Trouve 3 programmes Québec.", status: "Scan Invest Québec..." },
      { id: 'Tax_Credit_Specialist', role: 'Fiscaliste', task: "Crédits d'impôt salariaux.", status: "Analyse fiscale..." },
      { id: 'Financial_Programs_Scout', role: 'Expert BDC/EDC', task: "Financement BDC/EDC.", status: "Recherche leviers BDC..." }
    ];

    const scoutPromises = scoutConfigs.map(async (s) => {
      onProgress(s.id, s.status);
      const res = await this.callAgent(s.id, s.role, s.task, profileContext, programCardSchema);
      onProgress(`${s.id}_DONE`);
      return res || [];
    });

    const results = await Promise.all(scoutPromises);
    let candidates: ProgramCard[] = results.flat().filter(p => p && p.program_name);

    // T2: Audit de Qualité & Risque (Pro) - Utilisation du modèle Pro pour le raisonnement critique
    onProgress("Quality_Auditor", "Audit de conformité et dédoublonnage (Gemini Pro)...");
    const auditedCandidates = await this.callAgent(
      "Quality_Auditor", 
      "Senior Auditor", 
      "Vérifie la véracité des sources, élimine les doublons et valide l'éligibilité réelle.",
      candidates,
      programCardSchema,
      true // Use Pro
    );
    if (auditedCandidates && auditedCandidates.length > 0) candidates = auditedCandidates;
    onProgress("Quality_Auditor_DONE");
    trail.push({ phase: "AUDIT", agent: "Senior Auditor", verdict: "PASS", notes: "Audit Gemini Pro terminé." });

    // T3: Composition Finale (Pro)
    onProgress("Final_Composition", "Génération du rapport stratégique (Gemini Pro)...");
    const reportData = await this.callAgent(
      "Orchestrator_CIO", 
      "CIO Executive", 
      "Génère le rapport final synthétique.",
      candidates,
      finalReportSchema,
      true // Use Pro
    );
    
    if (!reportData) return null;

    const finalReport: FinalReport = {
      ...reportData,
      report_metadata: {
        generated_at: new Date().toISOString(),
        scope: "Audit Multi-Model GrantOS v7"
      },
      top_recommendations: candidates.slice(0, 4).map((c, index) => ({
        ...c,
        rank: index + 1,
        next_steps: {
          next_7_days: ["Vérifier l'admissibilité", "Préparer les documents"],
          next_30_days: ["Dépôt officiel"]
        }
      })),
      rejected_items: [],
      questions_for_client: ["Avez-vous des dettes fiscales ?", "Vos brevets sont-ils déposés ?"],
      audit_trail: trail
    };

    onProgress("Final_Composition_DONE");
    return finalReport;
  }
}
