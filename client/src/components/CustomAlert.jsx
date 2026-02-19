import React from "react";

const CustomAlert = ({ 
  isOpen, 
  onClose, 
  message, 
  type = "alert", // "alert" or "confirm"
  onConfirm 
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-crazy-yellow)] border-[6px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full">
        {/* Message */}
        <div className="mb-6">
          <p className="text-xl font-black uppercase text-center leading-tight">
            {message}
          </p>
        </div>

        {/* Buttons */}
        {type === "alert" ? (
          <button
            onClick={onClose}
            className="w-full bg-[var(--color-crazy-blue)] border-4 border-black font-black px-6 py-3 text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-x-[2px] active:translate-y-[2px]"
          >
            OK
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-[var(--color-crazy-blue)] border-4 border-black font-black px-6 py-3 text-base uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-x-[2px] active:translate-y-[2px]"
            >
              OK
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-[var(--color-crazy-pink)] border-4 border-black font-black px-6 py-3 text-base uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-x-[2px] active:translate-y-[2px]"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomAlert;
