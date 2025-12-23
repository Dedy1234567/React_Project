import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4 py-12">
      <h1 className="text-6xl sm:text-8xl font-bold text-gray-900">404</h1>
      <p className="text-lg sm:text-xl text-gray-600">
        Halaman tidak ditemukan
      </p>
      <p className="text-sm sm:text-base text-gray-500 max-w-md">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Link
          to="/"
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Kembali</span>
        </button>
      </div>
    </div>
  );
}
