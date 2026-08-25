import React from 'react';
import { ToastMessage } from '../hooks/useReminders';
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-slate-900 text-white border-emerald-500/40 shadow-emerald-950/20',
    info: 'bg-slate-900 text-white border-indigo-500/40 shadow-indigo-950/20',
    warning: 'bg-amber-950 text-amber-100 border-amber-500/50 shadow-amber-950/30',
  }[toast.type];

  const icon = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Bell className="w-5 h-5 text-indigo-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />,
  }[toast.type];

  return (
    <div
      className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-50 pointer-events-auto transition-all transform animate-in fade-in slide-in-from-bottom-5 duration-300"
      role="alert"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md ${bgStyles}`}
      >
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold tracking-tight">{toast.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
