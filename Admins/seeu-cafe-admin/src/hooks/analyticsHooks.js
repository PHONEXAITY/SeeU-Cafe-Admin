'use client'

import { useQuery } from 'react-query';
import { analyticsService } from '@/services/api';

// Get sales analytics data
export const useSalesAnalytics = (timeRange = '7d', filters = {}) => {
  return useQuery(
    ['salesAnalytics', timeRange, filters],
    () => analyticsService.getSalesAnalytics(timeRange, filters).then(res => res.data),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 15, // 15 minutes
    }
  );
};

// Get product analytics data
export const useProductAnalytics = (filters = {}) => {
  return useQuery(
    ['productAnalytics', filters],
    () => analyticsService.getProductAnalytics(filters).then(res => res.data),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 15, // 15 minutes
    }
  );
};

// Get user analytics data
export const useUserAnalytics = (filters = {}) => {
  return useQuery(
    ['userAnalytics', filters],
    () => analyticsService.getUserAnalytics(filters).then(res => res.data),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 15, // 15 minutes
    }
  );
};

// Get dashboard stats
export const useDashboardStats = () => {
  return useQuery(
    'dashboardStats',
    () => analyticsService.getDashboardStats().then(res => res.data),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

// Time range options for analytics
export const timeRangeOptions = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last Year' },
  { value: 'all', label: 'All Time' },
];

// Helper function to format date ranges for display
export const formatDateRange = (timeRange) => {
  const today = new Date();
  let startDate = new Date();
  
  switch (timeRange) {
    case '7d':
      startDate.setDate(today.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(today.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(today.getDate() - 90);
      break;
    case '6m':
      startDate.setMonth(today.getMonth() - 6);
      break;
    case '1y':
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    case 'all':
      return 'All Time';
    default:
      startDate.setDate(today.getDate() - 7);
  }
  
  // Format dates as "DD MMM YYYY"
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  
  return `${formatDate(startDate)} - ${formatDate(today)}`;
};

// Currency formatter for analytics
export const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
});

// Number formatter with thousands separators
export const numberFormatter = new Intl.NumberFormat('en-US');

// Percentage formatter
export const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// Calculate percentage change
export const calculatePercentChange = (current, previous) => {
  if (!previous) return null;
  return (current - previous) / previous;
};

// Get color based on trend (positive or negative)
export const getTrendColor = (value) => {
  if (value === null || value === undefined) return 'text-gray-500';
  return value >= 0 ? 'text-green-500' : 'text-red-500';
};