import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { initialProducts } from "../../data/products";
import {
  ShoppingBag,
  Plus,
  Users,
  Package,
  TrendingUp,
  PackageCheck,
  BarChart3,
  AlertTriangle,
  DollarSign,
  Truck,
  Clock,
  CheckCircle,
  Send,
  Calendar,
  User as UserIcon,
  ClipboardList,
  MapPin,
  Edit,
  Trash2,
  X,
  Save,
  ArrowLeft,
  UserPlus,
  Tag,
  ChevronDown,
  History,
  Search,
  Menu,
} from "lucide-react";

export default function HomeAdmin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [showShippingManagement, setShowShippingManagement] = useState(false);
  const [showCourierManagement, setShowCourierManagement] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
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
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryOld, setEditingCategoryOld] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Baca state dari navigasi (misalnya dari AddProduct/ListProduct) untuk buka panel tertentu
  useEffect(() => {
    const state = location.state;
    if (!state || !state.openSection) return;

    const section = state.openSection;
    if (section === "order-status") {
      setShowOrderStatus(true);
      setShowSalesHistory(false);
      setShowShippingManagement(false);
      setShowCourierManagement(false);
      setShowCategoryManagement(false);
    }
  }, [location.state]);

  // Pastikan history stack benar saat pertama kali masuk ke /admin
  useEffect(() => {
    // Jika user adalah admin dan berada di /admin, pastikan history stack benar
    if (user && user.role === "admin") {
      // Pastikan entry saat ini adalah /admin dengan state yang benar
      // Ini memastikan back button tidak kembali ke home user
      if (window.location.pathname === "/admin") {
        // Replace current entry untuk memastikan state sudah benar
        window.history.replaceState(
          { adminPage: true, timestamp: Date.now() },
          "",
          "/admin"
        );
      }
    }
  }, [user]);

  // Handle browser back button saat di manajemen provinsi atau status pemesanan
  useEffect(() => {
    const handlePopState = (e) => {
      // Jika back button diklik dan kita di manajemen provinsi,
      // tutup manajemen provinsi dan kembali ke dashboard
      if (showShippingManagement) {
        setShowShippingManagement(false);
        // Pastikan kita tetap di /admin
        window.history.replaceState(
          { adminPage: true, dashboard: true },
          "",
          "/admin"
        );
      }

      // Jika back button diklik dan kita di status pemesanan,
      // tutup status pemesanan dan kembali ke dashboard
      if (showOrderStatus) {
        setShowOrderStatus(false);
        // Pastikan kita tetap di /admin
        window.history.replaceState(
          { adminPage: true, dashboard: true },
          "",
          "/admin"
        );
      }

      // Jika back button diklik dan kita di riwayat penjualan,
      // tutup riwayat penjualan dan kembali ke dashboard
      if (showSalesHistory) {
        setShowSalesHistory(false);
        // Pastikan kita tetap di /admin
        window.history.replaceState(
          { adminPage: true, dashboard: true },
          "",
          "/admin"
        );
      }

      // Jika back button diklik dan kita di manajemen kurir,
      // tutup manajemen kurir dan kembali ke dashboard
      if (showCourierManagement) {
        setShowCourierManagement(false);
        // Pastikan kita tetap di /admin
        window.history.replaceState(
          { adminPage: true, dashboard: true },
          "",
          "/admin"
        );
      }

      // Jika back button diklik dan kita di manajemen kategori,
      // tutup manajemen kategori dan kembali ke dashboard
      if (showCategoryManagement) {
        setShowCategoryManagement(false);
        // Pastikan kita tetap di /admin
        window.history.replaceState(
          { adminPage: true, dashboard: true },
          "",
          "/admin"
        );
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    showShippingManagement,
    showOrderStatus,
    showSalesHistory,
    showCourierManagement,
    showCategoryManagement,
  ]);

  // Ambil data produk dari localStorage
  useEffect(() => {
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
  }, []);

  // Ambil data kurir dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ecommerce_couriers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCouriers(parsed);
        }
      } catch (error) {
        console.error("Error parsing couriers from localStorage:", error);
        setCouriers([]);
      }
    }
  }, []);

  // Ambil data registered users dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ecommerce_registered_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRegisteredUsers(parsed);
        }
      } catch (error) {
        console.error(
          "Error parsing registered users from localStorage:",
          error
        );
        setRegisteredUsers([]);
      }
    }
  }, []);

  // Ambil data kategori dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ecommerce_categories");
    if (saved) {
      try {
        const savedCategories = JSON.parse(saved);
        if (Array.isArray(savedCategories) && savedCategories.length > 0) {
          setCategories(savedCategories);
        } else {
          // Jika belum ada, ambil dari produk yang ada
          const defaultCategories = [
            ...new Set(initialProducts.map((p) => p.category)),
          ];
          setCategories(defaultCategories);
          localStorage.setItem(
            "ecommerce_categories",
            JSON.stringify(defaultCategories)
          );
        }
      } catch (error) {
        console.error("Error parsing categories from localStorage:", error);
        const defaultCategories = [
          ...new Set(initialProducts.map((p) => p.category)),
        ];
        setCategories(defaultCategories);
        localStorage.setItem(
          "ecommerce_categories",
          JSON.stringify(defaultCategories)
        );
      }
    } else {
      // Jika belum ada, ambil dari produk yang ada
      const defaultCategories = [
        ...new Set(initialProducts.map((p) => p.category)),
      ];
      setCategories(defaultCategories);
      localStorage.setItem(
        "ecommerce_categories",
        JSON.stringify(defaultCategories)
      );
    }
  }, []);

  // Ambil data provinsi dan ongkir dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ecommerce_provinces");
    if (saved) {
      try {
        const savedProvinces = JSON.parse(saved);
        // Jika data yang tersimpan kurang dari 38 provinsi, update dengan data lengkap
        if (Array.isArray(savedProvinces) && savedProvinces.length < 38) {
          // Data default seluruh 38 provinsi Indonesia
          const defaultProvinces = [
            // Pulau Sumatera
            { id: 1, name: "Aceh", shippingCost: 35000 },
            { id: 2, name: "Sumatera Utara", shippingCost: 30000 },
            { id: 3, name: "Sumatera Barat", shippingCost: 30000 },
            { id: 4, name: "Riau", shippingCost: 28000 },
            { id: 5, name: "Kepulauan Riau", shippingCost: 32000 },
            { id: 6, name: "Jambi", shippingCost: 28000 },
            { id: 7, name: "Sumatera Selatan", shippingCost: 30000 },
            { id: 8, name: "Bangka Belitung", shippingCost: 35000 },
            { id: 9, name: "Bengkulu", shippingCost: 32000 },
            { id: 10, name: "Lampung", shippingCost: 25000 },

            // Pulau Jawa
            { id: 11, name: "DKI Jakarta", shippingCost: 15000 },
            { id: 12, name: "Jawa Barat", shippingCost: 20000 },
            { id: 13, name: "Banten", shippingCost: 20000 },
            { id: 14, name: "Jawa Tengah", shippingCost: 25000 },
            { id: 15, name: "Daerah Istimewa Yogyakarta", shippingCost: 25000 },
            { id: 16, name: "Jawa Timur", shippingCost: 25000 },

            // Pulau Bali & Nusa Tenggara
            { id: 17, name: "Bali", shippingCost: 35000 },
            { id: 18, name: "Nusa Tenggara Barat", shippingCost: 40000 },
            { id: 19, name: "Nusa Tenggara Timur", shippingCost: 45000 },

            // Pulau Kalimantan
            { id: 20, name: "Kalimantan Barat", shippingCost: 40000 },
            { id: 21, name: "Kalimantan Tengah", shippingCost: 40000 },
            { id: 22, name: "Kalimantan Selatan", shippingCost: 38000 },
            { id: 23, name: "Kalimantan Timur", shippingCost: 45000 },
            { id: 24, name: "Kalimantan Utara", shippingCost: 50000 },

            // Pulau Sulawesi
            { id: 25, name: "Sulawesi Utara", shippingCost: 50000 },
            { id: 26, name: "Sulawesi Tengah", shippingCost: 48000 },
            { id: 27, name: "Sulawesi Selatan", shippingCost: 45000 },
            { id: 28, name: "Sulawesi Tenggara", shippingCost: 50000 },
            { id: 29, name: "Gorontalo", shippingCost: 50000 },
            { id: 30, name: "Sulawesi Barat", shippingCost: 48000 },

            // Kepulauan Maluku
            { id: 31, name: "Maluku", shippingCost: 55000 },
            { id: 32, name: "Maluku Utara", shippingCost: 60000 },

            // Pulau Papua
            { id: 33, name: "Papua Barat", shippingCost: 65000 },
            { id: 34, name: "Papua", shippingCost: 70000 },
            { id: 35, name: "Papua Selatan", shippingCost: 70000 },
            { id: 36, name: "Papua Tengah", shippingCost: 70000 },
            { id: 37, name: "Papua Pegunungan", shippingCost: 70000 },
            { id: 38, name: "Papua Barat Daya", shippingCost: 68000 },
          ];
          setProvinces(defaultProvinces);
          localStorage.setItem(
            "ecommerce_provinces",
            JSON.stringify(defaultProvinces)
          );
        } else {
          setProvinces(savedProvinces);
        }
      } catch (error) {
        console.error("Error parsing provinces from localStorage:", error);
        // Jika error, gunakan data default
        const defaultProvinces = [
          // Pulau Sumatera
          { id: 1, name: "Aceh", shippingCost: 35000 },
          { id: 2, name: "Sumatera Utara", shippingCost: 30000 },
          { id: 3, name: "Sumatera Barat", shippingCost: 30000 },
          { id: 4, name: "Riau", shippingCost: 28000 },
          { id: 5, name: "Kepulauan Riau", shippingCost: 32000 },
          { id: 6, name: "Jambi", shippingCost: 28000 },
          { id: 7, name: "Sumatera Selatan", shippingCost: 30000 },
          { id: 8, name: "Bangka Belitung", shippingCost: 35000 },
          { id: 9, name: "Bengkulu", shippingCost: 32000 },
          { id: 10, name: "Lampung", shippingCost: 25000 },

          // Pulau Jawa
          { id: 11, name: "DKI Jakarta", shippingCost: 15000 },
          { id: 12, name: "Jawa Barat", shippingCost: 20000 },
          { id: 13, name: "Banten", shippingCost: 20000 },
          { id: 14, name: "Jawa Tengah", shippingCost: 25000 },
          { id: 15, name: "Daerah Istimewa Yogyakarta", shippingCost: 25000 },
          { id: 16, name: "Jawa Timur", shippingCost: 25000 },

          // Pulau Bali & Nusa Tenggara
          { id: 17, name: "Bali", shippingCost: 35000 },
          { id: 18, name: "Nusa Tenggara Barat", shippingCost: 40000 },
          { id: 19, name: "Nusa Tenggara Timur", shippingCost: 45000 },

          // Pulau Kalimantan
          { id: 20, name: "Kalimantan Barat", shippingCost: 40000 },
          { id: 21, name: "Kalimantan Tengah", shippingCost: 40000 },
          { id: 22, name: "Kalimantan Selatan", shippingCost: 38000 },
          { id: 23, name: "Kalimantan Timur", shippingCost: 45000 },
          { id: 24, name: "Kalimantan Utara", shippingCost: 50000 },

          // Pulau Sulawesi
          { id: 25, name: "Sulawesi Utara", shippingCost: 50000 },
          { id: 26, name: "Sulawesi Tengah", shippingCost: 48000 },
          { id: 27, name: "Sulawesi Selatan", shippingCost: 45000 },
          { id: 28, name: "Sulawesi Tenggara", shippingCost: 50000 },
          { id: 29, name: "Gorontalo", shippingCost: 50000 },
          { id: 30, name: "Sulawesi Barat", shippingCost: 48000 },

          // Kepulauan Maluku
          { id: 31, name: "Maluku", shippingCost: 55000 },
          { id: 32, name: "Maluku Utara", shippingCost: 60000 },

          // Pulau Papua
          { id: 33, name: "Papua Barat", shippingCost: 65000 },
          { id: 34, name: "Papua", shippingCost: 70000 },
          { id: 35, name: "Papua Selatan", shippingCost: 70000 },
          { id: 36, name: "Papua Tengah", shippingCost: 70000 },
          { id: 37, name: "Papua Pegunungan", shippingCost: 70000 },
          { id: 38, name: "Papua Barat Daya", shippingCost: 68000 },
        ];
        setProvinces(defaultProvinces);
        localStorage.setItem(
          "ecommerce_provinces",
          JSON.stringify(defaultProvinces)
        );
      }
    } else {
      // Data default seluruh 38 provinsi Indonesia
      const defaultProvinces = [
        // Pulau Sumatera
        { id: 1, name: "Aceh", shippingCost: 35000 },
        { id: 2, name: "Sumatera Utara", shippingCost: 30000 },
        { id: 3, name: "Sumatera Barat", shippingCost: 30000 },
        { id: 4, name: "Riau", shippingCost: 28000 },
        { id: 5, name: "Kepulauan Riau", shippingCost: 32000 },
        { id: 6, name: "Jambi", shippingCost: 28000 },
        { id: 7, name: "Sumatera Selatan", shippingCost: 30000 },
        { id: 8, name: "Bangka Belitung", shippingCost: 35000 },
        { id: 9, name: "Bengkulu", shippingCost: 32000 },
        { id: 10, name: "Lampung", shippingCost: 25000 },

        // Pulau Jawa
        { id: 11, name: "DKI Jakarta", shippingCost: 15000 },
        { id: 12, name: "Jawa Barat", shippingCost: 20000 },
        { id: 13, name: "Banten", shippingCost: 20000 },
        { id: 14, name: "Jawa Tengah", shippingCost: 25000 },
        { id: 15, name: "Daerah Istimewa Yogyakarta", shippingCost: 25000 },
        { id: 16, name: "Jawa Timur", shippingCost: 25000 },

        // Pulau Bali & Nusa Tenggara
        { id: 17, name: "Bali", shippingCost: 35000 },
        { id: 18, name: "Nusa Tenggara Barat", shippingCost: 40000 },
        { id: 19, name: "Nusa Tenggara Timur", shippingCost: 45000 },

        // Pulau Kalimantan
        { id: 20, name: "Kalimantan Barat", shippingCost: 40000 },
        { id: 21, name: "Kalimantan Tengah", shippingCost: 40000 },
        { id: 22, name: "Kalimantan Selatan", shippingCost: 38000 },
        { id: 23, name: "Kalimantan Timur", shippingCost: 45000 },
        { id: 24, name: "Kalimantan Utara", shippingCost: 50000 },

        // Pulau Sulawesi
        { id: 25, name: "Sulawesi Utara", shippingCost: 50000 },
        { id: 26, name: "Sulawesi Tengah", shippingCost: 48000 },
        { id: 27, name: "Sulawesi Selatan", shippingCost: 45000 },
        { id: 28, name: "Sulawesi Tenggara", shippingCost: 50000 },
        { id: 29, name: "Gorontalo", shippingCost: 50000 },
        { id: 30, name: "Sulawesi Barat", shippingCost: 48000 },

        // Kepulauan Maluku
        { id: 31, name: "Maluku", shippingCost: 55000 },
        { id: 32, name: "Maluku Utara", shippingCost: 60000 },

        // Pulau Papua
        { id: 33, name: "Papua Barat", shippingCost: 65000 },
        { id: 34, name: "Papua", shippingCost: 70000 },
        { id: 35, name: "Papua Selatan", shippingCost: 70000 },
        { id: 36, name: "Papua Tengah", shippingCost: 70000 },
        { id: 37, name: "Papua Pegunungan", shippingCost: 70000 },
        { id: 38, name: "Papua Barat Daya", shippingCost: 68000 },
      ];
      setProvinces(defaultProvinces);
      localStorage.setItem(
        "ecommerce_provinces",
        JSON.stringify(defaultProvinces)
      );
    }
  }, []);

  // Fungsi untuk memuat semua order
  const loadAllOrders = () => {
    const registeredUsers = JSON.parse(
      localStorage.getItem("ecommerce_registered_users") || "[]"
    );
    const allOrdersList = [];

    // Ambil order dari setiap user
    registeredUsers.forEach((registeredUser) => {
      const userOrders = JSON.parse(
        localStorage.getItem(`ecommerce_orders_${registeredUser.email}`) || "[]"
      );
      // Tambahkan informasi user ke setiap order
      userOrders.forEach((order) => {
        allOrdersList.push({
          ...order,
          userEmail: registeredUser.email,
          userName: registeredUser.name,
        });
      });
    });

    // Sort berdasarkan tanggal (terbaru dulu)
    allOrdersList.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllOrders(allOrdersList);
  };

  // Ambil semua order dari semua user
  useEffect(() => {
    // Load awal
    loadAllOrders();

    if (showOrderStatus) {
      // Refresh setiap 2 detik untuk update real-time ketika halaman status dibuka
      const interval = setInterval(loadAllOrders, 2000);
      return () => clearInterval(interval);
    } else {
      // Refresh setiap 5 detik untuk update badge count ketika halaman status tidak dibuka
      const interval = setInterval(loadAllOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [showOrderStatus]);

  // Data dummy untuk kurva penjualan (7 hari terakhir)
  const salesData = useMemo(() => {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    return days.map((day, index) => ({
      day,
      sales: Math.floor(Math.random() * 5000000) + 1000000, // 1M - 6M
    }));
  }, []);

  // Hitung statistik stok
  const stockStats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockProducts = products.filter((p) => (p.stock || 0) < 10);
    const outOfStockProducts = products.filter((p) => (p.stock || 0) === 0);
    return {
      totalStock,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5), // Ambil 5 teratas
    };
  }, [products]);

  // Hitung statistik produk
  const productStats = useMemo(() => {
    const totalProducts = products.length;

    // Hitung jumlah produk per kategori dari produk yang ada
    const productCategories = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    // Gabungkan dengan semua kategori yang sudah ditambahkan user
    // Ini memastikan kategori yang belum ada produknya juga ditampilkan (dengan 0 produk)
    const allCategories = {};

    // Tambahkan semua kategori dari state categories
    categories.forEach((cat) => {
      allCategories[cat] = productCategories[cat] || 0;
    });

    // Juga tambahkan kategori yang ada di produk tapi belum ada di state categories
    // (untuk backward compatibility)
    Object.keys(productCategories).forEach((cat) => {
      if (!allCategories[cat]) {
        allCategories[cat] = productCategories[cat];
      }
    });

    const totalValue = products.reduce(
      (sum, p) => sum + (p.price || 0) * (p.stock || 0),
      0
    );
    return {
      totalProducts,
      categories: allCategories,
      totalValue,
    };
  }, [products, categories]);

  // Hitung nilai maksimum untuk grafik
  const maxSales = Math.max(...salesData.map((d) => d.sales));

  const handleGoAddProduct = () => {
    navigate("/admin/add-product");
  };

  const handleGoManageUser = () => {
    navigate("/profile");
  };

  const handleGoListProduct = () => {
    navigate("/admin/list-product");
  };

  const handleToggleOrderStatus = () => {
    const wasOpen = showOrderStatus;
    setShowOrderStatus(!showOrderStatus);
    setShowSalesHistory(false);
    setShowShippingManagement(false);
    setShowCourierManagement(false);
    setShowCategoryManagement(false);

    // Jika membuka status pemesanan, tambahkan entry ke history
    // sehingga back button akan kembali ke dashboard admin
    if (!wasOpen) {
      // Push state baru ke history untuk memastikan back button kembali ke dashboard
      window.history.pushState(
        { adminPage: true, section: "order-status" },
        "",
        "/admin"
      );
    }
  };

  const handleToggleSalesHistory = () => {
    const wasOpen = showSalesHistory;
    setShowSalesHistory(!showSalesHistory);
    setShowOrderStatus(false);
    setShowShippingManagement(false);
    setShowCourierManagement(false);
    setShowCategoryManagement(false);

    // Jika membuka riwayat penjualan, tambahkan entry ke history
    // sehingga back button akan kembali ke dashboard admin
    if (!wasOpen) {
      // Push state baru ke history untuk memastikan back button kembali ke dashboard
      window.history.pushState(
        { adminPage: true, section: "sales-history" },
        "",
        "/admin"
      );
    }
  };

  const handleToggleShippingManagement = () => {
    const wasOpen = showShippingManagement;
    setShowShippingManagement(!showShippingManagement);
    setShowOrderStatus(false);
    setShowSalesHistory(false);
    setShowCategoryManagement(false);
    setShowCourierManagement(false);

    // Jika membuka manajemen provinsi, tambahkan entry ke history
    // sehingga back button akan kembali ke dashboard admin
    if (!wasOpen) {
      // Push state baru ke history untuk memastikan back button kembali ke dashboard
      window.history.pushState(
        { adminPage: true, section: "shipping-management" },
        "",
        "/admin"
      );
    }
  };

  const handleToggleCourierManagement = () => {
    const wasOpen = showCourierManagement;
    setShowCourierManagement(!showCourierManagement);
    setShowOrderStatus(false);
    setShowSalesHistory(false);
    setShowShippingManagement(false);
    setShowCategoryManagement(false);

    // Jika membuka manajemen kurir, tambahkan entry ke history
    // sehingga back button akan kembali ke dashboard admin
    if (!wasOpen) {
      // Push state baru ke history untuk memastikan back button kembali ke dashboard
      window.history.pushState(
        { adminPage: true, section: "courier-management" },
        "",
        "/admin"
      );
    }
  };

  const handleToggleCategoryManagement = () => {
    const wasOpen = showCategoryManagement;
    setShowCategoryManagement(!showCategoryManagement);
    setShowOrderStatus(false);
    setShowSalesHistory(false);
    setShowShippingManagement(false);
    setShowCourierManagement(false);

    // Jika membuka manajemen kategori, tambahkan entry ke history
    if (!wasOpen) {
      window.history.pushState(
        { adminPage: true, section: "category-management" },
        "",
        "/admin"
      );
    }
  };

  // CRUD Functions untuk Kategori
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert("Nama kategori harus diisi!");
      return;
    }

    // Cek apakah kategori sudah ada
    if (categories.includes(newCategory.trim())) {
      alert("Kategori sudah ada!");
      return;
    }

    const updatedCategories = [...categories, newCategory.trim()];
    setCategories(updatedCategories);
    localStorage.setItem(
      "ecommerce_categories",
      JSON.stringify(updatedCategories)
    );

    // Trigger custom event untuk notify halaman lain
    window.dispatchEvent(new Event("categoriesUpdated"));

    setNewCategory("");
    alert("Kategori berhasil ditambahkan!");
  };

  const handleEditCategory = (oldCategory) => {
    setEditingCategory(oldCategory);
  };

  const handleSaveCategoryEdit = () => {
    if (!editingCategory || !editingCategory.trim()) {
      alert("Nama kategori harus diisi!");
      return;
    }

    // Cari kategori lama yang sedang diedit
    const oldCategoryIndex = categories.findIndex((c) => c === editingCategory);
    if (oldCategoryIndex === -1) {
      // Jika tidak ditemukan, cari dari state sebelumnya
      const oldCategory = categories.find((c) =>
        products.some((p) => p.category === c && c !== editingCategory.trim())
      );
      if (!oldCategory) {
        alert("Kategori tidak ditemukan!");
        setEditingCategory(null);
        return;
      }

      // Update kategori di produk yang menggunakan kategori lama
      const updatedProducts = products.map((p) =>
        p.category === oldCategory
          ? { ...p, category: editingCategory.trim() }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem(
        "ecommerce_products",
        JSON.stringify(updatedProducts)
      );

      // Trigger custom event untuk notify halaman lain
      window.dispatchEvent(new Event("productsUpdated"));

      // Update daftar kategori
      const updatedCategories = categories.map((c) =>
        c === oldCategory ? editingCategory.trim() : c
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        "ecommerce_categories",
        JSON.stringify(updatedCategories)
      );
    } else {
      // Jika kategori ditemukan, cek apakah nama baru sudah ada
      if (
        categories.includes(editingCategory.trim()) &&
        categories[oldCategoryIndex] !== editingCategory.trim()
      ) {
        alert("Kategori dengan nama tersebut sudah ada!");
        return;
      }

      // Update kategori di produk yang menggunakan kategori lama
      const oldCategory = categories[oldCategoryIndex];
      const updatedProducts = products.map((p) =>
        p.category === oldCategory
          ? { ...p, category: editingCategory.trim() }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem(
        "ecommerce_products",
        JSON.stringify(updatedProducts)
      );

      // Trigger custom event untuk notify halaman lain
      window.dispatchEvent(new Event("productsUpdated"));

      // Update daftar kategori
      const updatedCategories = categories.map((c) =>
        c === oldCategory ? editingCategory.trim() : c
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        "ecommerce_categories",
        JSON.stringify(updatedCategories)
      );
    }

    // Trigger custom event untuk notify halaman lain
    window.dispatchEvent(new Event("categoriesUpdated"));

    setEditingCategory(null);
    alert("Kategori berhasil diupdate!");
  };

  const handleDeleteCategory = (categoryToDelete) => {
    // Cek apakah ada produk yang menggunakan kategori ini
    const productsUsingCategory = products.filter(
      (p) => p.category === categoryToDelete
    );
    if (productsUsingCategory.length > 0) {
      alert(
        `Tidak bisa menghapus kategori! Masih ada ${productsUsingCategory.length} produk yang menggunakan kategori ini.`
      );
      return;
    }

    if (
      window.confirm(`Yakin ingin menghapus kategori "${categoryToDelete}"?`)
    ) {
      const updatedCategories = categories.filter(
        (c) => c !== categoryToDelete
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        "ecommerce_categories",
        JSON.stringify(updatedCategories)
      );

      // Trigger custom event untuk notify halaman lain
      window.dispatchEvent(new Event("categoriesUpdated"));

      alert("Kategori berhasil dihapus!");
    }
  };

  // CRUD Functions untuk Provinsi dan Ongkir
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

  const handleSaveEdit = () => {
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

    // Cek apakah email sudah terdaftar
    const existingCourier = couriers.find((c) => c.email === newCourier.email);
    if (existingCourier) {
      alert("Email kurir sudah terdaftar!");
      return;
    }

    const courier = {
      id: Date.now(),
      name: newCourier.name,
      email: newCourier.email,
      password: newCourier.password, // Dalam production, password harus di-hash
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

  // Fungsi search untuk admin - mencari di semua kategori
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
      // Tutup semua section lain saat search aktif
      setShowOrderStatus(false);
      setShowSalesHistory(false);
      setShowShippingManagement(false);
      setShowCourierManagement(false);
      setShowCategoryManagement(false);
    } else {
      setShowSearchResults(false);
    }
  };

  // Hasil search untuk admin
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        products: [],
        orders: [],
        users: [],
        provinces: [],
        couriers: [],
        categories: [],
      };
    }

    const query = searchQuery.toLowerCase().trim();

    // Search produk
    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.id.toString().includes(query)
    );

    // Search orders
    const matchedOrders = allOrders.filter(
      (o) =>
        o.id.toString().includes(query) ||
        o.userName?.toLowerCase().includes(query) ||
        o.userEmail?.toLowerCase().includes(query) ||
        o.province?.toLowerCase().includes(query) ||
        o.address?.toLowerCase().includes(query) ||
        o.items?.some(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.id.toString().includes(query)
        )
    );

    // Search users
    const matchedUsers = registeredUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
    );

    // Search provinces
    const matchedProvinces = provinces.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toString().includes(query) ||
        p.shippingCost.toString().includes(query)
    );

    // Search couriers
    const matchedCouriers = couriers.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.id?.toString().includes(query)
    );

    // Search categories
    const matchedCategories = categories.filter((c) =>
      c.toLowerCase().includes(query)
    );

    return {
      products: matchedProducts,
      orders: matchedOrders,
      users: matchedUsers,
      provinces: matchedProvinces,
      couriers: matchedCouriers,
      categories: matchedCategories,
    };
  }, [
    searchQuery,
    products,
    allOrders,
    registeredUsers,
    provinces,
    couriers,
    categories,
  ]);

  const totalSearchResults =
    searchResults.products.length +
    searchResults.orders.length +
    searchResults.users.length +
    searchResults.provinces.length +
    searchResults.couriers.length +
    searchResults.categories.length;

  const handleResetToDefault = () => {
    if (
      window.confirm(
        "Yakin ingin reset ke 38 provinsi default? Data yang sudah diubah akan hilang."
      )
    ) {
      const defaultProvinces = [
        // Pulau Sumatera
        { id: 1, name: "Aceh", shippingCost: 35000 },
        { id: 2, name: "Sumatera Utara", shippingCost: 30000 },
        { id: 3, name: "Sumatera Barat", shippingCost: 30000 },
        { id: 4, name: "Riau", shippingCost: 28000 },
        { id: 5, name: "Kepulauan Riau", shippingCost: 32000 },
        { id: 6, name: "Jambi", shippingCost: 28000 },
        { id: 7, name: "Sumatera Selatan", shippingCost: 30000 },
        { id: 8, name: "Bangka Belitung", shippingCost: 35000 },
        { id: 9, name: "Bengkulu", shippingCost: 32000 },
        { id: 10, name: "Lampung", shippingCost: 25000 },

        // Pulau Jawa
        { id: 11, name: "DKI Jakarta", shippingCost: 15000 },
        { id: 12, name: "Jawa Barat", shippingCost: 20000 },
        { id: 13, name: "Banten", shippingCost: 20000 },
        { id: 14, name: "Jawa Tengah", shippingCost: 25000 },
        { id: 15, name: "Daerah Istimewa Yogyakarta", shippingCost: 25000 },
        { id: 16, name: "Jawa Timur", shippingCost: 25000 },

        // Pulau Bali & Nusa Tenggara
        { id: 17, name: "Bali", shippingCost: 35000 },
        { id: 18, name: "Nusa Tenggara Barat", shippingCost: 40000 },
        { id: 19, name: "Nusa Tenggara Timur", shippingCost: 45000 },

        // Pulau Kalimantan
        { id: 20, name: "Kalimantan Barat", shippingCost: 40000 },
        { id: 21, name: "Kalimantan Tengah", shippingCost: 40000 },
        { id: 22, name: "Kalimantan Selatan", shippingCost: 38000 },
        { id: 23, name: "Kalimantan Timur", shippingCost: 45000 },
        { id: 24, name: "Kalimantan Utara", shippingCost: 50000 },

        // Pulau Sulawesi
        { id: 25, name: "Sulawesi Utara", shippingCost: 50000 },
        { id: 26, name: "Sulawesi Tengah", shippingCost: 48000 },
        { id: 27, name: "Sulawesi Selatan", shippingCost: 45000 },
        { id: 28, name: "Sulawesi Tenggara", shippingCost: 50000 },
        { id: 29, name: "Gorontalo", shippingCost: 50000 },
        { id: 30, name: "Sulawesi Barat", shippingCost: 48000 },

        // Kepulauan Maluku
        { id: 31, name: "Maluku", shippingCost: 55000 },
        { id: 32, name: "Maluku Utara", shippingCost: 60000 },

        // Pulau Papua
        { id: 33, name: "Papua Barat", shippingCost: 65000 },
        { id: 34, name: "Papua", shippingCost: 70000 },
        { id: 35, name: "Papua Selatan", shippingCost: 70000 },
        { id: 36, name: "Papua Tengah", shippingCost: 70000 },
        { id: 37, name: "Papua Pegunungan", shippingCost: 70000 },
        { id: 38, name: "Papua Barat Daya", shippingCost: 68000 },
      ];
      setProvinces(defaultProvinces);
      localStorage.setItem(
        "ecommerce_provinces",
        JSON.stringify(defaultProvinces)
      );
      alert("Data provinsi berhasil direset ke 38 provinsi default!");
    }
  };

  // Fungsi untuk mengubah status pesanan menjadi "dalam perjalanan"
  const handleSendOrder = (order) => {
    if (
      window.confirm(
        `Yakin ingin mengirim pesanan #${order.id} dari ${order.userName}?`
      )
    ) {
      // Kurangi stok produk sesuai dengan item yang dipesan
      const updatedProducts = [...products];
      let insufficientStock = false;
      const outOfStockItems = [];

      // Fase 1: Cek semua item terlebih dahulu sebelum mengurangi stok
      order.items.forEach((orderItem) => {
        const productIndex = updatedProducts.findIndex(
          (p) => p.id === orderItem.id
        );

        if (productIndex !== -1) {
          const currentStock = updatedProducts[productIndex].stock || 0;
          const requestedQuantity = orderItem.quantity || 1;

          // Cek apakah stok cukup
          if (currentStock < requestedQuantity) {
            // Stok tidak cukup
            insufficientStock = true;
            outOfStockItems.push({
              name: orderItem.name,
              requested: requestedQuantity,
              available: currentStock,
            });
          }
        } else {
          // Produk tidak ditemukan
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
          `Gagal mengirim pesanan! Stok tidak mencukupi untuk:\n${itemsList}`
        );
        return;
      }

      // Fase 2: Jika semua stok cukup, baru kurangi stok
      order.items.forEach((orderItem) => {
        const productIndex = updatedProducts.findIndex(
          (p) => p.id === orderItem.id
        );

        if (productIndex !== -1) {
          const currentStock = updatedProducts[productIndex].stock || 0;
          const requestedQuantity = orderItem.quantity || 1;

          // Kurangi stok
          updatedProducts[productIndex].stock =
            currentStock - requestedQuantity;
        }
      });

      // Update products di state dan localStorage
      setProducts(updatedProducts);
      localStorage.setItem(
        "ecommerce_products",
        JSON.stringify(updatedProducts)
      );

      // Trigger custom event untuk notify halaman lain
      window.dispatchEvent(new Event("productsUpdated"));

      // Ambil semua order dari user tersebut
      const userOrders = JSON.parse(
        localStorage.getItem(`ecommerce_orders_${order.userEmail}`) || "[]"
      );

      // Update status order
      const updatedOrders = userOrders.map((o) =>
        o.id === order.id ? { ...o, status: "dalam perjalanan" } : o
      );

      // Simpan kembali ke localStorage
      localStorage.setItem(
        `ecommerce_orders_${order.userEmail}`,
        JSON.stringify(updatedOrders)
      );

      // Reload orders untuk update state
      loadAllOrders();

      alert("Pesanan berhasil dikirim! Stok produk telah dikurangi.");
    }
  };

  // Pastikan user adalah admin
  if (!user || user.role !== "admin") {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <p className="text-gray-600">
            Anda tidak memiliki akses ke halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header dengan Search dan Menu Button */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setShowSearchResults(false);
                }
              }}
              className="w-full pl-10 pr-20 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Search Bar untuk Desktop - Di atas sidebar dan main content */}
          <div className="hidden lg:block absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-10">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk, pesanan, user, provinsi, kurir, atau kategori..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value.trim()) {
                    setShowSearchResults(false);
                  }
                }}
                className="w-full pl-12 pr-24 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-lg text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                Cari
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar kiri - Responsive */}
          <aside
            className={`${
              isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            } fixed lg:static inset-y-0 left-0 z-50 lg:z-auto w-72 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out lg:mt-5 h-screen lg:h-auto`}
          >
            {/* Mobile Menu Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Menu Admin
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Menu sidebar */}
            <nav className="flex-1 p-4 space-y-2 pt-6 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  handleGoAddProduct();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Barang</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleGoManageUser();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <Users className="w-4 h-4" />
                <span>Manage User</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleGoListProduct();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <Package className="w-4 h-4" />
                <span>List Product</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleOrderStatus();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  showOrderStatus
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Truck className="w-4 h-4" />
                  <span>Status Pemesanan</span>
                </div>
                {allOrders.filter((o) => o.status !== "selesai").length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {allOrders.filter((o) => o.status !== "selesai").length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleSalesHistory();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  showSalesHistory
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <History className="w-4 h-4" />
                <span>Riwayat Penjualan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleShippingManagement();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  showShippingManagement
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Provinsi & Ongkir</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleCourierManagement();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  showCourierManagement
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Manajemen Kurir</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleCategoryManagement();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  showCategoryManagement
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Manajemen Kategori</span>
              </button>
            </nav>
          </aside>

          {/* Konten utama Dashboard */}
          <main className="flex-1 space-y-4 lg:space-y-6 min-w-0 lg:mt-5">
            {/* Hasil Search - Hanya tampil jika showSearchResults true */}
            {showSearchResults && searchQuery.trim() && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Search className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Hasil Pencarian: "{searchQuery}"
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                  >
                    <X className="w-5 h-5" />
                    <span>Tutup</span>
                  </button>
                </div>

                {totalSearchResults === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Tidak ada hasil untuk "{searchQuery}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Hasil Produk */}
                    {searchResults.products.length > 0 && (
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          <span>Produk ({searchResults.products.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {searchResults.products.map((product) => (
                            <div
                              key={product.id}
                              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-40 sm:h-48 object-cover rounded-lg mb-2 sm:mb-3"
                              />
                              <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2">
                                {product.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-500 mb-2">
                                {product.category}
                              </p>
                              <p className="text-base sm:text-lg font-bold text-blue-600">
                                Rp {product.price.toLocaleString("id-ID")}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                Stok: {product.stock}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hasil Pesanan */}
                    {searchResults.orders.length > 0 && (
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                          <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          <span>Pesanan ({searchResults.orders.length})</span>
                        </h3>
                        <div className="space-y-3">
                          {searchResults.orders.map((order) => (
                            <div
                              key={`${order.id}-${order.userEmail}`}
                              className="border border-gray-200 rounded-lg p-3 sm:p-4"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-semibold text-sm sm:text-base text-gray-900">
                                    Pesanan #{order.id}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {order.userName} ({order.userEmail})
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    Status: {order.status}
                                  </p>
                                </div>
                                <p className="text-base sm:text-lg font-bold text-green-600">
                                  Rp {order.total.toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hasil User */}
                    {searchResults.users.length > 0 && (
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          <span>User ({searchResults.users.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {searchResults.users.map((user, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-3 sm:p-4"
                            >
                              <p className="font-semibold text-sm sm:text-base text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hasil Provinsi */}
                    {searchResults.provinces.length > 0 && (
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                          <span>
                            Provinsi ({searchResults.provinces.length})
                          </span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {searchResults.provinces.map((province) => (
                            <div
                              key={province.id}
                              className="border border-gray-200 rounded-lg p-3 sm:p-4"
                            >
                              <p className="font-semibold text-sm sm:text-base text-gray-900">
                                {province.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                Ongkir: Rp{" "}
                                {province.shippingCost.toLocaleString("id-ID")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hasil Kurir */}
                    {searchResults.couriers.length > 0 && (
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                          <span>Kurir ({searchResults.couriers.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {searchResults.couriers.map((courier) => (
                            <div
                              key={courier.id}
                              className="border border-gray-200 rounded-lg p-3 sm:p-4"
                            >
                              <p className="font-semibold text-sm sm:text-base text-gray-900">
                                {courier.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 truncate">
                                {courier.email}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hasil Kategori */}
                    {searchResults.categories.length > 0 && (
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
                          <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                          <span>
                            Kategori ({searchResults.categories.length})
                          </span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {searchResults.categories.map((category, index) => (
                            <span
                              key={index}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-xs sm:text-sm"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Status Pemesanan - Hanya tampil jika showOrderStatus true */}
            {!showSearchResults && showOrderStatus && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mt-4 p-3 lg:p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Status Pemesanan
                  </h2>
                </div>

                {allOrders.filter((o) => o.status !== "selesai").length ===
                0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      Belum ada pesanan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allOrders
                      .filter((o) => o.status !== "selesai")
                      .map((order) => (
                        <div
                          key={`${order.id}-${order.userEmail}`}
                          className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm sm:text-base text-gray-900">
                                    {order.userName}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {order.userEmail}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:space-x-2 mt-2 text-xs sm:text-sm text-gray-600">
                                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Pesanan #{order.id}</span>
                                <span className="hidden sm:inline">•</span>
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs">
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
                              {/* Informasi Pengiriman */}
                              {(order.province || order.address) && (
                                <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="flex items-start space-x-2 text-xs sm:text-sm">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 mt-0.5 shrink-0" />
                                    <div className="flex-1">
                                      {order.province && (
                                        <p className="text-gray-900 font-medium mb-1">
                                          {order.province}
                                        </p>
                                      )}
                                      {order.address && (
                                        <p className="text-gray-600">
                                          {order.address}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-left sm:text-right sm:ml-4">
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
                              <div className="text-left sm:text-right">
                                {order.subtotal && (
                                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                    Subtotal: Rp{" "}
                                    {order.subtotal.toLocaleString("id-ID")}
                                  </p>
                                )}
                                {order.shippingCost && (
                                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                    Ongkir: Rp{" "}
                                    {order.shippingCost.toLocaleString("id-ID")}
                                  </p>
                                )}
                                <p className="text-base sm:text-lg font-bold text-green-600">
                                  Total: Rp{" "}
                                  {order.total.toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Daftar Barang */}
                          <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                            <div className="space-y-2 mb-3 sm:mb-4">
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

                            {/* Tombol Kirim untuk status pending */}
                            {order.status === "pending" && (
                              <button
                                onClick={() => handleSendOrder(order)}
                                className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                              >
                                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Kirim</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Riwayat Penjualan - Hanya tampil jika showSalesHistory true */}
            {!showSearchResults && showSalesHistory && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <History className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Riwayat Penjualan
                  </h2>
                </div>

                {allOrders.filter((o) => o.status === "selesai").length ===
                0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-500">
                      Belum ada riwayat penjualan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {allOrders
                      .filter((o) => o.status === "selesai")
                      .map((order) => (
                        <div
                          key={`${order.id}-${order.userEmail}`}
                          className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition bg-green-50/30"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm sm:text-base text-gray-900">
                                    {order.userName}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {order.userEmail}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:space-x-2 mt-2 text-xs sm:text-sm text-gray-600">
                                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Pesanan #{order.id}</span>
                                <span className="hidden sm:inline">•</span>
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs">
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
                              {/* Informasi Pengiriman */}
                              {(order.province || order.address) && (
                                <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                                  <div className="flex items-start space-x-2 text-xs sm:text-sm">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 mt-0.5 shrink-0" />
                                    <div className="flex-1">
                                      {order.province && (
                                        <p className="text-gray-900 font-medium mb-1">
                                          {order.province}
                                        </p>
                                      )}
                                      {order.address && (
                                        <p className="text-gray-600">
                                          {order.address}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-left sm:text-right sm:ml-4">
                              <div className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3" />
                                <span className="capitalize">Selesai</span>
                              </div>
                              <div className="text-left sm:text-right">
                                {order.subtotal && (
                                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                    Subtotal: Rp{" "}
                                    {order.subtotal.toLocaleString("id-ID")}
                                  </p>
                                )}
                                {order.shippingCost && (
                                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                    Ongkir: Rp{" "}
                                    {order.shippingCost.toLocaleString("id-ID")}
                                  </p>
                                )}
                                <p className="text-base sm:text-lg font-bold text-green-600">
                                  Total: Rp{" "}
                                  {order.total.toLocaleString("id-ID")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Daftar Barang */}
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

            {/* Manajemen Provinsi & Ongkir */}
            {!showSearchResults && showShippingManagement && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                      onClick={() => setShowShippingManagement(false)}
                      className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Kembali ke Dashboard"
                    >
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Manajemen Provinsi & Ongkir
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={handleResetToDefault}
                    className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-xs sm:text-sm"
                    title="Reset ke 38 provinsi default"
                  >
                    <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Reset ke Default</span>
                  </button>
                </div>

                {/* Form Tambah Provinsi */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Tambah Provinsi Baru
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <div className="flex items-end sm:col-span-2 lg:col-span-1">
                      <button
                        onClick={handleAddProvince}
                        className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Daftar Provinsi */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Daftar Provinsi ({provinces.length})
                  </h3>
                  {provinces.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-sm sm:text-base text-gray-500">
                        Belum ada provinsi yang ditambahkan
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {provinces.map((province) => (
                        <div
                          key={province.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                        >
                          {editingProvince?.id === province.id ? (
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                              </div>
                              <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                                <button
                                  onClick={handleSaveEdit}
                                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                                >
                                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>Simpan</span>
                                </button>
                                <button
                                  onClick={() => setEditingProvince(null)}
                                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                                >
                                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>Batal</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0" />
                                  <div>
                                    <p className="font-semibold text-sm sm:text-base text-gray-900">
                                      {province.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
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
                                  className="p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProvince(province.id)
                                  }
                                  className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
            {!showSearchResults && showCourierManagement && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                      <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Manajemen Kurir
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Daftarkan dan kelola kurir untuk pengiriman barang
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCourierManagement(false)}
                    className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Kembali</span>
                  </button>
                </div>

                {/* Form Tambah Kurir */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Tambah Kurir Baru
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Nama Kurir
                      </label>
                      <input
                        type="text"
                        value={newCourier.name}
                        onChange={(e) =>
                          setNewCourier({ ...newCourier, name: e.target.value })
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Masukkan nama kurir"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Masukkan email kurir"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Masukkan password"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddCourier}
                    className="mt-3 sm:mt-4 w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Tambah Kurir</span>
                  </button>
                </div>

                {/* Daftar Kurir */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Daftar Kurir ({couriers.length})
                  </h3>
                  {couriers.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border border-gray-200">
                      <UserPlus className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm sm:text-base text-gray-500">
                        Belum ada kurir terdaftar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {couriers.map((courier) => (
                        <div
                          key={courier.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          {editingCourier?.id === courier.id ? (
                            <>
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                <input
                                  type="text"
                                  value={editingCourier.name}
                                  onChange={(e) =>
                                    setEditingCourier({
                                      ...editingCourier,
                                      name: e.target.value,
                                    })
                                  }
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base sm:col-span-2 lg:col-span-1"
                                  placeholder="Password baru"
                                />
                              </div>
                              <div className="flex items-center space-x-2 sm:ml-4">
                                <button
                                  onClick={handleSaveCourierEdit}
                                  className="flex-1 sm:flex-none p-1.5 sm:p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                  title="Simpan"
                                >
                                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingCourier(null)}
                                  className="flex-1 sm:flex-none p-1.5 sm:p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                  title="Batal"
                                >
                                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex-1">
                                <p className="font-semibold text-sm sm:text-base text-gray-900">
                                  {courier.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {courier.email}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditCourier(courier)}
                                  className="p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteCourier(courier.id)
                                  }
                                  className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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

            {/* Manajemen Kategori */}
            {!showSearchResults && showCategoryManagement && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <button
                    onClick={() => setShowCategoryManagement(false)}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Kembali ke Dashboard"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Manajemen Kategori
                    </h2>
                  </div>
                </div>

                {/* Form Tambah Kategori */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Tambah Kategori Baru
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Masukkan nama kategori (contoh: Streetwear)"
                      className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddCategory();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddCategory}
                      className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>

                {/* Daftar Kategori */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Daftar Kategori ({categories.length})
                  </h3>
                  {categories.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Tag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-sm sm:text-base text-gray-500">
                        Belum ada kategori yang ditambahkan
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                        >
                          {editingCategoryOld === category ? (
                            <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4">
                              <input
                                type="text"
                                value={editingCategory}
                                onChange={(e) =>
                                  setEditingCategory(e.target.value)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleSaveCategoryEdit();
                                  }
                                }}
                              />
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={handleSaveCategoryEdit}
                                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
                                >
                                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>Simpan</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCategory(null);
                                    setEditingCategoryOld(null);
                                  }}
                                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                                >
                                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>Batal</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0" />
                                  <div>
                                    <p className="font-semibold text-sm sm:text-base text-gray-900">
                                      {category}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                      {
                                        products.filter(
                                          (p) => p.category === category
                                        ).length
                                      }{" "}
                                      produk
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category)}
                                  className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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

            {/* Dashboard Content - Hanya tampil jika showOrderStatus, showSalesHistory, showShippingManagement, showCourierManagement, showCategoryManagement, dan showSearchResults false */}
            {!showOrderStatus &&
              !showSalesHistory &&
              !showShippingManagement &&
              !showCourierManagement &&
              !showCategoryManagement &&
              !showSearchResults && (
                <>
                  {/* Kurva Penjualan */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Kurva Penjualan (7 Hari Terakhir)
                      </h2>
                    </div>

                    <div className="relative h-48 sm:h-64 overflow-x-auto">
                      <svg
                        viewBox="0 0 800 200"
                        className="w-full h-full min-w-150"
                        preserveAspectRatio="none"
                      >
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                          <line
                            key={i}
                            x1="50"
                            y1={40 + i * 40}
                            x2="750"
                            y2={40 + i * 40}
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-gray-200"
                          />
                        ))}

                        {/* Sales curve */}
                        <polyline
                          points={salesData
                            .map(
                              (d, i) =>
                                `${50 + (i * 700) / (salesData.length - 1)},${
                                  200 - 40 - (d.sales / maxSales) * 120
                                }`
                            )
                            .join(" ")}
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="3"
                          className="drop-shadow-sm"
                        />

                        {/* Gradient definition */}
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3b82f6"
                              stopOpacity="1"
                            />
                            <stop
                              offset="100%"
                              stopColor="#8b5cf6"
                              stopOpacity="1"
                            />
                          </linearGradient>
                        </defs>

                        {/* Area under curve */}
                        <polygon
                          points={`50,200 ${salesData
                            .map(
                              (d, i) =>
                                `${50 + (i * 700) / (salesData.length - 1)},${
                                  200 - 40 - (d.sales / maxSales) * 120
                                }`
                            )
                            .join(" ")}, 750,200`}
                          fill="url(#gradient)"
                          fillOpacity="0.2"
                        />

                        {/* Data points */}
                        {salesData.map((d, i) => {
                          const x = 50 + (i * 700) / (salesData.length - 1);
                          const y = 200 - 40 - (d.sales / maxSales) * 120;
                          return (
                            <g key={i}>
                              <circle
                                cx={x}
                                cy={y}
                                r="5"
                                fill="#3b82f6"
                                className=""
                              />
                              <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                className="text-xs fill-gray-600 font-medium"
                              >
                                {`Rp${(d.sales / 1000000).toFixed(1)}M`}
                              </text>
                            </g>
                          );
                        })}

                        {/* X-axis labels */}
                        {salesData.map((d, i) => {
                          const x = 50 + (i * 700) / (salesData.length - 1);
                          return (
                            <text
                              key={i}
                              x={x}
                              y="195"
                              textAnchor="middle"
                              className="text-xs fill-gray-600 font-medium"
                            >
                              {d.day}
                            </text>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Summary */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50  rounded-lg">
                        <p className="text-xs text-gray-600">Total Penjualan</p>
                        <p className="text-lg font-bold text-blue-600">
                          Rp
                          {(
                            salesData.reduce((sum, d) => sum + d.sales, 0) /
                            1000000
                          ).toFixed(1)}
                          M
                        </p>
                      </div>
                      <div className="text-center p-3 bg-purple-50  rounded-lg">
                        <p className="text-xs text-gray-600">Rata-rata/Hari</p>
                        <p className="text-lg font-bold text-purple-600">
                          Rp
                          {(
                            salesData.reduce((sum, d) => sum + d.sales, 0) /
                            salesData.length /
                            1000000
                          ).toFixed(1)}
                          M
                        </p>
                      </div>
                      <div className="text-center p-3 bg-emerald-50  rounded-lg">
                        <p className="text-xs text-gray-600">Hari Terbaik</p>
                        <p className="text-lg font-bold text-emerald-600">
                          {
                            salesData.find(
                              (d) =>
                                d.sales ===
                                Math.max(...salesData.map((d) => d.sales))
                            )?.day
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistik Stok dan Produk */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Statistik Stok */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <PackageCheck className="w-6 h-6 text-orange-600" />
                        <h2 className="text-xl font-semibold text-gray-900">
                          Statistik Stok
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50  rounded-xl border border-blue-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Stok
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                {stockStats.totalStock.toLocaleString("id-ID")}
                              </p>
                            </div>
                            <Package className="w-12 h-12 text-blue-600 opacity-50" />
                          </div>
                        </div>

                        <div className="p-4 bg-orange-50  rounded-xl border border-orange-100">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm text-gray-600">
                                Stok Rendah (&lt;10)
                              </p>
                              <p className="text-2xl font-bold text-orange-600">
                                {stockStats.lowStockCount}
                              </p>
                            </div>
                            <AlertTriangle className="w-12 h-12 text-orange-600 opacity-50" />
                          </div>
                          {stockStats.lowStockProducts.length > 0 && (
                            <div className="mt-3 space-y-1">
                              {stockStats.lowStockProducts.map((p) => (
                                <div
                                  key={p.id}
                                  className="text-xs text-gray-600 flex justify-between"
                                >
                                  <span>{p.name}</span>
                                  <span className="font-semibold text-orange-600">
                                    {p.stock} unit
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {stockStats.outOfStockCount > 0 && (
                          <div className="p-4 bg-red-50  rounded-xl border border-red-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Habis Stok
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                  {stockStats.outOfStockCount}
                                </p>
                              </div>
                              <AlertTriangle className="w-12 h-12 text-red-600 opacity-50" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Statistik Produk */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <BarChart3 className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-xl font-semibold text-gray-900">
                          Statistik Produk
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50  rounded-xl border border-emerald-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">
                                Total Produk
                              </p>
                              <p className="text-2xl font-bold text-emerald-600">
                                {productStats.totalProducts}
                              </p>
                            </div>
                            <ShoppingBag className="w-12 h-12 text-emerald-600 opacity-50" />
                          </div>
                        </div>

                        <div className="p-4 bg-purple-50  rounded-xl border border-purple-100">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm text-gray-600">
                                Nilai Total Inventori
                              </p>
                              <p className="text-2xl font-bold text-purple-600">
                                Rp
                                {(productStats.totalValue / 1000000).toFixed(1)}
                                M
                              </p>
                            </div>
                            <DollarSign className="w-12 h-12 text-purple-600 opacity-50" />
                          </div>
                        </div>

                        <div className="p-4 bg-indigo-50  rounded-xl border border-indigo-100">
                          <p className="text-sm text-gray-600 mb-3">
                            Produk per Kategori
                          </p>
                          <div className="space-y-2">
                            {Object.entries(productStats.categories).map(
                              ([cat, count]) => (
                                <div
                                  key={cat}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-gray-700">{cat}</span>
                                  <span className="font-semibold text-indigo-600">
                                    {count} produk
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
          </main>
        </div>
      </div>
    </div>
  );
}
