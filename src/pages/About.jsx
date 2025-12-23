import { Link } from "react-router-dom";
import { ShoppingBag, ShieldCheck, Truck, Sparkles, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-4">
                <ShoppingBag className="w-4 h-4" />
                <span>E-commerce Fashion & Lifestyle</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Tentang <span className="text-green-600">Zeluxe</span>
              </h1>
              <p className="text-gray-600 leading-relaxed max-w-2xl">
                Zeluxe adalah platform e-commerce yang berfokus pada fashion dan
                lifestyle kekinian. Kami ingin membuat pengalaman belanja online
                menjadi lebih mudah, aman, dan menyenangkan untuk semua orang di
                Indonesia.
              </p>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-green-500 via-emerald-400 to-teal-400 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-4 rounded-2xl border border-white/40" />
                <div className="relative z-10 text-center text-white px-4">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-xs uppercase tracking-wide mb-1">Zeluxe</p>
                  <p className="text-sm font-semibold">
                    Belanja nyaman, gaya maksimal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What is Zeluxe */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Apa itu Zeluxe?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Zeluxe adalah tempat kamu menemukan koleksi fashion, aksesoris,
              dan produk gaya hidup yang sudah dikurasi, dengan kualitas
              terjamin dan harga yang tetap bersahabat.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Visi & Misi
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Visi kami adalah menjadi destinasi utama belanja fashion online di
              Indonesia. Kami berkomitmen menghadirkan pengalaman belanja yang
              cepat, aman, dan personal untuk setiap pengguna.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Nilai Utama
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Kami menjunjung tinggi kepercayaan, kenyamanan, dan gaya. Setiap
              produk dan fitur yang kami hadirkan selalu berfokus pada kebutuhan
              pengguna.
            </p>
          </div>
        </div>

        {/* Why Zeluxe */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Mengapa belanja di Zeluxe?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Aman & Terpercaya
                </h3>
                <p className="text-xs text-gray-600">
                  Sistem pembayaran yang aman dengan jaminan perlindungan
                  pembeli untuk setiap transaksi.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Pengiriman Cepat
                </h3>
                <p className="text-xs text-gray-600">
                  Bekerja sama dengan berbagai ekspedisi terpercaya untuk
                  mengirim pesanan kamu dengan cepat.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Koleksi Kekinian
                </h3>
                <p className="text-xs text-gray-600">
                  Koleksi produk yang selalu update mengikuti tren fashion
                  terbaru.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community & CTA */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-xs uppercase tracking-wide font-semibold">
                  Komunitas Zeluxe
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Bergabung dengan jutaan pengguna Zeluxe.
              </h2>
              <p className="text-sm text-green-50 max-w-xl">
                Temukan gaya kamu, nikmati promo eksklusif, dan dapatkan
                pengalaman belanja yang lebih personal hanya di Zeluxe.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 min-w-[220px]">
              <Link
                to="/register"
                className="px-5 py-2.5 bg-white text-green-600 rounded-lg text-sm font-semibold text-center hover:bg-green-50 transition"
              >
                Daftar Sekarang
              </Link>
              <Link
                to="/products"
                className="px-5 py-2.5 bg-green-600/20 border border-white/40 rounded-lg text-sm font-semibold text-center hover:bg-green-600/30 transition"
              >
                Jelajahi Produk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
