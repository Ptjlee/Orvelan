'use client';

import { Suspense, useState } from 'react';
import { Lock, Loader2, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { updatePassword } from '../actions';

const t = {
  fr: {
    title: 'Nouveau mot de passe',
    subtitle: 'Veuillez définir votre nouveau mot de passe ci-dessous.',
    password: 'Nouveau mot de passe',
    submit: 'Mettre à jour',
    updating: 'Mise à jour...',
  },
  en: {
    title: 'New password',
    subtitle: 'Please set your new password below.',
    password: 'New password',
    submit: 'Update password',
    updating: 'Updating...',
  }
};

function UpdatePasswordForm() {
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') === 'en' ? 'en' : 'fr';
  const current = t[lang];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);
    
    setLoading(false);
    
    if (result?.error) {
      setError(result.error);
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
            <Key className="w-6 h-6" strokeWidth={1.5} />
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <input type="hidden" name="lang" value={lang} />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm uppercase tracking-widest text-primary-charcoal font-medium">{current.password}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-silver" />
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#FAFAFA] border border-primary-silver/30 pl-12 pr-4 py-4 text-sm font-light text-primary-midnight focus:bg-white focus:border-primary-copper focus:ring-1 focus:ring-primary-copper outline-none transition-all placeholder:text-primary-silver/80"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-primary-midnight text-white py-4 text-sm tracking-widest uppercase font-medium hover:bg-primary-copper transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? current.updating : current.submit}
            </button>
          </form>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4 font-sans">
      <Suspense fallback={<div className="w-full max-w-xl text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-copper" /></div>}>
        <UpdatePasswordForm />
      </Suspense>
    </div>
  );
}
