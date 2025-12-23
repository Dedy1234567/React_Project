import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initialProducts } from "../../data/products";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import ConfirmModal from "../../components/ConfirmModal";
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Smartphone,
  ArrowRight,
  Package,
  User,
  Menu,
  X,
} from "lucide-react";

export default function HomeUser() {
  const { t } = useLanguage();
  const { addToCart, getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [categoriesList, setCategoriesList] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const loadProducts = () => {
      const saved = localStorage.getItem("ecommerce_products");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Gunakan produk dari localStorage jika ada, tidak peduli jumlahnya
          // Ini memastikan sinkronisasi dengan perubahan dari admin
          if (parsed && Array.isArray(parsed)) {
            // Jika array kosong atau ada produk, gunakan data dari localStorage
            // Jangan reset ke initialProducts jika admin menghapus produk
            setProducts(parsed.length > 0 ? parsed : []);
            return;
          }
        } catch (error) {
          console.error("Error parsing products:", error);
        }
      }

      // Hanya gunakan initialProducts jika localStorage benar-benar kosong/null
      // Ini hanya terjadi saat pertama kali load
      if (!saved) {
        setProducts(initialProducts);
        localStorage.setItem(
          "ecommerce_products",
          JSON.stringify(initialProducts)
        );
      }
    };

    loadProducts();

    // Listen untuk perubahan localStorage
    const handleStorageChange = (e) => {
      if (e.key === "ecommerce_products") {
        loadProducts();
      }
    };

    // Listen untuk custom event productsUpdated
    const handleProductsUpdated = () => {
      loadProducts();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("productsUpdated", handleProductsUpdated);

    // Polling untuk check perubahan
    const interval = setInterval(() => {
      loadProducts();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("productsUpdated", handleProductsUpdated);
      clearInterval(interval);
    };
  }, []);

  // Ambil kategori dari localStorage dan listen perubahan
  useEffect(() => {
    const loadCategories = () => {
      const savedCategories = localStorage.getItem("ecommerce_categories");
      if (savedCategories) {
        try {
          const parsed = JSON.parse(savedCategories);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategoriesList(parsed);
            return;
          }
        } catch (error) {
          console.error("Error parsing categories:", error);
        }
      }

      // Fallback: ambil dari produk yang ada
      const productCategories = [...new Set(products.map((p) => p.category))];
      setCategoriesList(productCategories);
    };

    loadCategories();

    // Listen untuk perubahan localStorage
    const handleStorageChange = (e) => {
      if (e.key === "ecommerce_categories") {
        loadCategories();
      }
    };

    // Listen untuk custom event categoriesUpdated
    const handleCategoriesUpdated = () => {
      loadCategories();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("categoriesUpdated", handleCategoriesUpdated);

    // Polling untuk check perubahan
    const interval = setInterval(() => {
      loadCategories();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("categoriesUpdated", handleCategoriesUpdated);
      clearInterval(interval);
    };
  }, [products]);

  const categories =
    categoriesList.length > 0
      ? categoriesList
      : [...new Set(products.map((p) => p.category))];

  const featuredProducts = products;

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk menambahkan ke keranjang");
      navigate("/login");
      return;
    }

    const result = addToCart(product, 1);
    if (result.success) {
      // Produk berhasil ditambahkan ke keranjang, tetap di halaman HomeUser
    }
  };

  const handleSearch = (e) => {
    try {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      const query = String(searchQuery || "").trim();
      if (query && query.length > 0) {
        try {
          const encodedQuery = encodeURIComponent(query);
          navigate(`/products?search=${encodedQuery}`, { replace: false });
        } catch (navError) {
          console.error("Navigation error:", navError);
          navigate("/products", { replace: false });
        }
      }
      setIsSearchOpen(false);
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setIsSearchOpen(false);
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

  // Banner Tahun Baru 2026 dengan tema fashion & pakaian
  const banners = [
    {
      id: 1,
      title: "Selamat Tahun Baru 2026! 🎉",
      subtitle: "Diskon hingga 70% koleksi fashion untuk sambut tahun baru",
      buttonText: "Belanja Sekarang",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      title: "New Year Mega Sale 2026!",
      subtitle:
        "Gratis Ongkir + Voucher Extra untuk pembelian fashion pertama tahun ini",
      buttonText: "Ambil Promo",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      title: "Rayakan 2026 Bersama Zeluxe",
      subtitle: "Koleksi fashion spesial tahun baru dengan harga terbaik",
      buttonText: "Lihat Koleksi",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      title: "Happy New Year 2026! ✨",
      subtitle: "Tampil Stylish di Tahun Baru dengan Outfit Terbaik!",
      buttonText: "Cek Promo",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80",
    },
  ];

  const nextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(nextBanner, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Logout"
        message="Anda yakin ingin keluar?"
        confirmText="Ya"
        cancelText="Tidak"
      />
      {/* Top Bar - Tema Cerah Gold & Champagne */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-gray-900 py-2 px-4 text-center text-xs sm:text-sm font-semibold shadow-md">
        <p className="truncate">
          🎊 PROMO TAHUN BARU 2026: Gratis Ongkir + Diskon Extra!
        </p>
      </div>

      {/* Info Bar - Responsive */}
      <div className="bg-white border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 lg:gap-6">
              <Link
                to="/about"
                className="text-gray-700 hover:text-amber-600 transition font-medium"
              >
                Tentang Zeluxe
              </Link>
              <Link
                to="/promo"
                className="text-amber-600 hover:text-amber-700 transition font-semibold flex items-center gap-1"
              >
                <Package className="w-4 h-4" />
                <span className="hidden lg:inline">Promo Tahun Baru</span>
                <span className="lg:hidden">Promo</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 lg:gap-6">
              <div className="hidden lg:flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Dikirim ke Jakarta Pusat</span>
              </div>

              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-amber-600 transition font-medium"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="text-amber-600 hover:text-amber-700 transition font-semibold"
                  >
                    Daftar
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-amber-600 transition font-medium flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Profil</span>
                  </Link>
                  <span className="hidden xl:inline text-gray-600 text-sm">
                    Halo, {user.name} 🎉
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 transition font-medium text-sm"
                  >
                    Keluar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <MapPin className="w-3 h-3" />
              <span>Jakarta Pusat</span>
            </div>
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-amber-600 transition font-medium text-xs"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="text-amber-600 hover:text-amber-700 transition font-semibold text-xs"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600">Halo, {user.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar - Responsive */}
      <nav className="bg-white shadow-md border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-amber-600 shrink-0"
            >
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                zeluxe
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Cari produk fashion tahun baru..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                  className="w-full pl-12 pr-24 py-2.5 bg-gray-100 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 text-gray-800 transition-all text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 text-white px-4 py-1.5 rounded-lg hover:bg-amber-600 transition font-medium text-sm"
                >
                  Cari
                </button>
              </div>
            </div>

            {/* Right Side - Cart & Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 hover:bg-amber-100 rounded-xl transition"
                aria-label="Cari"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </button>

              {/* Cart Icon */}
              <Link
                to={user ? "/cart" : "/login"}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    navigate("/login");
                  }
                }}
                className="relative p-2 sm:p-2.5 hover:bg-amber-100 rounded-xl transition cursor-pointer"
                aria-label="Keranjang"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                {user && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full text-[10px] sm:text-xs">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-amber-100 rounded-xl transition"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="lg:hidden mt-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                      setIsSearchOpen(false);
                    }
                  }}
                  className="w-full pl-10 pr-20 py-2 bg-gray-100 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-400 text-gray-800 transition-all text-sm"
                />
                <button
                  onClick={() => {
                    handleSearch();
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition font-medium text-xs"
                >
                  Cari
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-3 pb-3 border-t border-amber-200 pt-3">
              <div className="flex flex-col gap-3">
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-amber-600 transition font-medium py-2 px-2 rounded-lg hover:bg-amber-50"
                >
                  Tentang Zeluxe
                </Link>
                <Link
                  to="/promo"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-amber-600 hover:text-amber-700 transition font-semibold flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-amber-50"
                >
                  <Package className="w-4 h-4" />
                  Promo Tahun Baru
                </Link>
                {user && (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-amber-600 transition font-medium flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-amber-50"
                    >
                      <User className="w-4 h-4" />
                      Profil
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-red-600 hover:text-red-700 transition font-medium text-left py-2 px-2 rounded-lg hover:bg-red-50"
                    >
                      Keluar
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Banner Carousel Tahun Baru */}
      <div className="relative w-full h-[500px] overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${banners[bannerIndex].image})`,
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
            <div className="max-w-2xl text-white space-y-6 animate-fadeIn">
              <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
                {banners[bannerIndex].title}
              </h1>
              <p className="text-xl text-gray-100 drop-shadow-md">
                {banners[bannerIndex].subtitle}
              </p>
              <div className="flex gap-4">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105 flex items-center gap-2">
                  {banners[bannerIndex].buttonText}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <Link
                  to="/promo"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold border-2 border-white/50 transition"
                >
                  Lihat semua promo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation & Dots */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevBanner();
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full transition z-20 cursor-pointer"
          aria-label="Banner sebelumnya"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextBanner();
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full transition z-20 cursor-pointer"
          aria-label="Banner berikutnya"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setBannerIndex(i);
              }}
              className={`w-3 h-3 rounded-full transition cursor-pointer ${
                i === bannerIndex
                  ? "bg-amber-600 w-10"
                  : "bg-white/70 hover:bg-white"
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Kategori Pilihan */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            🎯 Kategori Pilihan Tahun Baru
          </h2>
          <Link
            to="/products"
            className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 transition"
          >
            Lihat Semua <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (p) => p.category === category
            );
            const categoryImage =
              categoryProducts.length > 0 ? categoryProducts[0].image : "";

            return (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden border border-amber-200"
              >
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 p-4 flex items-center justify-center">
                  {categoryImage ? (
                    <img
                      src={categoryImage}
                      alt={category}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition"
                    />
                  ) : (
                    <Package className="w-16 h-16 text-amber-400" />
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition">
                    {category}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Produk Spesial - Card lebih kecil & tanpa tombol keranjang */}
      <div className="max-w-7xl mx-auto px-4 py-12 bg-white/50 rounded-3xl mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            ✨ Produk Spesial Tahun Baru 2026
          </h2>
          <Link
            to="/products"
            className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 transition"
          >
            Lihat Semua <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden border border-amber-200"
            >
              <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-amber-600">
                  Rp{product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
