import { useEffect } from "react";

const AlertModal = ({ message, open, onClose, color ="bg-white border border-gray-200" , textColor = "text-red-600" }) => {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed mt-2 top-16 right-6 z-999">
      <div className={`flex items-start gap-3 ${color}   shadow-xl rounded-lg px-4 py-3 min-w-[280px] animate-slide-in`}>
        <p className={`text-sm ${textColor} flex-1`}>{message}</p>

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
