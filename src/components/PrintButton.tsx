'use client';

import { FileText } from 'lucide-react';

export default function PrintButton({ label }: { label: string }) {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-primary-midnight text-white px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-primary-copper transition-colors flex items-center gap-3 print:hidden"
    >
      <FileText className="w-4 h-4" /> {label}
    </button>
  );
}
