'use client';

import { useState, useRef, useEffect } from 'react';
import { User as UserIcon, LogOut, Settings, X, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile } from './profile-actions';

const t = {
  fr: {
    profile: 'Profil',
    logout: 'Déconnexion',
    settings: 'Paramètres du compte',
    email: 'Adresse e-mail',
    phone: 'Numéro de téléphone',
    newPassword: 'Nouveau mot de passe',
    newPasswordDesc: '(laisser vide pour ne pas changer)',
    save: 'Enregistrer',
    saving: 'Enregistrement...',
    success: 'Profil mis à jour avec succès.',
    error: 'Une erreur est survenue.'
  },
  en: {
    profile: 'Profile',
    logout: 'Log out',
    settings: 'Account Settings',
    email: 'Email Address',
    phone: 'Phone Number',
    newPassword: 'New Password',
    newPasswordDesc: '(leave blank to keep current)',
    save: 'Save Changes',
    saving: 'Saving...',
    success: 'Profile updated successfully.',
    error: 'An error occurred.'
  }
};

export default function ProfileSettings({ user, lang = 'fr', signoutAction }: { user: any, lang?: 'fr'|'en', signoutAction: any }) {
  const current = t[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoading(false);

    if (res.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: current.success });
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage(null);
      }, 2000);
    }
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 text-sm text-primary-charcoal/70 hover:opacity-80 transition-opacity"
        >
          <span className="hidden sm:inline">{user.user_metadata?.first_name || current.profile} {user.user_metadata?.last_name || ''}</span>
          <div className="h-8 w-8 bg-primary-midnight text-white flex items-center justify-center rounded-full">
            {user.user_metadata?.first_name?.charAt(0) || 'C'}
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-3 w-48 bg-white border border-primary-silver/20 shadow-sm rounded-sm py-2 z-50 flex flex-col"
            >
              <button 
                onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-[#FAFAFA] transition-colors w-full text-primary-midnight"
              >
                <Settings className="w-4 h-4 text-primary-silver" />
                {current.settings}
              </button>
              
              <div className="w-full h-px bg-primary-silver/20 my-1" />
              
              <form action={signoutAction} className="w-full">
                <button type="submit" className="flex items-center gap-2 px-4 py-3 text-sm text-left hover:bg-[#FAFAFA] transition-colors text-primary-charcoal w-full hover:text-red-500">
                  <LogOut className="w-4 h-4 text-primary-silver" />
                  {current.logout}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-midnight/20 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-primary-silver/20 rounded-sm shadow-xl w-full max-w-md overflow-hidden relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-primary-silver hover:text-primary-midnight transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <h2 className="text-2xl font-serif text-primary-midnight mb-6 flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-primary-copper" />
                  {current.settings}
                </h2>

                {message && (
                  <div className={`p-4 text-sm font-light mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSave} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-primary-charcoal">{current.email}</label>
                    <input 
                      type="email" 
                      name="email"
                      defaultValue={user.email}
                      className="bg-[#FAFAFA] border border-primary-silver/30 px-4 py-3 text-sm focus:bg-white focus:border-primary-copper outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-primary-charcoal">{current.phone}</label>
                    <input 
                      type="tel" 
                      name="phone"
                      defaultValue={user.user_metadata?.phone || ''}
                      placeholder="+33 6 00 00 00 00"
                      className="bg-[#FAFAFA] border border-primary-silver/30 px-4 py-3 text-sm focus:bg-white focus:border-primary-copper outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-primary-charcoal">
                      {current.newPassword} <span className="text-primary-silver normal-case tracking-normal">{current.newPasswordDesc}</span>
                    </label>
                    <input 
                      type="password" 
                      name="password"
                      placeholder="••••••••"
                      className="bg-[#FAFAFA] border border-primary-silver/30 px-4 py-3 text-sm focus:bg-white focus:border-primary-copper outline-none transition-colors"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="mt-4 bg-primary-midnight text-white py-4 text-sm tracking-widest uppercase font-medium hover:bg-primary-copper transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {loading ? current.saving : current.save}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
