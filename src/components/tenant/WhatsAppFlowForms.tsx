import React, { useState } from 'react';
import { WhatsAppFlowForm } from '../../types.ts';
import {
  Smartphone,
  Plus,
  CheckCircle2,
  FileCode,
  Calendar,
  Layers,
  ChevronRight,
  ArrowLeft,
  Send,
  Eye,
  Sliders,
} from 'lucide-react';

interface WhatsAppFlowFormsProps {
  flowForms: WhatsAppFlowForm[];
  onCreateForm?: (form: WhatsAppFlowForm) => void;
  onPreviewForm?: (form?: WhatsAppFlowForm) => void;
}

export const WhatsAppFlowForms: React.FC<WhatsAppFlowFormsProps> = ({
  flowForms,
  onCreateForm,
}) => {
  const [selectedForm, setSelectedForm] = useState<WhatsAppFlowForm>(flowForms[0]);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showJsonSchema, setShowJsonSchema] = useState(false);

  const currentScreen = selectedForm.screens[activeScreenIndex] || selectedForm.screens[0];

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleNextScreen = () => {
    if (activeScreenIndex < selectedForm.screens.length - 1) {
      setActiveScreenIndex(activeScreenIndex + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleResetSimulator = () => {
    setActiveScreenIndex(0);
    setFormData({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Native WhatsApp Flow Forms
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              0% Drop-Off Architecture
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Build and deploy multi-screen JSON forms for bookings, KYC identity, and customer feedback directly inside WhatsApp without web redirects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJsonSchema(!showJsonSchema)}
            className="px-3.5 py-2.5 rounded-xl bg-[#0A1020] hover:bg-[#141E34] text-slate-200 border border-[#1E2B45] text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>{showJsonSchema ? 'Hide JSON Schema' : 'Inspect JSON Schema'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form List & Interactive Smartphone Simulator */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Flow Forms Directory */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Active WhatsApp Flow Templates
              </h2>
              <span className="text-[11px] text-slate-400">{flowForms.length} Forms Published</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {flowForms.map((form) => {
                const isSelected = form.id === selectedForm.id;
                return (
                  <div
                    key={form.id}
                    onClick={() => {
                      setSelectedForm(form);
                      handleResetSimulator();
                    }}
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-slate-800/80 border-l-2 border-emerald-500' : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{form.title}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                          {form.formType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                        <span>{form.screens.length} Screens</span>
                        <span>·</span>
                        <span>{form.submissionCount} Submissions Logged</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <span>Simulate</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* JSON Schema Inspector Card */}
          {showJsonSchema && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl animate-in fade-in-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  Meta WhatsApp Flow JSON Schema ({selectedForm.id}.json)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">v3.0 Strict JSON</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-slate-900 rounded-lg max-h-60 overflow-y-auto">
                {JSON.stringify(
                  {
                    version: '3.0',
                    screens: selectedForm.screens,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Smartphone Simulator */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-80 bg-slate-900 border-[6px] border-slate-800 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden flex flex-col h-[580px]">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 shrink-0" />

            {/* WhatsApp App Bar */}
            <div className="bg-emerald-950/80 border-b border-emerald-800/40 p-2.5 rounded-t-2xl flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                  W
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">WhatsOmni Support</div>
                  <div className="text-[9px] text-emerald-300">WhatsApp Flow Form</div>
                </div>
              </div>
              <button
                onClick={handleResetSimulator}
                className="text-[10px] text-emerald-400 underline"
              >
                Reset
              </button>
            </div>

            {/* Form Canvas inside WhatsApp Screen */}
            <div className="flex-1 overflow-y-auto p-3 bg-slate-950/90 text-white flex flex-col justify-between">
              {!submitted ? (
                <div className="space-y-3.5">
                  <div className="border-b border-slate-800 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                        Screen {activeScreenIndex + 1} of {selectedForm.screens.length}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-0.5">
                      {currentScreen.title}
                    </h4>
                  </div>

                  {/* Render Screen Fields */}
                  <div className="space-y-3">
                    {currentScreen.fields.map((field) => (
                      <div key={field.id} className="space-y-1">
                        <label className="block text-[11px] text-slate-300 font-medium">
                          {field.label} {field.required && <span className="text-emerald-400">*</span>}
                        </label>

                        {field.type === 'text' && (
                          <input
                            type="text"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder="Type here..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        )}

                        {field.type === 'select' && (
                          <select
                            value={formData[field.id] || field.options?.[0]}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          >
                            {field.options?.map((opt, oIdx) => (
                              <option key={oIdx} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}

                        {field.type === 'date' && (
                          <input
                            type="date"
                            value={formData[field.id] || '2026-10-15'}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        )}

                        {field.type === 'radio' && (
                          <div className="space-y-1 pt-0.5">
                            {field.options?.map((opt, oIdx) => (
                              <label
                                key={oIdx}
                                className="flex items-center gap-2 p-1.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={field.id}
                                  checked={formData[field.id] === opt}
                                  onChange={() => handleFieldChange(field.id, opt)}
                                  className="text-emerald-500 focus:ring-emerald-500"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="my-auto text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Flow Form Submitted!</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Data submitted natively in WhatsApp. Contact updated in CRM & deal advanced.
                    </p>
                  </div>
                  <button
                    onClick={handleResetSimulator}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Simulate Again
                  </button>
                </div>
              )}

              {/* Action Button */}
              {!submitted && (
                <div className="pt-3 border-t border-slate-800 mt-4">
                  <button
                    onClick={handleNextScreen}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
                  >
                    <span>
                      {activeScreenIndex < selectedForm.screens.length - 1 ? 'Continue to Next Screen' : 'Submit In-Chat'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
