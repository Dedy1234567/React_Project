import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    home: "Home",
    products: "Products",
    cart: "Cart",
    profile: "Profile",
    login: "Login",
    register: "Register",
    logout: "Logout",
    welcome: "Welcome",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    price: "Price",
    stock: "Stock",
    category: "Category",
    colors: "Colors",
    emptyCart: "Your cart is empty",
    mustLogin: "You must login to access this page",
    mustLoginToAdd: "You must login to add items to cart",
    total: "Total",
    quantity: "Quantity",
    remove: "Remove",
    checkout: "Checkout",
    name: "Name",
    email: "Email",
    role: "Role",
    editProfile: "Edit Profile",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    all: "All",
    lowest: "Lowest",
    highest: "Highest",
    noProducts: "No products found",
    productNotFound: "Product not found",
    selectedColor: "Selected color",
    edit: "Edit",
    update: "Update",
    delete: "Delete",
    addProduct: "Add Product",
  },
  id: {
    home: "Beranda",
    products: "Produk",
    cart: "Keranjang",
    profile: "Profil",
    login: "Masuk",
    register: "Daftar",
    logout: "Keluar",
    welcome: "Selamat Datang",
    addToCart: "Tambah ke Keranjang",
    buyNow: "Beli Sekarang",
    price: "Harga",
    stock: "Stok",
    category: "Kategori",
    colors: "Warna",
    emptyCart: "Keranjang Anda kosong",
    mustLogin: "Anda harus login untuk mengakses halaman ini",
    mustLoginToAdd: "Anda harus login untuk menambahkan item ke keranjang",
    total: "Total",
    quantity: "Jumlah",
    remove: "Hapus",
    checkout: "Checkout",
    name: "Nama",
    email: "Email",
    role: "Peran",
    editProfile: "Edit Profil",
    save: "Simpan",
    cancel: "Batal",
    search: "Cari",
    all: "Semua",
    lowest: "Terendah",
    highest: "Tertinggi",
    noProducts: "Tidak ada produk ditemukan",
    productNotFound: "Produk tidak ditemukan",
    selectedColor: "Warna dipilih",
    edit: "Edit",
    update: "Update",
    delete: "Hapus",
    addProduct: "Tambah Produk",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("ecommerce_language") || "id";
  });

  useEffect(() => {
    localStorage.setItem("ecommerce_language", language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "id" : "en"));
  };

  const value = { language, setLanguage, toggleLanguage, t };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

