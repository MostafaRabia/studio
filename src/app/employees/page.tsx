import { PageHeader } from '@/components/page-header';
import { EmployeeDirectoryClient } from '@/components/employees/employee-directory-client';
import { employees } from '@/lib/placeholder-data';

export default function EmployeeDirectoryPage() {
  return (
    <>
      <PageHeader
        title="Employee Directory"
        description="Find and connect with your colleagues."
      />
      <EmployeeDirectoryClient initialEmployees={employees} />
    </>
  );
}
