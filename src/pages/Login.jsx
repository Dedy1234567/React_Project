import { useState } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    const result = login(email, password);

    if (result.success) {
      // Redirect ke halaman yang diminta sebelumnya, atau ke home/admin sesuai role
      const from = location.state?.from?.pathname || "/";

      if (result.user && result.user.role === "admin") {
        // Jika admin, redirect ke /admin
        // Gunakan replace: true untuk MENGHAPUS entry login dari history
        navigate("/admin", { replace: true });

        // Setelah navigate, pastikan history stack benar
        // Jika history sebelumnya adalah home user (/), kita perlu memastikan
        // bahwa back button tidak kembali ke home user
        // Solusi: replace entry sebelumnya (home user) dengan /admin
        setTimeout(() => {
          // Pastikan entry saat ini adalah /admin dengan state yang benar
          if (window.location.pathname === "/admin") {
            window.history.replaceState(
              { adminPage: true, dashboard: true },
              "",
              "/admin"
            );
            // Push entry /admin lagi untuk memastikan back button
            // tidak kembali ke home user, tapi tetap di dashboard admin
            window.history.pushState(
              { adminPage: true, dashboard: true },
              "",
              "/admin"
            );
          }
        }, 0);
      } else if (result.user && result.user.role === "kurir") {
        // Jika kurir, redirect ke /kurir
        navigate("/kurir", { replace: true });
      } else {
        // User biasa, redirect ke halaman yang diminta atau home
        // Gunakan replace: true untuk menghapus entry login
        navigate(from, { replace: true });
      }
    } else {
      setError(result.message);

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Masuk ke Akun</h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Silakan login dengan akun Anda
            </p>
          </div>

          {/* Error Message */}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />

              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Masukkan email Anda"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Masukkan password Anda"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />

                    <span>Masuk</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
