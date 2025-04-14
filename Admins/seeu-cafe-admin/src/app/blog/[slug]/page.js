'use client';

import Layout from '@/components/layout/Layout';
import BlogPostView from '@/components/Blog/BlogPostView'; // Adjust path to your BlogPostView component

export default function BlogPostPage() {
  return (
     <Layout>
  <BlogPostView />
  </Layout>
  );
}