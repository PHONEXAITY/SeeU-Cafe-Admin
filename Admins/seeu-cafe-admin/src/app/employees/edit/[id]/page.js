'use client'
import EmployeeForm from '@/components/Employees/EmployeeForm';
import Layout from '@/components/layout/Layout';

export default function EditEmployeePage({ params }) {
  return (
    <Layout>
      <EmployeeForm employeeId={params.id} />
    </Layout>
  );
}