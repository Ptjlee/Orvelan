'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { signup } from '../actions';
import { Mail, Lock, User, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

const t = {
  fr: {
    title: 'Créer un compte',
    subtitle: 'Pour accéder à votre diagnostic personnalisé.',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email professionnel',
    password: 'Mot de passe',
    submit: 'Créer mon accès',
    existing: 'Déjà un compte ?',
    login: 'Se connecter',
    firstNamePlaceholder: 'Jean',
    lastNamePlaceholder: 'Dupont',
  },
  en: {
    title: 'Create an account',
    subtitle: 'To access your personalized diagnostic.',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Professional Email',
    password: 'Password',
    submit: 'Create access',
    existing: 'Already have an account?',
    login: 'Log in',
    firstNamePlaceholder: 'John',
    lastNamePlaceholder: 'Doe',
  }
};

function RegisterForm() {
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') === 'en' ? 'en' : 'fr';
  const current = t[lang];

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);
    if (result?.error) {
      setErrorMsg(result.error);
      setLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl"
    >
      <div className="bg-white border border-primary-silver/20 rounded-sm p-10 md:p-16 shadow-sm">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-midnight leading-tight mb-2">
            {current.title}
          </h1>
          <p className="text-primary-charcoal/70 font-light">
            {current.subtitle}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-sm mb-8 text-sm font-light">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <input type="hidden" name="lang" value={lang} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm uppercase tracking-widest text-primary-charcoal font-medium">{current.firstName}</label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-silver" />
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full bg-transparent border-b border-primary-silver/40 py-3 pl-8 text-lg font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors"
                  placeholder={current.firstNamePlaceholder}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm uppercase tracking-widest text-primary-charcoal font-medium">{current.lastName}</label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-silver" />
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full bg-transparent border-b border-primary-silver/40 py-3 pl-8 text-lg font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors"
                  placeholder={current.lastNamePlaceholder}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase tracking-widest text-primary-charcoal font-medium">{current.email}</label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-silver" />
              <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-primary-silver/40 py-3 pl-8 text-lg font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors"
                  placeholder="name@company.com"
                />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm uppercase tracking-widest text-primary-charcoal font-medium">{current.password}</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-silver" />
              <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full bg-transparent border-b border-primary-silver/40 py-3 pl-8 text-lg font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors"
                  placeholder="••••••••"
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-primary-midnight text-white px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-primary-copper transition-colors w-full flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{current.submit}</span>
                <Check className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-primary-charcoal/60 mt-8 font-light">
          {current.existing}{' '}
          <Link href={`/login?lang=${lang}`} className="text-primary-copper hover:text-primary-midnight transition-colors border-b border-transparent hover:border-primary-midnight font-medium">
            {current.login}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4 font-sans">
      <Suspense fallback={<div className="w-full max-w-xl text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-copper" /></div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
