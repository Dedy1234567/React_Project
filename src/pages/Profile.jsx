import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { initialProducts } from "../data/products";
import Footer from "../components/Footer";
import ConfirmModal from "../components/ConfirmModal";
import {
  User,
  Mail,
  Shield,
  Edit,
  Save,
  X,
  Users,
  Trash2,
  History,
  Package,
  Plus,
  Minus,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  DollarSign,
  MapPin,
  ArrowLeft,
  ShoppingBag,
  Tag,
  Package2,
  CreditCard,
  Wallet,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";

const ADMIN_EMAIL = "dedydarmawan876@gmail.com";

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState(
    user?.role === "admin" ? "manageUser" : "riwayat"
  );
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [address, setAddress] = useState("");
  const [products, setProducts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // "bank" or "cod"
  const [copiedAccount, setCopiedAccount] = useState(false);

  const isAdmin = user?.role === "admin";

  // Ambil semua user untuk admin
  useEffect(() => {
    if (isAdmin) {
      const registeredUsers = JSON.parse(
        localStorage.getItem("ecommerce_registered_users") || "[]"
      );

      // Tambahkan admin ke daftar
      const adminUser = {
        name: "Admin",
        email: ADMIN_EMAIL,
        role: "admin",
        password: "***", // Jangan tampilkan password
      };

      const usersWithAdmin = [
        adminUser,
        ...registeredUsers.map((u) => ({
          ...u,
          password: "***", // Jangan tampilkan password
        })),
      ];

      setAllUsers(usersWithAdmin);
    }
  }, [isAdmin]);

  // Load order history
  useEffect(() => {
    if (user && !isAdmin) {
      const savedOrders = localStorage.getItem(
        `ecommerce_orders_${user.email}`
      );
      if (savedOrders) {
        setOrderHistory(JSON.parse(savedOrders));
      }
    }
  }, [user, isAdmin]);

  // Load provinsi dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ecommerce_provinces");
    if (saved) {
      setProvinces(JSON.parse(saved));
    }
  }, []);

  // Load products untuk rekomendasi
  useEffect(() => {
    if (!isAdmin) {
      const loadProducts = () => {
        const saved = localStorage.getItem("ecommerce_products");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Gunakan produk dari localStorage jika ada, tidak peduli jumlahnya
            // Ini memastikan sinkronisasi dengan perubahan dari halaman lain
            if (parsed && Array.isArray(parsed)) {
              setProducts(parsed);
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

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("productsUpdated", handleProductsUpdated);
      };
    }
  }, [isAdmin]);

  // Reset selected items when cart changes
  useEffect(() => {
    setSelectedItems(new Set());
  }, [cart.length]);

  // Toggle item selection
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
    setProducts(updatedProducts);
    window.dispatchEvent(new Event("productsUpdated"));

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
    setOrderHistory(updatedOrders);
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
    // Alert dihapus, langsung pindah ke tab riwayat
    setActiveTab("riwayat");
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

  // Tidak ada filter search, tampilkan semua users
  const filteredUsers = allUsers;

  const handleDeleteUser = (email) => {
    if (email === ADMIN_EMAIL) {
      alert("Tidak dapat menghapus akun admin!");
      return;
    }

    if (window.confirm(`Yakin ingin menghapus user ${email}?`)) {
      const registeredUsers = JSON.parse(
        localStorage.getItem("ecommerce_registered_users") || "[]"
      );
      const updatedUsers = registeredUsers.filter((u) => u.email !== email);
      localStorage.setItem(
        "ecommerce_registered_users",
        JSON.stringify(updatedUsers)
      );

      // Update state
      setAllUsers((prev) => prev.filter((u) => u.email !== email));
    }
  };

  const handleSave = () => {
    // Update user name (simulasi)
    const updatedUser = { ...user, name };
    localStorage.setItem("ecommerce_user", JSON.stringify(updatedUser));
    setIsEditing(false);
    window.location.reload(); // Refresh untuk update user di context
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setIsEditing(false);
  };

  // Fungsi untuk membatalkan pesanan
  const handleCancelOrder = (orderId) => {
    if (!window.confirm("Yakin ingin membatalkan pesanan ini?")) {
      return;
    }

    // Hapus pesanan dari orderHistory user
    const updatedOrders = orderHistory.filter((o) => o.id !== orderId);
    setOrderHistory(updatedOrders);

    // Update localStorage user
    localStorage.setItem(
      `ecommerce_orders_${user.email}`,
      JSON.stringify(updatedOrders)
    );

    // Trigger storage event untuk update admin panel (jika admin panel listen ke storage event)
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: `ecommerce_orders_${user.email}`,
        newValue: JSON.stringify(updatedOrders),
      })
    );

    // Trigger custom event untuk update admin panel
    window.dispatchEvent(
      new CustomEvent("ordersUpdated", {
        detail: { userEmail: user.email, orderId },
      })
    );

    alert("Pesanan berhasil dibatalkan!");
  };

  // Tampilkan profil dengan tab (untuk semua user termasuk admin)
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        {/* Profile Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Profil Saya
            </h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t("editProfile")}</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t("save")}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t("cancel")}</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{t("name")}</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  />
                ) : (
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {user?.name || "-"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{t("email")}</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  {user?.email || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-gray-50 rounded-lg sm:col-span-2 lg:col-span-1">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{t("role")}</p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  {user?.role === "admin" ? "ADMIN" : "USER"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap space-x-1 px-3 sm:px-6 overflow-x-auto">
              {!isAdmin && (
                <button
                  onClick={() => setActiveTab("riwayat")}
                  className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === "riwayat"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <History className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Pesanan Saya</span>
                  {orderHistory.filter((o) => o.status !== "selesai").length >
                    0 && (
                    <span className="bg-gray-400 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                      {
                        orderHistory.filter((o) => o.status !== "selesai")
                          .length
                      }
                    </span>
                  )}
                </button>
              )}
              {!isAdmin && (
                <button
                  onClick={() => setActiveTab("pembelian")}
                  className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === "pembelian"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Riwayat Pembelian</span>
                  {orderHistory.filter((o) => o.status === "selesai").length >
                    0 && (
                    <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {
                        orderHistory.filter((o) => o.status === "selesai")
                          .length
                      }
                    </span>
                  )}
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setActiveTab("manageUser")}
                  className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === "manageUser"
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Manage User</span>
                  {allUsers.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                      {allUsers.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {/* Riwayat Pemesanan Tab - Hanya menampilkan pesanan yang belum selesai (pending, dalam perjalanan) */}
            {!isAdmin && activeTab === "riwayat" && (
              <div>
                {orderHistory.filter((o) => o.status !== "selesai").length ===
                0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <History className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-500">
                      Belum ada riwayat pemesanan
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Pesanan yang sudah selesai akan muncul di tab Riwayat
                      Pembelian
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {orderHistory
                      .filter((o) => o.status !== "selesai")
                      .map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm sm:text-base text-gray-900">
                                  Pesanan #{order.id}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 flex items-center space-x-1 mt-1">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                                  <span className="truncate">
                                    {new Date(order.date).toLocaleDateString(
                                      "id-ID",
                                      {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div
                                className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                                  order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : order.status === "dalam perjalanan"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {order.status === "pending" ? (
                                  <Clock className="w-3 h-3" />
                                ) : order.status === "dalam perjalanan" ? (
                                  <Truck className="w-3 h-3" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                <span className="capitalize">
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-base sm:text-lg font-bold text-green-600">
                                Rp {order.total.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 font-medium truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-gray-500">
                                      {item.quantity}x Rp{" "}
                                      {item.price.toLocaleString("id-ID")}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-gray-900 text-xs sm:text-sm shrink-0">
                                    Rp{" "}
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString("id-ID")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tombol Batalkan Pesanan - Hanya untuk status pending */}
                          {order.status === "pending" && (
                            <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
                              >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Batalkan Pesanan</span>
                              </button>
                            </div>
                          )}

                          {/* Info untuk pesanan dalam perjalanan */}
                          {order.status === "dalam perjalanan" && (
                            <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                                <p className="text-xs sm:text-sm text-blue-800 flex items-center space-x-2">
                                  <Truck className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                                  <span>
                                    Pesanan sedang dalam perjalanan dan tidak
                                    dapat dibatalkan
                                  </span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Manage User Tab - Hanya untuk admin */}
            {isAdmin && activeTab === "manageUser" && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                          No
                        </th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                          Nama
                        </th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                          Role
                        </th>
                        <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500"
                          >
                            Belum ada user terdaftar
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u, index) => (
                          <tr
                            key={u.email}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-600">
                              {index + 1}
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg shrink-0">
                                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                </div>
                                <span className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                                  {u.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-600 truncate">
                                  {u.email}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                              <span
                                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                  u.role === "admin"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                <Shield className="w-3 h-3 mr-1 shrink-0" />
                                {u.role === "admin" ? "ADMIN" : "USER"}
                              </span>
                            </td>
                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                              <div className="flex items-center justify-center space-x-2">
                                {u.email !== ADMIN_EMAIL && (
                                  <button
                                    onClick={() => handleDeleteUser(u.email)}
                                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus User"
                                  >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                  </button>
                                )}
                                {u.email === ADMIN_EMAIL && (
                                  <span className="text-xs text-gray-500 italic">
                                    Tidak dapat dihapus
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Riwayat Pembelian Tab - Hanya menampilkan order dengan status 'selesai' */}
            {!isAdmin && activeTab === "pembelian" && (
              <div>
                {orderHistory.filter((o) => o.status === "selesai").length ===
                0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-500">
                      Belum ada riwayat pembelian
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Riwayat pembelian hanya menampilkan pesanan yang sudah
                      selesai
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {orderHistory
                      .filter((o) => o.status === "selesai")
                      .map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition bg-green-50/30"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg shrink-0">
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm sm:text-base text-gray-900">
                                  Pesanan #{order.id}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 flex items-center space-x-1 mt-1">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                                  <span className="truncate">
                                    {new Date(order.date).toLocaleDateString(
                                      "id-ID",
                                      {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3" />
                                <span className="capitalize">Selesai</span>
                              </div>
                              <p className="text-base sm:text-lg font-bold text-green-600">
                                Rp {order.total.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 font-medium truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-gray-500">
                                      {item.quantity}x Rp{" "}
                                      {item.price.toLocaleString("id-ID")}
                                    </p>
                                  </div>
                                  <p className="font-semibold text-gray-900 text-xs sm:text-sm shrink-0">
                                    Rp{" "}
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString("id-ID")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Produk yang mungkin Anda suka - Hanya untuk user biasa */}
        {!isAdmin && products.length > 0 && (
          <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  Produk yang Mungkin Anda Suka
                </h2>
              </div>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 text-sm sm:text-base"
              >
                <span>Lihat Semua</span>
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {products
                .sort(() => Math.random() - 0.5)
                .slice(0, 6)
                .map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 sm:p-3">
                      <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-1 mb-1 sm:mb-2">
                        <Tag className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500 truncate">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-sm sm:text-lg font-bold text-blue-600 mb-1">
                        Rp{product.price.toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Package2 className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-500">
                          Stok: {product.stock}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
