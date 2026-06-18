import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Stethoscope, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  ClipboardCheck, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Github, 
  RefreshCw,
  Sliders,
  AlertTriangle
} from "lucide-react";
import { SuggestedCriteria, OrganizedCaseResult, ClinicalInput } from "./types";
import { MEDICAL_SAMPLES, MedicalSample } from "./data/samples";
import CriteriaChecklist from "./components/CriteriaChecklist";

export default function App() {
  // Input form state
  const [clinicalText, setClinicalText] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [gender, setGender] = useState<string>("Não especificado");
  const [customTime, setCustomTime] = useState<string>("");
  
  // App states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrganizedCaseResult | null>(null);
  const [activeCriteria, setActiveCriteria] = useState<SuggestedCriteria | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSampleIndex, setActiveSampleIndex] = useState<number | null>(null);

  // Prefill current date/time in Brazilian local format on mount
  useEffect(() => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const now = new Date();
    // Format: YYYY-MM-DDTHH:MM (compatible with input type="datetime-local")
    const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setCustomTime(formatted);
  }, []);

  // Handle loading sample clinical note
  const handleLoadSample = (sample: MedicalSample, index: number) => {
    setClinicalText(sample.rawText);
    setWeight(sample.weight);
    setGender(sample.gender);
    setActiveSampleIndex(index);
    setError(null);
  };

  // Reset tool
  const handleReset = () => {
    setClinicalText("");
    setWeight("");
    setGender("Não especificado");
    setResult(null);
    setActiveCriteria(null);
    setError(null);
    setActiveSampleIndex(null);
  };

  // Run structured evaluation via back-end Gemini API proxy route
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalText.trim()) {
      setError("Por favor, cole a evolução médica do paciente antes de prosseguir.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setActiveCriteria(null);

    try {
      // Format datetime to reader-friendly format or keep ISO
      let finalTime = "";
      if (customTime) {
        const dateObj = new Date(customTime);
        finalTime = dateObj.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      } else {
        finalTime = new Date().toLocaleString("pt-BR");
      }

      const response = await fetch("/api/organize-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: clinicalText,
          weight: weight ? parseFloat(weight) : undefined,
          gender: gender === "Não especificado" ? undefined : gender,
          customTime: finalTime
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || "Ocorreu um erro ao chamar o servidor.");
      }

      const data: OrganizedCaseResult = await response.json();
      setResult(data);
      // Hook up interactive checklist with suggested AI values
      setActiveCriteria(data.suggestedCriteria);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro desconhecido ao processar dados no servidor. Certifique-se de configurar a API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  // User manual toggle update in interactive score checklist
  const handleToggleCriteria = (id: keyof SuggestedCriteria) => {
    if (!activeCriteria) return;
    setActiveCriteria(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [id]: !prev[id]
      };
    });
  };

  // Quick action: copy structured TXT directly to clipboard
  const handleCopyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.formattedTxt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800" id="main-layout-root">
      {/* Clinically Designed Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs" id="header-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-xs transition-transform hover:scale-105">
              <Stethoscope className="w-6 h-6" id="logo-icon" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Projeto Prompts Poderosos
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v1.1</span>
              </div>
              <h1 className="font-display font-bold text-xl text-slate-900 tracking-tight">
                Organizador de Casos e Round Médico
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Github Developer Credit - Custom requested link */}
            <a 
              href="https://github.com/chapermann" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors font-medium border border-slate-200"
              id="github-credit-anchor"
            >
              <Github className="w-4 h-4 text-slate-700" />
              <span>chapermann</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8" id="main-content-area">
        
        {/* Anti-Leaking and Patient Security Privacy Safeguard */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 mb-6 md:mb-8 flex items-start gap-3 shadow-2xs" id="privacy-safeguard">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800 leading-relaxed">
            <p className="font-semibold">Privacidade de Dados Médicos & Conformidade (Regra 1):</p>
            <p className="mt-0.5">
              Este aplicativo opera de forma <strong>estritamente stateless (sem estado persistente)</strong>. Não armazenamos, registramos nem conservamos nenhuma informação confidencial, nomes de pacientes, médicos ou equipe em nenhum banco de dados ou memória de longo prazo. Todos os prontuários gerados residem apenas no seu navegador ativo e são processados em tempo real na rota segura do servidor.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="dashboard-grid">
          
          {/* Left Side: Input Panel (Forms & Sample Presets) */}
          <section className="lg:col-span-5 space-y-6" id="input-section">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-slate-500" />
                  <h2 className="font-display font-semibold text-base text-slate-800">
                    Entrada do Prontuário
                  </h2>
                </div>
                {clinicalText && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
                    id="btn-clear-form"
                  >
                    <RefreshCw className="w-3 h-3" /> Redefinir formulário
                  </button>
                )}
              </div>

              {/* Sample Notes Loader */}
              <div className="mb-5" id="presets-panel">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Casos de Teste (Carregamento Rápido)
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {MEDICAL_SAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLoadSample(sample, idx)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col ${
                        activeSampleIndex === idx
                          ? "bg-slate-50 border-emerald-500 ring-1 ring-emerald-500/20"
                          : "bg-white hover:bg-slate-50/60 border-slate-200 hover:border-slate-300"
                      }`}
                      id={`sample-selector-${idx}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-slate-700">{sample.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                          sample.status === "crítico" 
                            ? "bg-rose-100 text-rose-800"
                            : sample.status === "moderado"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {sample.status}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5 text-[11px] font-normal leading-relaxed line-clamp-1">
                        {sample.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Clinical Input Form */}
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label htmlFor="clinical-note-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 flex justify-between">
                    <span>Cole aqui a evolução médica de hoje *</span>
                    <span className="text-[10px] text-slate-400 lowercase italic">obrigatório</span>
                  </label>
                  <textarea
                    id="clinical-note-input"
                    rows={12}
                    value={clinicalText}
                    onChange={(e) => {
                      setClinicalText(e.target.value);
                      if (activeSampleIndex !== null) setActiveSampleIndex(null);
                    }}
                    placeholder={`Cole os rascunhos verbais, anotações de evolução do plantão ou relatos sem formatação. 
Exemplo:
Maria, Leito 4, 68a. Pneumonia severa, sob tot pcv. Noradrenalina ativa...`}
                    className="w-full rounded-xl border border-slate-200 p-4 text-xs font-mono leading-relaxed bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-600 transition-all text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* Sub-inputs: Weight, Sex, Custom Time */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <label htmlFor="weight-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Peso do Paciente (Kg)
                    </label>
                    <input
                      id="weight-input"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Padrão: 75"
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-[9px] text-slate-400 block mt-0.5">Vazio = 75Kg (Regra 5)</span>
                  </div>

                  <div>
                    <label htmlFor="gender-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Sexo / Gênero
                    </label>
                    <select
                      id="gender-input"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 bg-[right_8px_center] cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Não especificado">Auto-Detectar</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                    </select>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Prefere o informado</span>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="time-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Data/Hora de Registro no Prontuário
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="time-input"
                        type="datetime-local"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submitting button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 select-none active:scale-98 ${
                    isLoading
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md cursor-pointer"
                  }`}
                  id="btn-submit-analysis"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Processando Caso...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>Evoluir e Organizar para o Round</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 text-emerald-100" />
                    </>
                  )}
                </button>
              </form>

              {/* Error Box */}
              {error && (
                <div className="mt-4 p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5" id="error-alert">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-800 leading-relaxed font-medium">
                    <p className="font-semibold text-rose-900">Falha na transcrição:</p>
                    <p className="mt-0.5">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Right Side: Results Presentation Panel */}
          <section className="lg:col-span-7 space-y-6" id="output-section">
            <AnimatePresence mode="wait">
              {isLoading ? (
                // Loading Placeholder Status Tracker Component
                <motion.div
                  key="loading-tracker"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 min-h-[400px] flex flex-col items-center justify-center text-center"
                  id="loading-spinner-view"
                >
                  <div className="relative mb-4">
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                    <Stethoscope className="w-5 h-5 text-emerald-600 absolute left-3.5 top-3.5 animate-pulse" />
                  </div>
                  
                  <h3 className="font-display font-semibold text-slate-800 text-base mb-1">
                    Analisando Dados Clínicos com Inteligência Artificial
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
                    Interpretando exames laboratoriais, organizando comorbidades crônicas, gasometrias e ajustando o prontuário para o formato de discussão diária do round.
                  </p>

                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 max-w-sm text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Conselho de Privacidade (Regra 1)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-normal block">
                      Qualquer dado sensível de identificação captado nos prontuários é descartado preliminarmente pelo algoritmo.
                    </span>
                  </div>
                </motion.div>
              ) : result && activeCriteria ? (
                // Real Live Structured Results Content Output
                <motion.div
                  key="results-ready"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                  id="results-view"
                >
                  {/* Results Section 1: Plain TXT Evolution note formatting */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6" id="txt-output-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-600" />
                        <div>
                          <h2 className="font-display font-semibold text-base text-slate-800">
                            Texto Estruturado para Prontuário (TXT)
                          </h2>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Redigido em bloco plano compatível com qualquer editor simples
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyToClipboard}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold tracking-wide flex items-center gap-1.5 border select-none transition-all ${
                          copied
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 active:scale-97"
                        }`}
                        id="btn-copy-txt"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Texto TXT</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Preformated TXT Document Display area - Rule 4 Metódico */}
                    <div className="relative">
                      <pre className="p-4 bg-slate-50 hover:bg-slate-50/85 transition-colors border border-slate-200 rounded-xl overflow-x-auto text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap select-all max-h-[500px]" id="txt-preformated-result">
                        {result.formattedTxt}
                      </pre>
                      
                      <div className="mt-3 bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-start gap-2">
                        <span className="text-[10px] bg-slate-200 text-slate-600 font-bold uppercase py-0.5 px-1.5 rounded mt-0.5">
                          Nota
                        </span>
                        <span className="text-[11px] text-slate-500 leading-normal">
                          Como estipulado pela <strong>Regra 4</strong>, este sumário é apresentado como texto corrido em TXT simples puro (sem tabelas, colunas ricas ou TABs) para garantir portabilidade universal em qualquer sistema de prontuário eletrônico. Opções de download em PDF ou DOCX/DOC foram desativadas protocolarmente.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Results Section 2: Interactive Criteria Checklist component */}
                  <CriteriaChecklist 
                    criteria={activeCriteria} 
                    onToggle={handleToggleCriteria} 
                  />

                  {/* Results Section 3: Non-Aventated Clinical Findings Warning alert list */}
                  {result.unaventatedFindings && result.unaventatedFindings.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6" id="findings-output-card">
                      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h2 className="font-display font-semibold text-slate-800 text-base">
                          Regra 10: Sinais & Sintomas não Aventados
                        </h2>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                        Associações clínicas implícitas e hipóteses correlatas indicadas pelo algoritmo que complementam a análise dos dados do prontuário médico fornecido (sem sugestões terapêuticas diretas ou invasão médica):
                      </p>

                      <ul className="space-y-2.5 pl-3 border-l border-amber-250">
                        {result.unaventatedFindings.map((finding, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed" id={`finding-item-${idx}`}>
                            <span className="text-amber-500 font-bold select-none mt-0.5">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 p-2.5 bg-amber-50 rounded-lg text-[10px] text-amber-800 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                        <span>Aviso Legal: Dados meramente indicativos de auditoria clínica. A responsabilidade é exclusiva do médico assistente.</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                // Safe and friendly Empty State / Manual instruction page
                <motion.div
                  key="empty-safeguard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center min-h-[500px] flex flex-col items-center justify-center"
                  id="empty-state-view"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 mb-4 shadow-2xs">
                    <FileText className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-800 text-base mb-1">
                    Aguardando Evolução Clínica do Paciente
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
                    Cole as anotações do prontuário ou use um dos nossos casos de teste rápidos à esquerda. O sistema processará, gerará o relatório TXT clássico para o Round Médico e avaliará na hora se o caso clínico cumpre critérios de alta da terapia intensiva para a enfermaria.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-2">
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-left">
                      <span className="font-semibold text-slate-700 text-xs block mb-1">Passagem de Round</span>
                      <span className="text-slate-500 text-[11px] leading-relaxed block">
                        Estruturação imediata de evoluções diárias em 11 tópicos formais recomendados, com data atual e cálculo do peso correto de 75kg universal.
                      </span>
                    </div>

                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-left">
                      <span className="font-semibold text-slate-700 text-xs block mb-1">Transição Clínica Real</span>
                      <span className="text-slate-500 text-[11px] leading-relaxed block">
                        Calculadora do score do hospital para admissão na enfermaria de clínica médica (10 perguntas integradas, do dreno de tórax à hemodinâmica).
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 font-normal" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>Projeto Prompts Poderosos — Solucionando organização médica nos hospitais.</span>
          </div>
          <div>
            <a 
              href="https://github.com/chapermann" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
              id="footer-github-link"
            >
              GitHub chapermann
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
