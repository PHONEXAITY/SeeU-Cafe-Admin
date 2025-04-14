'use client'
import EditSlidePage from '@/components/Slideshow/EditSlidePage';
import Layout from '@/components/layout/Layout';

export default function EditSlide({ params }) {
  return (
    <Layout>
      <EditSlidePage params={params}/>
    </Layout>
  );
}