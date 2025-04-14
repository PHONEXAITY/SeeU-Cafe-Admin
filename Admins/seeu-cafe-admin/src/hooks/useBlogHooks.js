'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useToast } from "@/components/ui/use-toast";

export const useBlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/blog-categories');
      setCategories(response.data || []);
      return response.data;
    } catch (err) {
      console.error('Error fetching blog categories:', err);
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດໂຫລດໝວດໝູ່ໄດ້';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

export const useBlogActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const createCategory = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/blog-categories', data);
      toast({
        title: "ສຳເລັດ",
        description: "ສ້າງໝວດໝູ່ໃໝ່ສຳເລັດແລ້ວ",
        variant: "success",
      });
      return response.data;
    } catch (err) {
      console.error('Error creating blog category:', err);
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດສ້າງໝວດໝູ່ໄດ້';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/blog-categories/${id}`, data);
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດໝວດໝູ່ສຳເລັດແລ້ວ",
        variant: "success",
      });
      return response.data;
    } catch (err) {
      console.error('Error updating blog category:', err);
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດອັບເດດໝວດໝູ່ໄດ້';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/blog-categories/${id}`);
      toast({
        title: "ສຳເລັດ",
        description: "ລຶບໝວດໝູ່ສຳເລັດແລ້ວ",
        variant: "success",
      });
      return response.data;
    } catch (err) {
      console.error('Error deleting blog category:', err);
      let errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດລຶບໝວດໝູ່ໄດ້';
      if (err.response?.status === 409) {
        errorMessage = 'ບໍ່ສາມາດລຶບໝວດໝູ່ນີ້ໄດ້ເນື່ອງຈາກມີບົດຄວາມທີ່ໃຊ້ໝວດໝູ່ນີ້ຢູ່';
      }
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/blogs/${id}`, data);
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດບົດຄວາມສຳເລັດແລ້ວ",
        variant: "success",
      });
      return response.data;
    } catch (err) {
      console.error('Error updating blog post:', err);
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດອັບເດດບົດຄວາມໄດ້';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadPostImage = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/blogs/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({
        title: "ສຳເລັດ",
        description: "ອັບໂຫລດຮູບພາບສຳເລັດແລ້ວ",
        variant: "success",
      });
      return response.data;
    } catch (err) {
      console.error('Error uploading image:', err);
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດອັບໂຫລດຮູບພາບໄດ້';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    updatePost,
    uploadPostImage,
    loading,
    error,
  };
};

export const useBlogPosts = (initialParams = {}) => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchPosts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    const finalParams = {
      page: params.page || initialParams.page || 1,
      limit: params.limit || initialParams.limit || 10,
      sort: params.sort || initialParams.sort || 'created_at',
      order: params.order || initialParams.order || 'desc',
      status: params.status || initialParams.status || undefined,
      categoryId: params.categoryId || initialParams.categoryId || undefined,
      search: params.search || initialParams.search || undefined,
    };

    try {
      const response = await api.get('/blogs', { params: finalParams });
      setPosts(response.data.posts || response.data || []);
      setPagination(response.data.pagination || null);
      return response.data;
    } catch (err) {
      console.error('Fetch posts error:', err);
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດໂຫລດບົດຄວາມໄດ້';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
      });
      return { posts: [], pagination: null };
    } finally {
      setLoading(false);
    }
  }, [toast, initialParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, pagination, loading, error, refetch: fetchPosts };
};

export const useBlogPost = (id) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchPost = useCallback(async () => {
    if (!id) {
      setError('ບໍ່ມີ ID ສຳລັບບົດຄວາມ');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/blogs/${id}`);
      setPost(response.data || null);
      return response.data;
    } catch (err) {
      console.error('Error fetching blog post:', err);
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດໂຫລດບົດຄວາມໄດ້';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, error, refetch: fetchPost };
};

export const useBlogPostBySlug = (slug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchPostBySlug = useCallback(async () => {
    if (!slug) {
      setError('ບໍ່ມີ Slug ສຳລັບບົດຄວາມ');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/blogs/slug/${slug}`);
      setPost(response.data || null);
      return response.data;
    } catch (err) {
      console.error('Error fetching blog post by slug:', err);
      const errorMessage = err.response?.data?.message || 'ບໍ່ສາມາດໂຫລດບົດຄວາມໄດ້';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [slug, toast]);

  useEffect(() => {
    fetchPostBySlug();
  }, [fetchPostBySlug]);

  return { post, loading, error, refetch: fetchPostBySlug };
};