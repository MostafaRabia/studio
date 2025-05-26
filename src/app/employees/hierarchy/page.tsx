
"use client";

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { useEmployees } from '@/contexts/employee-context';
import { EmployeeHierarchyNode } from '@/components/employees/employee-hierarchy-node';
// Removed type Employee import as it's not directly used here anymore

export default function EmployeeHierarchyPage() {
  const { employees } = useEmployees();

  const employeeIds = new Set(employees.map(e => e.id));
  const rootEmployees = employees.filter(emp => {
    if (!emp.reportsTo || emp.reportsTo.length === 0) {
      return true;
    }
    return !emp.reportsTo.some(managerId => employeeIds.has(managerId));
  });

  return (
    <>
      <PageHeader
        title="Employee Hierarchy Chart"
        description="Visualize the reporting structure of the organization."
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
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Hierarchy Chart
          </CardTitle>
          <CardDescription>
            Organizational structure based on reporting lines. Scroll horizontally if needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 overflow-x-auto"> {/* Added overflow-x-auto for horizontal scrolling */}
          {employees.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground">No employees in the directory to display a hierarchy.</p>
            </div>
          ) : rootEmployees.length > 0 ? (
             <div className="flex flex-row justify-center items-start space-x-4 min-w-max"> {/* Horizontal layout for root nodes, min-w-max ensures content defines width */}
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
