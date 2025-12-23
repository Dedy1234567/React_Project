import {
  Route,
  Routes,
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import {
  ShoppingBag,
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  UserPlus,
  LogIn,
  ShieldCheck,
  ShoppingBasket,
  Plus,
  LogOut,
  Loader2,
  Search,
} from "lucide-react";

import ProductsPage from "./pages/Products";

import ProductDetailPage from "./pages/ProductDetail";

import AddProductPage from "./pages/admin/AddProduct";

import ListProductPage from "./pages/admin/ListProduct";

import CartPage from "./pages/Cart";

import LoginPage from "./pages/Login";

import RegisterPage from "./pages/Register";

import ProfilePage from "./pages/Profile";

import HomeAdmin from "./pages/admin/HomeAdmin";

import { useAuth } from "./context/AuthContext";

import { useLanguage } from "./context/LanguageContext";

import { useCart } from "./context/CartContext";

import ConfirmModal from "./components/ConfirmModal";

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // Tunggu sampai loading selesai sebelum mengecek user
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function Layout() {
  const { user, logout } = useAuth();

  const { t } = useLanguage();

  const { getTotalItems } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleProtectedClick = (e, path, requireLogin = true) => {
    if (requireLogin && !user) {
      e.preventDefault();

      navigate("/login");
    }
  };

  const handleCartClick = (e) => {
    handleProtectedClick(e, "/cart");
  };

  const handleProfileClick = (e) => {
    handleProtectedClick(e, "/profile");
  };

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
    // Navigate dulu, baru logout untuk menghindari redirect ke login
    navigate("/", { replace: true });
    // Lalu logout setelah navigate
    setTimeout(() => {
      logout();
    }, 100);
    setShowLogoutModal(false);
  };

  const isAdminPage = location.pathname.startsWith("/admin");

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Logout"
        message="Anda yakin ingin keluar?"
        confirmText="Ya"
        cancelText="Tidak"
      />
      <header className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-sm bg-opacity-95 border-b border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Left Section - Logo */}
            <div className="flex items-center shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <ShoppingBag className="w-8 h-8 text-blue-600" />
                <span>Zeluxe</span>
              </Link>
            </div>

            {/* Center Section - Search Bar (Absolute Centered) - Tidak tampil di halaman admin */}
            {!isAdminPage && (
              <form onSubmit={handleSearch} className="hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </form>
            )}

            {/* Right Section - Navigation & Cart (Paling Kanan) */}
            <div className="hidden md:flex items-center space-x-1 shrink-0 ml-auto">
              {/* User biasa: beranda & keranjang */}

              {(!user || user.role !== "admin") && (
                <>
                  <Link
                    to="/"
                    className="flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium text-sm lg:text-base"
                  >
                    <Home className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="hidden lg:inline">{t("home")}</span>
                  </Link>

                  <Link
                    to="/cart"
                    onClick={handleCartClick}
                    className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 font-medium relative text-sm lg:text-base ${
                      user
                        ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        : "text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="hidden lg:inline">{t("cart")}</span>
                    {user && getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* Admin: tombol ke dashboard admin */}

              {user?.role === "admin" && (
                <>
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium text-sm lg:text-base ${
                      isAdminPage ? "bg-blue-50" : ""
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Admin</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium text-sm lg:text-base"
                  >
                    <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {/* Auth Buttons */}

              {!user && (
                <>
                  <Link
                    to="/login"
                    className="ml-2 lg:ml-4 flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium text-sm lg:text-base"
                  >
                    <LogIn className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>{t("login")}</span>
                  </Link>

                  <Link
                    to="/register"
                    className="ml-2 flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium text-sm lg:text-base"
                  >
                    <UserPlus className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>{t("register")}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2 shrink-0">
              <Link
                to="/cart"
                onClick={handleCartClick}
                className={`relative p-2 rounded-lg transition-all ${
                  user
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-400 opacity-50"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {user && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Tidak tampil di halaman admin */}
          {isMenuOpen && !isAdminPage && (
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                {/* User biasa: beranda & keranjang */}

                {(!user || user.role !== "admin") && (
                  <>
                    <Link
                      to="/"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
                    >
                      <Home className="w-5 h-5" />
                      <span>{t("home")}</span>
                    </Link>

                    <Link
                      to="/cart"
                      onClick={handleCartClick}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium relative ${
                        user
                          ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          : "text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>{t("cart")}</span>
                      {user && getTotalItems() > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {getTotalItems()}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* Admin: tombol ke dashboard admin */}

                {user?.role === "admin" && (
                  <>
                    <Link
                      to="/admin"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium ${
                        isAdminPage ? "bg-blue-50" : ""
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>Admin</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                )}

                {/* Auth Buttons */}

                {!user && (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>{t("login")}</span>
                    </Link>

                    <Link
                      to="/register"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>{t("register")}</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/products" element={<ProductsPage />} />

          <Route path="/products/:id" element={<ProductDetailPage />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route path="/profile" element={<ProfilePage />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <HomeAdmin />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/add-product"
            element={
              <PrivateRoute roles={["admin"]}>
                <AddProductPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/list-product"
            element={
              <PrivateRoute roles={["admin"]}>
                <ListProductPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/provinsi-ongkir"
            element={
              <PrivateRoute roles={["admin"]}>
                <ListProductPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/riwayat-penjualan"
            element={
              <PrivateRoute roles={["admin"]}>
                <ListProductPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/manajemen-kurir"
            element={
              <PrivateRoute roles={["admin"]}>
                <ListProductPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer */}

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <span className="text-gray-600 font-medium text-sm sm:text-base">
                Zeluxe Store
              </span>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm text-center md:text-right">
              © 2024 Zeluxe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
