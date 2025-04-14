'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPostBySlug, useBlogActions } from '@/hooks/useBlogHooks';
import { useToast } from '@/components/ui/use-toast';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaCalendarAlt, 
  FaEye, 
  FaUser, 
  FaTag,
  FaGlobe,
  FaPenNib,
  FaArchive,
  FaShareAlt,
  FaRegClock
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPostView() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const slug = params?.slug;
  
  const { post, loading, error, refetch } = useBlogPostBySlug(slug);

  useEffect(() => {
    if (!slug) {
      toast({
        variant: "destructive",
        title: "ບໍ່ພົບບົດຄວາມ",
        description: "ບໍ່ມີ slug ສຳລັບບົດຄວາມນີ້",
      });
      router.push('/blog/posts');
      return;
    }

    if (!loading && error) {
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error || "ບໍ່ສາມາດໂຫລດບົດຄວາມໄດ້",
      });
      router.push('/blog/posts');
    }

    if (!loading && !post && !error) {
      toast({
        variant: "destructive",
        title: "ບໍ່ພົບບົດຄວາມ",
        description: "ບໍ່ພົບບົດຄວາມທີ່ຄົ້ນຫາ ຫຼື ບົດຄວາມອາດຖືກລຶບໄປແລ້ວ",
      });
      router.push('/blog/posts');
    }
  }, [loading, post, error, slug, router, toast]);

  const handleBack = () => {
    router.push('/blog/posts');
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "ແຊບົດຄວາມສຳເລັດ",
          description: "ລິ້ງບົດຄວາມຖືກສົ່ງໄປແລ້ວ",
        });
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "ຄັດລອກລິ້ງແລ້ວ",
          description: "ລິ້ງບົດຄວາມຖືກຄັດລອກໄປຍັງຄລິບບອດແລ້ວ",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: "destructive",
        title: "ຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດແຊບົດຄວາມໄດ້",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return {
          icon: <FaGlobe className="mr-1.5 h-3.5 w-3.5" />,
          label: 'ເຜີຍແຜ່',
          class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
      case 'draft':
        return {
          icon: <FaPenNib className="mr-1.5 h-3.5 w-3.5" />,
          label: 'ຮ່າງ',
          class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        };
      case 'archived':
        return {
          icon: <FaArchive className="mr-1.5 h-3.5 w-3.5" />,
          label: 'ເກັບຖາວອນ',
          class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        };
      default:
        return {
          icon: <FaPenNib className="mr-1.5 h-3.5 w-3.5" />,
          label: 'ຮ່າງ',
          class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        };
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Phetsarath_OT'] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-32 mr-4" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="w-full h-96 rounded-xl mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex flex-wrap gap-4 mb-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null; // Handled by useEffect

  const statusBadge = getStatusBadge(post.status);
  const readTime = calculateReadTime(post.content);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Phetsarath_OT'] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="w-fit">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            ກັບຄືນ
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="border-gray-200 dark:border-gray-700"
            >
              <FaShareAlt className="mr-2 h-4 w-4" />
              ແຊ
            </Button>
            <Link href={`/blog/edit/${post.id}`}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                <FaEdit className="mr-2 h-4 w-4" />
                ແກ້ໄຂບົດຄວາມ
              </Button>
            </Link>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {post.image && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 relative">
              <div className="relative w-full h-96">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                  onError={() => toast({
                    variant: "destructive",
                    title: "ບໍ່ສາມາດໂຫລດຮູບພາບ",
                    description: "ຮູບພາບບໍ່ສາມາດໂຫລດໄດ້",
                  })}
                />
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-3">
            <Badge className={`${statusBadge.class} px-3 py-1 text-sm flex items-center`}>
              {statusBadge.icon}
              {statusBadge.label}
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-3 py-1 text-sm flex items-center">
              <FaRegClock className="mr-1.5 h-3.5 w-3.5" />
              {readTime} ນາທີໃນການອ່ານ
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 h-3.5 w-3.5" />
              <span>{format(new Date(post.created_at), 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex items-center">
              <FaEye className="mr-2 h-3.5 w-3.5" />
              <span>{post.views || 0} ເບິ່ງ</span>
            </div>
            {post.author && (
              <div className="flex items-center">
                <FaUser className="mr-2 h-3.5 w-3.5" />
                <span>{post.author}</span>
              </div>
            )}
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Badge 
                    key={category.id} 
                    className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0 px-3 py-1.5 text-sm"
                  >
                    <FaTag className="mr-2 h-3 w-3" />
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Card className="mb-12 border-0 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6 sm:p-8">
              <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
                {post.content.split('\n').map((paragraph, index) => (
                  paragraph ? (
                    <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{paragraph}</p>
                  ) : <br key={index} />
                ))}
              </article>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mb-12">
            <Button variant="outline" onClick={handleBack}>
              <FaArrowLeft className="mr-2 h-4 w-4" />
              ກັບຄືນລາຍການບົດຄວາມ
            </Button>
            <Link href={`/blog/edit/${post.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                <FaEdit className="mr-2 h-4 w-4" />
                ແກ້ໄຂບົດຄວາມ
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}