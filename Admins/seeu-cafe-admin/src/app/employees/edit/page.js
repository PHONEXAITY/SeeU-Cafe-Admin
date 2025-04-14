'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeDetails from '@/components/Employees/EmployeeDetails';
import EmployeeDocuments from '@/components/Employees/EmployeeForm';
import Layout from '@/components/layout/Layout';

export default function EmployeeDetailPage({ params }) {
  return (
    <Layout>
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">ຂໍ້ມູນພະນັກງານ</TabsTrigger>
          <TabsTrigger value="documents">ເອກະສານ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <EmployeeDetails employeeId={params.id} />
        </TabsContent>
        
        <TabsContent value="documents">
          <EmployeeDocuments employeeId={params.id} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}