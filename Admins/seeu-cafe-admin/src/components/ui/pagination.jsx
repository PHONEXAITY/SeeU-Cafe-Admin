'use client'; // ใช้ client-side rendering

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // ฟังก์ชันช่วยจัดการ className (ถ้ามีในโปรเจกต์)

// คอมโพเนนต์หลัก Pagination
export const Pagination = ({ children, className }) => {
  return (
    <nav className={cn('flex items-center justify-center', className)}>
      {children}
    </nav>
  );
};

// คอมโพเนนต์สำหรับห่อเนื้อหา Pagination
export const PaginationContent = ({ children, className }) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {children}
    </div>
  );
};

// คอมโพเนนต์สำหรับแต่ละ item ใน Pagination
export const PaginationItem = ({ children, className }) => {
  return <div className={cn('inline-flex', className)}>{children}</div>;
};

// คอมโพเนนต์สำหรับลิงก์หน้า
export const PaginationLink = ({ page, isActive = false, children, className, ...props }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'px-3 py-1 rounded-md text-sm',
        isActive ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// คอมโพเนนต์สำหรับปุ่ม Previous
export const PaginationPrevious = ({ className, disabled = false, ...props }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const handleClick = () => {
    if (currentPage > 1) {
      const params = new URLSearchParams(searchParams);
      params.set('page', (currentPage - 1).toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || currentPage === 1}
      className={cn(
        'p-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50',
        className
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
};

// คอมโพเนนต์สำหรับปุ่ม Next
export const PaginationNext = ({ totalPages, className, disabled = false, ...props }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const handleClick = () => {
    if (currentPage < totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', (currentPage + 1).toString());
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || currentPage === totalPages}
      className={cn(
        'p-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50',
        className
      )}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  );
};

// คอมโพเนนต์สำหรับจุดไข่ปลา (Ellipsis)
export const PaginationEllipsis = ({ className, ...props }) => {
  return (
    <span
      className={cn('px-3 py-1 text-sm text-gray-800', className)}
      {...props}
    >
      ...
    </span>
  );
};