import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  ArrowLeft,
} from "lucide-react";

export default function ProductPromoDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const product = useMemo(() => {
    return promoProducts.find((p) => p.id === Number(id));
  }, [id]);

  const calculateDiscount = (originalPrice, promoPrice) => {
    return Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
  };

  const discount = product
    ? calculateDiscount(product.originalPrice, product.promoPrice)
    : 0;

  const handleAddToCart = () => {
    if (!user) {
      alert(t("mustLoginToAdd") || "Silakan login terlebih dahulu untuk menambahkan ke keranjang");
      navigate("/login");
      return;
    }
    // Tampilkan dialog konfirmasi
    setShowConfirmDialog(true);
  };

  const confirmAddToCart = () => {
    if (!product) return;

    // Buat produk untuk cart dengan harga promo
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.promoPrice, // Gunakan harga promo
      image: product.image,
      category: product.category,
      stock: product.stock,
      originalPrice: product.originalPrice, // Simpan harga asli untuk referensi
      isPromo: true, // Flag untuk menandai ini produk promo
    };

    const result = addToCart(cartProduct, 1);
    if (result.success) {
      setShowConfirmDialog(false);
      // Navigate ke HomeUser setelah berhasil menambah ke keranjang
      navigate("/");
    } else {
      alert(result.message || "Gagal menambahkan ke keranjang");
    }
  };

  const cancelAddToCart = () => {
    setShowConfirmDialog(false);
  };

  // Produk promo lainnya (kecuali produk saat ini)
  const otherPromoProducts = useMemo(() => {
    if (!product) return [];
    return promoProducts
      .filter((p) => p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Produk promo tidak ditemukan
        </h1>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tombol Kembali */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali</span>
      </Link>

      {/* Dialog Konfirmasi */}
      <ConfirmModal
        isOpen={showConfirmDialog}
        onClose={cancelAddToCart}
        onConfirm={confirmAddToCart}
        title="Konfirmasi"
        message="Yakin menambahkan barang ini ke keranjang?"
        confirmText="Ya"
        cancelText="Tidak"
      />

      {/* Detail Produk Promo */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            {/* Badge Diskon */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg flex items-center space-x-1">
                <Percent className="w-5 h-5" />
                <span>-{discount}%</span>
              </div>
            </div>
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  {product.category}
                </span>
              </div>

              {/* Harga */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    Rp{product.promoPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl text-gray-400 line-through">
                    Rp{product.originalPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    Hemat Rp
                    {(product.originalPrice - product.promoPrice).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Package2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {t("stock") || "Stok"}: {product.stock}
                </span>
              </div>

              {/* Deskripsi */}
              {product.description && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Palette className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t("colors") || "Warna"}:
                  </span>
                </div>
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        selectedColor === color
                          ? "border-red-600 dark:border-red-400 scale-110"
                          : "border-gray-200 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t("selectedColor") || "Warna yang dipilih"}: {selectedColor}
                  </p>
                )}
              </div>
            )}

            <div className="pt-4 space-y-3">
              {!user && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {t("mustLoginToAdd") || "Silakan login terlebih dahulu untuk menambahkan ke keranjang"}
                  </p>
                </div>
              )}
              
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!user}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{t("addToCart") || "Tambah ke Keranjang"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Produk Promo Lainnya */}
      {otherPromoProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-red-600" />
            Produk Promo Lainnya
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherPromoProducts.map((p) => {
              const itemDiscount = calculateDiscount(p.originalPrice, p.promoPrice);
              return (
                <Link
                  key={p.id}
                  to={`/promo/${p.id}`}
                  className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center space-x-1">
                      <Percent className="w-4 h-4" />
                      <span>-{itemDiscount}%</span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-2">
                      {p.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex items-end space-x-2">
                      <span className="text-lg font-bold text-red-600">
                        Rp{p.promoPrice.toLocaleString("id-ID")}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        Rp{p.originalPrice.toLocaleString("id-ID")}
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
  );
}

