import React from 'react';
import Layout from '@/components/layout/Layout';
import OrderList from '@/components/Orders/OrderList';

const OrderListPage = () => {
  return (
    <Layout>
      <OrderList />
    </Layout>
  );
};

export default OrderListPage;