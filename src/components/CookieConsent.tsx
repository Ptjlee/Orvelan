'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const config = {
  fr: {
    title: 'Paramètres de confidentialité',
    description: "Nous utilisons des cookies analytiques via Google Tag Manager pour comprendre l'utilisation de notre plateforme et améliorer votre expérience (mesure d'audience).",
    accept: 'Accepter',
    decline: 'Refuser les cookies non essentiels',
  },
  en: {
    title: 'Privacy Settings',
    description: 'We use analytics cookies via Google Tag Manager to understand how you use our platform and improve your experience (audience measurement).',
    accept: 'Accept',
    decline: 'Decline non-essential',
  }
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: Function;
  }
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') === 'en' ? 'en' : 'fr';
  const t = config[lang];

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem('orvelan_cookie_consent');
    
    // Initialize default consent state immediately locally
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    if (!consent) {
      // Set default consent to denied required for strict GDPR mode
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
      });
      setShow(true);
    } else if (consent === 'granted') {
      gtag('consent', 'default', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
      });
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('orvelan_cookie_consent', 'granted');
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
    });
    // Fire a custom event for GTM to know consent state has changed dynamically
    window.dataLayer.push({ event: 'cookie_consent_update' });
    setShow(false);
  };

  const declineCookies = () => {
    localStorage.setItem('orvelan_cookie_consent', 'denied');
    window.gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
    });
    window.dataLayer.push({ event: 'cookie_consent_update' });
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-center pointer-events-none"
        >
          <div className="bg-primary-midnight text-white w-full max-w-5xl rounded-sm shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 pointer-events-auto">
            <div className="flex gap-4 items-start">
              <ShieldAlert className="w-6 h-6 text-primary-copper shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-lg tracking-wide mb-2">{t.title}</h3>
                <p className="text-white/70 font-light text-sm md:text-base leading-relaxed">
                  {t.description}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <button
                onClick={declineCookies}
                className="px-6 py-3 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm tracking-widest uppercase font-medium"
              >
                {t.decline}
              </button>
              <button
                onClick={acceptCookies}
                className="px-6 py-3 bg-primary-copper text-white hover:bg-[#A35D3A] transition-colors text-sm tracking-widest uppercase font-medium"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
