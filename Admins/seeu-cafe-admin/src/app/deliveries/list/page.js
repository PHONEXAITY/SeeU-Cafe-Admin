import Layout from '@/components/layout/Layout';
import DeliveryDashboard from '@/components/deliveries/DeliveryDashboard'; // Changed to default import

const DeliveryList = () => {
  return (
    <Layout>
      <DeliveryDashboard />
    </Layout>
  );
};

export default DeliveryList;