import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ShoppingBag,
  Coffee,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatCurrency } from "@/hooks/productHooks";

export const ProductCard = React.memo(
  ({ product, onView, onEdit, onDelete, getCategoryName }) => {
    const router = useRouter();

    // Render status badge based on product status
    const renderStatusBadge = (status) => (
      <Badge
        variant={status === "active" ? "success" : "destructive"}
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === "active"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {status === "active" ? "ເປີດໃຊ້ງານ" : "ປິດໃຊ້ງານ"}
      </Badge>
    );

    return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full flex flex-col overflow-hidden border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="p-0">
            <div
              className="relative aspect-square w-full group cursor-pointer"
              onClick={() => onView(product)}
            >
              {product.image ? (
                <>
                  <Image
                    src={product.image}
                    alt={product.name}
                    priority
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                    <Button
                      variant="ghost"
                      className="text-white mb-4 hover:bg-white/20 border border-white/40"
                    >
                      <Eye className="h-4 w-4 mr-2" /> ເບິ່ງລາຍລະອຽດ
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  {product.type === "food" ? (
                    <ShoppingBag className="h-12 w-12 text-gray-300" />
                  ) : (
                    <Coffee className="h-12 w-12 text-gray-300" />
                  )}
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge
                  variant={product.type === "food" ? "secondary" : "default"}
                  className={
                    product.type === "food"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }
                >
                  {product.type === "food" ? "ອາຫານ" : "ເຄື່ອງດື່ມ"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <div className="mb-2 flex justify-between items-start">
              <h3
                className="font-medium text-base line-clamp-2"
                title={product.name}
              >
                {product.name}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(product)}>
                    <Eye className="mr-2 h-4 w-4" /> ເບິ່ງລາຍລະອຽດ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/products/${product.type}/${product.id}`)
                    }
                  >
                    <Info className="mr-2 h-4 w-4" /> ລາຍລະອຽດເພີ່ມເຕີມ
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="mr-2 h-4 w-4" /> ແກ້ໄຂ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(product)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> ລຶບ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              {getCategoryName(product.category_id)}
            </div>
            {renderStatusBadge(product.status)}
          </CardContent>
          <CardFooter className="p-4 pt-0 mt-auto">
            {product.type === "food" ? (
              <div className="text-lg font-bold text-amber-600">
                {formatCurrency(product.price)}
              </div>
            ) : (
              <div className="w-full">
                {product.hot_price && (
                  <div className="flex justify-between text-sm mb-1">
                    <span>ຮ້ອນ:</span>
                    <span className="font-medium text-amber-600">
                      {formatCurrency(product.hot_price)}
                    </span>
                  </div>
                )}
                {product.ice_price && (
                  <div className="flex justify-between text-sm">
                    <span>ເຢັນ:</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(product.ice_price)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";
