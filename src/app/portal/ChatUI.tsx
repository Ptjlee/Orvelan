'use client';

import { useState, useRef, useEffect } from 'react';
import { sendMessage } from './actions';
import { Send, Loader2, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

type Message = {
  id: string;
  content: string;
  sender_role: 'client' | 'admin';
  created_at: string;
};

const t = {
  fr: {
    title: 'Espace Communication',
    subtitle: 'Contacter Orvelan',
    emptyTitle: 'Aucun message',
    emptyDesc: 'Laissez une note ou posez une question à David. Il vous répondra directement ici.',
    placeholder: 'Écrivez votre message...',
  },
  en: {
    title: 'Communication Hub',
    subtitle: 'Contact Orvelan',
    emptyTitle: 'No messages',
    emptyDesc: 'Leave a note or ask David a question. He will answer you directly here.',
    placeholder: 'Write your message...',
  }
};

export default function ChatUI({ initialMessages, lang = 'fr' }: { initialMessages: Message[], lang?: 'fr' | 'en' }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const current = t[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('message') as string;
    
    if (!content.trim()) return;
    
    setLoading(true);
    
    // Optimistic UI update
    const optimisticMsg: Message = {
      id: Math.random().toString(),
      content,
      sender_role: 'client',
      created_at: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, optimisticMsg]);
    e.currentTarget.reset();

    const res = await sendMessage(formData);
    if (res?.error) {
      alert(res.error);
      // Revert optimistic update on error
      setMessages((prev) => prev.filter(m => m.id !== optimisticMsg.id));
    }
    
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[500px] border border-primary-silver/20 bg-white rounded-sm shadow-sm overflow-hidden">
      <div className="bg-[#FAFAFA] border-b border-primary-silver/20 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg text-primary-midnight">{current.title}</h3>
          <p className="text-xs text-primary-charcoal/60 uppercase tracking-widest mt-1">{current.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-primary-silver">
            <ShieldCheck className="w-12 h-12 mb-4 opacity-50" strokeWidth={1} />
            <p className="text-sm font-light text-center max-w-xs text-primary-charcoal/60">
              {current.emptyDesc}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isClient = msg.sender_role === 'client';
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[80%] ${isClient ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isClient ? 'bg-primary-silver/20 text-primary-charcoal' : 'bg-primary-midnight text-white'}`}>
                    {isClient ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 text-sm font-light leading-relaxed ${isClient ? 'bg-[#FAFAFA] border border-primary-silver/20 text-primary-midnight rounded-tl-xl rounded-tr-xl rounded-bl-xl' : 'bg-primary-midnight text-white rounded-tl-xl rounded-tr-xl rounded-br-xl'}`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="p-4 bg-[#FAFAFA] border-t border-primary-silver/20">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            name="message"
            placeholder={current.placeholder}
            disabled={loading}
            className="w-full bg-white border border-primary-silver/30 rounded-full py-3 pl-6 pr-14 text-sm font-light text-primary-midnight focus:border-primary-copper focus:ring-1 focus:ring-primary-copper outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 w-10 h-10 bg-primary-midnight text-white rounded-full flex items-center justify-center hover:bg-primary-copper transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-1" />}
          </button>
        </form>
      </div>
    </div>
  );
}
