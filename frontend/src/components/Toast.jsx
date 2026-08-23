import { useEffect } from "react";

function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  const isError = type === "error";
  const isWarning = type === "warning";
  const isInfo = type === "info";

  const styles = isError
    ? {
        wrapper: "border-red-500/30 bg-red-500/10",
        icon: "bg-red-500/20 text-red-400",
        text: "text-red-300",
        symbol: "!",
      }
    : isWarning
      ? {
          wrapper: "border-amber-500/30 bg-amber-500/10",
          icon: "bg-amber-500/20 text-amber-400",
          text: "text-amber-300",
          symbol: "!",
        }
      : isInfo
        ? {
            wrapper: "border-cyan-500/30 bg-cyan-500/10",
            icon: "bg-cyan-500/20 text-cyan-400",
            text: "text-cyan-300",
            symbol: "i",
          }
        : {
            wrapper: "border-emerald-500/30 bg-emerald-500/10",
            icon: "bg-emerald-500/20 text-emerald-400",
            text: "text-emerald-300",
            symbol: "✓",
          };

  return (
    <div
      className="fixed right-4 top-20 z-[100] w-[calc(100%-2rem)] max-w-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md ${styles.wrapper}`}
      >
        {/* Icon */}

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${styles.icon}`}
          aria-hidden="true"
        >
          {styles.symbol}
        </div>

        {/* Message */}

        <div className="min-w-0 flex-1 pt-1">
          <p className={`break-words text-sm font-medium ${styles.text}`}>
            {message}
          </p>
        </div>

        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-md px-1 text-lg leading-none text-slate-500 transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
