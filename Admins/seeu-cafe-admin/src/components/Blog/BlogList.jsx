'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCalendarAlt, 
  FaTag,
  FaUser,
  FaExternalLinkAlt,
  FaImage,
  FaSyncAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import DeleteDialog from './DeleteDialog';
import { useBlogActions } from '@/hooks/useBlogActions';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
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

export default function BlogList({
  posts, 
  loading, 
  error, 
  isGridView, 
  formatDate, 
  getExcerpt, 
  getStatusBadge, 
  refetch, 
  onView
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const { deletePost, loading: deleteLoading } = useBlogActions();

  // Handle delete button click
  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      await deletePost(postToDelete.id);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      refetch(); // Refresh the post list
    } catch (err) {
      // Error is already handled by useBlogActions with toast
    }
  };

  // Handle dialog close
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  // Loading skeletons with dark mode support
  if (loading) {
    return isGridView ? (
      // Grid loading skeleton
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array(6).fill().map((_, i) => (
          <Card key={i} className="overflow-hidden dark:bg-gray-800 dark:border-gray-700 shadow-sm">
            <div className="h-40 bg-gray-100 dark:bg-gray-700 animate-pulse"></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-3"></div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="h-8 w-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="flex gap-1">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      // List loading skeleton
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array(5).fill().map((_, i) => (
          <div key={i} className="p-4 sm:p-6 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="hidden sm:block h-24 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-1 hidden sm:block"></div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-2 mt-2 sm:mt-0">
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state with dark mode support
  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4 text-red-600 dark:text-red-400 mb-4">
          <FaExclamationTriangle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">ເກີດຂໍ້ຜິດພາດ</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{error}</p>
        <Button 
          onClick={refetch} 
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
        >
          <FaSyncAlt className="mr-2 h-4 w-4" /> ລອງໃໝ່
        </Button>
      </div>
    );
  }

  // Empty state with dark mode support
  if (!posts?.length) {
    return (
      <div className="p-8 text-center">
        <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 text-gray-500 dark:text-gray-400 inline-flex mb-4">
          <FaImage className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">ບໍ່ພົບບົດຄວາມ</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">ບໍ່ມີບົດຄວາມທີ່ກົງກັບການຄົ້ນຫາຂອງທ່ານ</p>
      </div>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'published': return 'ເຜີຍແຜ່';
      case 'draft': return 'ຮ່າງ';
      case 'archived': return 'ເກັບຖາວອນ';
      default: return status;
    }
  };

  // Grid view with animations and dark mode support
  if (isGridView) {
    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts.map((post) => (
          <motion.div key={post.id} variants={itemVariants}>
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] flex flex-col h-full dark:bg-gray-800 dark:border-gray-700 border border-gray-200">
              {/* Featured Image */}
              <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
                {post.image ? (
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-750 text-gray-400 dark:text-gray-500">
                    <FaImage className="h-16 w-16 opacity-30" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className={`${getStatusBadge(post.status)} shadow-sm`}>
                    {getStatusText(post.status)}
                  </Badge>
                </div>

                {/* Hover overlay for quick actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="rounded-full h-10 w-10 bg-white/90 hover:bg-white text-blue-600 border-0 shadow-md"
                              onClick={() => onView(post.id)}
                            >
                              <FaEye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ເບິ່ງບົດຄວາມ</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={`/blog/edit/${post.id}`}>
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="rounded-full h-10 w-10 bg-white/90 hover:bg-white text-blue-600 border-0 shadow-md"
                            >
                              <FaEdit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ແກ້ໄຂບົດຄວາມ</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              
              {/* Card Content */}
              <CardContent className="p-5 flex-grow flex flex-col">
                {/* Meta Info */}
                <div className="flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-3 w-3 mr-1.5" /> 
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaEye className="h-3 w-3 mr-1.5" /> 
                    <span>{post.views || 0} ເບິ່ງ</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="font-medium text-lg mb-2.5 line-clamp-2 hover:text-blue-600 transition-colors dark:text-white">
                  <Link href={`/blog/edit/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                
                {/* Excerpt */}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-grow">
                  {getExcerpt(post.content)}
                </p>
                
                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.categories.slice(0, 2).map((category, index) => (
                      <span key={index} className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md text-xs">
                        <FaTag className="h-2 w-2 mr-1.5" />
                        {category.name}
                      </span>
                    ))}
                    {post.categories.length > 2 && (
                      <span className="inline-flex items-center bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md text-xs">
                        +{post.categories.length - 2}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 -ml-2"
                    onClick={() => onView(post.id)}
                  >
                    <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center">
                      <FaExternalLinkAlt className="mr-1.5 h-3 w-3" /> 
                      <span>ເບິ່ງ</span>
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 dark:bg-transparent dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800/30 h-8" 
                    onClick={() => handleDeleteClick(post)}
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        <DeleteDialog 
          isOpen={deleteDialogOpen}
          title={postToDelete?.title}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      </motion.div>
    );
  }

  // List view with animations and dark mode support
  return (
    <motion.div 
      className="divide-y divide-gray-200 dark:divide-gray-700"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post) => (
        <motion.div 
          key={post.id} 
          variants={itemVariants}
          className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200"
        >
          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Thumbnail for larger screens */}
              {post.image ? (
                <div className="hidden sm:block h-28 w-44 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative flex-shrink-0 shadow-sm">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="176px"
                  />
                </div>
              ) : (
                <div className="hidden sm:flex h-28 w-44 bg-gray-100 dark:bg-gray-750 rounded-lg overflow-hidden relative flex-shrink-0 items-center justify-center">
                  <FaImage className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-center mb-2.5">
                  <Badge className={`${getStatusBadge(post.status)}`}>
                    {getStatusText(post.status)}
                  </Badge>
                  
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <FaCalendarAlt className="h-3 w-3 mr-1.5" />
                    {formatDate(post.created_at)}
                  </span>
                  
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <FaEye className="h-3 w-3 mr-1.5" />
                    {post.views || 0} ເບິ່ງ
                  </span>
                  
                  {post.author && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FaUser className="h-3 w-3 mr-1.5" />
                      {post.author}
                    </span>
                  )}
                </div>
                
                <div className="mb-2.5">
                  <h3 className="text-lg font-medium line-clamp-1 sm:line-clamp-none hover:text-blue-600 dark:text-white transition-colors">
                    <Link href={`/blog/edit/${post.id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5 hidden sm:block line-clamp-2">
                    {getExcerpt(post.content)}
                  </p>
                </div>
                
                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="hidden sm:flex flex-wrap gap-1.5 mt-3">
                    {post.categories.map((category, index) => (
                      <span key={index} className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md text-xs">
                        <FaTag className="h-2 w-2 mr-1.5" />
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2.5 mt-3 sm:mt-0 justify-end flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-3 h-9 border-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => onView(post.id)}
                      >
                        <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center">
                          <FaEye className="mr-2 h-3.5 w-3.5" />
                          <span className="hidden xs:inline">ເບິ່ງ</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>ເບິ່ງບົດຄວາມ</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-3 h-9 border-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Link href={`/blog/edit/${post.id}`} className="flex items-center">
                          <FaEdit className="mr-2 h-3.5 w-3.5" />
                          <span className="hidden xs:inline">ແກ້ໄຂ</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>ແກ້ໄຂບົດຄວາມ</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-3 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300 dark:border-red-800/30 dark:hover:border-red-700/50 dark:hover:bg-red-900/20" 
                        onClick={() => handleDeleteClick(post)}
                      >
                        <FaTrash className="mr-2 h-3.5 w-3.5" />
                        <span className="hidden xs:inline">ລຶບ</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>ລຶບບົດຄວາມ</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      <DeleteDialog 
        isOpen={deleteDialogOpen}
        title={postToDelete?.title}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </motion.div>
  );
}