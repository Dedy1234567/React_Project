import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Shirt,
  Footprints,
  Dress,
  Jacket,
  Package,
  X,
} from "lucide-react";

// Mapping kategori utama dengan subkategori
const categoryData = {
  Streetwear: {
    icon: <Shirt className="w-5 h-5" />,
    subcategories: {
      "Pakaian Streetwear": [
        "Hoodie",
        "T-Shirt",
        "Cargo Pants",
        "Jogger Pants",
        "Oversized Tee",
        "Streetwear Jacket",
      ],
      Aksesoris: [
        "Topi Snapback",
        "Bucket Hat",
        "Tas Streetwear",
        "Belt",
        "Kaus Kaki",
        "Masker",
      ],
      Sepatu: ["Sneakers", "High Top", "Low Top", "Platform Shoes", "Slip On"],
    },
  },
  Outerwear: {
    icon: <Jacket className="w-5 h-5" />,
    subcategories: {
      Jaket: [
        "Denim Jacket",
        "Bomber Jacket",
        "Puffer Jacket",
        "Blazer",
        "Windbreaker",
        "Leather Jacket",
      ],
      "Coat & Cardigan": [
        "Trench Coat",
        "Wool Coat",
        "Cardigan",
        "Vest",
        "Parka",
      ],
    },
  },
  Footwear: {
    icon: <Footprints className="w-5 h-5" />,
    subcategories: {
      Sneakers: [
        "Running Shoes",
        "Casual Sneakers",
        "High Top",
        "Low Top",
        "Platform",
      ],
      Boots: ["Ankle Boots", "Combat Boots", "Chelsea Boots", "Platform Boots"],
      "Sandals & Slip On": ["Sandals", "Slip On", "Loafers", "Mules"],
    },
  },
  Dress: {
    icon: <Dress className="w-5 h-5" />,
    subcategories: {
      Dress: [
        "Midi Dress",
        "Maxi Dress",
        "Mini Dress",
        "Bodycon Dress",
        "A-Line Dress",
        "Wrap Dress",
      ],
      "Jumpsuit & Romper": ["Jumpsuit", "Romper", "Playsuit"],
    },
  },
  Casual: {
    icon: <Shirt className="w-5 h-5" />,
    subcategories: {
      Atasan: ["Kemeja", "Polo Shirt", "T-Shirt", "Blouse", "Tank Top"],
      Bawahan: ["Jeans", "Chinos", "Trousers", "Shorts", "Skirt"],
      Set: ["Set Casual", "Set Formal", "Set Olahraga"],
    },
  },
};

export default function CategoryDropdown({ isOpen, onClose, categories }) {
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0] || "Streetwear"
  );

  if (!isOpen) return null;

  const currentCategoryData =
    categoryData[selectedCategory] || categoryData.Streetwear;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Dropdown Menu */}
      <div className="fixed left-1/2 top-20 -translate-x-1/2 w-full max-w-5xl bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden mx-4">
        <div className="flex h-[500px]">
          {/* Left Panel - Kategori Utama */}
          <div className="w-64 bg-gray-800 text-white overflow-y-auto">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Kategori</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-700 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-2">
              {categories.map((category) => {
                const categoryInfo = categoryData[category];
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`}
                  >
                    {categoryInfo?.icon || <Package className="w-5 h-5" />}
                    <span className="text-sm font-medium">{category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Subkategori */}
          <div className="flex-1 bg-white overflow-y-auto p-6">
            {/* Category Header */}
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                {currentCategoryData.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCategory}
                </h2>
                <p className="text-sm text-gray-500">
                  Pilih subkategori yang Anda inginkan
                </p>
              </div>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-4 gap-6">
              {Object.entries(currentCategoryData.subcategories).map(
                ([subcategoryName, items]) => (
                  <div key={subcategoryName} className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">
                      {subcategoryName}
                    </h3>
                    <ul className="space-y-1">
                      {items.map((item) => (
                        <li key={item}>
                          <Link
                            to={`/products?category=${encodeURIComponent(
                              selectedCategory
                            )}&search=${encodeURIComponent(item)}`}
                            onClick={onClose}
                            className="text-sm text-gray-600 hover:text-green-600 transition-colors block py-1"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>

            {/* View All Category Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to={`/products?category=${encodeURIComponent(
                  selectedCategory
                )}`}
                onClick={onClose}
                className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold text-sm"
              >
                <span>Lihat Semua Produk {selectedCategory}</span>
                <ShoppingBag className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
