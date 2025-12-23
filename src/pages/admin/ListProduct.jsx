import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initialProducts } from "../../data/products";
import {
  Plus,
  Users,
  Package,
  Truck,
  History,
  MapPin,
  UserPlus,
  Tag,
  ArrowLeft,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Package2,
  Palette,
  ChevronDown,
  X,
  Save,
  Calendar,
  CheckCircle,
  User as UserIcon,
} from "lucide-react";

export default function ListProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    colors: "",
  });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isFormCategoryDropdownOpen, setIsFormCategoryDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [showShippingManagement, setShowShippingManagement] = useState(false);
  const [showCourierManagement, setShowCourierManagement] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [editingProvince, setEditingProvince] = useState(null);
  const [newProvince, setNewProvince] = useState({
    name: "",
    shippingCost: "",
  });
  const [couriers, setCouriers] = useState([]);
  const [newCourier, setNewCourier] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editingCourier, setEditingCourier] = useState(null);

  // Pastikan user adalah admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  // Sinkronkan route dengan state section yang ditampilkan
  useEffect(() => {
    const path = location.pathname;
    if (path === "/admin/provinsi-ongkir") {
      setShowShippingManagement(true);
      setShowSalesHistory(false);
      setShowCourierManagement(false);
    } else if (path === "/admin/riwayat-penjualan") {
      setShowSalesHistory(true);
      setShowShippingManagement(false);
      setShowCourierManagement(false);
    } else if (path === "/admin/manajemen-kurir") {
      setShowCourierManagement(true);
      setShowSalesHistory(false);
      setShowShippingManagement(false);
    } else if (path === "/admin/list-product") {
      setShowSalesHistory(false);
      setShowShippingManagement(false);
      setShowCourierManagement(false);
    }
  }, [location.pathname]);

  // Load products
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
      if (!saved) {
        setProducts(initialProducts);
        localStorage.setItem(
          "ecommerce_products",
          JSON.stringify(initialProducts)
        );
      }
    };

    loadProducts();

    const handleStorageChange = (e) => {
      if (e.key === "ecommerce_products") {
        loadProducts();
      }
    };

    const handleProductsUpdated = () => {
      if (!isUpdating) {
        loadProducts();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("productsUpdated", handleProductsUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("productsUpdated", handleProductsUpdated);
    };
  }, [isUpdating]);

  // Load categories
  useEffect(() => {
    const loadCategories = () => {
      const savedCategories = localStorage.getItem("ecommerce_categories");
      if (savedCategories) {
        try {
          const parsed = JSON.parse(savedCategories);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
            return;
          }
        } catch (error) {
          console.error("Error parsing categories:", error);
        }
      }
      const defaultCategories = [
        ...new Set(initialProducts.map((p) => p.category)),
      ];
      setCategories(defaultCategories);
    };

    loadCategories();

    const handleCategoriesUpdated = () => {
      loadCategories();
    };

    window.addEventListener("categoriesUpdated", handleCategoriesUpdated);

    return () => {
      window.removeEventListener("categoriesUpdated", handleCategoriesUpdated);
    };
  }, []);

  // Load provinces
  useEffect(() => {
    const savedProvinces = localStorage.getItem("ecommerce_provinces");
    if (savedProvinces) {
      try {
        const parsed = JSON.parse(savedProvinces);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProvinces(parsed);
          return;
        }
      } catch (error) {
        console.error("Error parsing provinces:", error);
      }
    }
  }, []);

  // Load couriers
  useEffect(() => {
    const savedCouriers = localStorage.getItem("ecommerce_couriers");
    if (savedCouriers) {
      try {
        const parsed = JSON.parse(savedCouriers);
        if (Array.isArray(parsed)) {
          setCouriers(parsed);
        }
      } catch (error) {
        console.error("Error parsing couriers:", error);
      }
    }
  }, []);

  // Load all orders
  useEffect(() => {
    const loadAllOrders = () => {
      const registeredUsers = JSON.parse(
        localStorage.getItem("ecommerce_registered_users") || "[]"
      );
      const allOrdersList = [];

      registeredUsers.forEach((registeredUser) => {
        const userOrders = JSON.parse(
          localStorage.getItem(`ecommerce_orders_${registeredUser.email}`) || "[]"
        );
        userOrders.forEach((order) => {
          allOrdersList.push({
            ...order,
            userEmail: registeredUser.email,
            userName: registeredUser.name,
          });
        });
      });

      allOrdersList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllOrders(allOrdersList);
    };

    loadAllOrders();
    if (showSalesHistory) {
      const interval = setInterval(loadAllOrders, 2000);
      return () => clearInterval(interval);
    }
  }, [showSalesHistory]);

  // Hitung jumlah pesanan yang belum selesai (untuk badge Status Pemesanan)
  const pendingOrdersCount = useMemo(() => {
    return allOrders.filter((o) => o.status !== "selesai").length;
  }, [allOrders]);

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
      image: "",
      colors: "",
    });
    setEditingId(null);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);
    const colorsArray = form.colors.trim()
      ? form.colors.split(",").map((c) => c.trim())
      : [];

    if (!form.name || !form.category || !price || !stock) {
      alert("Semua field harus diisi!");
      return;
    }

    if (editingId) {
      setIsUpdating(true);
      const updatedProducts = products.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: form.name,
              category: form.category,
              price,
              stock,
              image: form.image || p.image,
              colors: colorsArray,
            }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem(
        "ecommerce_products",
        JSON.stringify(updatedProducts)
      );
      setTimeout(() => {
        setIsUpdating(false);
      }, 100);
      window.dispatchEvent(new Event("productsUpdated"));
      alert("Produk berhasil diupdate!");
      resetForm();
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || "",
      colors: product.colors ? product.colors.join(", ") : "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus produk ini?")) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem(
        "ecommerce_products",
        JSON.stringify(updatedProducts)
      );
      window.dispatchEvent(new Event("productsUpdated"));
      alert("Produk berhasil dihapus!");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let data = [...products];
    if (search) {
      const keyword = search.toLowerCase();
      data = data.filter((p) => p.name.toLowerCase().includes(keyword));
    }
    if (categoryFilter !== "all") {
      data = data.filter((p) => p.category === categoryFilter);
    }
    if (sortBy === "name-asc")
      data.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "price-asc") data.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") data.sort((a, b) => b.price - a.price);
    return data;
  }, [products, search, categoryFilter, sortBy]);

  const categoriesList = useMemo(() => {
    return ["all", ...categories];
  }, [categories]);

  // Handler functions untuk toggle sections dengan routing
  const handleToggleSalesHistory = () => {
    if (showSalesHistory) {
      navigate("/admin/list-product");
    } else {
      navigate("/admin/riwayat-penjualan");
    }
  };

  const handleToggleShippingManagement = () => {
    if (showShippingManagement) {
      navigate("/admin/list-product");
    } else {
      navigate("/admin/provinsi-ongkir");
    }
  };

  const handleToggleCourierManagement = () => {
    if (showCourierManagement) {
      navigate("/admin/list-product");
    } else {
      navigate("/admin/manajemen-kurir");
    }
  };

  // CRUD Functions untuk Provinsi
  const handleAddProvince = () => {
    if (!newProvince.name || !newProvince.shippingCost) {
      alert("Nama provinsi dan harga ongkir harus diisi!");
      return;
    }

    const province = {
      id: Date.now(),
      name: newProvince.name,
      shippingCost: parseInt(newProvince.shippingCost),
    };

    const updatedProvinces = [...provinces, province];
    setProvinces(updatedProvinces);
    localStorage.setItem(
      "ecommerce_provinces",
      JSON.stringify(updatedProvinces)
    );
    setNewProvince({ name: "", shippingCost: "" });
    alert("Provinsi berhasil ditambahkan!");
  };

  const handleEditProvince = (province) => {
    setEditingProvince({ ...province });
  };

  const handleSaveProvinceEdit = () => {
    if (!editingProvince.name || !editingProvince.shippingCost) {
      alert("Nama provinsi dan harga ongkir harus diisi!");
      return;
    }

    const updatedProvinces = provinces.map((p) =>
      p.id === editingProvince.id
        ? {
            ...p,
            name: editingProvince.name,
            shippingCost: parseInt(editingProvince.shippingCost),
          }
        : p
    );

    setProvinces(updatedProvinces);
    localStorage.setItem(
      "ecommerce_provinces",
      JSON.stringify(updatedProvinces)
    );
    setEditingProvince(null);
    alert("Provinsi berhasil diupdate!");
  };

  const handleDeleteProvince = (id) => {
    if (window.confirm("Yakin ingin menghapus provinsi ini?")) {
      const updatedProvinces = provinces.filter((p) => p.id !== id);
      setProvinces(updatedProvinces);
      localStorage.setItem(
        "ecommerce_provinces",
        JSON.stringify(updatedProvinces)
      );
      alert("Provinsi berhasil dihapus!");
    }
  };

  // CRUD Functions untuk Kurir
  const handleAddCourier = () => {
    if (!newCourier.name || !newCourier.email || !newCourier.password) {
      alert("Nama, email, dan password harus diisi!");
      return;
    }

    const existingCourier = couriers.find((c) => c.email === newCourier.email);
    if (existingCourier) {
      alert("Email kurir sudah terdaftar!");
      return;
    }

    const courier = {
      id: Date.now(),
      name: newCourier.name,
      email: newCourier.email,
      password: newCourier.password,
      role: "kurir",
    };

    const updatedCouriers = [...couriers, courier];
    setCouriers(updatedCouriers);
    localStorage.setItem("ecommerce_couriers", JSON.stringify(updatedCouriers));
    setNewCourier({ name: "", email: "", password: "" });
    alert("Kurir berhasil ditambahkan!");
  };

  const handleEditCourier = (courier) => {
    setEditingCourier({ ...courier });
  };

  const handleSaveCourierEdit = () => {
    if (
      !editingCourier.name ||
      !editingCourier.email ||
      !editingCourier.password
    ) {
      alert("Nama, email, dan password harus diisi!");
      return;
    }

    const updatedCouriers = couriers.map((c) =>
      c.id === editingCourier.id
        ? {
            ...c,
            name: editingCourier.name,
            email: editingCourier.email,
            password: editingCourier.password,
          }
        : c
    );

    setCouriers(updatedCouriers);
    localStorage.setItem("ecommerce_couriers", JSON.stringify(updatedCouriers));
    setEditingCourier(null);
    alert("Kurir berhasil diupdate!");
  };

  const handleDeleteCourier = (id) => {
    if (window.confirm("Yakin ingin menghapus kurir ini?")) {
      const updatedCouriers = couriers.filter((c) => c.id !== id);
      setCouriers(updatedCouriers);
      localStorage.setItem(
        "ecommerce_couriers",
        JSON.stringify(updatedCouriers)
      );
      alert("Kurir berhasil dihapus!");
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] max-w-7xl mx-auto pt-5 px-4 lg:px-0 flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Sidebar kiri */}
      <aside className="w-full lg:w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex-shrink-0 mb-4 lg:mb-0 flex flex-col overflow-hidden">
        <nav className="flex-1 p-4 space-y-2 pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/add-product")}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Barang</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <Users className="w-4 h-4" />
            <span>Manage User</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/list-product")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === "/admin/list-product"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>List Product</span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin", { state: { openSection: "order-status" } })
            }
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <div className="flex items-center space-x-3">
              <Truck className="w-4 h-4" />
              <span>Status Pemesanan</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleToggleSalesHistory}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === "/admin/riwayat-penjualan"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Penjualan</span>
          </button>

          <button
            type="button"
            onClick={handleToggleShippingManagement}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === "/admin/provinsi-ongkir"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Provinsi & Ongkir</span>
          </button>

          <button
            type="button"
            onClick={handleToggleCourierManagement}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === "/admin/manajemen-kurir"
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Manajemen Kurir</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <Tag className="w-4 h-4" />
            <span>Manajemen Kategori</span>
          </button>
        </nav>
      </aside>

      {/* Konten utama */}
      <main className="flex-1 space-y-6 min-w-0">
        {/* Riwayat Penjualan */}
        {location.pathname === "/admin/riwayat-penjualan" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Riwayat Penjualan
              </h2>
            </div>

            {allOrders.filter((o) => o.status === "selesai").length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Belum ada riwayat penjualan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {allOrders
                  .filter((o) => o.status === "selesai")
                  .map((order) => (
                    <div
                      key={`${order.id}-${order.userEmail}`}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition bg-green-50/30 dark:bg-green-900/10"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <UserIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {order.userName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {order.userEmail}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <Package className="w-4 h-4" />
                            <span>Pesanan #{order.id}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="w-4 h-4" />
                            <span>
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
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="w-3 h-3" />
                            <span className="capitalize">Selesai</span>
                          </div>
                          <div className="text-right">
                            {order.subtotal && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Subtotal: Rp{" "}
                                {order.subtotal.toLocaleString("id-ID")}
                              </p>
                            )}
                            {order.shippingCost && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Ongkir: Rp{" "}
                                {order.shippingCost.toLocaleString("id-ID")}
                              </p>
                            )}
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              Total: Rp {order.total.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-3 text-sm"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-gray-900 dark:text-white font-medium">
                                  {item.name}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                  {item.quantity}x Rp{" "}
                                  {item.price.toLocaleString("id-ID")}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                Rp{" "}
                                {(item.price * item.quantity).toLocaleString(
                                  "id-ID"
                                )}
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

        {/* Manajemen Provinsi & Ongkir */}
        {location.pathname === "/admin/provinsi-ongkir" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/admin/list-product")}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Kembali"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Manajemen Provinsi & Ongkir
                  </h2>
                </div>
              </div>
            </div>

            {/* Form Tambah Provinsi */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tambah Provinsi Baru
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Provinsi
                  </label>
                  <input
                    type="text"
                    value={newProvince.name}
                    onChange={(e) =>
                      setNewProvince({
                        ...newProvince,
                        name: e.target.value,
                      })
                    }
                    placeholder="Contoh: DKI Jakarta"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Harga Ongkir (Rp)
                  </label>
                  <input
                    type="number"
                    value={newProvince.shippingCost}
                    onChange={(e) =>
                      setNewProvince({
                        ...newProvince,
                        shippingCost: e.target.value,
                      })
                    }
                    placeholder="Contoh: 15000"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddProvince}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Daftar Provinsi */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daftar Provinsi ({provinces.length})
              </h3>
              {provinces.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Belum ada provinsi yang ditambahkan
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {provinces.map((province) => (
                    <div
                      key={province.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition"
                    >
                      {editingProvince?.id === province.id ? (
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <input
                              type="text"
                              value={editingProvince.name}
                              onChange={(e) =>
                                setEditingProvince({
                                  ...editingProvince,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              value={editingProvince.shippingCost}
                              onChange={(e) =>
                                setEditingProvince({
                                  ...editingProvince,
                                  shippingCost: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleSaveProvinceEdit}
                              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <Save className="w-4 h-4" />
                              <span>Simpan</span>
                            </button>
                            <button
                              onClick={() => setEditingProvince(null)}
                              className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                            >
                              <X className="w-4 h-4" />
                              <span>Batal</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {province.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Ongkir: Rp{" "}
                                  {province.shippingCost.toLocaleString(
                                    "id-ID"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditProvince(province)}
                              className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProvince(province.id)}
                              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manajemen Kurir */}
        {location.pathname === "/admin/manajemen-kurir" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Manajemen Kurir
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Daftarkan dan kelola kurir untuk pengiriman barang
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/admin/list-product")}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            </div>

            {/* Form Tambah Kurir */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tambah Kurir Baru
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Kurir
                  </label>
                  <input
                    type="text"
                    value={newCourier.name}
                    onChange={(e) =>
                      setNewCourier({ ...newCourier, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Masukkan nama kurir"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCourier.email}
                    onChange={(e) =>
                      setNewCourier({
                        ...newCourier,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Masukkan email kurir"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newCourier.password}
                    onChange={(e) =>
                      setNewCourier({
                        ...newCourier,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Masukkan password"
                  />
                </div>
              </div>
              <button
                onClick={handleAddCourier}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kurir</span>
              </button>
            </div>

            {/* Daftar Kurir */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daftar Kurir ({couriers.length})
              </h3>
              {couriers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <UserPlus className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Belum ada kurir terdaftar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {couriers.map((courier) => (
                    <div
                      key={courier.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      {editingCourier?.id === courier.id ? (
                        <>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              value={editingCourier.name}
                              onChange={(e) =>
                                setEditingCourier({
                                  ...editingCourier,
                                  name: e.target.value,
                                })
                              }
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                            <input
                              type="email"
                              value={editingCourier.email}
                              onChange={(e) =>
                                setEditingCourier({
                                  ...editingCourier,
                                  email: e.target.value,
                                })
                              }
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                            <input
                              type="password"
                              value={editingCourier.password}
                              onChange={(e) =>
                                setEditingCourier({
                                  ...editingCourier,
                                  password: e.target.value,
                                })
                              }
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Password baru"
                            />
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={handleSaveCourierEdit}
                              className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                              title="Simpan"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCourier(null)}
                              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              title="Batal"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {courier.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {courier.email}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditCourier(courier)}
                              className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourier(courier.id)}
                              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter & Search - Hanya tampil jika tidak ada section lain yang aktif */}
        {location.pathname === "/admin/list-product" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Filter & Pencarian
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-left flex items-center justify-between shadow-sm hover:border-blue-500"
              >
                <span className="text-gray-900 dark:text-white font-medium">
                  {categoryFilter === "all"
                    ? "Semua Kategori"
                    : categoryFilter}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isCategoryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                  />
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategoryFilter(cat);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          categoryFilter === cat
                            ? "bg-blue-600 text-white"
                            : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {cat === "all" ? "Semua Kategori" : cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="name-asc">Nama A-Z</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </div>
            </div>
          )}

        {/* Edit Form Modal - Hanya tampil jika tidak ada section lain yang aktif */}
        {location.pathname === "/admin/list-product" &&
          editingId && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Produk
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Package className="absolute left-3 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama produk"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="relative">
                  <Tag className="absolute left-3 top-4 w-5 h-5 text-gray-400 dark:text-gray-500 z-10" />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsFormCategoryDropdownOpen(!isFormCategoryDropdownOpen)
                      }
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-left flex items-center justify-between"
                    >
                      <span
                        className={
                          form.category
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      >
                        {form.category || "Pilih Kategori"}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          isFormCategoryDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isFormCategoryDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsFormCategoryDropdownOpen(false)}
                        />
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setForm({ ...form, category: cat });
                                setIsFormCategoryDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                                form.category === cat
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="number"
                    name="price"
                    placeholder="Harga"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="relative">
                  <Package2 className="absolute left-3 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stok"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Foto Produk
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 dark:file:bg-blue-900 file:text-blue-800 dark:file:text-blue-200 hover:file:bg-blue-200 dark:hover:file:bg-blue-800"
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mt-4 w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                )}
              </div>
              <div className="relative">
                <Palette className="absolute left-3 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  name="colors"
                  placeholder="Warna (pisah koma, ex: #000000, #ffffff)"
                  value={form.colors}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Update Produk
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
          )}

        {/* List Produk - Hanya tampil jika tidak ada section lain yang aktif */}
        {location.pathname === "/admin/list-product" && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Daftar Produk ({filteredAndSorted.length})
            </h2>
          </div>
          {filteredAndSorted.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Tidak ada produk ditemukan
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSorted.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 overflow-hidden group"
                >
                  <Link
                    to={`/products/${p.id}`}
                    className="block aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-4 space-y-3">
                    <Link to={`/products/${p.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-2">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      Rp{p.price.toLocaleString("id-ID")}
                    </p>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        {p.category}
                      </span>
                      <span className="flex items-center gap-2">
                        <Package2 className="w-4 h-4" />
                        Stok: {p.stock}
                      </span>
                    </div>
                    {p.colors && p.colors.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-gray-500" />
                        <div className="flex gap-2">
                          {p.colors.map((color) => (
                            <div
                              key={color}
                              className="w-6 h-6 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
            </div>
          )}
      </main>
    </div>
  );
}

