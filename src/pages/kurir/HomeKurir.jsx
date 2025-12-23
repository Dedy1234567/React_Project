import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/ConfirmModal";
import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Calendar,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeKurir() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("dalam perjalanan"); // Filter default: hanya pesanan dalam perjalanan
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fungsi untuk memuat semua order dengan status "dalam perjalanan"
  const loadOrders = () => {
    const registeredUsers = JSON.parse(
      localStorage.getItem("ecommerce_registered_users") || "[]"
    );
    const ordersList = [];

    // Ambil order dari setiap user
    registeredUsers.forEach((registeredUser) => {
      const userOrders = JSON.parse(
        localStorage.getItem(`ecommerce_orders_${registeredUser.email}`) || "[]"
      );
      // Tambahkan informasi user ke setiap order
      userOrders.forEach((order) => {
        ordersList.push({
          ...order,
          userEmail: registeredUser.email,
          userName: registeredUser.name,
        });
      });
    });

    // Filter hanya pesanan dengan status "dalam perjalanan"
    const filteredOrders = ordersList.filter(
      (order) => order.status === filterStatus
    );

    // Sort berdasarkan tanggal (terbaru dulu)
    filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllOrders(filteredOrders);
  };

  useEffect(() => {
    loadOrders();
    // Refresh setiap 3 detik untuk update real-time
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, [filterStatus]);

  // Fungsi untuk mengkonfirmasi penerimaan barang
  const handleConfirmDelivery = (order) => {
    if (
      window.confirm(
        `Konfirmasi penerimaan barang untuk pesanan #${order.id} dari ${order.userName}?`
      )
    ) {
      // Ambil semua order dari user tersebut
      const userOrders = JSON.parse(
        localStorage.getItem(`ecommerce_orders_${order.userEmail}`) || "[]"
      );

      // Update status order menjadi "selesai"
      const updatedOrders = userOrders.map((o) =>
        o.id === order.id ? { ...o, status: "selesai" } : o
      );

      // Simpan kembali ke localStorage
      localStorage.setItem(
        `ecommerce_orders_${order.userEmail}`,
        JSON.stringify(updatedOrders)
      );

      // Reload orders
      loadOrders();

      alert("Barang berhasil dikonfirmasi diterima!");
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Navigate dulu ke home, baru logout untuk menghindari redirect ke login
    navigate("/", { replace: true });
    // Lalu logout setelah navigate
    setTimeout(() => {
      logout();
    }, 100);
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Logout"
        message="Anda yakin ingin keluar?"
        confirmText="Ya"
        cancelText="Tidak"
      />
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard Kurir
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Halo, {user?.name || "Kurir"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="dalam perjalanan">Dalam Perjalanan</option>
              <option value="selesai">Selesai</option>
              <option value="pending">Pending</option>
              <option value="all">Semua</option>
            </select>
            <div className="flex-1"></div>
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg font-semibold">
              {allOrders.length} Pesanan
            </div>
          </div>
        </div>

        {/* Daftar Pesanan */}
        <div className="space-y-4">
          {allOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Tidak ada pesanan dengan status "{filterStatus}"
              </p>
            </div>
          ) : (
            allOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        Pesanan #{order.id}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Pemesan: {order.userName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(order.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : order.status === "dalam perjalanan"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {order.status === "pending" ? (
                      <Clock className="w-3 h-3" />
                    ) : order.status === "dalam perjalanan" ? (
                      <Truck className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3" />
                    )}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>

                {/* Informasi Pengiriman */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Informasi Pengiriman</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Provinsi:
                      </span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {order.province || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Alamat:
                      </span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {order.address || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Daftar Barang */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Daftar Barang:
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.quantity}x Rp{" "}
                            {item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Rp{" "}
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Subtotal:
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Rp{(order.subtotal || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                  {order.shippingCost && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                        <Truck className="w-4 h-4" />
                        <span>Ongkir:</span>
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        Rp{order.shippingCost.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <span className="text-xl font-semibold text-gray-900 dark:text-white">
                        Total:
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Rp{(order.total || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Tombol Konfirmasi */}
                {order.status === "dalam perjalanan" && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleConfirmDelivery(order)}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Konfirmasi Barang Diterima</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
