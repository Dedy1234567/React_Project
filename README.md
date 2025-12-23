# Zeluxe - E-Commerce Platform

Aplikasi e-commerce modern berbasis React + Vite dengan fitur lengkap untuk pengguna, admin, dan kurir. Aplikasi ini menggunakan localStorage untuk penyimpanan data dan Tailwind CSS untuk styling yang responsif.

## 🚀 Teknologi yang Digunakan

- **React 19.2.0** - Framework UI modern
- **Vite 7.2.4** - Build tool yang cepat
- **React Router DOM 7.10.1** - Routing dan navigasi
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Lucide React** - Icon library
- **LocalStorage** - Penyimpanan data client-side

## 📋 Fitur Utama

### 👤 Fitur Pengguna (User)

- ✅ Beranda dengan produk unggulan dan kategori
- ✅ Pencarian produk
- ✅ Detail produk dengan gambar, deskripsi, dan variasi warna
- ✅ Keranjang belanja (Cart)
- ✅ Checkout dengan pilihan metode pembayaran
- ✅ Manajemen provinsi dan ongkir
- ✅ Profil pengguna dengan riwayat pemesanan
- ✅ Halaman promo/diskon

### 🛡️ Fitur Admin

- ✅ Dashboard admin dengan statistik penjualan
- ✅ Manajemen produk (Tambah, Edit, Hapus)
- ✅ Manajemen kategori produk
- ✅ Status pemesanan dan tracking order
- ✅ Riwayat penjualan
- ✅ Manajemen provinsi & ongkir
- ✅ Manajemen kurir
- ✅ Manajemen pengguna

### 🚚 Fitur Kurir

- ✅ Dashboard kurir untuk melihat pesanan yang perlu dikirim
- ✅ Update status pengiriman

## 🛠️ Instalasi

1. **Clone repository atau download project**

   ```bash
   cd ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Jalankan development server**

   ```bash
   npm run dev
   ```

4. **Build untuk production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔐 Kredensial Login

### Admin

- **Email:** `dedydarmawan876@gmail.com`
- **Password:** `121005`

### User Biasa

- Daftar akun baru melalui halaman Register (`/register`)
- Atau gunakan akun yang sudah terdaftar sebelumnya

### Kurir

- Kurir dapat didaftarkan oleh admin melalui menu "Manajemen Kurir" di dashboard admin
- Setelah terdaftar, kurir dapat login menggunakan email dan password yang telah dibuat

## 📁 Struktur Project

```
ecommerce/
├── src/
│   ├── components/          # Komponen reusable
│   │   ├── ConfirmModal.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/             # Context providers
│   │   ├── AuthContext.jsx  # Authentication & user management
│   │   ├── CartContext.jsx  # Shopping cart management
│   │   └── LanguageContext.jsx
│   ├── data/                # Data statis
│   │   └── products.js      # Data produk awal
│   ├── pages/               # Halaman aplikasi
│   │   ├── admin/           # Halaman admin
│   │   │   ├── HomeAdmin.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   └── ListProduct.jsx
│   │   ├── kurir/           # Halaman kurir
│   │   │   └── HomeKurir.jsx
│   │   ├── user/            # Halaman user
│   │   │   └── HomeUser.jsx
│   │   ├── About.jsx
│   │   ├── Cart.jsx
│   │   ├── Login.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Profile.jsx
│   │   ├── Promo.jsx
│   │   └── Register.jsx
│   ├── App.jsx              # Layout utama & routing
│   ├── main.jsx             # Entry point aplikasi
│   └── index.css            # Global styles
├── package.json
└── README.md
```

## 🎯 Alur Program

### 1. Pengguna Baru

1. Buka aplikasi → Halaman beranda (`/`)
2. Browse produk atau cari produk
3. Klik produk untuk melihat detail
4. Tambah ke keranjang (harus login dulu)
5. Register akun baru (`/register`) jika belum punya akun
6. Login (`/login`)
7. Lanjutkan belanja dan checkout

### 2. Admin

1. Login dengan kredensial admin
2. Masuk ke dashboard admin (`/admin`)
3. **Tambah Produk** (`/admin/add-product`)
   - Isi form: nama, deskripsi, harga, stok, kategori, warna, gambar
   - Simpan produk
4. **List Produk** (`/admin/list-product`)
   - Lihat semua produk
   - Edit atau hapus produk
5. **Status Pemesanan**
   - Lihat semua pesanan
   - Update status pesanan (pending → diproses → dikirim → selesai)
6. **Riwayat Penjualan**
   - Lihat penjualan yang sudah selesai
7. **Manajemen Kategori**
   - Tambah, edit, hapus kategori produk
8. **Provinsi & Ongkir**
   - Tambah provinsi dan set harga ongkir
9. **Manajemen Kurir**
   - Daftarkan kurir baru
   - Edit atau hapus kurir

### 3. Kurir

1. Login dengan akun kurir (yang dibuat admin)
2. Masuk ke dashboard kurir (`/kurir`)
3. Lihat pesanan yang perlu dikirim
4. Update status pengiriman

## 📱 Responsive Design

Aplikasi ini sudah fully responsive menggunakan Tailwind CSS dengan breakpoints:

- **Mobile:** `< 640px`
- **Tablet:** `640px - 1024px`
- **Desktop:** `> 1024px`

Semua halaman telah dioptimalkan untuk berbagai ukuran layar.

## 💾 Penyimpanan Data

Aplikasi menggunakan **localStorage** untuk menyimpan:

- `ecommerce_user` - Data user yang sedang login
- `ecommerce_registered_users` - Daftar user terdaftar
- `ecommerce_products` - Daftar produk
- `ecommerce_categories` - Daftar kategori
- `ecommerce_orders` - Daftar pesanan
- `ecommerce_couriers` - Daftar kurir
- `ecommerce_provinces` - Daftar provinsi & ongkir
- `ecommerce_cart` - Keranjang belanja

**Catatan:** Data akan hilang jika localStorage browser di-clear.

## 🎨 Fitur UI/UX

- ✅ Design modern dan clean
- ✅ Animasi dan transisi yang smooth
- ✅ Loading states
- ✅ Error handling dengan pesan yang jelas
- ✅ Modal konfirmasi untuk aksi penting
- ✅ Badge notifikasi untuk keranjang dan pesanan pending
- ✅ Search bar yang responsif
- ✅ Mobile menu untuk navigasi di mobile

## 🔒 Keamanan

- ✅ Protected routes untuk halaman yang memerlukan autentikasi
- ✅ Role-based access control (Admin, User, Kurir)
- ✅ Validasi form input
- ✅ Konfirmasi untuk aksi penting (hapus, logout)

## 📝 Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build aplikasi untuk production
- `npm run preview` - Preview production build
- `npm run lint` - Menjalankan ESLint

## 🐛 Troubleshooting

### Data tidak tersimpan

- Pastikan localStorage browser tidak di-disable
- Cek console browser untuk error

### Login tidak berfungsi

- Pastikan email dan password sesuai (case-sensitive)
- Untuk admin, gunakan kredensial yang tepat
- Clear localStorage dan coba lagi

### Produk tidak muncul

- Pastikan produk sudah ditambahkan melalui admin
- Cek localStorage `ecommerce_products`

## 📞 Kontak & Support

Untuk pertanyaan atau bantuan, silakan hubungi:

- **Email Admin:** dedydarmawan876@gmail.com

## 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran dan pengembangan.

---

**Selamat menggunakan Zeluxe E-Commerce Platform! 🛍️**
