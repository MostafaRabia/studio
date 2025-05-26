
"use client";

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { useEmployees } from '@/contexts/employee-context';
import { EmployeeHierarchyNode } from '@/components/employees/employee-hierarchy-node';
import type { Employee } from '@/lib/placeholder-data';

export default function EmployeeHierarchyPage() {
  const { employees } = useEmployees();

  // Determine root nodes: employees who don't report to anyone in the current list,
  // or whose 'reportsTo' is empty/undefined.
  const employeeIds = new Set(employees.map(e => e.id));
  const rootEmployees = employees.filter(emp => {
    if (!emp.reportsTo || emp.reportsTo.length === 0) {
      return true; // No manager listed
    }
    // Check if any listed manager is actually in the current employee dataset
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
            Organizational structure based on reporting lines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground">No employees in the directory to display a hierarchy.</p>
            </div>
          ) : rootEmployees.length > 0 ? (
            <div className="space-y-6">
              {rootEmployees.map(employee => (
                <EmployeeHierarchyNode
                  key={employee.id}
                  employee={employee}
                  allEmployees={employees}
                  level={0}
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
