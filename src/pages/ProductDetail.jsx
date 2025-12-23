import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { initialProducts } from "../data/products";
import { promoProducts } from "../data/promoProducts";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ConfirmModal from "../components/ConfirmModal";
import {
  ShoppingCart,
  Tag,
  DollarSign,
  Package2,
  Palette,
  AlertCircle,
  Percent,
  Sparkles,
} from "lucide-react";

export default function ProductDetail() {
  // Get params first
  const params = useParams();
  const id = params?.id;
  const navigate = useNavigate();

  // Initialize contexts with error handling
  let cartContext, authContext, langContext;
  try {
    cartContext = useCart();
  } catch (e) {
    console.error("Cart context error:", e);
    cartContext = null;
  }

  try {
    authContext = useAuth();
  } catch (e) {
    console.error("Auth context error:", e);
    authContext = null;
  }

  try {
    langContext = useLanguage();
  } catch (e) {
    console.error("Language context error:", e);
    langContext = null;
  }

  // Safe context access
  const addToCart =
    cartContext?.addToCart ||
    (() => ({ success: false, message: "Cart tidak tersedia" }));
  const user = authContext?.user || null;
  const t = langContext?.t || ((key) => key);

  const [selectedColor, setSelectedColor] = useState(null);
  const [products, setProducts] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products
  useEffect(() => {
    let mounted = true;

    const loadProducts = () => {
      try {
        if (!mounted) return;

        const saved = localStorage.getItem("ecommerce_products");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
              if (mounted) {
                setProducts(parsed);
                setIsLoading(false);
              }
              return;
            }
          } catch (parseError) {
            console.error("Parse error:", parseError);
          }
        }

        // Fallback
        const defaultProducts = Array.isArray(initialProducts)
          ? initialProducts
          : [];
        if (mounted) {
          setProducts(defaultProducts);
          if (!saved && defaultProducts.length > 0) {
            try {
              localStorage.setItem(
                "ecommerce_products",
                JSON.stringify(defaultProducts)
              );
            } catch (e) {
              console.error("Storage error:", e);
            }
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Load error:", err);
        if (mounted) {
          setError("Error memuat produk");
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    const handleUpdate = () => {
      if (mounted) loadProducts();
    };

    window.addEventListener("productsUpdated", handleUpdate);

    return () => {
      mounted = false;
      window.removeEventListener("productsUpdated", handleUpdate);
    };
  }, []);

  // Find product
  const product = useMemo(() => {
    try {
      if (!id) return null;

      const productId = Number(id);
      if (isNaN(productId)) return null;

      const defaultProducts = Array.isArray(initialProducts)
        ? initialProducts
        : [];
      const allProducts = products.length > 0 ? products : defaultProducts;

      if (!Array.isArray(allProducts) || allProducts.length === 0) return null;

      const found = allProducts.find((p) => p && p.id === productId);
      return found || null;
    } catch (err) {
      console.error("Product find error:", err);
      return null;
    }
  }, [id, products]);

  // Recommended products
  const recommendedProducts = useMemo(() => {
    try {
      if (!product || !products || products.length === 0) return [];
      if (!product.category || !product.id) return [];

      const sameCategory = products.filter(
        (p) => p && p.category === product.category && p.id !== product.id
      );

      if (sameCategory.length < 4) {
        const random = products
          .filter(
            (p) =>
              p &&
              p.id !== product.id &&
              !sameCategory.some((sp) => sp && sp.id === p.id)
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 4 - sameCategory.length);
        return [...sameCategory, ...random].slice(0, 4);
      }
      return sameCategory.slice(0, 4);
    } catch (err) {
      console.error("Recommended error:", err);
      return [];
    }
  }, [product, products]);

  // Promo products
  const promoProductsList = useMemo(() => {
    try {
      if (
        !promoProducts ||
        !Array.isArray(promoProducts) ||
        promoProducts.length === 0
      ) {
        return [];
      }
      return [...promoProducts].sort(() => Math.random() - 0.5).slice(0, 4);
    } catch (err) {
      console.error("Promo error:", err);
      return [];
    }
  }, []);

  const calculateDiscount = (originalPrice, promoPrice) => {
    try {
      if (!originalPrice || !promoPrice) return 0;
      return Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
    } catch {
      return 0;
    }
  };

  const handleAddToCart = () => {
    try {
      if (!user) {
        alert("Silakan login terlebih dahulu");
        return;
      }
      if (!product) {
        alert("Produk tidak ditemukan");
        return;
      }
      setShowConfirmDialog(true);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Terjadi kesalahan");
    }
  };

  const confirmAddToCart = () => {
    try {
      if (!product) {
        alert("Produk tidak ditemukan");
        setShowConfirmDialog(false);
        return;
      }
      const result = addToCart(product, 1);
      if (result && result.success) {
        setShowConfirmDialog(false);
        // Navigate ke HomeUser setelah berhasil menambah ke keranjang
        navigate("/");
      } else {
        alert(result?.message || "Gagal menambahkan ke keranjang");
      }
    } catch (err) {
      console.error("Confirm error:", err);
      alert("Terjadi kesalahan");
      setShowConfirmDialog(false);
    }
  };

  const cancelAddToCart = () => {
    setShowConfirmDialog(false);
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
          <Link
            to="/products"
            className="inline-block px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md mx-auto text-center">
          <Package2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Produk tidak ditemukan
          </h1>
          <Link
            to="/products"
            className="inline-block px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dialog */}
        <ConfirmModal
          isOpen={showConfirmDialog}
          onClose={cancelAddToCart}
          onConfirm={confirmAddToCart}
          title="Konfirmasi"
          message="Yakin menambahkan barang ini ke keranjang?"
          confirmText="Ya"
          cancelText="Tidak"
        />

        {/* Product Detail */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
              <img
                src={product.image || ""}
                alt={product.name || "Product"}
                className="w-full h-full object-cover"
                // onError={(e) => {
                //   e.target.src =
                //     "https://via.placeholder.com/500?text=No+Image";
                // }}
              />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {product.name || "Product"}
                </h1>
                <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <span className="text-sm sm:text-base text-gray-500">
                    {product.category || "Category"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    Rp{(product.price || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <span className="text-sm sm:text-base text-gray-600">
                    Stok: {product.stock || 0}
                  </span>
                </div>
                {product.description && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm sm:text-base text-gray-700">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {product.colors &&
                Array.isArray(product.colors) &&
                product.colors.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <span className="font-medium text-sm sm:text-base text-gray-900">
                        Warna:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, idx) => (
                        <button
                          key={color || idx}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-all ${
                            selectedColor === color
                              ? "border-blue-600 scale-110"
                              : "border-gray-200"
                          }`}
                          style={{ backgroundColor: color || "#000000" }}
                          title={color || "Color"}
                        />
                      ))}
                    </div>
                    {selectedColor && (
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">
                        Warna yang dipilih: {selectedColor}
                      </p>
                    )}
                  </div>
                )}

              <div className="pt-4">
                {!user && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-yellow-800">
                      Silakan login terlebih dahulu untuk menambahkan ke
                      keranjang
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!user}
                  className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Tambah ke Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <span className="text-base sm:text-xl">Produk yang mungkin Anda suka</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendedProducts
                .filter((p) => p && p.id)
                .map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden bg-gray-100 aspect-square">
                      <img
                        src={p.image || ""}
                        alt={p.name || "Product"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        // onError={(e) => {
                        //   e.target.src =
                        //     "https://via.placeholder.com/500?text=No+Image";
                        // }}
                      />
                    </div>
                    <div className="p-3 sm:p-4 space-y-2">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm hover:text-blue-600 transition-colors line-clamp-2">
                        {p.name || "Product"}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {p.category || "Category"}
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-blue-600">
                        Rp{(p.price || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Promo Products */}
        {promoProductsList.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              <span className="text-base sm:text-xl">Produk Promo</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {promoProductsList
                .filter((p) => p && p.id && p.originalPrice && p.promoPrice)
                .map((p) => {
                  const discount = calculateDiscount(
                    p.originalPrice,
                    p.promoPrice
                  );
                  return (
                    <Link
                      key={p.id}
                      to={`/promo/${p.id}`}
                      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm shadow-lg flex items-center space-x-1">
                          <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>-{discount}%</span>
                        </div>
                      </div>
                      <div className="relative overflow-hidden bg-gray-100 aspect-square">
                        <img
                          src={p.image || ""}
                          alt={p.name || "Product"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          // onError={(e) => {
                          //   e.target.src =
                          //     "https://via.placeholder.com/500?text=No+Image";
                          // }}
                        />
                      </div>
                      <div className="p-3 sm:p-4 space-y-2">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm hover:text-blue-600 transition-colors line-clamp-2">
                          {p.name || "Product"}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Tag className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {p.category || "Category"}
                          </span>
                        </div>
                        <div className="flex items-end space-x-2">
                          <span className="text-base sm:text-lg font-bold text-red-600">
                            Rp{(p.promoPrice || 0).toLocaleString("id-ID")}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            Rp{(p.originalPrice || 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
