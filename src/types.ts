export interface ClinicalInput {
  text: string;
  weight?: string;
  gender?: string;
  customTime?: string;
}

export interface SuggestedCriteria {
  q1_surgicalDischarge: boolean;
  q2_noSurgicalCondition: boolean;
  q3_roomAir: boolean;
  q4_lowFlowOxygen: boolean;
  q5_lucid: boolean;
  q6_stableIfNotLucid: boolean;
  q7_noPain: boolean;
  q8_recentDischargeOrAdmittedClMed: boolean;
  q9_compensatedDisease: boolean;
  q10_needsClSpecialty: boolean;
}

export interface OrganizedCaseResult {
  formattedTxt: string;
  unaventatedFindings: string[];
  suggestedCriteria: SuggestedCriteria;
}

export interface CriteriaQuestion {
  id: keyof SuggestedCriteria;
  label: string;
  yesPoints: number;
  noPoints: number;
  simRequiredForYes?: boolean; // Any additional helper hints or descriptions
}

export const CRITERIA_QUESTIONS: CriteriaQuestion[] = [
  {
    id: "q1_surgicalDischarge",
    label: "1 - Paciente encontra-se de ALTA pelas especialidades cirúrgicas?",
    yesPoints: 1,
    noPoints: -1
  },
  {
    id: "q2_noSurgicalCondition",
    label: "2 - Paciente não apresenta nenhuma condição cirúrgica ou potencialmente cirúrgica no momento?",
    yesPoints: 1,
    noPoints: -1
  },
  {
    id: "q3_roomAir",
    label: "3 - Paciente encontra-se em ar ambiente?",
    yesPoints: 1,
    noPoints: -1
  },
  {
    id: "q4_lowFlowOxygen",
    label: "4 - Paciente que precisa de oxigênio, necessita de pouco fluxo ou de pouca suplementação de oxigênio?",
    yesPoints: 1,
    noPoints: -2
  },
  {
    id: "q5_lucid",
    label: "5 - Paciente encontra-se lúcido?",
    yesPoints: 1,
    noPoints: -1
  },
  {
    id: "q6_stableIfNotLucid",
    label: "6 - Paciente que não encontra-se lúcido, encontra-se hemodinamicamente estável?",
    yesPoints: 1,
    noPoints: -2
  },
  {
    id: "q7_noPain",
    label: "7 - Paciente encontra-se nesse momento sem queixas álgicas?",
    yesPoints: 1,
    noPoints: -1
  },
  {
    id: "q8_recentDischargeOrAdmittedClMed",
    label: "8 - Paciente recebeu alta recentemente ou esteve internado na clínica médica?",
    yesPoints: 2,
    noPoints: -1
  },
  {
    id: "q9_compensatedDisease",
    label: "9 - Paciente tem doença clínica compensada?",
    yesPoints: 1,
    noPoints: -1
  },
  {
    id: "q10_needsClSpecialty",
    label: "10 - Paciente tem doença clínica que necessita de alguma especialidade Clínica?",
    yesPoints: 1,
    noPoints: -2
  }
];
