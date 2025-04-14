import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FaSearch, 
  FaFilter, 
  FaTags, 
  FaSort, 
  FaEraser, 
  FaTimes, 
  FaCheck,
  FaGlobe,
  FaPenNib,
  FaArchive
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Animation variants
const filterItemVariants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2 }
};

export default function BlogFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  sortOrder,
  setSortOrder,
  categories,
  setCurrentPage
}) {
  const handleFilterChange = (setter) => (value) => {
    setter(value === 'all' ? '' : value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setCategoryFilter('');
    setSortOrder('newest');
    setCurrentPage(1);
  };

  const isFiltersActive = searchQuery || statusFilter || categoryFilter || sortOrder !== 'newest';

  // Helper to get status icon and text
  const getStatusInfo = (status) => {
    switch(status) {
      case 'published':
        return { 
          icon: <FaGlobe className="h-3.5 w-3.5 text-green-500" />, 
          color: 'bg-green-500',
          text: 'ເຜີຍແຜ່' 
        };
      case 'draft':
        return { 
          icon: <FaPenNib className="h-3.5 w-3.5 text-yellow-500" />, 
          color: 'bg-yellow-400',
          text: 'ຮ່າງ' 
        };
      case 'archived':
        return { 
          icon: <FaArchive className="h-3.5 w-3.5 text-gray-500" />, 
          color: 'bg-gray-400',
          text: 'ເກັບຖາວອນ' 
        };
      default:
        return { 
          icon: <FaFilter className="h-3.5 w-3.5 text-gray-400" />, 
          color: 'bg-gray-400',
          text: 'ສະຖານະທັງໝົດ' 
        };
    }
  };

  const activeStatusInfo = getStatusInfo(statusFilter);

  return (
    <div className="p-5 border-t border-gray-200 dark:border-gray-700 space-y-5">
      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ຄົ້ນຫາບົດຄວາມ..."
            className="w-full pl-10 h-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Select 
                    value={statusFilter || 'all'} 
                    onValueChange={handleFilterChange(setStatusFilter)}
                  >
                    <SelectTrigger className="w-full min-w-[160px] lg:w-40 h-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      <div className="flex items-center">
                        {statusFilter ? activeStatusInfo.icon : <FaFilter className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />}
                        <span className="ml-2 truncate">{statusFilter ? activeStatusInfo.text : "ສະຖານະທັງໝົດ"}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="all" className="dark:text-white dark:focus:bg-gray-700">
                        <div className="flex items-center">
                          <FaFilter className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          ສະຖານະທັງໝົດ
                        </div>
                      </SelectItem>
                      <SelectItem value="published" className="dark:text-white dark:focus:bg-gray-700">
                        <div className="flex items-center">
                          <FaGlobe className="mr-2 h-4 w-4 text-green-500" />
                          ເຜີຍແຜ່
                        </div>
                      </SelectItem>
                      <SelectItem value="draft" className="dark:text-white dark:focus:bg-gray-700">
                        <div className="flex items-center">
                          <FaPenNib className="mr-2 h-4 w-4 text-yellow-500" />
                          ຮ່າງ
                        </div>
                      </SelectItem>
                      <SelectItem value="archived" className="dark:text-white dark:focus:bg-gray-700">
                        <div className="flex items-center">
                          <FaArchive className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          ເກັບຖາວອນ
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {statusFilter && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-500 text-white">
                      <FaCheck className="h-2.5 w-2.5" />
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>ກັ່ນຕອງຕາມສະຖານະ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Category Filter */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Select 
                    value={categoryFilter || 'all'} 
                    onValueChange={handleFilterChange(setCategoryFilter)}
                  >
                    <SelectTrigger className="w-full min-w-[160px] lg:w-44 h-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      <div className="flex items-center">
                        <FaTags className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="truncate">
                          {categoryFilter 
                            ? categories?.find(c => c.id.toString() === categoryFilter)?.name || categoryFilter
                            : "ໝວດໝູ່ທັງໝົດ"
                          }
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="all" className="dark:text-white dark:focus:bg-gray-700">
                        <div className="flex items-center">
                          <FaTags className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          ໝວດໝູ່ທັງໝົດ
                        </div>
                      </SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem 
                          key={cat.id} 
                          value={cat.id.toString()}
                          className="dark:text-white dark:focus:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categoryFilter && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-500 text-white">
                      <FaCheck className="h-2.5 w-2.5" />
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>ກັ່ນຕອງຕາມໝວດໝູ່</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Sort Order */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Select 
                    value={sortOrder} 
                    onValueChange={(val) => { 
                      setSortOrder(val); 
                      setCurrentPage(1); 
                    }}
                  >
                    <SelectTrigger className="w-full min-w-[160px] lg:w-40 h-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      <div className="flex items-center">
                        <FaSort className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="truncate">
                          {sortOrder === 'newest' ? "ໃໝ່ຫາເກົ່າ" : "ເກົ່າຫາໃໝ່"}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="newest" className="dark:text-white dark:focus:bg-gray-700">
                        <div className="flex items-center">
                          <span className="mr-2">↓</span> ໃໝ່ຫາເກົ່າ
                        </div>
                      </SelectItem>
                      <SelectItem value="oldest" className="dark:text-white dark:focus:bg-gray-700">
                        <div className="flex items-center">
                          <span className="mr-2">↑</span> ເກົ່າຫາໃໝ່
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {sortOrder !== 'newest' && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-500 text-white">
                      <FaCheck className="h-2.5 w-2.5" />
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>ລຽງຕາມວັນທີສ້າງ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Reset Filters Button */}
          {isFiltersActive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-10 w-10 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-red-900/20 hover:bg-red-50 hover:text-red-600 transition-colors" 
                    onClick={handleResetFilters}
                  >
                    <FaEraser className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ລຶບຕົວກັ່ນຕອງທັງໝົດ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      {/* Active Filters */}
      <AnimatePresence>
        {isFiltersActive && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="py-2 px-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">ຕົວກັ່ນຕອງທີ່ໃຊ້ຢູ່:</span>
                
                <div className="flex flex-wrap gap-2">
                  {/* Search Filter Badge */}
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.div
                        key="search-filter"
                        initial={filterItemVariants.initial}
                        animate={filterItemVariants.animate}
                        exit={filterItemVariants.exit}
                        transition={filterItemVariants.transition}
                      >
                        <Badge
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 border-0"
                        >
                          <span className="mr-1">ຄົ້ນຫາ:</span>
                          <span className="font-semibold">{searchQuery}</span>
                          <button 
                            className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => setSearchQuery('')}
                            aria-label="Remove search filter"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Status Filter Badge */}
                  <AnimatePresence>
                    {statusFilter && (
                      <motion.div
                        key="status-filter"
                        initial={filterItemVariants.initial}
                        animate={filterItemVariants.animate}
                        exit={filterItemVariants.exit}
                        transition={filterItemVariants.transition}
                      >
                        <Badge 
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 border-0"
                        >
                          <span className="mr-1">ສະຖານະ:</span>
                          <span className="font-semibold">
                            {statusFilter === 'published' ? 'ເຜີຍແຜ່' : statusFilter === 'draft' ? 'ຮ່າງ' : 'ເກັບຖາວອນ'}
                          </span>
                          <button 
                            className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => setStatusFilter('')}
                            aria-label="Remove status filter"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Category Filter Badge */}
                  <AnimatePresence>
                    {categoryFilter && (
                      <motion.div
                        key="category-filter"
                        initial={filterItemVariants.initial}
                        animate={filterItemVariants.animate}
                        exit={filterItemVariants.exit}
                        transition={filterItemVariants.transition}
                      >
                        <Badge 
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 border-0"
                        >
                          <span className="mr-1">ໝວດໝູ່:</span>
                          <span className="font-semibold">
                            {categories?.find(c => c.id.toString() === categoryFilter)?.name || categoryFilter}
                          </span>
                          <button 
                            className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => setCategoryFilter('')}
                            aria-label="Remove category filter"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Sort Order Badge */}
                  <AnimatePresence>
                    {sortOrder !== 'newest' && (
                      <motion.div
                        key="sort-filter"
                        initial={filterItemVariants.initial}
                        animate={filterItemVariants.animate}
                        exit={filterItemVariants.exit}
                        transition={filterItemVariants.transition}
                      >
                        <Badge 
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 border-0"
                        >
                          <span className="mr-1">ລຽງຕາມ:</span>
                          <span className="font-semibold">
                            {sortOrder === 'oldest' ? 'ເກົ່າຫາໃໝ່' : 'ໃໝ່ຫາເກົ່າ'}
                          </span>
                          <button 
                            className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => setSortOrder('newest')}
                            aria-label="Remove sort filter"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 h-7 px-2"
                  onClick={handleResetFilters}
                >
                  <FaEraser className="h-3 w-3 mr-1.5" />
                  ລຶບຕົວກັ່ນຕອງທັງໝົດ
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}