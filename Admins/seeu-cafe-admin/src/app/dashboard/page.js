import dynamic from "next/dynamic";

const DashboardClient = dynamic(
  () => import("@/components/dashboard/DashboardPage"),
  { ssr: false }
);

export default function DashboardPage() {
  return <DashboardClient />;
}
