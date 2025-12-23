import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { promoProducts } from "../data/promoProducts";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import {
  ShoppingCart,
  ArrowLeft,
  Tag,
  Percent,
  Package,
  Zap,
} from "lucide-react";

export default function Promo() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categoriesList, setCategoriesList] = useState([]);

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
      // Fallback: ambil dari promoProducts yang ada
      const productCategories = [
        ...new Set(promoProducts.map((p) => p.category)),
      ];
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
  }, []);

  const categories = ["all", ...categoriesList];

  const filteredProducts = promoProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk menambahkan ke keranjang");
      navigate("/login");
      return;
    }

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.promoPrice,
      image: product.image,
      category: product.category,
      stock: product.stock,
    };

    const result = addToCart(cartProduct, 1);
    if (result.success) {
      alert(`${product.name} ditambahkan ke keranjang!`);
    }
  };

  const calculateDiscount = (originalPrice, promoPrice) => {
    return Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-8 sm:py-12 text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6 flex-wrap gap-2">
            <Zap className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Promo Spesial
            </h1>
            <Zap className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
          </div>
          <p className="text-base sm:text-xl md:text-2xl text-amber-100 font-medium px-2">
            Diskon Gila Hingga 30% – Buruan Sebelum Kehabisan!
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full px-3 py-2 sm:px-5 sm:py-3 transition-all duration-300 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium hidden sm:inline">Kembali</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-10 border border-white/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk promo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-400 focus:border-transparent transition-all text-gray-800 placeholder-gray-500 text-sm sm:text-base"
              />
              <Tag className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-400 transition-all text-gray-800 text-sm sm:text-base"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Semua Kategori" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur rounded-3xl shadow-inner">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <p className="text-2xl text-gray-600 font-medium">
              Tidak ada produk promo yang ditemukan
            </p>
            <p className="text-gray-500 mt-2">
              Coba kata kunci atau kategori lain
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => {
              const discount = calculateDiscount(
                product.originalPrice,
                product.promoPrice
              );
              return (
                <Link
                  key={product.id}
                  to={`/promo/${product.id}`}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-3 block cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg flex items-center space-x-1 animate-pulse">
                      <Percent className="w-5 h-5" />
                      <span>-{discount}%</span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Stok:{" "}
                        <span className="font-bold text-gray-700">
                          {product.stock}
                        </span>
                      </span>
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Pricing */}
                    <div>
                      <div className="flex items-end space-x-3">
                        <span className="text-3xl font-extrabold text-orange-600">
                          Rp{product.promoPrice.toLocaleString("id-ID")}
                        </span>
                        <span className="text-lg text-gray-400 line-through mb-1">
                          Rp{product.originalPrice.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="text-sm text-green-600 font-semibold mt-1">
                        Hemat Rp
                        {(
                          product.originalPrice - product.promoPrice
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Summary Count (optional, tanpa tombol lihat semua) */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700 font-medium">
              Menampilkan{" "}
              <span className="font-bold text-amber-600">
                {filteredProducts.length}
              </span>{" "}
              produk promo spesial
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
