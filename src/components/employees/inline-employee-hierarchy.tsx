
"use client";

import { PageHeader } from '@/components/page-header'; // Not strictly needed for title, but good for consistency if we add description
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useEmployees } from '@/contexts/employee-context';
import { EmployeeHierarchyNode } from '@/components/employees/employee-hierarchy-node';

export function InlineEmployeeHierarchy() {
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
    <section aria-labelledby="hierarchy-title">
      <h2 id="hierarchy-title" className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
        Organizational Chart
      </h2>
      <Card className="shadow-lg">
        <CardHeader className="hidden"> {/* Header content moved to h2 above for semantic structure */}
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
    </section>
  );
}
