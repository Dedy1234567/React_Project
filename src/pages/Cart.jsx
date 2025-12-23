import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { initialProducts } from "../data/products";
import Footer from "../components/Footer";
import ConfirmModal from "../components/ConfirmModal";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  DollarSign,
  MapPin,
  Truck,
  ArrowLeft,
  CreditCard,
  Wallet,
  MessageCircle,
  Copy,
  Check,
  ShoppingBag,
  Tag,
  Package2,
} from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [address, setAddress] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // "bank" or "cod"
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [products, setProducts] = useState([]);

  // Reset selected items when cart changes
  useEffect(() => {
    setSelectedItems(new Set());
  }, [cart.length]);

  // Load provinsi dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ecommerce_provinces");
    if (saved) {
      setProvinces(JSON.parse(saved));
    }
  }, []);

  // Load products untuk cek stok dan rekomendasi
  useEffect(() => {
    const loadProducts = () => {
      const saved = localStorage.getItem("ecommerce_products");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed)) {
            setProducts(parsed);
            return;
          }
        } catch (error) {
          console.error("Error parsing products:", error);
        }
      }
      // Jika localStorage kosong, gunakan initialProducts
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

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("productsUpdated", handleProductsUpdated);
    };
  }, []);

  // Toggle item selection - HANYA dari checkbox
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map((item) => item.id)));
    }
  };

  // Get selected items
  const getSelectedItems = () => {
    return cart.filter((item) => selectedItems.has(item.id));
  };

  // Calculate total for selected items (harga produk saja)
  const getSelectedTotal = () => {
    return getSelectedItems().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Handle update quantity dengan validasi stok dan checkbox
  const handleUpdateQuantity = (itemId, newQuantity) => {
    // Cek apakah item sudah di-checkbox
    if (!selectedItems.has(itemId)) {
      alert("Silakan centang item terlebih dahulu untuk mengubah quantity!");
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(itemId);
      // Hapus dari selected items juga
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      return;
    }

    // Cari item di cart
    const cartItem = cart.find((item) => item.id === itemId);
    if (!cartItem) return;

    // Cari produk di products untuk cek stok
    const product = products.find((p) => p.id === itemId);
    if (product) {
      // Cek apakah stok cukup
      if (newQuantity > product.stock) {
        alert(
          `Stok ${product.name} tidak mencukupi. Stok tersedia: ${product.stock}`
        );
        return;
      }
    }

    // Update quantity jika stok cukup
    updateQuantity(itemId, newQuantity);
  };

  // Get shipping cost berdasarkan provinsi yang dipilih
  const getShippingCost = () => {
    if (!selectedProvince) return 0;
    const province = provinces.find((p) => p.id === parseInt(selectedProvince));
    return province ? province.shippingCost : 0;
  };

  // Calculate grand total (harga produk + ongkir)
  const getGrandTotal = () => {
    return getSelectedTotal() + getShippingCost();
  };

  // Handle checkout - show confirmation modal
  const handleCheckout = () => {
    const selected = getSelectedItems();

    if (selected.length === 0) {
      alert("Pilih minimal satu item untuk checkout!");
      return;
    }

    if (!selectedProvince) {
      alert("Pilih provinsi tujuan pengiriman!");
      return;
    }

    if (!address.trim()) {
      alert("Masukkan alamat pengiriman!");
      return;
    }

    if (!paymentMethod) {
      alert("Pilih metode pembayaran!");
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  // Confirm checkout - process the order
  const confirmCheckout = () => {
    const selected = getSelectedItems();
    const selectedProvinceData = provinces.find(
      (p) => p.id === parseInt(selectedProvince)
    );

    // Cek stok sebelum checkout
    const updatedProducts = [...products];
    let insufficientStock = false;
    const outOfStockItems = [];

    selected.forEach((orderItem) => {
      const productIndex = updatedProducts.findIndex(
        (p) => p.id === orderItem.id
      );

      if (productIndex !== -1) {
        const currentStock = updatedProducts[productIndex].stock || 0;
        const requestedQuantity = orderItem.quantity || 1;

        if (currentStock < requestedQuantity) {
          insufficientStock = true;
          outOfStockItems.push({
            name: orderItem.name,
            requested: requestedQuantity,
            available: currentStock,
          });
        }
      } else {
        insufficientStock = true;
        outOfStockItems.push({
          name: orderItem.name,
          requested: orderItem.quantity || 1,
          available: 0,
        });
      }
    });

    // Jika ada item yang stoknya tidak cukup, tampilkan alert dan batalkan
    if (insufficientStock) {
      const itemsList = outOfStockItems
        .map(
          (item) =>
            `${item.name} (diminta: ${item.requested}, tersedia: ${item.available})`
        )
        .join("\n");
      alert(
        `Gagal checkout! Stok tidak mencukupi untuk:\n${itemsList}\n\nSilakan kurangi quantity atau hapus item yang stoknya tidak mencukupi.`
      );
      setShowConfirmModal(false);
      return;
    }

    // Kurangi stok produk
    selected.forEach((orderItem) => {
      const productIndex = updatedProducts.findIndex(
        (p) => p.id === orderItem.id
      );

      if (productIndex !== -1) {
        const currentStock = updatedProducts[productIndex].stock || 0;
        const requestedQuantity = orderItem.quantity || 1;
        updatedProducts[productIndex].stock = currentStock - requestedQuantity;
      }
    });

    // Simpan produk yang sudah dikurangi stoknya
    localStorage.setItem("ecommerce_products", JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event("productsUpdated"));

    // Simpan order history
    const orderHistory = JSON.parse(
      localStorage.getItem(`ecommerce_orders_${user.email}`) || "[]"
    );

    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...selected],
      subtotal: getSelectedTotal(),
      shippingCost: getShippingCost(),
      total: getGrandTotal(),
      province: selectedProvinceData?.name || "",
      address: address.trim(),
      paymentMethod: paymentMethod, // "bank" or "cod"
      status: "pending",
    };

    const updatedOrders = [newOrder, ...orderHistory];
    localStorage.setItem(
      `ecommerce_orders_${user.email}`,
      JSON.stringify(updatedOrders)
    );

    // Remove selected items from cart
    selected.forEach((item) => {
      removeFromCart(item.id);
    });

    setSelectedItems(new Set());
    setSelectedProvince("");
    setAddress("");
    setPaymentMethod("");
    setShowConfirmModal(false);
    // Alert dihapus, langsung navigate ke profile
    navigate("/profile");
  };

  // Copy bank account number
  const copyAccountNumber = () => {
    const accountNumber = "1234567890123456";
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Open WhatsApp for payment confirmation
  const openWhatsApp = () => {
    const message = `Halo, saya ingin konfirmasi pembayaran untuk pesanan dengan total Rp${getGrandTotal().toLocaleString(
      "id-ID"
    )}`;
    const whatsappUrl = `https://wa.me/6282360223309?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // Cancel checkout
  const cancelCheckout = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={cancelCheckout}
        onConfirm={confirmCheckout}
        title="Konfirmasi Pemesanan"
        message="Anda yakin ingin memesan product ini?"
        confirmText="Ya"
        cancelText="Tidak"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tombol Back */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Kembali</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("cart")}
            </h1>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg mb-4">
                {t("emptyCart")}
              </p>
              <Link
                to="/products"
                className="inline-block px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
              >
                Mulai Berbelanja
              </Link>
            </div>
          ) : (
            <>
              {/* Select All Button */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.size === cart.length && cart.length > 0
                    }
                    onChange={selectAllItems}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Pilih Semua ({selectedItems.size}/{cart.length})
                  </span>
                </label>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border ${
                      selectedItems.has(item.id)
                        ? "bg-green-50 border-green-300"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {/* Checkbox dan Image */}
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleItemSelection(item.id);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer shrink-0"
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 sm:hidden">
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    
                    {/* Info Produk - Desktop */}
                    <div className="flex-1 hidden sm:block">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.category}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-gray-600">
                          Harga satuan: Rp{item.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity} × Rp
                          {item.price.toLocaleString("id-ID")}
                        </p>
                        {(() => {
                          const product = products.find(
                            (p) => p.id === item.id
                          );
                          return product ? (
                            <p className="text-xs text-gray-500">
                              Stok tersedia: {product.stock}
                            </p>
                          ) : null;
                        })()}
                        <p className="text-sm sm:text-base font-bold text-green-600 mt-1">
                          Subtotal: Rp
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    
                    {/* Info Produk - Mobile */}
                    <div className="flex-1 sm:hidden w-full pl-11">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">
                          Harga: Rp{item.price.toLocaleString("id-ID")}
                        </p>
                        {(() => {
                          const product = products.find(
                            (p) => p.id === item.id
                          );
                          return product ? (
                            <p className="text-xs text-gray-500">
                              Stok: {product.stock}
                            </p>
                          ) : null;
                        })()}
                        <p className="text-sm font-bold text-green-600">
                          Subtotal: Rp
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-center w-full sm:w-auto gap-2 sm:space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          data-quantity-button="minus"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdateQuantity(item.id, item.quantity - 1);
                          }}
                          disabled={!selectedItems.has(item.id)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                            selectedItems.has(item.id)
                              ? "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                              : "bg-gray-100 opacity-50 cursor-not-allowed"
                          }`}
                          title={
                            selectedItems.has(item.id)
                              ? "Kurangi quantity"
                              : "Centang item terlebih dahulu"
                          }
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <span className="w-8 sm:w-12 text-center font-semibold text-sm sm:text-base text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          data-quantity-button="plus"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdateQuantity(item.id, item.quantity + 1);
                          }}
                          disabled={!selectedItems.has(item.id)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                            selectedItems.has(item.id)
                              ? "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                              : "bg-gray-100 opacity-50 cursor-not-allowed"
                          }`}
                          title={
                            selectedItems.has(item.id)
                              ? "Tambah quantity"
                              : "Centang item terlebih dahulu"
                          }
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Pengiriman */}
              {selectedItems.size > 0 && (
                <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    <span>Informasi Pengiriman</span>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Pilih Provinsi
                      </label>
                      <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="">-- Pilih Provinsi --</option>
                        {provinces.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.name} - Rp{" "}
                            {province.shippingCost.toLocaleString("id-ID")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Alamat Lengkap
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Masukkan alamat lengkap pengiriman"
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Metode Pembayaran */}
              {selectedItems.size > 0 && selectedProvince && address.trim() && (
                <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span>Metode Pembayaran</span>
                  </h3>
                  <div className="space-y-3">
                    {/* Bank Transfer Option */}
                    <label
                      className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                      style={{
                        borderColor:
                          paymentMethod === "bank" ? "#10b981" : "#e5e7eb",
                        backgroundColor:
                          paymentMethod === "bank" ? "#f0fdf4" : "transparent",
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          <span className="font-semibold text-sm sm:text-base text-gray-900">
                            Transfer Bank
                          </span>
                        </div>
                        {paymentMethod === "bank" && (
                          <div className="mt-3 p-3 sm:p-4 bg-white rounded-lg border border-green-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">
                              Silakan transfer ke rekening berikut:
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm text-gray-700">
                                  Bank: BCA
                                </span>
                              </div>
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="text-xs sm:text-sm text-gray-700">
                                  No. Rekening:
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono font-semibold text-xs sm:text-sm text-gray-900">
                                    1234567890123456
                                  </span>
                                  <button
                                    onClick={copyAccountNumber}
                                    className="p-1.5 hover:bg-gray-100 rounded transition"
                                    title="Salin nomor rekening"
                                  >
                                    {copiedAccount ? (
                                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm text-gray-700">
                                  Atas Nama: Zeluxe Store
                                </span>
                              </div>
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-2">
                                  Setelah transfer, konfirmasi pembayaran via
                                  WhatsApp:
                                </p>
                                <button
                                  onClick={openWhatsApp}
                                  className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-xs sm:text-sm"
                                >
                                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>Konfirmasi via WhatsApp</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* COD Option */}
                    <label
                      className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                      style={{
                        borderColor:
                          paymentMethod === "cod" ? "#10b981" : "#e5e7eb",
                        backgroundColor:
                          paymentMethod === "cod" ? "#f0fdf4" : "transparent",
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                          <span className="font-semibold text-sm sm:text-base text-gray-900">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        {paymentMethod === "cod" && (
                          <p className="mt-2 text-xs sm:text-sm text-gray-600">
                            Bayar saat barang diterima. Ongkir akan ditambahkan
                            ke total pembayaran.
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Subtotal ({selectedItems.size} item):
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    Rp{getSelectedTotal().toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Ongkir */}
                {selectedProvince && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-gray-600 flex items-center space-x-1">
                      <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Ongkir:</span>
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-gray-900">
                      Rp{getShippingCost().toLocaleString("id-ID")}
                    </span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    <span className="text-lg sm:text-xl font-semibold text-gray-900">
                      Total:
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">
                    Rp{getGrandTotal().toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    selectedItems.size === 0 ||
                    !selectedProvince ||
                    !address.trim() ||
                    !paymentMethod
                  }
                  className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm sm:text-base ${
                    selectedItems.size === 0 ||
                    !selectedProvince ||
                    !address.trim() ||
                    !paymentMethod
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  }`}
                >
                  {selectedItems.size === 0
                    ? "Pilih item untuk checkout"
                    : !selectedProvince
                    ? "Pilih provinsi tujuan"
                    : !address.trim()
                    ? "Masukkan alamat pengiriman"
                    : !paymentMethod
                    ? "Pilih metode pembayaran"
                    : t("checkout")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Produk yang mungkin Anda suka */}
      {products.length > 0 && (
        <div className="mt-12 bg-white bg-gray-800 rounded-2xl shadow-lg border border-gray-200 border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-blue-600 text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 text-white">
                Produk yang Mungkin Anda Suka
              </h2>
            </div>
            <Link
              to="/products"
              className="text-blue-600 text-blue-400 hover:text-blue-700 hover:text-blue-300 font-medium flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products
              .sort(() => Math.random() - 0.5)
              .slice(0, 6)
              .map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 border-gray-600"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50 bg-gray-600">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 text-white mb-1 line-clamp-2 group-hover:text-blue-600 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 text-gray-400">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-600 text-blue-400 mb-1">
                      Rp{product.price.toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Package2 className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 text-gray-400">
                        Stok: {product.stock}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
