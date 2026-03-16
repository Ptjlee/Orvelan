"use client";

import { useState } from "react";
import diagnosticData from "@/data/diagnosticForm.json";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";

// Grouping logic for the multistep
const GROUP_SIZE = 5;

export default function DiagnosticPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Separate intro fields (first 7) from the rest
  const introFields = diagnosticData.slice(0, 7);
  const questionFields = diagnosticData.slice(7);

  // Chunk the long list of questions into groups of 5
  const questionGroups = [];
  for (let i = 0; i < questionFields.length; i += GROUP_SIZE) {
    questionGroups.push(questionFields.slice(i, i + GROUP_SIZE));
  }

  const steps = [introFields, ...questionGroups];
  const totalSteps = steps.length;

  const handleInputChange = (id: string, value: string) => {
    setErrorMsg(null);
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateCurrentStep = () => {
    const currentFields = steps[currentStep];
    for (const field of currentFields) {
      if (!formData[field.id] || formData[field.id].trim() === "") {
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      setErrorMsg(lang === 'fr' ? 'Veuillez répondre à toutes les questions pour continuer.' : 'Please answer all questions to proceed.');
      return;
    }
    setErrorMsg(null);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setErrorMsg(null);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      setErrorMsg(lang === 'fr' ? 'Veuillez répondre à toutes les questions pour terminer.' : 'Please answer all questions to finish.');
      return;
    }
    if (currentStep !== totalSteps - 1) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    
    // 1. Build a human-readable object for the AI & Supabase
    const readableData: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const field = diagnosticData.find(d => d.id === key);
      const question = field ? (lang === 'fr' ? field.title : (field.titleEn || field.title)) : key;
      readableData[question] = value;
    });

    // 2. Build form data payload for Google Forms
    const data = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      // 3. Fire-and-forget to our internal backend (AI + Supabase)
      fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readableData)
      }).catch(err => console.error("Internal API Error:", err));

      // 4. Send directly to Google Forms
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLScqwkvqVhJUCz8tnyfflARXZaz4kJJ8vlOJDCqrcvN5S8eGQQ/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: data,
        }
      );
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      // Even if error locally, no-cors blocks reading it, we assume success often
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCleanTitle = (field: any) => {
    const titleToClean = lang === 'fr' ? field.title : (field.titleEn || field.title);
    return titleToClean.replace(/^[A-Z][0-9]+\s*-\s*/, "");
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar lang={lang} setLang={setLang} />

      <div className="flex-grow flex items-center justify-center pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl w-full">
          {!submitted ? (
            <div className="bg-white p-10 md:p-16 rounded-sm shadow-sm border border-primary-silver/20 relative overflow-hidden">
              
              {/* Progress bar */}
              <div className="absolute top-0 left-0 h-1 bg-primary-silver/20 w-full">
                <motion.div 
                  className="h-full bg-primary-copper transition-all duration-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>

              <div className="mb-12">
                <span className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
                  {lang === 'fr' ? `Étape ${currentStep + 1} sur ${totalSteps}` : `Step ${currentStep + 1} of ${totalSteps}`}
                </span>
                <h1 className="text-4xl md:text-5xl font-serif text-primary-midnight leading-tight tracking-tight">
                  {currentStep === 0 
                    ? (lang === 'fr' ? "Faisons connaissance." : "Let's get to know you.") 
                    : (lang === 'fr' ? "Prenez le temps de répondre." : "Take your time to answer.")}
                </h1>
                <p className="text-primary-charcoal/70 mt-4 font-light">
                  {currentStep === 0 
                    ? (lang === 'fr' ? "Ces informations restent strictement confidentielles." : "This information remains strictly confidential.")
                    : (lang === 'fr' ? "Répondez selon votre ressenti réel, pas ce que vous aimeriez que ce soit." : "Answer based on your actual feeling, not what you wish it were.")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-10"
                  >
                    {steps[currentStep].map((field) => (
                      <div key={field.id} className="flex flex-col gap-4">
                        <label className="text-xl font-serif text-primary-midnight leading-relaxed">
                          {getCleanTitle(field)}
                        </label>
                        
                        {field.options && field.options.length > 0 ? (
                          <div className="flex flex-col gap-3 mt-2">
                            {field.options.map((opt: string, idx: number) => {
                              if (opt === "") return null;
                              const displayOpt = lang === 'fr' ? opt : (field.optionsEn[idx] || opt);
                              return (
                                <label 
                                  key={opt}
                                  className={`flex items-center gap-4 p-4 border border-primary-silver/30 cursor-pointer transition-all ${
                                    formData[field.id] === opt 
                                      ? "bg-primary-copper/5 border-primary-copper text-primary-midnight" 
                                      : "hover:bg-[#FAFAFA] text-primary-charcoal"
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    formData[field.id] === opt ? "border-primary-copper" : "border-primary-silver/50"
                                  }`}>
                                    {formData[field.id] === opt && <div className="w-2.5 h-2.5 bg-primary-copper rounded-full" />}
                                  </div>
                                  <input 
                                    type="radio" 
                                    name={field.id} 
                                    value={opt}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    checked={formData[field.id] === opt}
                                    className="hidden"
                                  />
                                  <span className="font-light">{displayOpt}</span>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <input 
                            type="text" 
                            name={field.id}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="bg-transparent border-b border-primary-silver/40 py-3 text-lg font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors"
                            placeholder={lang === 'fr' ? 'Votre réponse...' : 'Your answer...'}
                          />
                        )}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-col mt-8 pt-8 border-t border-primary-silver/20 relative">
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm font-medium self-end mb-4"
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex justify-between items-center w-full">
                    <button
                      type="button"
                      onClick={prevStep}
                    className={`flex items-center gap-2 text-primary-charcoal hover:text-primary-midnight transition-colors ${currentStep === 0 ? 'invisible' : 'visible'}`}
                  >
                    <ArrowLeft size={16} />
                    <span className="uppercase tracking-widest text-sm font-medium">{lang === 'fr' ? 'Retour' : 'Back'}</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center gap-4 bg-primary-midnight text-white px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-primary-copper transition-colors disabled:opacity-50"
                  >
                    {isSubmitting 
                      ? (lang === 'fr' ? 'Envoi...' : 'Sending...') 
                      : (currentStep === totalSteps - 1 
                        ? (lang === 'fr' ? 'Terminer' : 'Finish') 
                        : (lang === 'fr' ? 'Suivant' : 'Next'))
                    }
                    {currentStep !== totalSteps - 1 ? <ChevronRight size={18} /> : <Check size={18} />}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-16 text-center border-t-4 border-primary-copper shadow-sm flex flex-col items-center justify-center min-h-[50vh]"
            >
              <div className="w-20 h-20 bg-primary-copper/10 text-primary-copper rounded-full flex items-center justify-center mb-8">
                <Check size={40} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-primary-midnight mb-6">
                {lang === 'fr' ? "Merci pour votre temps." : "Thank you for your time."}
              </h2>
              <p className="text-xl text-primary-charcoal font-light leading-relaxed max-w-2xl mx-auto mb-10">
                {lang === 'fr' 
                  ? "Vos réponses ont bien été enregistrées. Nous vous contacterons sous 48 heures pour vous proposer un retour de 30 minutes. Ce retour est une lecture honnête de ce que vos réponses révèlent."
                  : "Your responses have been recorded. We will contact you within 48 hours for a 30-minute debrief. This debrief is an honest reading of what your answers reveal."
                }
              </p>
              <a href="/" className="inline-block border border-primary-midnight text-primary-midnight hover:bg-primary-midnight hover:text-white px-8 py-3 text-sm font-medium uppercase tracking-widest transition-colors">
                {lang === 'fr' ? "Retour à l'accueil" : "Back to home page"}
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
