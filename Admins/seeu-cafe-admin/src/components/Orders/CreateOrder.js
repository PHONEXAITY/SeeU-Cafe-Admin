"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Minus,
  Trash2,
  Coffee,
  Loader2,
  Search,
  ShoppingCart,
  User,
  CreditCard,
  CheckCircle2,
  Home,
  Truck,
  Utensils,
  Info,
  FileText,
  X,
  MapPin,
  Filter,
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Bookmark,
  BookmarkPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/hooks/orderHooks";
import { useCreateOrder } from "@/hooks/orderHooks";
import { productService, orderService } from "@/services/api";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";

const MapComponent = ({ address, setAddress }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
    };

    const styleSheet = document.createElement("link");
    styleSheet.rel = "stylesheet";
    styleSheet.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";

    document.head.appendChild(styleSheet);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      const mapContainer = document.getElementById("map");
      if (!mapContainer) return;

      const initialPosition = [17.9757, 102.6331];

      const map = L.map("map").setView(initialPosition, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker(initialPosition, { draggable: true }).addTo(map);

      marker.on("dragend", function (e) {
        const position = marker.getLatLng();

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
        )
          .then((response) => response.json())
          .then((data) => {
            const addressText =
              data.display_name || `${position.lat}, ${position.lng}`;
            setAddress(addressText);
          })
          .catch((error) => {
            console.error("Error fetching address:", error);
            setAddress(`${position.lat}, ${position.lng}`);
          });
      });

      return () => {
        map.remove();
      };
    }
  }, [mapLoaded, setAddress]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    fetch(
      `https:
        searchQuery
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon, display_name } = data[0];

          const map = L.map("map").setView([lat, lon], 13);
          const marker = L.marker([lat, lon], { draggable: true }).addTo(map);

          setAddress(display_name);
        } else {
          toast.error("ບໍ່ພົບທີ່ຢູ່ທີ່ຄົ້ນຫາ");
        }
      })
      .catch((error) => {
        console.error("Error searching location:", error);
        toast.error("ການຄົ້ນຫາລົ້ມເຫຼວ");
      });
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="ຄົ້ນຫາທີ່ຢູ່..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="secondary">
          ຄົ້ນຫາ
        </Button>
      </form>

      <div
        id="map"
        className="h-52 rounded-lg border border-gray-200 shadow-sm"
        style={{ width: "100%" }}
      ></div>

      <Textarea
        placeholder="ທີ່ຢູ່ຈັດສົ່ງ..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="min-h-24 resize-none"
      />

      <p className="text-xs text-gray-500 flex items-center">
        <MapPin className="w-3 h-3 inline mr-1 text-orange-500" />
        ເລືອກຕຳແໜ່ງໂດຍການລາກໝຸດສີແດງໃນແຜນທີ່ ຫຼື ຄົ້ນຫາທີ່ຢູ່
      </p>
    </div>
  );
};

const ProductCard = ({ product, handleAddItem, activeTab }) => {
  if (!product || !product.name) {
    console.error("Invalid product passed to ProductCard:", product);
    return null;
  }

  const hasValidImage =
    product.image &&
    (product.image.startsWith("http") || product.image.startsWith("/"));
  return (
    <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-gray-200 group">
      <div className="h-40 overflow-hidden relative">
        {hasValidImage ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
            <Coffee className="h-12 w-12 text-gray-300" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="font-medium">
            {formatCurrency(product.price)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-gray-900 text-lg mb-1 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex justify-between items-center mt-auto">
          <Badge
            variant={activeTab === "food" ? "destructive" : "default"}
            className="opacity-80"
          >
            {activeTab === "food" ? "ອາຫານ" : "ເຄື່ອງດື່ມ"}
          </Badge>
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddItem(product)}
            className="rounded-full h-9 w-9 p-0 ml-auto bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CartItem = ({
  item,
  index,
  handleRemoveItem,
  handleQuantityChange,
  handleItemNoteChange,
}) => {
  return (
    <div className="border-b pb-4 last:border-0 pt-4 first:pt-0">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 line-clamp-1">
            {item.name}
          </h4>
          <div className="text-sm text-gray-500 mt-1">
            {formatCurrency(item.price)} x {item.quantity} ={" "}
            <span className="font-medium text-orange-600">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center border rounded-md bg-gray-50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(index, -1)}
              className="text-gray-500 h-8 w-8 p-0 hover:bg-gray-100 rounded-none rounded-l-md"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2 text-sm font-medium">{item.quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(index, 1)}
              className="text-gray-500 h-8 w-8 p-0 hover:bg-gray-100 rounded-none rounded-r-md"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveItem(index)}
            className="text-red-500 ml-1 h-8 w-8 p-0 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <Input
          type="text"
          placeholder="ໝາຍເຫດສຳລັບລາຍການນີ້..."
          value={item.notes || ""}
          onChange={(e) => handleItemNoteChange(index, e.target.value)}
          className="text-xs py-1 px-2 h-8 bg-gray-50 border-gray-200 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
    </div>
  );
};

const CreateOrder = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [foodProducts, setFoodProducts] = useState([]);
  const [beverageProducts, setBeverageProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [formState, setFormState] = useState({
    userId: "",
    orderType: "pickup",
    paymentMethod: "cash",
    status: "pending",
    preparationNotes: "",
    pickupTime: "",
    tableId: "",
    deliveryAddress: "",
    deliveryNote: "",
    deliveryFee: 5000,
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("food");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const user = useSelector(selectUser);

  useEffect(() => {
    if (user && user.id) {
      setFormState((prev) => ({ ...prev, userId: user.id.toString() }));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        console.log(
          "API URL:",
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
        );

        let foodData = [];
        try {
          const foodResponse = await productService.getFoodProducts();
          console.log("Raw Food Response:", foodResponse);

          if (foodResponse && foodResponse.data) {
            foodData = Array.isArray(foodResponse.data)
              ? foodResponse.data
              : foodResponse.data.data || [];
          }
        } catch (foodError) {
          console.error("Error fetching food products:", foodError);
        }

        let beverageData = [];
        try {
          const beverageResponse = await productService.getBeverageProducts();
          console.log("Raw Beverage Response:", beverageResponse);

          if (beverageResponse && beverageResponse.data) {
            beverageData = Array.isArray(beverageResponse.data)
              ? beverageResponse.data
              : beverageResponse.data.data || [];
          }
        } catch (beverageError) {
          console.error("Error fetching beverage products:", beverageError);
        }

        let tablesData = [];
        let categoriesData = [];

        try {
          const tablesResponse = await tableService.getAllTables("available");
          console.log("Table API Response:", tablesResponse);

          if (tablesResponse && Array.isArray(tablesResponse)) {
            tablesData = tablesResponse;
          } else if (
            tablesResponse &&
            tablesResponse.data &&
            Array.isArray(tablesResponse.data)
          ) {
            tablesData = tablesResponse.data;
          } else {
            console.warn("Invalid tables data structure:", tablesResponse);
            tablesData = [];
          }

          tablesData = tablesData.map((table) => ({
            id: table.id,
            number: table.number || 0,
            capacity: table.capacity || 1,
            status: table.status || "available",
          }));
        } catch (error) {
          console.error("Error fetching tables:", error);
          tablesData = [];
        }

        try {
          const categoriesResponse = await productService.getCategories();
          categoriesData = Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : categoriesResponse.data?.data || [];
        } catch (error) {
          console.error("Error fetching categories:", error);
        }

        const processedFoodData = foodData
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            id: item.id || Math.random().toString(36).substring(2, 9),
            name: item.name || "Unknown Food Item",
            price: parseFloat(item.price) || 0,
            description: item.description || "",
            category_id: item.category_id || item.categoryId || "1",
            image: item.image || null,
            status: item.status || "active",
          }));

        const processedBeverageData = beverageData
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            id: item.id || Math.random().toString(36).substring(2, 9),
            name: item.name || "Unknown Beverage Item",
            price: parseFloat(item.price) || 0,
            description: item.description || "",
            category_id: item.category_id || item.categoryId || "2",
            image: item.image || null,
            status: item.status || "active",
          }));

        console.log("Processed Food Data:", processedFoodData);
        console.log("Processed Beverage Data:", processedBeverageData);

        setFoodProducts(processedFoodData);
        setBeverageProducts(processedBeverageData);
        setTables(tablesData);
        setCategories(categoriesData);

        if (
          processedFoodData.length === 0 &&
          processedBeverageData.length === 0
        ) {
          setErrorMessage(
            "ບໍ່ພົບຂໍ້ມູນສິນຄ້າ. ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ກັບເຊີບເວີ."
          );
        }

        if (user && user.id) {
          setFavoriteItems([
            { name: "ເຂົ້າຜັດກະເພົາ", count: 5 },
            { name: "ຕຳໝາກຫຸ່ງ", count: 3 },
            { name: "ກາເຟດຳ", count: 8 },
          ]);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setErrorMessage("ບໍ່ສາມາດດຶງຂໍ້ມູນສິນຄ້າໄດ້. ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.");

        if (process.env.NODE_ENV === "development") {
          console.log("Setting mock data for development testing");
          const mockFoodData = [
            {
              id: "f1",
              name: "ເຂົ້າຜັດກະເພົາ",
              price: 25000,
              description: "ເຂົ້າຜັດກະເພົາແຊບໆ",
              category_id: "1",
              status: "active",
            },
            {
              id: "f2",
              name: "ຕຳໝາກຫຸ່ງ",
              price: 20000,
              description: "ຕຳໝາກຫຸ່ງລາວແທ້",
              category_id: "1",
              status: "active",
            },
            {
              id: "f3",
              name: "ແກງເຜັດ",
              price: 30000,
              description: "ແກງເຜັດປາແຊບ",
              category_id: "1",
              status: "active",
            },
          ];

          const mockBeverageData = [
            {
              id: "b1",
              name: "ກາເຟດຳ",
              price: 15000,
              description: "ກາເຟດຳຫອມໆ",
              category_id: "2",
              status: "active",
            },
            {
              id: "b2",
              name: "ຊາຂຽວ",
              price: 18000,
              description: "ຊາຂຽວເຢັນສົດຊື່ນ",
              category_id: "2",
              status: "active",
            },
            {
              id: "b3",
              name: "ນ້ຳໝາກໄມ້ປັ່ນ",
              price: 22000,
              description: "ນ້ຳໝາກໄມ້ປັ່ນສົດ",
              category_id: "2",
              status: "active",
            },
          ];

          setFoodProducts(mockFoodData);
          setBeverageProducts(mockBeverageData);
          setErrorMessage("ກຳລັງໃຊ້ຂໍ້ມູນຕົວຢ່າງສຳລັບການທົດສອບ.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredProducts = React.useMemo(() => {
    console.log("Filtering products for tab:", activeTab);
    console.log("Available Food Products:", foodProducts.length);
    console.log("Available Beverage Products:", beverageProducts.length);

    const sourceProducts =
      activeTab === "food" ? foodProducts : beverageProducts;

    return sourceProducts.filter((product) => {
      if (!product || !product.name) {
        return false;
      }

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const isActive = product.status === "active" || !product.status;

      const matchesCategory =
        categoryFilter === "all" ||
        (product.category_id &&
          product.category_id.toString() === categoryFilter);

      return matchesSearch && isActive && matchesCategory;
    });
  }, [activeTab, foodProducts, beverageProducts, searchTerm, categoryFilter]);

  const calculateTotal = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleAddItem = (product) => {
    const existingItemIndex = selectedItems.findIndex(
      (item) =>
        (item.food_menu_id === product.id && activeTab === "food") ||
        (item.beverage_menu_id === product.id && activeTab === "beverage")
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      const newItem = {
        food_menu_id: activeTab === "food" ? product.id : null,
        beverage_menu_id: activeTab === "beverage" ? product.id : null,
        name: product.name,
        price: product.price,
        quantity: 1,
        notes: "",
        image: product.image || null,
      };
      setSelectedItems([...selectedItems, newItem]);
    }

    toast.success(`ເພີ່ມ ${product.name} ສຳເລັດ`, {
      style: {
        borderRadius: "10px",
        background: "#22c55e",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#22c55e",
      },
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
    toast.success("ລຶບສິນຄ້າສຳເລັດ", {
      style: {
        borderRadius: "10px",
        background: "#ef4444",
        color: "#fff",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#ef4444",
      },
    });
  };

  const handleQuantityChange = (index, change) => {
    const updatedItems = [...selectedItems];
    const newQuantity = Math.max(1, updatedItems[index].quantity + change);
    updatedItems[index].quantity = newQuantity;
    setSelectedItems(updatedItems);
  };

  const handleItemNoteChange = (index, note) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].notes = note;
    setSelectedItems(updatedItems);
  };

  const handleFormChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));

    if (name === "orderType") {
      if (value === "pickup") {
        setFormState((prev) => ({
          ...prev,
          tableId: "",
          deliveryAddress: "",
          deliveryNote: "",
          orderType: value,
        }));
      } else if (value === "delivery") {
        setFormState((prev) => ({
          ...prev,
          tableId: "",
          pickupTime: "",
          orderType: value,
        }));
      } else if (value === "table") {
        setFormState((prev) => ({
          ...prev,
          pickupTime: "",
          deliveryAddress: "",
          deliveryNote: "",
          deliveryFee: 0,
          orderType: value,
        }));
      }
    }
  };

  const validateForm = () => {
    if (!formState.userId) {
      toast.error("ກະລຸນາເລືອກລູກຄ້າ");
      return false;
    }

    if (selectedItems.length === 0) {
      toast.error("ກະລຸນາເລືອກສິນຄ້າຢ່າງໜ້ອຍ 1 ລາຍການ");
      return false;
    }

    if (formState.orderType === "table" && !formState.tableId) {
      toast.error("ກະລຸນາເລືອກໂຕະ");
      return false;
    }

    if (formState.orderType === "delivery" && !formState.deliveryAddress) {
      toast.error("ກະລຸນາປ້ອນທີ່ຢູ່ຈັດສົ່ງ");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmOrder = async () => {
    try {
      setIsLoading(true);

      const orderData = {
        User_id: parseInt(formState.userId),
        order_type: formState.orderType,
        status: formState.status,
        total_price: calculateTotal(),
        preparation_notes: formState.preparationNotes,
        pickup_time:
          formState.orderType === "pickup" && formState.pickupTime
            ? new Date(formState.pickupTime).toISOString()
            : null,
        table_id:
          formState.orderType === "table" && formState.tableId
            ? parseInt(formState.tableId)
            : null,
        order_details: selectedItems.map((item) => ({
          food_menu_id: item.food_menu_id,
          beverage_menu_id: item.beverage_menu_id,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
        })),
        delivery:
          formState.orderType === "delivery"
            ? {
                delivery_address: formState.deliveryAddress,
                customer_note: formState.deliveryNote,
                delivery_fee: parseFloat(formState.deliveryFee) || 0,
              }
            : null,
      };

      console.log("Submitting order data:", orderData);
      const response = await orderService.createOrder(orderData);
      console.log("Order creation response:", response);

      toast.success("ສ້າງການສັ່ງຊື້ສຳເລັດ", {
        style: {
          borderRadius: "10px",
          background: "#3b82f6",
          color: "#fff",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#3b82f6",
        },
      });

      setShowConfirmDialog(false);

      setTimeout(() => {
        router.push(`/Orders/list`);
      }, 1000);
    } catch (error) {
      console.error("Failed to create order:", error);

      let errorMsg = "ການສ້າງການສັ່ງຊື້ລົ້ມເຫຼວ";
      if (error.response) {
        console.error("Error response:", error.response.data);
        if (error.response.data && error.response.data.message) {
          errorMsg += `: ${error.response.data.message}`;
        }
      }

      toast.error(errorMsg);
      setShowConfirmDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredCategories = () => {
    if (!categories || categories.length === 0) return [];
    return categories.filter(
      (cat) => cat.type === (activeTab === "food" ? "food" : "beverage")
    );
  };

  const handleRetryFetch = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [foodResponse, beverageResponse] = await Promise.all([
        productService.getFoodProducts(),
        productService.getBeverageProducts(),
      ]);

      const foodData = Array.isArray(foodResponse.data)
        ? foodResponse.data
        : foodResponse.data?.data || [];

      const beverageData = Array.isArray(beverageResponse.data)
        ? beverageResponse.data
        : beverageResponse.data?.data || [];

      const processedFoodData = foodData
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          id: item.id || Math.random().toString(36).substring(2, 9),
          name: item.name || "Unknown Food Item",
          price: parseFloat(item.price) || 0,
          description: item.description || "",
          category_id: item.category_id || item.categoryId || "1",
          image: item.image || null,
          status: item.status || "active",
        }));

      const processedBeverageData = beverageData
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          id: item.id || Math.random().toString(36).substring(2, 9),
          name: item.name || "Unknown Beverage Item",
          price: parseFloat(item.price) || 0,
          description: item.description || "",
          category_id: item.category_id || item.categoryId || "2",
          image: item.image || null,
          status: item.status || "active",
        }));

      setFoodProducts(processedFoodData);
      setBeverageProducts(processedBeverageData);

      if (
        processedFoodData.length === 0 &&
        processedBeverageData.length === 0
      ) {
        setErrorMessage(
          "ຍັງບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາກວດສອບການເຊື່ອມຕໍ່ຂອງທ່ານ."
        );
      } else {
        toast.success("ດຶງຂໍ້ມູນສິນຄ້າສຳເລັດ");
      }
    } catch (error) {
      console.error("Error retrying fetch:", error);
      setErrorMessage("ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່ພາຍຫລັງ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-['Phetsarath_OT']">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                ສ້າງລາຍການສັ່ງຊື້ໃໝ່
              </h1>
              <p className="text-gray-500 text-sm">
                ເລືອກສິນຄ້າແລະວິທີການຈັດສົ່ງທີ່ທ່ານຕ້ອງການ
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/Orders/list")}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" /> ເບິ່ງລາຍການສັ່ງຊື້ທັງໝົດ
            </Button>
            <Button
              variant="default"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white gap-2 shadow-sm"
              onClick={handleSubmit}
              disabled={isLoading || selectedItems.length === 0}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              ສ້າງການສັ່ງຊື້
            </Button>
          </div>
        </div>

        {}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{errorMessage}</p>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryFetch}
                disabled={isLoading}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                ລອງໃໝ່
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-5">
            <Card className="overflow-hidden border-gray-200 shadow-sm">
              <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  ຂໍ້ມູນການສັ່ງຊື້
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                {user ? (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <Label className="text-blue-700 font-medium">
                      ສັ່ງໃນນາມ
                    </Label>
                    <div className="flex items-center mt-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                        {user.first_name?.charAt(0) || "U"}
                        {user.last_name?.charAt(0) || ""}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.first_name || ""} {user.last_name || ""}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          {user.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="userId">
                      ເລືອກລູກຄ້າ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="userId"
                      type="number"
                      placeholder="ລະຫັດລູກຄ້າ"
                      value={formState.userId}
                      onChange={(e) =>
                        handleFormChange("userId", e.target.value)
                      }
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ໝາຍເຫດ: ໃສ່ ID ລູກຄ້າທີ່ມີໃນລະບົບ
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orderType">
                      ປະເພດການສັ່ງຊື້ <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formState.orderType}
                      onValueChange={(value) =>
                        handleFormChange("orderType", value)
                      }
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">
                          <div className="flex items-center">
                            <Home className="w-4 h-4 mr-2 text-orange-500" />
                            <span>ຮັບດ້ວຍຕົນເອງ</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="delivery">
                          <div className="flex items-center">
                            <Truck className="w-4 h-4 mr-2 text-blue-500" />
                            <span>ສົ່ງເຖິງບ້ານ</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="table">
                          <div className="flex items-center">
                            <Utensils className="w-4 h-4 mr-2 text-green-500" />
                            <span>ຮັບປະທານໃນຮ້ານ</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">
                      ສະຖານະ <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formState.status}
                      onValueChange={(value) =>
                        handleFormChange("status", value)
                      }
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-amber-500" />
                            ລໍຖ້າ
                          </div>
                        </SelectItem>
                        <SelectItem value="processing">
                          <div className="flex items-center">
                            <Coffee className="w-4 h-4 mr-2 text-blue-500" />
                            ກຳລັງດຳເນີນ
                          </div>
                        </SelectItem>
                        <SelectItem value="ready">
                          <div className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                            ພ້ອມສົ່ງ
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-3">
                  {formState.orderType === "pickup" && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <Label
                        htmlFor="pickupTime"
                        className="text-orange-800 flex items-center mb-2"
                      >
                        <Clock className="w-4 h-4 mr-2 text-orange-600" />
                        ເວລານັດຮັບສິນຄ້າ
                      </Label>
                      <Input
                        id="pickupTime"
                        type="datetime-local"
                        value={formState.pickupTime}
                        onChange={(e) =>
                          handleFormChange("pickupTime", e.target.value)
                        }
                        className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                      <p className="text-xs text-orange-700 mt-2">
                        ເລືອກເວລາທີ່ທ່ານຕ້ອງການມາຮັບສິນຄ້າ
                      </p>
                    </div>
                  )}

                  {formState.orderType === "table" && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <Label
                        htmlFor="tableId"
                        className="text-green-800 flex items-center mb-2"
                      >
                        <Utensils className="w-4 h-4 mr-2 text-green-600" />
                        ເລືອກໂຕະ <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formState.tableId}
                        onValueChange={(value) =>
                          handleFormChange("tableId", value)
                        }
                      >
                        <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400">
                          <SelectValue placeholder="ເລືອກໂຕະ..." />
                        </SelectTrigger>
                        <SelectContent>
                          {tables && tables.length > 0 ? (
                            tables.map((table) => (
                              <SelectItem
                                key={table.id}
                                value={table.id.toString()}
                              >
                                ໂຕະ {table.number} (ຄວາມຈຸ: {table.capacity}{" "}
                                ທ່ານ)
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              {isLoading
                                ? "ກຳລັງໂຫລດຂໍ້ມູນໂຕະ..."
                                : "ບໍ່ມີໂຕະຫວ່າງ"}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {tables && tables.length === 0 && !isLoading && (
                        <p className="text-xs text-red-600 mt-2">
                          ບໍ່ພົບຂໍ້ມູນໂຕະທີ່ພ້ອມໃຊ້ງານ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ
                        </p>
                      )}
                      <p className="text-xs text-green-700 mt-2">
                        ເລືອກໂຕະທີ່ທ່ານຕ້ອງການນັ່ງ
                      </p>
                    </div>
                  )}

                  {formState.orderType === "delivery" && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <Label
                        htmlFor="deliveryAddress"
                        className="text-blue-800 flex items-center mb-2"
                      >
                        <Truck className="w-4 h-4 mr-2 text-blue-600" />
                        ທີ່ຢູ່ຈັດສົ່ງ <span className="text-red-500">*</span>
                      </Label>
                      <MapComponent
                        address={formState.deliveryAddress}
                        setAddress={(address) =>
                          handleFormChange("deliveryAddress", address)
                        }
                      />

                      <div className="mt-4">
                        <Label
                          htmlFor="deliveryNote"
                          className="text-blue-800 flex items-center mb-2"
                        >
                          <FileText className="w-4 h-4 mr-2 text-blue-600" />
                          ໝາຍເຫດການຈັດສົ່ງ
                        </Label>
                        <Textarea
                          id="deliveryNote"
                          placeholder="ໝາຍເຫດການຈັດສົ່ງ..."
                          value={formState.deliveryNote}
                          onChange={(e) =>
                            handleFormChange("deliveryNote", e.target.value)
                          }
                          className="resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>

                      <div className="mt-4">
                        <Label
                          htmlFor="deliveryFee"
                          className="text-blue-800 flex items-center mb-2"
                        >
                          <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                          ຄ່າຈັດສົ່ງ
                        </Label>
                        <Input
                          id="deliveryFee"
                          type="number"
                          placeholder="0"
                          value={formState.deliveryFee}
                          onChange={(e) =>
                            handleFormChange("deliveryFee", e.target.value)
                          }
                          className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                        <p className="text-xs text-blue-700 mt-2">
                          ຄ່າບໍລິການຈັດສົ່ງອາຫານ
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="preparationNotes"
                    className="flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    ໝາຍເຫດສຳລັບການກະກຽມ
                  </Label>
                  <Textarea
                    id="preparationNotes"
                    placeholder="ໝາຍເຫດເພີ່ມເຕີມສຳລັບການກະກຽມອາຫານ..."
                    value={formState.preparationNotes}
                    onChange={(e) =>
                      handleFormChange("preparationNotes", e.target.value)
                    }
                    className="mt-1 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-gray-200 shadow-sm">
              <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-orange-500" />
                    ລາຍການສິນຄ້າທີ່ເລືອກ
                  </CardTitle>
                  <Badge variant="outline" className="bg-white">
                    {selectedItems.length} ລາຍການ
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-700 font-medium">
                      ຍັງບໍ່ມີສິນຄ້າທີ່ເລືອກ
                    </p>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                      ກະລຸນາເລືອກສິນຄ້າຈາກລາຍການດ້ານຂວາ
                      ເພື່ອເພີ່ມເຂົ້າໃນລາຍການສັ່ງຊື້
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-96 overflow-y-auto">
                    <div className="px-5 divide-y divide-gray-100">
                      {selectedItems.map((item, index) => (
                        <CartItem
                          key={index}
                          item={item}
                          index={index}
                          handleRemoveItem={handleRemoveItem}
                          handleQuantityChange={handleQuantityChange}
                          handleItemNoteChange={handleItemNoteChange}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>

              <CardFooter className="bg-gray-50 border-t p-5">
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ລວມຍອດສິນຄ້າ:</span>
                    <span className="font-medium">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>

                  {formState.orderType === "delivery" &&
                    parseFloat(formState.deliveryFee) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ຄ່າຈັດສົ່ງ:</span>
                        <span className="font-medium">
                          {formatCurrency(parseFloat(formState.deliveryFee))}
                        </span>
                      </div>
                    )}

                  <Separator className="my-2" />

                  <div className="flex justify-between">
                    <span className="text-gray-900 font-semibold">
                      ລວມທັງໝົດ:
                    </span>
                    <span className="text-orange-600 font-bold text-lg">
                      {formatCurrency(
                        calculateTotal() +
                          (formState.orderType === "delivery"
                            ? parseFloat(formState.deliveryFee) || 0
                            : 0)
                      )}
                    </span>
                  </div>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full mt-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    size="lg"
                    disabled={isLoading || selectedItems.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ກຳລັງດຳເນີນການ...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        ສ້າງການສັ່ງຊື້
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <Card className="border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {activeTab === "food" ? (
                      <Coffee className="h-5 w-5 text-orange-500" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    )}
                    ເລືອກສິນຄ້າ
                  </CardTitle>

                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="ຄົ້ນຫາສິນຄ້າ..."
                      className="pl-9 border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>

              <Tabs
                defaultValue="food"
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-2"
              >
                <div className="px-6">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger
                      value="food"
                      className="flex items-center data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700"
                    >
                      <Coffee className="w-4 h-4 mr-2" />
                      ເມນູອາຫານ
                    </TabsTrigger>
                    <TabsTrigger
                      value="beverage"
                      className="flex items-center data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      ເມນູເຄື່ອງດື່ມ
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-6 pt-4 pb-2 border-b">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm flex items-center text-gray-500">
                      <Filter className="w-4 h-4 mr-1" /> ກັ່ນຕອງຕາມໝວດໝູ່:
                    </Label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-48 h-8 text-xs border-gray-200 focus:border-orange-400 focus:ring-orange-400">
                        <SelectValue placeholder="ທັງໝົດ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ທັງໝົດ</SelectItem>
                        {getFilteredCategories().map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TabsContent value="food" className="m-0 p-6">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <Card
                            key={index}
                            className="rounded-lg border animate-pulse overflow-hidden"
                          >
                            <div className="h-40 bg-gray-200" />
                            <CardContent className="p-4">
                              <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
                              <div className="w-1/2 h-4 bg-gray-200 rounded mb-3"></div>
                              <div className="flex justify-between items-center">
                                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          handleAddItem={handleAddItem}
                          activeTab={activeTab}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Info className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        ບໍ່ພົບສິນຄ້າ
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        ບໍ່ພົບສິນຄ້າທີ່ກົງກັບການຄົ້ນຫາ. ກະລຸນາລອງຄຳອື່ນ ຫຼື
                        ເລືອກໝວດໝູ່ອື່ນ.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="beverage" className="m-0 p-6">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <Card
                            key={index}
                            className="rounded-lg border animate-pulse overflow-hidden"
                          >
                            <div className="h-40 bg-gray-200" />
                            <CardContent className="p-4">
                              <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
                              <div className="w-1/2 h-4 bg-gray-200 rounded mb-3"></div>
                              <div className="flex justify-between items-center">
                                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          handleAddItem={handleAddItem}
                          activeTab={activeTab}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Info className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        ບໍ່ພົບສິນຄ້າ
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        ບໍ່ພົບສິນຄ້າທີ່ກົງກັບການຄົ້ນຫາ. ກະລຸນາລອງຄຳອື່ນ ຫຼື
                        ເລືອກໝວດໝູ່ອື່ນ.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>

            {user && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card className="border-gray-200 shadow-sm overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      ສິນຄ້າທີ່ສັ່ງຊື້ເລື້ອຍໆ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    {favoriteItems.length > 0 ? (
                      <div className="space-y-2">
                        {favoriteItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <div className="bg-amber-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                <Bookmark className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ສັ່ງຊື້ {item.count} ຄັ້ງ
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-full hover:bg-amber-100 hover:text-amber-600"
                              onClick={() => {
                                const foundProduct = [
                                  ...foodProducts,
                                  ...beverageProducts,
                                ].find((p) => p.name === item.name);
                                if (foundProduct) {
                                  handleAddItem(foundProduct);
                                } else {
                                  toast.error(`ບໍ່ພົບ ${item.name} ໃນເມນູ`);
                                }
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Bookmark className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">
                          ຍັງບໍ່ມີສິນຄ້າທີ່ສັ່ງຊື້ເລື້ອຍໆ
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          ສິນຄ້າທີ່ທ່ານສັ່ງຊື້ເລື້ອຍໆຈະປະກົດຢູ່ທີ່ນີ້
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-500" />
                      ປະຫວັດການສັ່ງຊື້
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <p className="text-2xl font-bold text-indigo-600">
                            0
                          </p>
                          <p className="text-xs text-indigo-900">ວັນນີ້</p>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <p className="text-2xl font-bold text-indigo-600">
                            0
                          </p>
                          <p className="text-xs text-indigo-900">ອາທິດນີ້</p>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <p className="text-2xl font-bold text-indigo-600">
                            0
                          </p>
                          <p className="text-xs text-indigo-900">ທັງໝົດ</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button
                          variant="outline"
                          className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          onClick={() => router.push("/order-history")}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          ເບິ່ງປະຫວັດການສັ່ງຊື້ທັງໝົດ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xl">ຢືນຢັນການສັ່ງຊື້</span>
            </DialogTitle>
            <DialogDescription>
              ກະລຸນາກວດສອບລາຍລະອຽດການສັ່ງຊື້ຂອງທ່ານ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">ລູກຄ້າ</Label>
                  <p className="font-medium">
                    {user
                      ? `${user.first_name || ""} ${user.last_name || ""}`
                      : `ID: ${formState.userId}`}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">ປະເພດການສັ່ງຊື້</Label>
                  <p className="font-medium flex items-center">
                    {formState.orderType === "pickup" ? (
                      <>
                        <Home className="w-4 h-4 mr-1 text-orange-500" />
                        ຮັບດ້ວຍຕົນເອງ
                      </>
                    ) : formState.orderType === "delivery" ? (
                      <>
                        <Truck className="w-4 h-4 mr-1 text-blue-500" />
                        ສົ່ງເຖິງບ້ານ
                      </>
                    ) : (
                      <>
                        <Utensils className="w-4 h-4 mr-1 text-green-500" />
                        ຮັບປະທານໃນຮ້ານ
                      </>
                    )}
                  </p>
                </div>
              </div>

              {formState.orderType === "pickup" && formState.pickupTime && (
                <div className="mt-4 p-3 bg-orange-50 rounded-md border border-orange-100">
                  <Label className="text-orange-700">ເວລານັດຮັບສິນຄ້າ</Label>
                  <p className="font-medium text-orange-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-orange-600" />
                    {new Date(formState.pickupTime).toLocaleString()}
                  </p>
                </div>
              )}

              {formState.orderType === "table" && formState.tableId && (
                <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
                  <Label className="text-green-700">ໂຕະ</Label>
                  <p className="font-medium text-green-900 flex items-center">
                    <Utensils className="w-4 h-4 mr-1 text-green-600" />
                    {tables.find((t) => t.id.toString() === formState.tableId)
                      ? `ໂຕະເບີ ${
                          tables.find(
                            (t) => t.id.toString() === formState.tableId
                          ).number
                        } (ຄວາມຈຸ: ${
                          tables.find(
                            (t) => t.id.toString() === formState.tableId
                          ).capacity
                        } ທ່ານ)`
                      : formState.tableId}
                  </p>
                </div>
              )}

              {formState.orderType === "delivery" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <Label className="text-blue-700">ທີ່ຢູ່ຈັດສົ່ງ</Label>
                  <p className="font-medium text-blue-900 flex items-start">
                    <MapPin className="w-4 h-4 mr-1 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">
                      {formState.deliveryAddress}
                    </span>
                  </p>
                  {formState.deliveryNote && (
                    <div className="mt-2">
                      <Label className="text-blue-700">ໝາຍເຫດການຈັດສົ່ງ</Label>
                      <p className="text-sm text-blue-900">
                        {formState.deliveryNote}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700 flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2 text-gray-600" />
                ລາຍການສິນຄ້າ ({selectedItems.length})
              </Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b py-2 px-4 grid grid-cols-12 text-sm font-medium text-gray-600">
                  <div className="col-span-6">ລາຍການ</div>
                  <div className="col-span-2 text-center">ຈຳນວນ</div>
                  <div className="col-span-2 text-right">ລາຄາ</div>
                  <div className="col-span-2 text-right">ລວມ</div>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {selectedItems.map((item, index) => (
                    <div
                      key={index}
                      className="py-3 px-4 grid grid-cols-12 items-center text-sm"
                    >
                      <div className="col-span-6">
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        {item.notes && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.notes}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 text-center">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-right">
                        {formatCurrency(item.price)}
                      </div>
                      <div className="col-span-2 text-right font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ລວມຍອດສິນຄ້າ:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>

                {formState.orderType === "delivery" &&
                  parseFloat(formState.deliveryFee) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ຄ່າຈັດສົ່ງ:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(parseFloat(formState.deliveryFee))}
                      </span>
                    </div>
                  )}

                <Separator className="my-2 bg-orange-200" />

                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">
                    ລວມທັງໝົດ:
                  </span>
                  <span className="text-orange-600 font-bold text-lg">
                    {formatCurrency(
                      calculateTotal() +
                        (formState.orderType === "delivery"
                          ? parseFloat(formState.deliveryFee) || 0
                          : 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              ຍົກເລີກ
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 flex-1 sm:flex-none"
              onClick={handleConfirmOrder}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ກຳລັງດຳເນີນການ...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  ຢືນຢັນການສັ່ງຊື້
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateOrder;
