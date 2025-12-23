import {
  Facebook,
  Twitter,
  Instagram,
  DollarSign,
  Percent,
  Truck,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  // Handler untuk mencegah navigasi
  const handleClick = (e) => {
    e.preventDefault();
    // Tidak melakukan apa-apa, hanya tampilan
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolom 1: Zeluxe */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Zeluxe</h3>
            <ul className="space-y-2">
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Tentang Zeluxe
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Hak Kekayaan Intelektual
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Karir
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Blog
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Zeluxe Affiliate Program
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Zeluxe B2B Digital
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Zeluxe Marketing Solutions
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Kalkulator Indeks Masa Tubuh
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Zeluxe Farma
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Promo Hari Ini
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Beli Lokal
                </span>
              </li>
              <li>
                <span
                  onClick={handleClick}
                  className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                >
                  Promo Guncang
                </span>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Beli, Jual, Bantuan dan Panduan */}
          <div>
            {/* Sub-bagian: Beli */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Beli</h3>
              <ul className="space-y-2">
                <li>
                  <span
                    onClick={handleClick}
                    className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                  >
                    Tagihan & Top Up
                  </span>
                </li>
                <li>
                  <span
                    onClick={handleClick}
                    className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                  >
                    Zeluxe COD
                  </span>
                </li>
                <li>
                  <span
                    onClick={handleClick}
                    className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                  >
                    Bebas Ongkir
                  </span>
                </li>
              </ul>
            </div>

            {/* Sub-bagian: Jual */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Jual</h3>
              <ul className="space-y-2">
                <li>
                  <span
                    onClick={handleClick}
                    className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                  >
                    Pusat Edukasi Seller
                  </span>
                </li>
                <li>
                  <span
                    onClick={handleClick}
                    className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                  >
                    Daftar Mall
                  </span>
                </li>
              </ul>
            </div>

            {/* Sub-bagian: Bantuan dan Panduan */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Bantuan dan Panduan
              </h3>
              <ul className="space-y-2">
                <li>
                  <span
                    onClick={handleClick}
                    className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                  >
                    Zeluxe Care
                  </span>
                </li>
                <li>
                  <span
                    onClick={handleClick}
                    className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                  >
                    Syarat dan Ketentuan
                  </span>
                </li>
                <li>
                  <span
                    onClick={handleClick}
                    className="text-sm text-gray-600 hover:text-green-600 cursor-pointer block"
                  >
                    Kebijakan Privasi
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Kolom 3: Keamanan & Privasi dan Ikuti Kami */}
          <div>
            {/* Sub-bagian: Keamanan & Privasi */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Keamanan & Privasi
              </h3>
              <div className="space-y-3">
                {/* Badge PCI DSS */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-orange-800 mb-1">
                    PCI DSS COMPLIANT
                  </div>
                  <div className="text-xs text-orange-600">
                    ASSESSED BY CONTROLCASE
                  </div>
                </div>

                {/* Badge ISO 27001 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">BSI</span>
                    </div>
                    <div className="text-xs font-semibold text-blue-800">
                      ISO/IEC 27001
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">
                    Information Security Management CERTIFIED
                  </div>
                </div>

                {/* Badge ISO 27701 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">BSI</span>
                    </div>
                    <div className="text-xs font-semibold text-blue-800">
                      ISO/IEC 27701
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">
                    Privacy Information Management CERTIFIED
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-bagian: Ikuti Kami */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Ikuti Kami
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleClick}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleClick}
                  className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleClick}
                  className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
                  aria-label="Pinterest"
                >
                  <span className="text-white text-xs font-bold">P</span>
                </button>
                <button
                  onClick={handleClick}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 hover:opacity-90 flex items-center justify-center transition-opacity"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Kolom 4: Nikmatin keuntungan spesial di aplikasi */}
          <div>
            {/* Sub-bagian: Keuntungan Aplikasi */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                Nikmatin keuntungan spesial di aplikasi:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">
                    Diskon 70%* hanya di aplikasi
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Percent className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">
                    Promo khusus aplikasi
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">
                    Gratis Ongkir tiap hari
                  </span>
                </li>
              </ul>
            </div>

            {/* Sub-bagian: QR Code dan Download */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-sm">
                Buka aplikasi dengan scan QR atau klik tombol:
              </h3>
              <div className="flex items-start space-x-4">
                {/* QR Code */}
                <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.origin : "https://zeluxe.com"
                    )}`}
                    alt="QR Code Zeluxe"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Download Buttons */}
                <div className="flex flex-col space-y-2">
                  {/* Google Play */}
                  <button
                    onClick={handleClick}
                    className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <span>GET IT ON</span>
                    <span className="font-bold">Google Play</span>
                  </button>

                  {/* App Store */}
                  <button
                    onClick={handleClick}
                    className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <span>Download on the</span>
                    <span className="font-bold">App Store</span>
                  </button>

                  {/* AppGallery */}
                  <button
                    onClick={handleClick}
                    className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <span>EXPLORE IT ON</span>
                    <span className="font-bold">AppGallery</span>
                  </button>
                </div>
              </div>

              {/* Link Pelajari Selengkapnya */}
              <button
                onClick={handleClick}
                className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>Pelajari Selengkapnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-sm text-gray-500 text-center">
            © 2024 Zeluxe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
