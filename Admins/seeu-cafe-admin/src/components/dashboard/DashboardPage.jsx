"use client";

import React, { useEffect, memo, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthInitialized,
} from "@/store/slices/authSlice";

import Layout from "@/components/layout/Layout";

const DashboardStats = lazy(() =>
  import("@/components/dashboard/DashboardStats")
);
const SalesAnalytics = lazy(() =>
  import("@/components/dashboard/SalesAnalytics")
);
const TrendingCoffee = lazy(() =>
  import("@/components/dashboard/TrendingCoffee")
);
const RecentOrders = lazy(() => import("@/components/dashboard/RecentOrders"));
const CustomerMap = lazy(() => import("@/components/dashboard/CustomerMap"));
const RevenueChart = lazy(() => import("@/components/dashboard/RevenueChart"));

const LoadingIndicator = ({ message }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const circleVariants = {
    initial: { scale: 0.8, opacity: 0.3 },
    animate: { scale: 1, opacity: 1 },
  };

  const circleTransition = {
    duration: 0.8,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="p-8 rounded-xl bg-white shadow-xl flex flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex space-x-3 mb-6">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-4 h-4 rounded-full bg-blue-500"
              variants={circleVariants}
              initial="initial"
              animate="animate"
              transition={{
                ...circleTransition,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-lg font-medium text-gray-700">{message}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ComponentLoader = ({ children }) => (
  <Suspense
    fallback={
      <div className="p-4 rounded-lg bg-gray-50 animate-pulse flex items-center justify-center h-64">
        <p className="text-gray-400">กำลังโหลด...</p>
      </div>
    }
  >
    {children}
  </Suspense>
);

const DashboardContent = memo(() => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ComponentLoader>
          <DashboardStats />
        </ComponentLoader>

        <div className="grid gap-8 mb-8 md:grid-cols-2 xl:grid-cols-4 mt-8">
          <motion.div
            className="md:col-span-2 xl:col-span-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ComponentLoader>
              <SalesAnalytics />
            </ComponentLoader>
          </motion.div>

          <motion.div
            className="md:col-span-2 xl:col-span-1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ComponentLoader>
              <TrendingCoffee />
            </ComponentLoader>
          </motion.div>
        </div>

        <div className="container mx-auto p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Revenue Chart</h2>
              <ComponentLoader>
                <RevenueChart />
              </ComponentLoader>
            </motion.div>

            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4">Customer Map</h2>
              <ComponentLoader>
                <CustomerMap />
              </ComponentLoader>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ComponentLoader>
            <RecentOrders />
          </ComponentLoader>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

DashboardContent.displayName = "DashboardContent";

const DashboardPage = () => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  const isInitialized = useSelector(selectAuthInitialized);

  useEffect(() => {
    if (!isInitialized || authLoading) return;

    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login...");
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, isInitialized, router]);

  if (!isInitialized || authLoading) {
    return (
      <LoadingIndicator
        message={
          authLoading ? "กำลังตรวจสอบการเข้าสู่ระบบ..." : "กำลังโหลดข้อมูล..."
        }
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <LoadingIndicator message="กำลังเปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ..." />
    );
  }

  return (
    <Layout>
      <DashboardContent />
    </Layout>
  );
};

export default DashboardPage;
