'use client';

import { Suspense, useState } from 'react';
import { Mail, Check, Loader2, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { resetPassword } from '../actions';

const t = {
  fr: {
    title: 'Mot de passe oublié',
    subtitle: 'Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.',
    email: 'Adresse e-mail',
    emailPlaceholder: 'votre.email@entreprise.com',
    submit: 'Envoyer le lien',
    back: 'Retour à la connexion',
    successTitle: 'Lien envoyé',
    successDesc: 'Vérifiez votre boîte mail. Un lien de réinitialisation vous a été envoyé.',
    sending: 'Envoi...',
  },
  en: {
    title: 'Forgot password',
    subtitle: 'Enter your email address to receive a reset link.',
    email: 'Email address',
    emailPlaceholder: 'your.email@company.com',
    submit: 'Send reset link',
    back: 'Back to login',
    successTitle: 'Link sent',
    successDesc: 'Check your email. A reset link has been sent to you.',
    sending: 'Sending...',
  }
};

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') === 'en' ? 'en' : 'fr';
  const current = t[lang];

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await resetPassword(formData);
    
    setLoading(false);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl"
    >
      <div className="bg-white border border-primary-silver/20 rounded-sm p-10 md:p-16 shadow-sm relative overflow-hidden">
        
        {/* Header */}
        <div className="mb-10 lg:mb-12">
          <div className="w-12 h-12 bg-primary-midnight/5 text-primary-midnight rounded-full flex items-center justify-center mb-6">
            <KeyRound className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-midnight leading-tight mb-4">{current.title}</h1>
          <p className="text-primary-charcoal/70 font-light max-w-sm">{current.subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-600 p-4 font-light text-sm mb-8"
            >
              {error}
            </motion.div>
          )}

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#FAFAFA] border border-primary-silver/20 p-8 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif text-primary-midnight mb-2">{current.successTitle}</h3>
              <p className="text-primary-charcoal/70 text-sm font-light mb-6">{current.successDesc}</p>
              
              <Link href={`/login?lang=${lang}`} className="text-primary-copper font-medium uppercase tracking-widest text-xs hover:text-primary-midnight transition-colors">
                {current.back}
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <input type="hidden" name="lang" value={lang} />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm uppercase tracking-widest text-primary-charcoal font-medium">{current.email}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-silver" />
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder={current.emailPlaceholder}
                    className="w-full bg-[#FAFAFA] border border-primary-silver/30 pl-12 pr-4 py-4 text-sm font-light text-primary-midnight focus:bg-white focus:border-primary-copper focus:ring-1 focus:ring-primary-copper outline-none transition-all placeholder:text-primary-silver/80"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary-midnight text-white py-4 text-sm tracking-widest uppercase font-medium hover:bg-primary-copper transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? current.sending : current.submit}
                </button>
                
                <p className="text-center text-sm font-light text-primary-charcoal/60">
                  <Link href={`/login?lang=${lang}`} className="text-primary-copper hover:text-primary-midnight transition-colors border-b border-transparent hover:border-primary-midnight">
                    {current.back}
                  </Link>
                </p>
              </div>
            </form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4 font-sans">
      <Suspense fallback={<div className="w-full max-w-xl text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-copper" /></div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
