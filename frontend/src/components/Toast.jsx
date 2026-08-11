function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const styles =
    type === "success"
      ? "bg-green-500/10 border-green-500 text-green-400"
      : "bg-red-500/10 border-red-500 text-red-400";

  return (
    <div
      className={`fixed top-20 right-4 z-100 w-[calc(100%-2rem)] sm:w-auto sm:min-w-[320px] max-w-md border rounded-xl px-4 py-3 shadow-lg ${styles}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium">{message}</p>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
