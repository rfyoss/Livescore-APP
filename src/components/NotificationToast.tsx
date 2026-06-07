import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Goal, Bell } from 'lucide-react';

export interface ToastAlert {
  id: string;
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  scorer?: string;
  minute: number;
  description: string;
}

interface NotificationToastProps {
  toasts: ToastAlert[];
  removeToast: (id: string) => void;
}

export default function NotificationToast({ toasts, removeToast }: NotificationToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            className="bg-zinc-900 border border-emerald-500/30 text-white rounded-xl shadow-2xl overflow-hidden shadow-emerald-500/10"
            id={`goal-toast-${toast.id}`}
          >
            {/* Header Sparkle alert */}
            <div className="bg-emerald-600/90 px-4 py-2 flex items-center justify-between text-xs font-semibold tracking-wide uppercase">
              <span className="flex items-center gap-1.5 font-mono">
                <Goal className="w-4 h-4 animate-bounce" /> GOAL SCORED!
              </span>
              <span className="bg-emerald-950/70 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px]">
                {toast.minute}' MIN
              </span>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between font-bold text-base mb-1">
                <span>{toast.homeTeam}</span>
                <span className="bg-zinc-800 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-zinc-700">
                  {toast.homeScore} - {toast.awayScore}
                </span>
                <span>{toast.awayTeam}</span>
              </div>

              {toast.scorer && (
                <p className="text-sm font-semibold text-zinc-300">
                  Scorer: <span className="text-emerald-400 font-bold">{toast.scorer}</span>
                </p>
              )}

              <p className="text-xs text-zinc-400 mt-2 leading-relaxed italic">
                "{toast.description}"
              </p>

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-[10px] text-zinc-500 hover:text-white uppercase transition-colors"
                  id={`close-toast-${toast.id}`}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
