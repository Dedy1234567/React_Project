import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { AlertCircle, Loader2 } from "lucide-react";
import { useMemo } from "react";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  // SELALU cek localStorage sebagai sumber kebenaran utama
  // Ini memastikan tidak ada race condition saat back button diklik
  const currentUser = useMemo(() => {
    // Cek localStorage dulu (lebih reliable)
    const savedUser = localStorage.getItem("ecommerce_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Jika user dari context berbeda, prioritaskan localStorage
        return parsed;
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    // Fallback ke user dari context
    return user;
  }, [user, location.pathname]); // Re-check saat pathname berubah

  // Tunggu sampai loading selesai
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada user sama sekali, redirect ke login
  if (!currentUser) {
    // Jangan redirect jika sudah di halaman login
    if (location.pathname !== "/login") {
      // Gunakan replace: false untuk menjaga history browser
      return (
        <Navigate to="/login" state={{ from: location }} replace={false} />
      );
    }
    return null;
  }

  // Jika ada roles yang ditentukan, cek apakah user memiliki role yang sesuai
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace={false} />;
  }

  return children;
}
