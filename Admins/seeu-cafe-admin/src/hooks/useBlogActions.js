"use client";

import { useState } from 'react';
import api from '@/services/api';
import { useToast } from "@/components/ui/use-toast";

export const useBlogActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  
  const createPost = async (data) => {
    setLoading(true);
    setError(null);
    try {
      
      
      const apiAcceptedData = {
        title: data.title,
        content: data.content,
        status: data.status || 'draft',
        slug: data.slug,
        image: data.image || null,
        
        categories: data.categoryIds || [],
      };

      console.log('Sending data to API:', apiAcceptedData);
      const response = await api.post('/blogs', apiAcceptedData);
      
      return response.data;
    } catch (err) {
      console.error('Error creating blog post:', err);
      
      
      let errorMessage = err.response?.data?.message || 'Failed to create blog post';
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
      
      if (err.response?.status === 409 && errorMessage.includes('slug')) {
        errorMessage = 'Slug นี้มีผู้ใช้งานแล้ว กรุณาใช้ slug อื่น';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  
  const updatePost = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      
      const apiAcceptedData = {
        title: data.title,
        content: data.content,
        status: data.status,
        slug: data.slug,
        image: data.image,
        
        categories: data.categoryIds || [],
      };

      const response = await api.patch(`/blogs/${id}`, apiAcceptedData);
      return response.data;
    } catch (err) {
      console.error('Error updating blog post:', err);
      let errorMessage = err.response?.data?.message || 'Failed to update blog post';
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  
  const deletePost = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error deleting blog post:', err);
      let errorMessage = err.response?.data?.message || 'Failed to delete blog post';
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  
  const updatePostStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/blogs/${id}/status`, { status });
      return response.data;
    } catch (err) {
      console.error('Error updating blog post status:', err);
      let errorMessage = err.response?.data?.message || 'Failed to update post status';
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  
  const uploadPostImage = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/cloudinary/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          
          console.log('Upload progress:', Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });
      return response.data;
    } catch (err) {
      console.error('Error uploading image:', err);
      let errorMessage = err.response?.data?.message || 'Failed to upload image';
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(', ');
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { 
    createPost, 
    updatePost, 
    deletePost, 
    updatePostStatus, 
    uploadPostImage, 
    loading, 
    error 
  };
};

export default useBlogActions;