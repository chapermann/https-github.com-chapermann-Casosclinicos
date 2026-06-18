export interface MedicalSample {
  title: string;
  description: string;
  gender: string;
  weight: string;
  status: "crítico" | "moderado" | "estável";
  rawText: string;
}

export const MEDICAL_SAMPLES: MedicalSample[] = [
  {
    title: "Caso 1: Paciente Crítico com Alta Dependência (UTI / Sala Vermelha)",
    description: "Paciente sob ventilação mecânica invasiva, em desmame complexo, com noradrenalina ativa e dreno torácico.",
    gender: "Feminino",
    weight: "72",
    status: "crítico",
    rawText: `Evolução UTI Leito 4: Maria Francisca Oliveira, 68 anos, com diagnóstico de Insuficiência Respiratória Secundária a Pneumonia Comunitária Grave e choque séptico de foco pulmonar. Encontra-se sob sedação com fentanil 4 ml/h e midazolam 3 ml/h (RASS -3). Pupilas isocóricas e fotorreagentes.
Ainda sob Ventilação Mecânica Invasiva via Tubo Orotraqueal (TOT) no modo PCV: pressao controle 14, PEEP 8, FiO2 45%, complacência estática de 28 ml/cmH2O. Hemodinâmica parcialmente compensada às custas de droga vasoativa: Noradrenalina infundindo a 0,2 mcg/kg/min por Cateter Venoso Central (CVC) em veia subclávia direita. Sonda Vesical de Demora (SVD) locada apresentando diurese clara em quantidade adequada nas últimas horas (1500ml/12h).
Apresentando dreno de tórax à direita devido a derrame pleural purulento, drenando secreção serossubstanciosa em pequena quantidade (50ml).
Sinais vitais de hoje de manhã: PA 105/65 mmHg, FC 98 bpm, FR 18 ipm, T 37,1 °C, SatO2 96%.
Gasometria arterial (coleta às 07:00 com FiO2 45%): pH 7,31, PaCO2 48 mmHg, PaO2 76 mmHg, HCO3 22 mEq/L, BE -3,8, Lactato 2,4 mmol/L.
Exames laboratoriais: Leucograma 16.500 mm3 com 8% de bastões, Hb 9,5 g/dL, Plaquetas 142.000 mm3, Creatinina 1,8 mg/dL (função renal alterada), Ureia 85 mg/dL, PCR 120 mg/L (elevado).
Antibioticoterapia em uso: Piperacilina/Tazobactam 4,5g EV de 8/8h, hoje no D5 de tratamento.
No round multiprofissional da manhã foi decidido: Reduzir dose da noradrenalina paulatinamente, iniciar desmame da sedação de tarde, solicitar ultrassom de tórax para reavaliar dreno do derrame à direita, manter fisioterapia respiratória intensiva.`
  },
  {
    title: "Caso 2: Paciente em Transição para Alta de Enfermaria (Estável)",
    description: "Paciente lúcido, confortável em ar ambiente, pós-operatório ortopédico resolvido e sem queixas álgicas.",
    gender: "Masculino",
    weight: "80",
    status: "estável",
    rawText: `Evolução Ortopedia Enfermaria Quarto 202: José Ribamar Gomes, 52 anos, residente do Rio de Janeiro. História de queda de própria altura há 5 dias com fratura de fêmur proximal esquerdo. Realizado osteossíntese de fêmur esquerdo há 3 dias por raquianestesia, pós-operatório transcorrendo sem intercorrências.
No momento do exame clínico o paciente encontra-se totalmente lúcido, orientado em tempo e espaço, conversando ativamente sobre a reabilitação.
Hemodinamicamente estável, sem necessidade de drogas vasoativas. Sinais vitais: PA 120/80 mmHg, FC 74 bpm, FR 14 ipm, afebril (36,4 °C). Encontra-se respirando confortavelmente em ar ambiente, apresentando saturação de oxigênio de 98%.
Nega queixas álgicas hoje, relatando dor zero no membro cirúrgico após início de dipirona e cetoprofeno de uso programado orais. Recebeu alta definitiva da equipe de Ortopedia Cirúrgica hoje cedo, sem restrições ou drenos, apenas orientações de deambulação com andador. Nega dispneia, cefaleia ou outras queixas clínicas secundárias. Doença hipertensiva crônica compensada com seu uso crônico de losartana de manhã.
Exames laboratoriais de controle de hoje: Hemoglobina de 11,8 g/dL (estável em relação ao PO imediato), Leucócitos 8.200 mm3, função renal preservada (Creatinina 0,9 mg/dL), eletrólitos normais.
Antibiótico de profilaxia cirúrgica (Cefazolina 1g EV) já foi descontinuado há 48h. Atualmente sem antibióticos em curso.
Planejamento de condutas do dia: Manter reabilitação motora sob supervisão da fisioterapia, organizar receitas médicas para uso domiciliar e liberar alta definitiva para enfermaria ou residência conforme fluxo administrativo.`
  },
  {
    title: "Caso 3: Paciente Clínico Moderado (Estabilidade Limítrofe)",
    description: "Paciente idoso lúcido, hemodinamicamente estável, porém requerendo suplementação leve de oxigênio via cateter nasal.",
    gender: "Feminino",
    weight: "75",
    status: "moderado",
    rawText: `Evolução Clínica Médica Leito 12: Sebastião Alves de Melo, 75 anos. Internado por descompensação de Doença Pulmonar Obstrutiva Crônica (DPOC) infectada.
Atualmente encontra-se lúcido, sonolento mas facilmente despertável à chamada verbal, colaborando com os comandos.
Hemodinâmica estável sem drogas vasoativas. Sinais vitais: PA 130/75 mmHg, FC 88 bpm, FR 19 ipm, T 36,8 °C.
Do ponto de vista pulmonar, está apresentando leve esforço expiratório com tempos expiratórios prolongados, confortável utilizando suplementação leve de oxigênio por cateter nasal de O2 a 2 L/min, mantendo SatO2 em 93% (alvo adequado para DPOC crônico).
Refere dor lombar crônica sob controle subjetivo aceitável com uso de analgésicos comuns (paracetamol se necessário).
Não apresenta condições cirúrgicas. Comorbidades: Portador de DPOC grave, HAS e ex-tabagista de longa data. Uso de medicações de manutenção inalatórias (formoterol/budesonida).
Exames de imagem: Radiografia de tórax de ontem evidencia infiltrado intersticial discreto em bases pulmonares e hiperinsuflação (estigma de enfisema).
Exames laboratoriais (hoje): PCR de 34 mg/L (em queda), Creatinina 1,1 mg/dL, K+ 4,2 mEq/L, Na+ 137 mEq/L, Leucócitos 11.200 (sem bastões).
Antibioticoterapia: Levofloxacino 500mg VO 1x ao dia, iniciado há 4 dias (planejado 7 dias).
Decisões e Condutas do dia: Monitorar padrão ventilatório, tentar espaçar nebulizações profiláticas com broncodilatador, programar teste de tolerância ao ar ambiente de tarde e manter fisioterapia motora leve.`
  }
];
