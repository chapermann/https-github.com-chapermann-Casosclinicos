import React from "react";
import { SuggestedCriteria, CRITERIA_QUESTIONS, CriteriaQuestion } from "../types";
import { ClipboardCheck, Check, AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";

interface CriteriaChecklistProps {
  criteria: SuggestedCriteria;
  onToggle: (id: keyof SuggestedCriteria) => void;
}

export default function CriteriaChecklist({ criteria, onToggle }: CriteriaChecklistProps) {
  // Compute points
  let score = 0;
  CRITERIA_QUESTIONS.forEach((item) => {
    const value = criteria[item.id];
    score += value ? item.yesPoints : item.noPoints;
  });

  // Describe score status
  let statusText = "";
  let badgeColor = "";
  let borderColors = "";
  let iconComponent = null;

  if (score < 5) {
    statusText = "Não está de Alta (Enfermaria)";
    badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
    borderColors = "border-l-4 border-rose-500 bg-rose-50/50";
    iconComponent = <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />;
  } else if (score >= 5 && score <= 8) {
    statusText = "Provavelmente não está de Alta";
    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
    borderColors = "border-l-4 border-amber-500 bg-amber-50/50";
    iconComponent = <AlertTriangle className="w-5 h-5 text-amber-500" />;
  } else if (score > 8 && score <= 10) {
    statusText = "Provável Alta Médica";
    badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
    borderColors = "border-l-4 border-emerald-400 bg-emerald-50/20";
    iconComponent = <Check className="w-5 h-5 text-emerald-500" />;
  } else {
    // Score > 10
    statusText = "Está de Alta Médica (Enfermaria)";
    badgeColor = "bg-green-600 text-white border-green-600 shadow-sm";
    borderColors = "border-l-4 border-green-500 bg-green-50/40";
    iconComponent = <Check className="w-5 h-5 text-white bg-green-500 rounded-full p-0.5" />;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6" id="criteria-checklist-container">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <ClipboardCheck className="w-5 h-5 text-slate-700" id="criteria-icon" />
        <h2 className="font-display font-semibold text-lg text-slate-800">
          Critérios de Internação em Enfermaria de Clínica Médica
        </h2>
      </div>

      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Responda às 10 perguntas abaixo para calcular o score de transferência do paciente para a enfermaria clínica. Cada sim ou não altera o cálculo dinamicamente.
      </p>

      {/* Checklist items */}
      <div className="space-y-3 mb-6 max-h-[460px] overflow-y-auto pr-1">
        {CRITERIA_QUESTIONS.map((item, index) => {
          const isActive = criteria[item.id];
          return (
            <div
              key={item.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
                isActive 
                  ? "bg-slate-50 border-slate-200" 
                  : "bg-slate-50/30 border-slate-100 opacity-90"
              }`}
              id={`criteria-row-${item.id}`}
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 leading-snug">
                  {item.label}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    Sim: {item.yesPoints > 0 ? `+${item.yesPoints}` : item.yesPoints} pt
                  </span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    Não: {item.noPoints > 0 ? `+${item.noPoints}` : item.noPoints} pt
                  </span>
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="flex gap-1 bg-slate-200 p-0.5 rounded-lg w-fit self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => { if (!isActive) onToggle(item.id); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all select-none ${
                    isActive
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  id={`btn-criteria-${item.id}-yes`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => { if (isActive) onToggle(item.id); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all select-none ${
                    !isActive
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  id={`btn-criteria-${item.id}-no`}
                >
                  Não
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Output Score Box */}
      <div className={`p-4 rounded-xl border ${borderColors} transition-all duration-300`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Resultado da Avaliação
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-800 font-mono tracking-tight" id="score-display">
                {score}
              </span>
              <span className="text-slate-400 text-sm">pontos</span>
            </div>
          </div>

          <div className={`px-4 py-2 border rounded-lg flex items-center gap-2 font-semibold text-sm ${badgeColor}`}>
            {iconComponent}
            <span>{statusText}</span>
          </div>
        </div>

        {/* Dynamic breakdown indicator line */}
        <div className="mt-4 pt-3 border-t border-slate-200/50 flex flex-wrap gap-y-1 gap-x-4 text-[10px] text-slate-400 justify-between">
          <span>&lt; 5 pts: Não de alta</span>
          <span>5-8 pts: Provavelmente não</span>
          <span>&gt; 8 pts: Provável alta</span>
          <span>&gt; 10 pts: Alta clínica</span>
        </div>
      </div>
    </div>
  );
}
