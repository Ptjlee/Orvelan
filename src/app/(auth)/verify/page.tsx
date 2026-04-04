'use client';

import { Suspense } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const t = {
  fr: {
    title: 'Vérifiez votre boîte mail',
    subtitle: 'Nous vous avons envoyé un lien magique pour confirmer votre adresse et activer votre compte.',
    back: 'Retour à la connexion',
  },
  en: {
    title: 'Check your email',
    subtitle: 'We sent you a magic link to confirm your address and activate your account.',
    back: 'Back to login',
  }
};

function VerifyForm() {
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') === 'en' ? 'en' : 'fr';
  const current = t[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl text-center"
    >
      <div className="bg-white border border-primary-silver/20 rounded-sm p-10 md:p-16 shadow-sm flex flex-col items-center">
        <div className="w-16 h-16 bg-primary-midnight/5 text-primary-midnight rounded-full flex items-center justify-center mb-8 border border-primary-midnight/10">
          <Mail className="w-8 h-8" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-serif text-primary-midnight leading-tight mb-4">
          {current.title}
        </h1>
        <p className="text-primary-charcoal/70 font-light mb-10 max-w-sm mx-auto">
          {current.subtitle}
        </p>

        <Link href={`/login?lang=${lang}`} className="text-primary-copper hover:text-primary-midnight transition-colors border-b border-transparent hover:border-primary-midnight font-medium uppercase tracking-widest text-sm">
          {current.back}
        </Link>
      </div>
    </motion.div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4 font-sans">
      <Suspense fallback={<div className="w-full max-w-xl text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-copper" /></div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
