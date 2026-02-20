
export interface ClientProfile {
  legal_structure: string;
  province: string;
  city: string;
  industry: string;
  naics?: string;
  employees: string;
  revenue_range?: string;
  stage: string;
  export: string;
  rd_innovation: string;
  digital_transformation: string;
  training: string;
  hiring: string;
  capex: string;
  clean_tech: string;
}

export interface ProjectCosts {
  salaries: number;
  contractors: number;
  software: number;
  equipment: number;
  training: number;
  marketing_export: number;
  other: number;
}

export interface Project {
  name: string;
  objective: string;
  timeline: { start: string; end: string };
  costs: ProjectCosts;
}

export interface Constraints {
  time_horizon_months: number;
  need_cash_fast: string;
  risk_tolerance: string;
  documentation_readiness: string;
}

export interface ProgramSource {
  title: string;
  url: string;
}

export interface ProgramCard {
  program_name: string;
  jurisdiction: string;
  instrument_type: string;
  short_description: string;
  why_relevant: string;
  role_in_funding_stack: string;
  sources: ProgramSource[];
  eligibility: {
    key_criteria: { text: string; source_url: string }[];
    eligible_costs: { text: string; source_url: string }[];
    exclusions: { text: string; source_url: string }[];
    deadlines_or_periods: { text: string; source_url: string }[];
    required_documents: { text: string; source_url: string }[];
    cumul_notes: {
      status: string;
      note: string;
      source_url: string;
    };
  };
  value_model: {
    estimated_value_range: string;
    estimated_value_numeric: number; // Added for precise charting
    assumptions: string[];
    probability_of_success: string;
    time_to_cash: string;
    effort_level: string;
  };
  risk: {
    risk_level: string;
    main_risks: string[];
    mitigations: string[];
    human_validation_required: string;
  };
  status: string;
  confidence: string;
  notes: string;
}

export interface FinalReport {
  report_metadata: {
    client_name_or_id?: string;
    generated_at: string;
    scope: string;
  };
  executive_summary: {
    headline: string;
    key_numbers: {
      total_estimated_support_range: string;
      avg_time_to_cash: string;
      overall_risk_level: string;
      top_3_levers: string[];
    };
    what_to_do_next: string[];
  };
  funding_stack: {
    stack_layers: { layer: string; estimated_range: string; notes: string }[];
    bridge_financing_need: string;
    bridge_financing_notes: string;
  };
  timeline_cashflow: {
    narrative: string;
    milestones: { month: string; expected_event: string }[];
  };
  top_recommendations: (ProgramCard & { rank: number; next_steps: { next_7_days: string[]; next_30_days: string[] } })[];
  rejected_items: { program_name: string; reason: string; missing_sources: string[] }[];
  questions_for_client: string[];
  audit_trail: { phase: string; agent: string; verdict: string; notes: string }[];
}

export interface ClientFeedback {
  satisfaction: number;
  accuracy: number;
  clarity: number;
  comments: string;
}

export enum AgentState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface AgentProgress {
  id: string;
  name: string;
  state: AgentState;
  statusText?: string; // Added for real-time thoughts
  output?: any;
}
