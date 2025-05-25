import { PageHeader } from '@/components/page-header';
import { EmployeeDirectoryClient } from '@/components/employees/employee-directory-client';
import { employees } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeDirectoryPage() {
  return (
    <>
      <PageHeader
        title="Employee Directory"
        description="Find and connect with your colleagues."
        actions={
          <Link href="/employees/new" passHref>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              New Employee
            </Button>
          </Link>
        }
      />
      <EmployeeDirectoryClient initialEmployees={employees} />
    </>
  );
}
