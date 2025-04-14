// app/products/[type]/[id]/page.js
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/api";
import { Loader2, ShoppingBag, Coffee, Share2, Star } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/hooks/productHooks";
import { motion } from "framer-motion";
import Layout from '@/components/layout/Layout';

export default function ProductDetail({ params }) {
  const router = useRouter();
  const { type, id } = params;

  const fetchProduct = async () => {
    if (!id || !type) return null;
    if (type === "food") {
      const response = await productService.getFoodProductById(id);
      return { ...response.data, type: "food" };
    } else if (type === "beverage") {
      const response = await productService.getBeverageProductById(id);
      return { ...response.data, type: "beverage" };
    }
    throw new Error("Invalid product type");
  };

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", type, id],
    queryFn: fetchProduct,
    enabled: !!id && !!type,
  });

  // ฟังก์ชันแชร์ไปยังโซเชียลมีเดีย (ตัวอย่างง่าย ๆ)
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `ເບິ່ງສິນຄ້ານີ້: ${product.name}`,
        url,
      });
    } else {
      alert(`ແຊร์ລິ້ງນີ້: ${url}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-amber-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">404 - ບໍ່ພົບສິນຄ້າ</h1>
        <p className="text-gray-500">ບໍ່ສາມາດຄົ້ນຫາສິນຄ້າທີ່ທ່ານຕ້ອງການໄດ້</p>
        <Button onClick={() => router.push("/products")} className="mt-4 bg-amber-500 hover:bg-amber-600">
          ກັບຄືນໄປຫາລາຍການສິນຄ້າ
        </Button>
      </div>
    );
  }

  return (
    <Layout>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto font-['Phetsarath_OT']"
      style={{ width: "1101px", height: "747px" }} // ขนาดที่กำหนด
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          ກັບຄືນ
        </Button>
        <Button variant="ghost" onClick={handleShare} className="text-amber-600 hover:text-amber-800">
          <Share2 className="h-5 w-5 mr-2" /> ແຊร์
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6 h-[calc(747px-80px)] flex flex-col md:flex-row gap-6">
        {/* Image Section */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full md:w-1/2 h-[400px] rounded-lg overflow-hidden"
        >
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              {product.type === "food" ? (
                <ShoppingBag className="h-16 w-16 text-gray-300" />
              ) : (
                <Coffee className="h-16 w-16 text-gray-300" />
              )}
            </div>
          )}
        </motion.div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              <Badge
                variant={product.type === "food" ? "secondary" : "default"}
                className={product.type === "food" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}
              >
                {product.type === "food" ? "ອາຫານ" : "ເຄື່ອງດື່ມ"}
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">{product.description || "ບໍ່ມີລາຍລະອຽດ"}</p>
            {product.type === "food" ? (
              <div className="text-2xl font-bold text-amber-600 mb-4">{formatCurrency(product.price)}</div>
            ) : (
              <div className="mb-4">
                {product.hot_price && (
                  <p className="text-lg">
                    ຮ້ອນ: <span className="font-bold text-amber-600">{formatCurrency(product.hot_price)}</span>
                  </p>
                )}
                {product.ice_price && (
                  <p className="text-lg">
                    ເຢັນ: <span className="font-bold text-blue-600">{formatCurrency(product.ice_price)}</span>
                  </p>
                )}
              </div>
            )}
            <div className="mb-4">
              <span className="text-gray-500">ສະຖານະ: </span>
              <Badge
                variant={product.status === "active" ? "success" : "destructive"}
                className={product.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}
              >
                {product.status === "active" ? "ເປີດໃຊ້ງານ" : "ປິດໃຊ້ງານ"}
              </Badge>
            </div>
            <div className="mb-4">
              <span className="text-gray-500">ໝວດໝູ່: </span>
              <span className="text-gray-800">{product.category?.name || "ບໍ່ລະບຸ"}</span>
            </div>
          </div>

          {/* Review Section (เพิ่มความน่าสนใจ) */}
          <div className="">
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-2 text-gray-700">4.5 (20 ຣີວິວ)</span>
            </div>
            <p className="text-sm text-gray-500 italic">"ອາຫານແຊບຫຼາຍ, ບໍລິການດີ!" - ລູກຄ້າທີ່ບໍ່ປະສົງອອກຊື່</p>
          </div>
        </div>
      </div>
    </motion.div>
    </Layout>
  );
}