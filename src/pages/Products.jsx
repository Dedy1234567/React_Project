import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { initialProducts } from "../data/products";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import ConfirmModal from "../components/ConfirmModal";
import Footer from "../components/Footer";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Package2,
  Palette,
  Image as ImageIcon,
  X,
  Save,
  ArrowUpDown,
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

export default function Products() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const isAdmin = user && user.role === "admin";

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // Flag untuk mencegah reload saat update
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
  const [isFormCategoryDropdownOpen, setIsFormCategoryDropdownOpen] =
    useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Banner images
  const banners = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200",
  ];

  const prevBanner = () => {
    setBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextBanner = () => {
    setBannerIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

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
        const defaultProducts = Array.isArray(initialProducts)
          ? initialProducts
          : [];
        setProducts(defaultProducts);
        if (defaultProducts.length > 0) {
          localStorage.setItem(
            "ecommerce_products",
            JSON.stringify(defaultProducts)
          );
        }
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
      // Jangan reload jika sedang update dari halaman ini sendiri
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

  useEffect(() => {
    try {
      const urlSearch = searchParams.get("search");
      const urlCategory = searchParams.get("category");
      if (urlSearch && typeof urlSearch === "string" && urlSearch.trim()) {
        setSearch(urlSearch.trim());
      } else {
        setSearch("");
      }
      if (
        urlCategory &&
        typeof urlCategory === "string" &&
        urlCategory.trim()
      ) {
        setCategoryFilter(urlCategory.trim());
      }
    } catch (error) {
      console.error("Error reading search params:", error);
      setSearch("");
    }
  }, [searchParams]);

  // useEffect ini akan menyimpan ke localStorage ketika products berubah
  // Tapi kita sudah menyimpan langsung di handleSubmit, jadi ini sebagai backup
  useEffect(() => {
    if (products.length > 0) {
      // Cek apakah data di localStorage sudah sama dengan state
      // Jika sama, jangan simpan lagi untuk menghindari loop
      const saved = localStorage.getItem("ecommerce_products");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Jika data sama, jangan simpan lagi
          if (JSON.stringify(parsed) === JSON.stringify(products)) {
            return;
          }
        } catch (error) {
          // Jika error parsing, lanjutkan simpan
        }
      }

      localStorage.setItem("ecommerce_products", JSON.stringify(products));
      // Trigger custom event untuk notify halaman lain
      window.dispatchEvent(new Event("productsUpdated"));
    }
  }, [products]);

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
      // Set flag untuk mencegah reload
      setIsUpdating(true);

      // Update produk yang sudah ada
      const updatedProducts = products.map((p) =>
        p.id === editingId
          ? {
              ...p, // Pertahankan semua field yang sudah ada (termasuk description)
              name: form.name,
              category: form.category,
              price,
              stock,
              image: form.image || p.image, // Gunakan image baru atau tetap gunakan yang lama
              colors: colorsArray,
            }
          : p
      );

      // Update state
      setProducts(updatedProducts);

      // Simpan langsung ke localStorage
      localStorage.setItem(
        "ecommerce_products",
        JSON.stringify(updatedProducts)
      );

      // Reset flag setelah sedikit delay
      setTimeout(() => {
        setIsUpdating(false);
      }, 100);

      // Trigger custom event untuk notify halaman lain
      window.dispatchEvent(new Event("productsUpdated"));

      alert("Produk berhasil diupdate!");
    } else {
      // Tambah produk baru
      const newProduct = {
        id: Date.now(),
        name: form.name,
        category: form.category,
        price,
        stock,
        image:
          form.image ||
          "https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg?auto=compress&cs=tinysrgb&w=600",
        colors: colorsArray,
        description: "", // Tambahkan description kosong untuk produk baru
      };

      const updatedProducts = [...products, newProduct];

      // Set flag untuk mencegah reload
      setIsUpdating(true);

      // Update state
      setProducts(updatedProducts);

      // Simpan langsung ke localStorage
      localStorage.setItem(
        "ecommerce_products",
        JSON.stringify(updatedProducts)
      );

      // Reset flag setelah sedikit delay
      setTimeout(() => {
        setIsUpdating(false);
      }, 100);

      // Trigger custom event untuk notify halaman lain
      window.dispatchEvent(new Event("productsUpdated"));

      alert("Produk berhasil ditambahkan!");
    }
    resetForm();
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

      // Trigger custom event untuk notify halaman lain
      window.dispatchEvent(new Event("productsUpdated"));

      alert("Produk berhasil dihapus!");
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Silakan login terlebih dahulu");
      return;
    }
    const result = addToCart(product, 1);
    if (result.success) {
      alert(`${product.name} ditambahkan ke keranjang`);
    }
  };

  const filteredAndSorted = useMemo(() => {
    try {
      // Pastikan products adalah array
      if (!Array.isArray(products)) {
        return [];
      }

      let data = products.filter((p) => {
        // Validasi produk memiliki property yang diperlukan
        return (
          p &&
          typeof p === "object" &&
          p.name &&
          typeof p.name === "string" &&
          p.category &&
          typeof p.category === "string"
        );
      });

      // Filter berdasarkan search
      if (search && typeof search === "string" && search.trim()) {
        const keyword = search.toLowerCase().trim();
        data = data.filter((p) => {
          const productName = p.name ? String(p.name).toLowerCase() : "";
          return productName.includes(keyword);
        });
      }

      // Filter berdasarkan kategori
      if (categoryFilter && categoryFilter !== "all") {
        data = data.filter((p) => {
          return p.category === categoryFilter;
        });
      }

      // Sort data
      if (sortBy === "name-asc") {
        data.sort((a, b) => {
          const nameA = a.name ? String(a.name) : "";
          const nameB = b.name ? String(b.name) : "";
          return nameA.localeCompare(nameB);
        });
      } else if (sortBy === "price-asc") {
        data.sort((a, b) => {
          const priceA = typeof a.price === "number" ? a.price : 0;
          const priceB = typeof b.price === "number" ? b.price : 0;
          return priceA - priceB;
        });
      } else if (sortBy === "price-desc") {
        data.sort((a, b) => {
          const priceA = typeof a.price === "number" ? a.price : 0;
          const priceB = typeof b.price === "number" ? b.price : 0;
          return priceB - priceA;
        });
      }

      return data;
    } catch (error) {
      console.error("Error in filteredAndSorted:", error);
      return [];
    }
  }, [products, search, categoryFilter, sortBy]);

  // State untuk kategori yang akan update ketika ada perubahan
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
      // Fallback: ambil dari produk yang ada
      if (Array.isArray(products) && products.length > 0) {
        const productCategories = [
          ...new Set(
            products
              .filter((p) => p && p.category && typeof p.category === "string")
              .map((p) => p.category)
          ),
        ];
        setCategoriesList(productCategories);
      } else {
        setCategoriesList([]);
      }
    };

    loadCategories();

    // Listen untuk perubahan localStorage (dari tab lain atau admin)
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

    // Polling untuk check perubahan (karena storage event hanya trigger di tab lain)
    const interval = setInterval(() => {
      loadCategories();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("categoriesUpdated", handleCategoriesUpdated);
      clearInterval(interval);
    };
  }, [products]);

  // Kategori untuk dropdown (dengan "all")
  const categories = useMemo(() => {
    return ["all", ...categoriesList];
  }, [categoriesList]);

  // Refs untuk section admin
  const adminAddProductRef = useRef(null);
  const adminListProductRef = useRef(null);

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAdminLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/");
    setShowLogoutModal(false);
  };

  const handleManageUser = () => navigate("/profile");

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 to-white">
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Logout"
        message="Anda yakin ingin keluar?"
        confirmText="Ya"
        cancelText="Tidak"
      />
      {/* Tombol Back */}
      <div className="container mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Banner Promo Tahun Baru di atas */}
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-64 sm:h-80 lg:h-96 shadow-2xl">
          <img
            src={
              Array.isArray(banners) && banners[bannerIndex]
                ? banners[bannerIndex]
                : banners[0]
            }
            alt="Promo Tahun Baru 2026"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-white/90 via-white/50 to-transparent flex items-center">
            <div className="px-4 sm:px-8 lg:px-12 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-amber-800 mb-2 sm:mb-4 drop-shadow-md">
                New Year Mega Sale 2026! 
              </h2>
              <p className="text-sm sm:text-lg lg:text-2xl mb-4 sm:mb-8 text-gray-700 drop-shadow">
                Diskon hingga 70% + Gratis Ongkir untuk rayakan tahun baru
              </p>
              <Link
                to="/products"
                className="inline-block px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-amber-600 text-white font-bold text-sm sm:text-base lg:text-lg rounded-lg sm:rounded-xl hover:bg-amber-500 transition shadow-lg"
              >
                Belanja Sekarang 
              </Link>
            </div>
          </div>
          <button
            onClick={prevBanner}
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 sm:p-3 rounded-full transition"
            aria-label="Banner sebelumnya"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-amber-800" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 sm:p-3 rounded-full transition"
            aria-label="Banner berikutnya"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-amber-800" />
          </button>
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
            {Array.isArray(banners) &&
              banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIndex(i)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${
                    i === bannerIndex
                      ? "bg-amber-600 w-6 sm:w-10"
                      : "bg-white/70"
                  }`}
                  aria-label={`Banner ${i + 1}`}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-4 lg:gap-8 pb-8 sm:pb-16">
        {/* Sidebar Admin */}
        {isAdmin && (
          <aside className="lg:block w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-4 sm:p-6 lg:sticky lg:top-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-amber-600 rounded-xl">
                  <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-amber-800">
                    Admin Panel
                  </p>
                  <p className="text-base sm:text-lg font-bold text-gray-800">
                    Zeluxe 2026
                  </p>
                </div>
              </div>
              <nav className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => scrollToSection(adminAddProductRef)}
                  className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 bg-amber-50 text-amber-800 rounded-xl hover:bg-amber-100 transition font-medium text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Tambah Produk</span>
                </button>
                <button
                  onClick={handleManageUser}
                  className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 rounded-xl transition font-medium text-sm sm:text-base"
                >
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Kelola User</span>
                </button>
                <button
                  onClick={() => scrollToSection(adminListProductRef)}
                  className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 rounded-xl transition font-medium text-sm sm:text-base"
                >
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>List Produk</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-medium text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </aside>
        )}

        {/* Konten Utama */}
        <div className="flex-1 space-y-10">
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-extrabold text-amber-800 mb-2">
              {isAdmin ? "Kelola Produk" : "Koleksi Produk Zeluxe"}
            </h1>
            <p className="text-lg text-gray-600">
              {isAdmin
                ? "Tambah, edit, dan hapus produk dengan mudah"
                : "Temukan produk terbaik untuk tahun baru 2026 🎊"}
            </p>
          </div>

          {/* Form Admin */}
          {isAdmin && (
            <section
              ref={adminAddProductRef}
              id="admin-add-product"
              className="bg-white rounded-2xl shadow-xl border border-amber-200 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Plus className="w-7 h-7 text-amber-600" />
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Form fields sama seperti sebelumnya tapi accent amber */}
                <div className="relative">
                  <Package className="absolute left-3 top-4 w-5 h-5 text-amber-500" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama produk"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition bg-gray-50"
                  />
                </div>
                <div className="relative">
                  <Tag className="absolute left-3 top-4 w-5 h-5 text-amber-500 z-10" />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setIsFormCategoryDropdownOpen(
                          !isFormCategoryDropdownOpen
                        )
                      }
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition bg-gray-50 text-left flex items-center justify-between"
                    >
                      <span
                        className={
                          form.category ? "text-gray-900" : "text-gray-500"
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
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                          {categories
                            .filter((cat) => cat !== "all")
                            .map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  setForm({ ...form, category: cat });
                                  setIsFormCategoryDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                                  form.category === cat
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "text-gray-900"
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
                  <DollarSign className="absolute left-3 top-4 w-5 h-5 text-amber-500" />
                  <input
                    type="number"
                    name="price"
                    placeholder="Harga"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition bg-gray-50"
                  />
                </div>
                <div className="relative">
                  <Package2 className="absolute left-3 top-4 w-5 h-5 text-amber-500" />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stok"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Produk
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                  />
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="mt-4 w-32 h-32 object-cover rounded-xl border border-amber-200"
                    />
                  )}
                </div>
                <div className="md:col-span-2 lg:col-span-3 relative">
                  <Palette className="absolute left-3 top-4 w-5 h-5 text-amber-500" />
                  <input
                    type="text"
                    name="colors"
                    placeholder="Warna (pisah koma, ex: #000000, #ffffff)"
                    value={form.colors}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex gap-4">
                  <button
                    type="submit"
                    className="px-8 py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-500 transition shadow-lg"
                  >
                    {editingId ? "Update" : "Simpan"} Produk
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}

          {/* Filter & Search */}
          <section className="bg-white rounded-2xl shadow-xl border border-amber-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Filter className="w-7 h-7 text-amber-600" />
              Filter & Pencarian
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-4 w-5 h-5 text-amber-500" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition bg-gray-50"
                />
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                  className="w-full px-4 py-3 border-2 border-amber-400 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition bg-white text-left flex items-center justify-between shadow-sm hover:border-amber-500"
                >
                  <span className="text-gray-900 font-medium">
                    {categoryFilter === "all"
                      ? "Semua Kategori"
                      : categoryFilter}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
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
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                      {categories.map((cat) => (
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
                              : "text-gray-900 hover:bg-gray-50"
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
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-amber-300 focus:border-amber-500 transition bg-gray-50"
              >
                <option value="name-asc">Nama A-Z</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
              </select>
            </div>
          </section>

          {/* List Produk - Card lebih besar & elegan */}
          <section ref={adminListProductRef} id="admin-list-product">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Daftar Produk (
                {Array.isArray(filteredAndSorted)
                  ? filteredAndSorted.length
                  : 0}
                )
              </h2>
            </div>
            {!Array.isArray(filteredAndSorted) ||
            filteredAndSorted.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-24 h-24 text-amber-200 mx-auto mb-6" />
                <p className="text-xl text-gray-500">
                  Tidak ada produk ditemukan
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.isArray(filteredAndSorted) &&
                  filteredAndSorted.map((p) => {
                    if (!p || !p.id) return null;
                    const productId = p.id;
                    const productName = p.name || "Produk Tanpa Nama";
                    const productImage = p.image || "";
                    const productPrice =
                      typeof p.price === "number" ? p.price : 0;
                    const productCategory = p.category || "Uncategorized";
                    const productStock =
                      typeof p.stock === "number" ? p.stock : 0;
                    const productColors = Array.isArray(p.colors)
                      ? p.colors
                      : [];

                    return (
                      <div
                        key={productId}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-amber-100 overflow-hidden group"
                      >
                        <Link
                          to={`/products/${productId}`}
                          className="block aspect-square overflow-hidden bg-gray-50"
                        >
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            // onError={(e) => {
                            //   e.target.src =
                            //     "https://via.placeholder.com/300x300?text=No+Image";
                            // }}
                          />
                        </Link>
                        <div className="p-6 space-y-4">
                          <Link to={`/products/${productId}`}>
                            <h3 className="text-xl font-semibold text-gray-800 hover:text-amber-600 transition line-clamp-2">
                              {productName}
                            </h3>
                          </Link>
                          <p className="text-3xl font-bold text-amber-600">
                            Rp{productPrice.toLocaleString("id-ID")}
                          </p>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              {productCategory}
                            </span>
                            <span className="flex items-center gap-2">
                              <Package2 className="w-4 h-4" />
                              Stok: {productStock}
                            </span>
                          </div>
                          {productColors.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Palette className="w-5 h-5 text-gray-500" />
                              <div className="flex gap-2">
                                {productColors.map((color) => (
                                  <div
                                    key={color}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {isAdmin && (
                            <div className="pt-4 border-t border-gray-100">
                              <div className="grid grid-cols-2 gap-4">
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="py-3 bg-amber-100 text-amber-800 font-medium rounded-xl hover:bg-amber-200 transition"
                                >
                                  <Edit className="w-5 h-5 mx-auto" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(productId)}
                                  className="py-3 bg-red-100 text-red-600 font-medium rounded-xl hover:bg-red-200 transition"
                                >
                                  <Trash2 className="w-5 h-5 mx-auto" />
                                  Hapus
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
