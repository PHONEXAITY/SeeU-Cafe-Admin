"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  RefreshCw,
  Table as TableIcon,
  Search,
  SlidersHorizontal,
  Info,
  LayoutGrid,
  LayoutList,
  ArrowUpDown,
  Utensils,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import TableCard from "./TableCard";
import TableFilter from "./TableFilter";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTableManagement } from "@/hooks/useTableManagement";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ApiStatusIndicator } from "./ApiStatusIndicator";
import TableStatusBadge from "./TableStatusBadge";

const TableList = () => {
  const [filter, setFilter] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("number-asc");
  const [quickSearch, setQuickSearch] = useState("");
  const router = useRouter();

  const {
    tables,
    loading,
    error,
    setFilter: applyFilter,
    updateTableStatus,
    startTableSession,
    endTableSession,
    refreshTables,
  } = useTableManagement();

  useEffect(() => {
    applyFilter(filter);
  }, [filter, applyFilter]);

  const filterTables = (tables, filter) => {
    if (!tables || !Array.isArray(tables)) {
      console.warn("Tables is not an array in filterTables:", tables);
      return [];
    }

    let filteredTables = [...tables];

    // Apply quick search
    if (quickSearch) {
      const searchTerm = quickSearch.toLowerCase();
      filteredTables = filteredTables.filter((table) =>
        table.number.toString().includes(searchTerm)
      );
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filteredTables = filteredTables.filter(
        (table) => table.status === activeTab
      );
    }

    // Apply advanced filters
    if (filter) {
      filteredTables = filteredTables.filter((table) => {
        if (
          filter.status &&
          filter.status !== "all" &&
          table.status !== filter.status
        ) {
          return false;
        }

        if (filter.capacity && table.capacity < filter.capacity) {
          return false;
        }

        if (filter.tableNumber && table.number !== filter.tableNumber) {
          return false;
        }

        return true;
      });
    }

    // Apply sorting
    filteredTables = sortTables(filteredTables, sortBy);

    return filteredTables;
  };

  const sortTables = (tables, sortOption) => {
    if (!tables || !Array.isArray(tables)) return [];

    const sortedTables = [...tables];

    switch (sortOption) {
      case "number-asc":
        return sortedTables.sort((a, b) => a.number - b.number);
      case "number-desc":
        return sortedTables.sort((a, b) => b.number - a.number);
      case "capacity-asc":
        return sortedTables.sort((a, b) => a.capacity - b.capacity);
      case "capacity-desc":
        return sortedTables.sort((a, b) => b.capacity - a.capacity);
      case "status":
        return sortedTables.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return sortedTables;
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTableStatus(id, status);
    } catch (error) {
      console.error("Error updating table status:", error);
    }
  };

  const handleStartSession = async (id) => {
    try {
      await startTableSession(id);
    } catch (error) {
      console.error("Error starting table session:", error);
    }
  };

  const handleEndSession = async (id) => {
    try {
      await endTableSession(id);
    } catch (error) {
      console.error("Error ending table session:", error);
    }
  };

  const filteredTables =
    tables && Array.isArray(tables) ? filterTables(tables, filter) : [];

  const groupTablesByStatus = (tables) => {
    if (!tables || !Array.isArray(tables)) {
      return {
        occupied: [],
        reserved: [],
        available: [],
      };
    }

    return {
      occupied: tables.filter((table) => table.status === "occupied"),
      reserved: tables.filter((table) => table.status === "reserved"),
      available: tables.filter((table) => table.status === "available"),
    };
  };

  const tableGroups = groupTablesByStatus(filteredTables);

  // Generate statistics about tables
  const tableStats = {
    total: tables?.length || 0,
    available: tableGroups.available?.length || 0,
    reserved: tableGroups.reserved?.length || 0,
    occupied: tableGroups.occupied?.length || 0,
    averageCapacity:
      tables && tables.length > 0
        ? Math.round(
            tables.reduce((sum, table) => sum + table.capacity, 0) /
              tables.length
          )
        : 0,
    maxCapacity:
      tables && tables.length > 0
        ? Math.max(...tables.map((table) => table.capacity))
        : 0,
  };

  const clearAllFilters = () => {
    setFilter(null);
    setQuickSearch("");
    setActiveTab("all");
  };

  const hasActiveFilters = filter || quickSearch || activeTab !== "all";

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl font-['Phetsarath_OT']">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">
                  ໂຕະທັງໝົດ
                </p>
                <h3 className="text-3xl font-bold text-blue-900">
                  {tableStats.total}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TableIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <p className="text-xs text-blue-600">
                ພ້ອມໃຊ້ງານ:{" "}
                <span className="font-medium">{tableStats.available}</span>
              </p>
              <Separator
                orientation="vertical"
                className="h-3 mx-2 bg-blue-200"
              />
              <p className="text-xs text-blue-600">
                ທີ່ນັ່ງສະເລ່ຍ:{" "}
                <span className="font-medium">
                  {tableStats.averageCapacity}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-emerald-700 mb-1">
                  ພ້ອມໃຊ້ງານ
                </p>
                <h3 className="text-3xl font-bold text-emerald-900">
                  {tableStats.available}
                </h3>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="w-full bg-emerald-200 rounded-full h-2.5">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      tableStats.total
                        ? Math.round(
                            (tableStats.available / tableStats.total) * 100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium text-emerald-700 ml-2">
                {tableStats.total
                  ? Math.round((tableStats.available / tableStats.total) * 100)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">
                  ຈອງແລ້ວ
                </p>
                <h3 className="text-3xl font-bold text-blue-900">
                  {tableStats.reserved}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      tableStats.total
                        ? Math.round(
                            (tableStats.reserved / tableStats.total) * 100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium text-blue-700 ml-2">
                {tableStats.total
                  ? Math.round((tableStats.reserved / tableStats.total) * 100)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-rose-700 mb-1">
                  ກຳລັງໃຊ້ງານ
                </p>
                <h3 className="text-3xl font-bold text-rose-900">
                  {tableStats.occupied}
                </h3>
              </div>
              <div className="p-3 bg-rose-100 rounded-full">
                <Utensils className="h-6 w-6 text-rose-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <div className="w-full bg-rose-200 rounded-full h-2.5">
                <div
                  className="bg-rose-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      tableStats.total
                        ? Math.round(
                            (tableStats.occupied / tableStats.total) * 100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium text-rose-700 ml-2">
                {tableStats.total
                  ? Math.round((tableStats.occupied / tableStats.total) * 100)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="bg-white border-0 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <TableIcon className="h-6 w-6 text-gray-700" />
                ຈັດການໂຕະອາຫານ
              </CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                ບໍລິຫານຈັດການໂຕະອາຫານຂອງຮ້ານ ເບີ່ງສະຖານະ ແລະເລີ່ມການໃຊ້ງານ
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Button
                variant="outline"
                onClick={refreshTables}
                className="border-gray-300 text-gray-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-300 text-gray-700 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">ຕົວກອງ</span>
              </Button>
              <Button
                onClick={() => router.push("/tables/add")}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">ເພີ່ມໂຕະໃໝ່</span>
                <span className="sm:hidden">ເພີ່ມໂຕະ</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Search and Filter Bar */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex-1 w-full sm:max-w-xs relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ຄົ້ນຫາໂຕະຕາມເລກ..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="pl-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-9 text-sm border-gray-200">
                  <div className="flex items-center">
                    <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-gray-500" />
                    <SelectValue placeholder="ລຽງຕາມ..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number-asc">
                    ເລກໂຕະ (ນ້ອຍ - ຫຼາຍ)
                  </SelectItem>
                  <SelectItem value="number-desc">
                  ເລກໂຕະ (ຫຼາຍ - ນ້ອຍ)
                  </SelectItem>
                  <SelectItem value="capacity-asc">
                    ຄວາມຈຸ (ນ້ອຍ - ຫຼາຍ)
                  </SelectItem>
                  <SelectItem value="capacity-desc">
                    ຄວາມຈຸ (ຫຼາຍ - ນ້ອຍ)
                  </SelectItem>
                  <SelectItem value="status">ສະຖານະ</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-9 h-9 border-gray-200"
                  >
                    {viewMode === "grid" ? (
                      <LayoutGrid className="h-4 w-4" />
                    ) : (
                      <LayoutList className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewMode("grid")}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    <span>ສະແດງແບບຕາຕະລາງ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode("list")}>
                    <LayoutList className="mr-2 h-4 w-4" />
                    <span>ສະແດງແບບລາຍການ</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 mr-2">ກຳລັງກອງ:</div>
              <div className="flex flex-wrap gap-2">
                {filter?.status && filter.status !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-gray-100 text-gray-700"
                  >
                    ສະຖານະ:{" "}
                    {filter.status === "available"
                      ? "ພ້ອມໃຊ້ງານ"
                      : filter.status === "reserved"
                      ? "ຈອງແລ້ວ"
                      : filter.status === "occupied"
                      ? "ກຳລັງໃຊ້ງານ"
                      : filter.status}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setFilter({ ...filter, status: null })}
                    />
                  </Badge>
                )}

                {filter?.capacity && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-gray-100 text-gray-700"
                  >
                    ຄວາມຈຸ: ≥ {filter.capacity}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setFilter({ ...filter, capacity: null })}
                    />
                  </Badge>
                )}

                {filter?.tableNumber && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-gray-100 text-gray-700"
                  >
                    ເລກໂຕະ: {filter.tableNumber}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() =>
                        setFilter({ ...filter, tableNumber: null })
                      }
                    />
                  </Badge>
                )}

                {quickSearch && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-gray-100 text-gray-700"
                  >
                    ຄົ້ນຫາ: {quickSearch}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setQuickSearch("")}
                    />
                  </Badge>
                )}

                {activeTab !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-gray-100 text-gray-700"
                  >
                    ສະແດງ:{" "}
                    {activeTab === "available"
                      ? "ພ້ອມໃຊ້ງານ"
                      : activeTab === "reserved"
                      ? "ຈອງແລ້ວ"
                      : activeTab === "occupied"
                      ? "ກຳລັງໃຊ້ງານ"
                      : activeTab}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setActiveTab("all")}
                    />
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  onClick={clearAllFilters}
                >
                  ລ້າງທັງໝົດ
                </Button>
              </div>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="border-b">
            <div className="p-4">
              <TableFilter onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}

        <CardContent className="p-4">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="mb-4">
              <TabsList className="grid grid-cols-4 w-full max-w-md bg-gray-100/80 p-1">
                <TabsTrigger
                  value="all"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  ທັງໝົດ
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-gray-200/50 text-gray-700"
                  >
                    {tables?.length || 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="available"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
                    <span className="hidden xs:inline">ພ້ອມໃຊ້ງານ</span>
                    <span className="xs:hidden">ຫວ່າງ</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-gray-200/50 text-gray-700"
                  >
                    {tableGroups.available?.length || 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="reserved"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    <span className="hidden xs:inline">ຈອງແລ້ວ</span>
                    <span className="xs:hidden">ຈອງ</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-gray-200/50 text-gray-700"
                  >
                    {tableGroups.reserved?.length || 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="occupied"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-1"></span>
                    <span className="hidden xs:inline">ກຳລັງໃຊ້ງານ</span>
                    <span className="xs:hidden">ໃຊ້ງານ</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-gray-200/50 text-gray-700"
                  >
                    {tableGroups.occupied?.length || 0}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <TablesContent
                tables={filteredTables}
                loading={loading}
                error={error}
                onStatusChange={handleStatusChange}
                onStartSession={handleStartSession}
                onEndSession={handleEndSession}
                applyFilter={applyFilter}
                filter={filter}
                setFilter={setFilter}
                viewMode={viewMode}
                activeTab={activeTab}
              />
            </TabsContent>

            <TabsContent value="available" className="m-0">
              <TablesContent
                tables={tableGroups.available}
                loading={loading}
                error={error}
                onStatusChange={handleStatusChange}
                onStartSession={handleStartSession}
                onEndSession={handleEndSession}
                applyFilter={applyFilter}
                filter={filter}
                setFilter={setFilter}
                viewMode={viewMode}
                activeTab={activeTab}
              />
            </TabsContent>

            <TabsContent value="reserved" className="m-0">
              <TablesContent
                tables={tableGroups.reserved}
                loading={loading}
                error={error}
                onStatusChange={handleStatusChange}
                onStartSession={handleStartSession}
                onEndSession={handleEndSession}
                applyFilter={applyFilter}
                filter={filter}
                setFilter={setFilter}
                viewMode={viewMode}
                activeTab={activeTab}
              />
            </TabsContent>

            <TabsContent value="occupied" className="m-0">
              <TablesContent
                tables={tableGroups.occupied}
                loading={loading}
                error={error}
                onStatusChange={handleStatusChange}
                onStartSession={handleStartSession}
                onEndSession={handleEndSession}
                applyFilter={applyFilter}
                filter={filter}
                setFilter={setFilter}
                viewMode={viewMode}
                activeTab={activeTab}
              />
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Footer */}
        <CardFooter className="border-t bg-gray-50 py-3 px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-xs text-gray-500">
            ສະແດງ {filteredTables.length} จาก {tables?.length || 0} ໂຕະທັງໝົດ
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-3">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
              ພ້ອມໃຊ້ງານ: {tableGroups.available?.length || 0}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              ຈອງແລ້ວ: {tableGroups.reserved?.length || 0}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-rose-500 rounded-full mr-1"></span>
              ກຳລັງໃຊ້ງານ: {tableGroups.occupied?.length || 0}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const TablesContent = ({
  tables,
  loading,
  error,
  onStatusChange,
  onStartSession,
  onEndSession,
  applyFilter,
  filter,
  setFilter,
  viewMode,
  activeTab, // Added this prop
}) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 bg-gray-50 rounded-lg">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600 font-medium">ກຳລັງໂຫລດຂໍ້ມູນໂຕະ...</p>
        <p className="text-gray-500 text-sm mt-1">ກະລຸນາລໍຖ້າ</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center bg-red-50 rounded-lg">
        <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
          <X className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-red-700 font-medium mb-2">ເກີດຂໍ້ຜິດພາດ</h3>
        <p className="text-red-600 mb-4 max-w-md mx-auto">{error}</p>
        <Button
          onClick={() => applyFilter(filter)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> ລອງໃໝ່
        </Button>
      </div>
    );
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
        <div className="bg-gray-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
          <Info className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-gray-700 font-medium mb-2">ບໍ່ພົບຂໍ້ມູນໂຕະ</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">
          ບໍ່ພົບຂໍ້ມູນໂຕະທີ່ກົງກັບເງື່ອນໄຂທີ່ທ່ານເລືອກ
          ລອງປ່ຽນຕົວກອງຫຼືລ້າງຕົວກອງເພື່ອເບີ່ງໂຕະທັງໝົດ
        </p>
        {(filter || activeTab !== "all") && (
          <Button
            variant="outline"
            onClick={() => setFilter(null)}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> ລ້າງຕົວກອງ
          </Button>
        )}
      </div>
    );
  }

  // Grid view
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onStatusChange={onStatusChange}
            onStartSession={onStartSession}
            onEndSession={onEndSession}
          />
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="overflow-auto rounded-md border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">
              ເລກໂຕະ
            </th>
            <th className="text-center py-3 px-4 font-medium text-gray-500">
              ຄວາມຈຸ
            </th>
            <th className="text-center py-3 px-4 font-medium text-gray-500">
              ສະຖານະ
            </th>
            <th className="text-center py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">
              ໄລຍະເວລາ
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">
              ຈັດການ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tables.map((table) => {
            // Format session time if available
            const formatSessionTime = () => {
              if (!table.current_session_start) return "-";
              const start = new Date(table.current_session_start);
              const now = new Date();
              const diffMs = now - start;
              const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
              const diffMins = Math.floor(
                (diffMs % (1000 * 60 * 60)) / (1000 * 60)
              );
              return `${diffHrs}ຊມ. ${diffMins}ນາທີ`;
            };

            return (
              <tr key={table.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">ໂຕະ #{table.number}</td>
                <td className="py-3 px-4 text-center">
                  {table.capacity} ທີ່ນັ່ງ
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <span
                      className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        table.status === "available"
                          ? "bg-emerald-100 text-emerald-800"
                          : table.status === "reserved"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }
                    `}
                    >
                      <span
                        className={`
                        w-1.5 h-1.5 rounded-full mr-1.5
                        ${
                          table.status === "available"
                            ? "bg-emerald-500"
                            : table.status === "reserved"
                            ? "bg-blue-500"
                            : "bg-rose-500"
                        }
                      `}
                      ></span>
                      {table.status === "available"
                        ? "ພ້ອມໃຊ້ງານ"
                        : table.status === "reserved"
                        ? "ຈອງແລ້ວ"
                        : "ກຳລັງໃຊ້ງານ"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center hidden sm:table-cell">
                  {table.status === "occupied" ? formatSessionTime() : "-"}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {table.status === "available" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStartSession(table.id)}
                        className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        ເລີ່ມໃຊ້ງານ
                      </Button>
                    )}
                    {table.status === "occupied" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEndSession(table.id)}
                        className="h-8 text-xs border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                      >
                        ສີ້ນສຸດການໃຊ້ງານ
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        (window.location.href = `/tables/${table.id}`)
                      }
                      className="h-8 text-xs text-gray-700"
                    >
                      ລາຍລະອຽດ
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableList;
