
import { PageHeader } from '@/components/page-header';
import { EmployeeDirectoryClient } from '@/components/employees/employee-directory-client';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react'; // Changed GitFork to Users for hierarchy
import Link from 'next/link';
// import { InlineEmployeeHierarchy } from '@/components/employees/inline-employee-hierarchy'; // Removed
// import { Separator } from '@/components/ui/separator'; // Removed

export default function EmployeeDirectoryPage() {
  return (
    <>
      <PageHeader
        title="Employee Directory"
        description="Find and connect with your colleagues."
        actions={
          <div className="flex gap-2">
            <Link href="/employees/hierarchy" passHref>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" /> 
                Employee Hierarchy
              </Button>
            </Link>
            <Link href="/employees/new" passHref>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                New Employee
              </Button>
            </Link>
          </div>
        }
      />
      {/* EmployeeDirectoryClient now gets employees from context */}
      <EmployeeDirectoryClient /> 

      {/* <Separator className="my-8" /> Removed Separator */}

      {/* <InlineEmployeeHierarchy /> Removed InlineEmployeeHierarchy */}
    </>
  );
}
