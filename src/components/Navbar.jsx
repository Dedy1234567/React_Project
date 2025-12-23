import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ConfirmModal from "./ConfirmModal";
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Menu,
  MapPin,
  Smartphone,
  ChevronRight,
  User,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/", { replace: true });
    setShowLogoutModal(false);
  };

  return (
    <>
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Logout"
        message="Anda yakin ingin keluar?"
        confirmText="Ya"
        cancelText="Tidak"
      />
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-gray-600">
              <Smartphone className="w-4 h-4" />
              <span>Gratis Ongkir + Banyak Promo belanja di aplikasi</span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <Link to="/about" className="hover:text-green-600">
                Tentang Zeluxe
              </Link>
              <Link to="/promo" className="hover:text-green-600">
                Promo
              </Link>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Dikirim ke Jakarta Pusat</span>
              </div>
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-1 bg-white border border-green-600 text-green-600 rounded hover:bg-green-50"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Daftar
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-gray-600 hover:text-green-600 px-3 py-1 rounded hover:bg-gray-50 transition"
                  >
                    <User className="w-4 h-4" />
                    <span>Profil</span>
                  </Link>
                  <span className="text-gray-600">Halo, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Keluar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="relative flex items-center justify-between">
            {/* Left Section - Logo & Kategori */}
            <div className="flex items-center gap-4 shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-2 text-2xl font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                <ShoppingBag className="w-8 h-8" />
                <span>zeluxe</span>
              </Link>
              <button className="hidden md:flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Menu className="w-5 h-5" />
                <span>Kategori</span>
              </button>
            </div>

            {/* Center Section - Search Bar (Absolute Centered) */}
            <form onSubmit={handleSearch} className="hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari di Zeluxe"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 transition-all"
                />
              </div>
            </form>

            {/* Right Section - Cart (Paling Kanan) */}
            <div className="flex items-center shrink-0 ml-auto">
              <Link
                to="/cart"
                className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                {user && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
