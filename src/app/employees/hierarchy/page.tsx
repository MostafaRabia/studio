
"use client";

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users }
from 'lucide-react';
import { useEmployees } from '@/contexts/employee-context';
import { EmployeeHierarchyNode } from '@/components/employees/employee-hierarchy-node';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EmployeeHierarchyPage() {
  const { employees } = useEmployees();

  const employeeIds = new Set(employees.map(e => e.id));
  const rootEmployees = employees.filter(emp => {
    if (!emp.reportsTo || emp.reportsTo.length === 0) {
      return true;
    }
    // Check if any of the managers listed in reportsTo actually exist in the employee list
    return !emp.reportsTo.some(managerId => employeeIds.has(managerId));
  });

  return (
    <>
      <PageHeader
        title="Employee Hierarchy Chart"
        description="Visual representation of the reporting structure."
        actions={
            <Link href="/employees" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
        }
      />
      <Card className="shadow-lg">
        <CardHeader className="hidden"> {/* Header content moved to PageHeader */}
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Organizational Chart
          </CardTitle>
          <CardDescription>
            Visual representation of the reporting structure.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto">
          {employees.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground">No employees in the directory to display a hierarchy.</p>
            </div>
          ) : rootEmployees.length > 0 ? (
             <div className="flex flex-row justify-center items-start space-x-4 min-w-max">
              {rootEmployees.map(employee => (
                <EmployeeHierarchyNode
                  key={employee.id}
                  employee={employee}
                  allEmployees={employees}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground">Could not determine root employees for the hierarchy. Check reporting data.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
