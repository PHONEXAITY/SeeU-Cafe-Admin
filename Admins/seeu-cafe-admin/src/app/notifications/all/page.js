import React from 'react';
import Layout from '@/components/layout/Layout';
import NotificationsList from '@/components/Notifications/NotificationsList';

const NotificationsPage = () => {
  return (
    <Layout>
      <NotificationsList />
    </Layout>
  );
};

export default NotificationsPage;