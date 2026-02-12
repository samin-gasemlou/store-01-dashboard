import React from "react";
import { X } from "lucide-react";

const BaseModal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95%]",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
      dir="rtl"
    >
      {/* ✅ container height محدود + موبایل-friendly */}
      <div
        className={`
          bg-slate-50 w-full ${sizeClasses[size]}
          rounded-2xl shadow-2xl overflow-hidden animate-fade-in relative
          max-h-[92vh] sm:max-h-[90vh]
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white">
          <h2 className="text-base sm:text-xl font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
          </button>
        </div>

        {/* ✅ Body scroll داخل مودال (ارتفاع زیاد در موبایل حل میشه) */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
