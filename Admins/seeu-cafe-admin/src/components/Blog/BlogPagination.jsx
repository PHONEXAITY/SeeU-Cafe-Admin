import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaArrowRight } from 'react-icons/fa';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

export default function BlogPagination({ currentPage, totalPages, setCurrentPage }) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Handle window resize for responsive pagination
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPageNumbers = () => {
    // Show fewer page links on mobile
    const maxPagesToShow = windowWidth < 640 ? 3 : windowWidth < 768 ? 5 : 7;
    const pageNumbers = [];
    
    // Always show first page
    if (currentPage > 3) {
      pageNumbers.push(1);
      // Add ellipsis if there's a gap
      if (currentPage > 4) {
        pageNumbers.push('ellipsis1');
      }
    }
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // Add middle page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Always show last page
    if (endPage < totalPages - 1) {
      // Add ellipsis if there's a gap
      pageNumbers.push('ellipsis2');
    }
    
    if (endPage < totalPages) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Don't show pagination if only one page
  if (totalPages <= 1) return null;
  
  const handlePageClick = (page) => {
    // Don't do anything if clicking current page
    if (page === currentPage) return;
    setCurrentPage(page);
    
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleJumpFirst = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  const handleJumpLast = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(totalPages);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Pagination className="max-w-xl mx-auto">
        <PaginationContent className="flex flex-wrap justify-center gap-1 md:gap-0">
          {/* Jump to first page button (visible on larger screens) */}
          {windowWidth >= 640 && (
            <PaginationItem className="hidden sm:inline-block">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleJumpFirst}
                disabled={currentPage === 1}
                className="h-9 w-9 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <FaAngleDoubleLeft className="h-3.5 w-3.5" />
                <span className="sr-only">First Page</span>
              </Button>
            </PaginationItem>
          )}

          {/* Previous Page Button */}
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <FaAngleLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
          </PaginationItem>
          
          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis1' || page === 'ellipsis2') {
              return (
                <PaginationItem key={page} className="flex items-center justify-center">
                  <PaginationEllipsis className="text-gray-400 dark:text-gray-500" />
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => handlePageClick(page)}
                  className={`
                    ${currentPage === page 
                      ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                    transition-colors h-9 w-9 rounded-md font-medium
                  `}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {/* Next Page Button */}
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <FaAngleRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </PaginationItem>

          {/* Jump to last page button (visible on larger screens) */}
          {windowWidth >= 640 && (
            <PaginationItem className="hidden sm:inline-block">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleJumpLast}
                disabled={currentPage === totalPages}
                className="h-9 w-9 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <FaAngleDoubleRight className="h-3.5 w-3.5" />
                <span className="sr-only">Last Page</span>
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
        
        {/* Jump to page controls for larger screen */}
        <div className="mt-5  justify-center items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hidden sm:flex">
          <span>ໄປຫາໜ້າ:</span>
          <Select 
            value={currentPage.toString()}
            onValueChange={(value) => handlePageClick(parseInt(value))}
          >
            <SelectTrigger className="w-16 h-8 px-2 py-0 border-gray-300 dark:border-gray-600 dark:bg-gray-800">
              <SelectValue>{currentPage}</SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 dark:bg-gray-800 dark:border-gray-700">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <SelectItem 
                  key={page} 
                  value={page.toString()}
                  className="dark:text-gray-300 dark:focus:bg-gray-700"
                >
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>ຈາກ {totalPages} ໜ້າ</span>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => handlePageClick(currentPage)}
            className="ml-2 h-8 px-3 text-xs border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FaArrowRight className="mr-1.5 h-3 w-3" />
            ໄປ
          </Button>
        </div>

        {/* Page info for mobile */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:hidden">
          ໜ້າ {currentPage} ຈາກ {totalPages}
        </div>
      </Pagination>
    </motion.div>
  );
}