import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Kredensial admin
const ADMIN_EMAIL = "dedydarmawan876@gmail.com";
const ADMIN_PASSWORD = "121005";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek user dari localStorage (simulasi login yang tersimpan)
    const savedUser = localStorage.getItem("ecommerce_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("ecommerce_user");
      }
    }
    setLoading(false);
  }, []);

  // Sync user state dengan localStorage saat popstate (back/forward button)
  useEffect(() => {
    const handlePopState = (e) => {
      // Saat back button diklik, LANGSUNG sync dari localStorage tanpa delay
      // Ini sangat penting untuk mencegah redirect ke login
      const savedUser = localStorage.getItem("ecommerce_user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Update state langsung, tidak perlu cek perbedaan
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          setUser(null);
        }
      } else {
        // Jika localStorage kosong, clear state
        setUser(null);
      }
    };

    // Listen untuk back/forward button - ini sangat penting!
    // Gunakan capture phase untuk memastikan handler dijalankan lebih awal
    window.addEventListener("popstate", handlePopState, true);

    // Juga listen untuk perubahan localStorage (dari tab lain)
    const handleStorageChange = (e) => {
      if (e.key === "ecommerce_user") {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error("Error parsing user:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("popstate", handlePopState, true);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array - hanya setup sekali

  const login = (email, password) => {
    // Validasi admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        email: ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
      };
      setUser(adminUser);
      localStorage.setItem("ecommerce_user", JSON.stringify(adminUser));
      return {
        success: true,
        message: "Login admin berhasil",
        user: adminUser,
      };
    }

    // Validasi kurir
    const couriers = JSON.parse(
      localStorage.getItem("ecommerce_couriers") || "[]"
    );
    const foundCourier = couriers.find(
      (c) => c.email === email && c.password === password
    );

    if (foundCourier) {
      const courierData = {
        email: foundCourier.email,
        name: foundCourier.name,
        role: "kurir",
      };
      setUser(courierData);
      localStorage.setItem("ecommerce_user", JSON.stringify(courierData));
      return {
        success: true,
        message: "Login kurir berhasil",
        user: courierData,
      };
    }

    // Validasi user biasa
    const registeredUsers = JSON.parse(
      localStorage.getItem("ecommerce_registered_users") || "[]"
    );
    const foundUser = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        email: foundUser.email,
        name: foundUser.name,
        role: "user",
      };
      setUser(userData);
      localStorage.setItem("ecommerce_user", JSON.stringify(userData));
      return { success: true, message: "Login berhasil", user: userData };
    }

    return {
      success: false,
      message:
        "Email atau password salah. Silakan register terlebih dahulu jika belum punya akun.",
    };
  };

  const register = (name, email, password) => {
    // Cek apakah email sudah terdaftar
    const registeredUsers = JSON.parse(
      localStorage.getItem("ecommerce_registered_users") || "[]"
    );

    // Cek apakah email sudah ada
    if (registeredUsers.some((u) => u.email === email)) {
      return {
        success: false,
        message:
          "Email sudah terdaftar. Silakan login atau gunakan email lain.",
      };
    }

    // Cek apakah mencoba register dengan email admin
    if (email === ADMIN_EMAIL) {
      return {
        success: false,
        message: "Email ini tidak dapat digunakan untuk registrasi.",
      };
    }

    // Tambahkan user baru
    const newUser = {
      name,
      email,
      password, // Dalam production, password harus di-hash
      role: "user",
    };

    registeredUsers.push(newUser);
    localStorage.setItem(
      "ecommerce_registered_users",
      JSON.stringify(registeredUsers)
    );

    // Auto login setelah register
    const userData = {
      email: newUser.email,
      name: newUser.name,
      role: "user",
    };
    setUser(userData);
    localStorage.setItem("ecommerce_user", JSON.stringify(userData));

    return { success: true, message: "Registrasi berhasil" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecommerce_user");
  };

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return ctx;
}
