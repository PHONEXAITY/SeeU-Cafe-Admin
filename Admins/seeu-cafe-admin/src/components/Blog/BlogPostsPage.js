'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaPlus, 
  FaColumns, 
  FaTable, 
  FaTh, 
  FaChartBar, 
  FaFileAlt,
  FaSyncAlt,
  FaFilter,
  FaArrowUp
} from 'react-icons/fa';
import { useToast } from '@/components/ui/use-toast';
import { useBlogPosts, useBlogCategories, useBlogActions } from '@/hooks/useBlogHooks';
import { blogPostsAPI } from '@/services/api';
import BlogFilters from './BlogFilters';
import BlogList from './BlogList';
import BlogPagination from './BlogPagination';
import DeleteDialog from './DeleteDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from 'next/link';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

const BlogPostsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, postId: null, postTitle: '' });
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize initialParams
  const initialParams = useMemo(() => ({
    page: currentPage,
    limit: 10,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    categoryId: categoryFilter || undefined,
    order: sortOrder === 'newest' ? 'desc' : 'asc',
    sort: 'created_at',
  }), [currentPage, debouncedSearch, statusFilter, categoryFilter, sortOrder]);

  const { posts, pagination, loading, error, refetch } = useBlogPosts(initialParams);

  // เรียก refetch เมื่อ params เปลี่ยน
  useEffect(() => {
    refetch(initialParams);
  }, [initialParams, refetch]);

  const { categories } = useBlogCategories();
  const { deletePost, loading: deleteLoading } = useBlogActions();

  const handleDeletePost = async () => {
    if (!deleteDialog.postId) return;
    try {
      await deletePost(deleteDialog.postId);
      toast({
        title: 'ລຶບສຳເລັດ',
        description: 'ບົດຄວາມຖືກລຶບແລ້ວ',
        variant: 'success',
      });
      refetch(initialParams);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'ຜິດພາດ',
        description: err.message || 'ລຶບບໍ່ໄດ້',
      });
    } finally {
      setDeleteDialog({ isOpen: false, postId: null, postTitle: '' });
    }
  };

  const handleIncrementViews = async (postId) => {
    try {
      await blogPostsAPI.incrementPostViews(postId);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  const getPostCount = () => {
    if (!pagination) return '';
    return `${pagination.total || 0} ບົດຄວາມ`;
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Phetsarath_OT']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center">
                <FaFileAlt className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                ບົດຄວາມທັງໝົດ
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
                ຈັດການບົດຄວາມຂອງທ່ານ 
                <Badge variant="outline" className="ml-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  {getPostCount()}
                </Badge>
              </p>
            </div>
            <Link href="/blog/create">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-sm transition-all duration-200 transform hover:scale-[1.02]">
                <FaPlus className="w-4 h-4 mr-2" /> ສ້າງບົດຄວາມໃໝ່
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-6">
          {/* View Toggle and Filters */}
          <motion.div 
            variants={itemVariants} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <h2 className="text-lg font-medium text-gray-700 dark:text-white flex items-center">
                  <FaFilter className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  ຕົວກັ່ນຕອງ
                </h2>
                <Badge variant="outline" className="ml-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  {getPostCount()}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={isGridView ? "default" : "outline"}
                  size="sm"
                  className={`${isGridView ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 border-blue-200' : 'dark:text-gray-300 dark:border-gray-600'}`}
                  onClick={() => setIsGridView(true)}
                >
                  <FaTh className="w-4 h-4 mr-1.5" /> ຕາຕະລາງ
                </Button>
                <Button
                  variant={!isGridView ? "default" : "outline"}
                  size="sm"
                  className={`${!isGridView ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-200 border-blue-200' : 'dark:text-gray-300 dark:border-gray-600'}`}
                  onClick={() => setIsGridView(false)}
                >
                  <FaTable className="w-4 h-4 mr-1.5" /> ລາຍການ
                </Button>
              </div>
            </div>
            
            <BlogFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              isGridView={isGridView}
              setIsGridView={setIsGridView}
              categories={categories}
              setCurrentPage={setCurrentPage}
            />
          </motion.div>

          {/* Blog Stats Cards */}
          {!loading && !error && posts?.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <CardContent className="flex items-center p-6">
                  <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <FaFileAlt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ບົດຄວາມທັງໝົດ</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{pagination?.total || 0}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <CardContent className="flex items-center p-6">
                  <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/30 mr-4">
                    <FaEye className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ການເບິ່ງທັງໝົດ</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {posts.reduce((total, post) => total + (post.views || 0), 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <CardContent className="flex items-center p-6">
                  <div className="rounded-full p-3 bg-yellow-100 dark:bg-yellow-900/30 mr-4">
                    <FaFilter className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ໝວດໝູ່</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{categories?.length || 0}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <CardContent className="flex items-center p-6">
                  <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900/30 mr-4">
                    <FaChartBar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ສະຖານະເຜີຍແຜ່</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {posts.filter(post => post.status === 'published').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Blog List */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <BlogList
              posts={posts}
              loading={loading}
              error={error}
              isGridView={isGridView}
              formatDate={(date) => format(new Date(date), 'dd/MM/yyyy')}
              getExcerpt={(content) => content?.replace(/<[^>]+>/g, '').substring(0, 120) + '...'}
              getStatusBadge={(status) => ({
                published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
              }[status] || 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300')}
              refetch={() => refetch(initialParams)}
              onDelete={(post) => setDeleteDialog({ isOpen: true, postId: post.id, postTitle: post.title })}
              onView={handleIncrementViews}
            />
          </motion.div>

          {/* Pagination */}
          {pagination?.total_pages > 1 && (
            <motion.div 
              variants={itemVariants}
              className="flex justify-center mt-6"
            >
              <BlogPagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                setCurrentPage={setCurrentPage}
              />
            </motion.div>
          )}

          {/* No Results */}
          {!loading && !error && posts?.length === 0 && (
            <motion.div 
              variants={itemVariants}
              className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
            >
              <div className="mx-auto h-20 w-20 text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">ບໍ່ພົບບົດຄວາມ</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                ບໍ່ພົບບົດຄວາມທີ່ກົງກັບການຄົ້ນຫາຂອງທ່ານ. ລອງປ່ຽນຕົວກັ່ນຕອງ ຫຼື ສ້າງບົດຄວາມໃໝ່.
              </p>
              <div className="mt-6 flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="border-gray-300 dark:border-gray-600 dark:text-gray-300"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('');
                    setCategoryFilter('');
                    setSortOrder('newest');
                    setCurrentPage(1);
                  }}
                >
                  <FaSyncAlt className="w-4 h-4 mr-2" /> ລ້າງຕົວກັ່ນຕອງ
                </Button>
                <Link href="/blog/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                    <FaPlus className="w-4 h-4 mr-2" /> ສ້າງບົດຄວາມໃໝ່
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.postTitle}
        onClose={() => setDeleteDialog({ isOpen: false, postId: null, postTitle: '' })}
        onConfirm={handleDeletePost}
        loading={deleteLoading}
      />

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={handleBackToTop}
            className="fixed right-6 bottom-6 p-3 rounded-full bg-blue-600 dark:bg-blue-700 text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-200 z-20"
            aria-label="Back to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPostsPage;