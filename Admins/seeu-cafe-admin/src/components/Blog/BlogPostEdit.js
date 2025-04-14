'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FaSave,
  FaImage,
  FaQuestionCircle,
  FaTimes,
  FaCheck,
  FaArrowLeft,
  FaEye,
  FaTag,
  FaCog,
  FaSearch,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useBlogCategories, useBlogActions, useBlogPost } from '@/hooks/useBlogHooks';
import { debounce } from 'lodash';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  const statusText = {
    draft: 'ຮ່າງ',
    published: 'ເຜີຍແຜ່',
    archived: 'ເກັບຖາວອນ',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || statusStyles.draft
      }`}
    >
      {statusText[status] || statusText.draft}
    </span>
  );
};

const BlogPostEdit = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [unsavedChangesDialog, setUnsavedChangesDialog] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const postId = params?.id;
  const { post, loading: postLoading, error: postError } = useBlogPost(postId);
  const { categories, loading: categoriesLoading, error: categoriesError } = useBlogCategories();
  const { updatePost, uploadPostImage, loading: submitLoading, error: submitError } = useBlogActions();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft',
    slug: '',
    image: '',
    categoryIds: [],
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    if (post && !formChanged) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        status: post.status || 'draft',
        slug: post.slug || '',
        image: post.image || '',
        categoryIds: post.categories ? post.categories.map((cat) => cat.id) : [],
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
      });
      if (post.image) {
        setImagePreview(post.image);
      }
    }
  }, [post, formChanged]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formChanged) {
        e.preventDefault();
        e.returnValue = 'ທ່ານມີການປ່ຽນແປງທີ່ຍັງບໍ່ບັນທຶກ. ຕ້ອງການອອກຈາກໜ້ານີ້ບໍ່?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formChanged]);

  const slugify = useCallback((text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }, []);

  const debouncedHandleInputChange = useCallback(
    debounce((name, value) => {
      if (name === 'slug') {
        const sanitizedValue = value
          .toLowerCase()
          .replace(/[^a-z0-9\-]/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+|-+$/g, '');
        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }

      setFormChanged(true);

      if (name === 'title' && (!formData.slug || formData.slug === slugify(formData.title))) {
        setFormData((prev) => ({ ...prev, slug: slugify(value) }));
      }
    }, 300),
    [formData.slug, formData.title, slugify]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    debouncedHandleInputChange(name, value);
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormChanged(true);
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: value ? [parseInt(value)] : [],
    }));
    setFormChanged(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'ຂໍ້ຜິດພາດ',
        description: 'ຮູບພາບມີຂະໜາດໃຫຍ່ເກີນ 10MB',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append('file', file);
      const response = await uploadPostImage(uploadData);

      if (response?.secure_url) {
        setFormData((prev) => ({ ...prev, image: response.secure_url }));
        setFormChanged(true);
        toast({
          title: 'ອັບໂຫຼດຮູບພາບສຳເລັດ',
          description: 'ຮູບພາບຖືກອັບໂຫຼດແລ້ວ',
          variant: 'success',
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        variant: 'destructive',
        title: 'ຂໍ້ຜິດພາດ',
        description: 'ບໍ່ສາມາດອັບໂຫຼດຮູບພາບໄດ້',
      });
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setImagePreview(null);
    setFormChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push('ກະລຸນາໃສ່ຫົວຂໍ້ບົດຄວາມ');
    if (!formData.content.trim()) errors.push('ກະລຸນາໃສ່ເນື້ອໃນບົດຄວາມ');
    if (!formData.slug.trim()) errors.push('ກະລຸນາໃສ່ slug ສຳລັບບົດຄວາມ');
    else if (!/^[a-z0-9\-]+$/.test(formData.slug))
      errors.push('Slug ຕ້ອງປະກອບດ້ວຍຕົວອັກສອນພາສາອັງກິດຕົວພິມນ້ອຍ, ຕົວເລກ, ແລະຂີດກາງ (-) ເທົ່ານັ້ນ');
    return errors;
  };

  const handleSubmit = async (publishStatus = null) => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        variant: 'destructive',
        title: 'ກະລຸນາແກ້ໄຂຂໍ້ມູນ',
        description: (
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
      });
      return;
    }

    if (!updatePost) {
      console.error('updatePost function is not available');
      toast({
        variant: 'destructive',
        title: 'ຂໍ້ຜິດພາດ',
        description: 'ບໍ່ສາມາດອັບເດດບົດຄວາມໄດ້ເນື່ອງຈາກຄວາມຜິດພາດຂອງລະບົບ',
      });
      return;
    }

    // Filter out fields not accepted by the backend
    const { title, content, status, slug, image } = formData;
    const finalFormData = {
      title,
      content,
      status: publishStatus || status,
      slug,
      image,
    };

    try {
      await updatePost(postId, finalFormData);
      toast({
        title: 'ອັບເດດບົດຄວາມສຳເລັດ',
        description: `ບົດຄວາມຖືກ${
          finalFormData.status === 'published' ? 'ເຜີຍແຜ່' : 'ບັນທຶກເປັນຮ່າງ'
        }ແລ້ວ`,
        variant: 'success',
      });
      setFormChanged(false);
      router.push('/blog/posts');
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        variant: 'destructive',
        title: 'ຂໍ້ຜິດພາດ',
        description:
          submitError ||
          'ບໍ່ສາມາດອັບເດດບົດຄວາມໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ',
      });
    }
  };

  const handleCancel = () => {
    if (formChanged) {
      setUnsavedChangesDialog(true);
    } else {
      router.push('/blog/posts');
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Phetsarath_OT'] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (postError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Phetsarath_OT'] flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <FaExclamationTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            ເກີດຂໍ້ຜິດພາດ
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            ບໍ່ສາມາດໂຫລດບົດຄວາມໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/blog/posts')}
              aria-label="ກັບຄືນໄປຍັງລາຍການບົດຄວາມ"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              ກັບຄືນ
            </Button>
            <Button onClick={() => window.location.reload()} aria-label="ລອງໃໝ່ອີກຄັ້ງ">
              ລອງໃໝ່ອີກຄັ້ງ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Phetsarath_OT']">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                aria-label="ກັບຄືນ"
              >
                <FaArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  ແກ້ໄຂບົດຄວາມ
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <StatusBadge status={formData.status} />
                  {formData.slug && (
                    <span className="text-gray-500 dark:text-gray-400 hidden sm:inline-block truncate max-w-xs">
                      /{formData.slug}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setPreviewDialog(true)}
                disabled={submitLoading}
                className="text-sm border-gray-300 dark:border-gray-600 dark:text-gray-300"
                aria-label="ເບິ່ງຕົວຢ່າງ"
              >
                <FaEye className="w-3.5 h-3.5 mr-2" />
                <span className="hidden sm:inline">ເບິ່ງຕົວຢ່າງ</span>
              </Button>
              <Link href={`/blog/posts/${formData.slug}`} target="_blank">
                <Button
                  variant="outline"
                  disabled={submitLoading || !formData.slug}
                  className="text-sm border-gray-300 dark:border-gray-600 dark:text-gray-300"
                  aria-label="ເບິ່ງໜ້າຈິງ"
                >
                  <FaEye className="w-3.5 h-3.5 mr-2" />
                  <span className="hidden sm:inline">ເບິ່ງໜ້າຈິງ</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={submitLoading}
                className="text-sm border-gray-300 dark:border-gray-600 dark:text-gray-300"
                aria-label="ຍົກເລີກ"
              >
                <FaTimes className="w-3.5 h-3.5 mr-2" />
                <span className="hidden sm:inline">ຍົກເລີກ</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSubmit('draft')}
                disabled={submitLoading}
                className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                aria-label="ບັນທຶກຮ່າງ"
              >
                <FaSave className="w-3.5 h-3.5 mr-2" />
                <span className="hidden sm:inline">
                  {submitLoading && formData.status === 'draft'
                    ? 'ກຳລັງບັນທຶກ...'
                    : 'ບັນທຶກຮ່າງ'}
                </span>
              </Button>
              <Button
                onClick={() => handleSubmit('published')}
                disabled={submitLoading}
                className="text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                aria-label="ເຜີຍແຜ່"
              >
                <FaCheck className="w-3.5 h-3.5 mr-2" />
                <span className="hidden sm:inline">
                  {submitLoading && formData.status === 'published'
                    ? 'ກຳລັງເຜີຍແຜ່...'
                    : 'ເຜີຍແຜ່'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                      ຫົວຂໍ້ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="ໃສ່ຫົວຂໍ້ບົດຄວາມ..."
                      className="mt-1 text-lg font-medium border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <Label
                        htmlFor="slug"
                        className="text-base font-medium text-gray-700 dark:text-gray-300"
                      >
                        Slug <span className="text-red-500">*</span>
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FaQuestionCircle className="w-3.5 h-3.5 ml-1 inline text-gray-400 dark:text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 text-white text-sm p-2 rounded shadow-lg">
                            <p>Slug ຈະປະກົດໃນ URL ຂອງບົດຄວາມ</p>
                            <p className="mt-1 text-xs text-gray-300">
                              ຕົວຢ່າງ: yourdomain.com/blog/<strong>your-slug</strong>
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                        /blog/
                      </span>
                      <Input
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="url-friendly-slug"
                        className="flex-1 rounded-l-none border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      *ໃຊ້ຕົວອັກສອນພາສາອັງກິດຕົວພິມນ້ອຍ, ຕົວເລກ ແລະ ຂີດກາງ (-) ເທົ່ານັ້ນ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
              <CardHeader className="bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 px-6 py-4">
                <CardTitle className="text-lg font-medium dark:text-white">
                  ເນື້ອໃນບົດຄວາມ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div>
                  <Label htmlFor="content" className="sr-only">
                    ເນື້ອໃນ <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="ເລີ່ມຂຽນບົດຄວາມຂອງທ່ານ..."
                    rows={18}
                    className="resize-y min-h-[300px] text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formData.content.length} ຕົວອັກສອນ</span>
                  <span>{formData.content.split(/\s+/).filter(Boolean).length} ຄຳ</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
              <CardHeader className="bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 px-6 py-4">
                <CardTitle className="text-lg font-medium dark:text-white">
                  ຮູບພາບຫຼັກ
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  ຮູບພາບທີ່ຈະສະແດງເທິງສຸດຂອງບົດຄວາມ
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isUploading && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        ກຳລັງອັບໂຫຼດ...
                      </span>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full animate-pulse"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                )}

                {imagePreview || formData.image ? (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || formData.image}
                      alt="ຮູບພາບຫຼັກຂອງບົດຄວາມ"
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    <div className="absolute top-0 right-0 p-2 flex gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-gray-900/50 hover:bg-red-500 text-white"
                        onClick={removeImage}
                        aria-label="ລຶບຮູບພາບ"
                      >
                        <FaTimes className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 ${
                      isUploading ? 'bg-gray-100 dark:bg-gray-750' : 'bg-white dark:bg-gray-800'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    aria-label="ອັບໂຫຼດຮູບພາບ"
                  >
                    <FaImage className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {isUploading ? 'ກຳລັງອັບໂຫຼດ...' : 'ລາກຮູບໃສ່ນີ້ ຫຼື ກົດເພື່ອເລືອກຮູບ'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      ຮອງຮັບ JPG, PNG, GIF (ສູງສຸດ 10MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 sticky top-24">
              <CardHeader className="bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 px-6 py-4">
                <div className="flex items-center">
                  <FaCog className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-lg font-medium dark:text-white">
                    ການຕັ້ງຄ່າການເຜີຍແຜ່
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      ສະຖານະ
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                        <SelectValue placeholder="ເລືອກສະຖານະ" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectItem
                          value="draft"
                          className="dark:text-white dark:focus:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                            ຮ່າງ
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="published"
                          className="dark:text-white dark:focus:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            ເຜີຍແຜ່
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="archived"
                          className="dark:text-white dark:focus:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                            ເກັບຖາວອນ
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700"></div>

                  <div>
                    <div className="flex items-center mb-2">
                      <FaTag className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <Label
                        htmlFor="category"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        ໝວດໝູ່
                      </Label>
                    </div>
                    {categoriesLoading ? (
                      <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                        ກຳລັງໂຫລດໝວດໝູ່...
                      </div>
                    ) : categoriesError ? (
                      <div className="text-sm text-red-500 py-2">
                        ເກີດຂໍ້ຜິດພາດ: ບໍ່ສາມາດໂຫລດໝວດໝູ່ໄດ້
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                        ບໍ່ມີໝວດໝູ່ສຳລັບເລືອກ
                      </div>
                    ) : (
                      <>
                        <Select
                          value={formData.categoryIds[0]?.toString() || ''}
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                            <SelectValue placeholder="ເລືອກໝວດໝູ່" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                                className="dark:text-white dark:focus:bg-gray-700"
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.categoryIds.length > 0 && (
                          <div className="mt-2">
                            {formData.categoryIds.map((id) => {
                              const category = categories.find((c) => c.id === id);
                              return category ? (
                                <span
                                  key={id}
                                  className="inline-flex items-center bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-md text-xs mr-1"
                                >
                                  {category.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="pt-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleSubmit('draft')}
                        disabled={submitLoading}
                        className="w-full justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                      >
                        <FaSave className="w-4 h-4 mr-2" />
                        {submitLoading && formData.status === 'draft'
                          ? 'ກຳລັງບັນທຶກ...'
                          : 'ບັນທຶກຮ່າງ'}
                      </Button>
                      <Button
                        onClick={() => handleSubmit('published')}
                        disabled={submitLoading}
                        className="w-full justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        <FaCheck className="w-4 h-4 mr-2" />
                        {submitLoading && formData.status === 'published'
                          ? 'ກຳລັງເຜີຍແຜ່...'
                          : 'ເຜີຍແຜ່'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto p-0 dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader className="p-6 border-b sticky top-0 bg-white dark:bg-gray-800 dark:border-gray-700 z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl dark:text-white">
                ສະແດງຕົວຢ່າງບົດຄວາມ
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setPreviewDialog(false)}
                aria-label="ປິດຕົວຢ່າງ"
              >
                <FaTimes className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-sm dark:text-gray-400">
              ນີ້ແມ່ນການສະແດງຕົວຢ່າງຂອງບົດຄວາມທີ່ຈະເຜີຍແຜ່
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 max-w-3xl mx-auto">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              <h1 className="text-3xl font-bold mb-6 dark:text-white">
                {formData.title || 'ຫົວຂໍ້ບົດຄວາມ'}
              </h1>

              {(formData.image || imagePreview) && (
                <div className="mb-6">
                  <img
                    src={formData.image || imagePreview}
                    alt={formData.title || 'ຮູບພາບບົດຄວາມ'}
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={() => {
                      setImagePreview(null);
                      toast({
                        variant: "destructive",
                        title: "ບໍ່ສາມາດໂຫລດຮູບພາບ",
                        description: "ຮູບພາບບໍ່ສາມາດໂຫລດໄດ້",
                      });
                    }}
                  />
                </div>
              )}

              <div className="mt-6 space-y-4">
                {formData.content ? (
                  formData.content.split('\n').map((paragraph, index) =>
                    paragraph.trim() ? (
                      <p
                        key={index}
                        className="text-gray-800 dark:text-gray-300 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ) : (
                      <br key={index} />
                    )
                  )
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    ກະລຸນາເພີ່ມເນື້ອໃນບົດຄວາມ...
                  </p>
                )}
              </div>
            </article>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={unsavedChangesDialog} onOpenChange={setUnsavedChangesDialog}>
        <DialogContent className="sm:max-w-md font-['Phetsarath_OT'] dark:bg-gray-900 dark:text-white">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <FaExclamationTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold dark:text-white">
              ການປ່ຽນແປງທີ່ຍັງບໍ່ບັນທຶກ
            </DialogTitle>
            <DialogDescription className="text-center dark:text-gray-300 text-base">
              ທ່ານມີການປ່ຽນແປງທີ່ຍັງບໍ່ບັນທຶກ. ຕ້ອງການອອກຈາກໜ້ານີ້ບໍ່?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 gap-3 sm:gap-0 p-6">
            <Button
              variant="outline"
              onClick={() => setUnsavedChangesDialog(false)}
              className="text-base hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              ຍົກເລີກ
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setUnsavedChangesDialog(false);
                setFormChanged(false);
                router.push('/blog/posts');
              }}
              className="text-base bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              ອອກໂດຍບໍ່ບັນທຶກ
            </Button>
            <Button
              onClick={() => {
                setUnsavedChangesDialog(false);
                handleSubmit(formData.status);
              }}
              className="text-base bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              ບັນທຶກແລະອອກ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPostEdit;