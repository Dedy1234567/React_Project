import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Konfirmasi", 
  message = "Anda yakin ingin keluar?",
  confirmText = "Ya",
  cancelText = "Tidak"
}) {
  const modalRef = useRef(null);

  // Mencegah scroll dan interaksi saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      // Simpan scroll position
      const scrollY = window.scrollY;
      // Disable scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      // Mencegah pointer events pada body (semua elemen di belakang)
      document.body.style.pointerEvents = 'none';
      
      // Enable pointer events hanya pada modal
      if (modalRef.current) {
        modalRef.current.style.pointerEvents = 'auto';
      }
      
      return () => {
        // Restore scroll dan pointer events saat modal ditutup
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.pointerEvents = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      data-modal="true"
      style={{ pointerEvents: 'auto' }}
      onMouseDown={(e) => {
        // Mencegah semua interaksi di belakang modal
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        // Mencegah touch events di belakang modal
        // e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        // Mencegah klik di overlay menutup modal
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {message}
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

