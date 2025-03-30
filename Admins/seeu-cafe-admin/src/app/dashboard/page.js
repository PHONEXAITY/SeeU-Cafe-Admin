import dynamic from 'next/dynamic';

// ใช้ dynamic import เพื่อให้ Component นี้ทำงานเฉพาะฝั่ง client และปิด SSR
const DashboardClient = dynamic(
  () => import('@/components/dashboard/DashboardPage'),
  { ssr: false }
);

export default function DashboardPage() {
  return <DashboardClient />;
}