
"use client";

import type { Employee } from '@/lib/placeholder-data';
import Link from 'next/link';
// Removed Avatar and full Card imports, will use simple divs for styling
import { cn } from '@/lib/utils';

interface EmployeeHierarchyNodeProps {
  employee: Employee;
  allEmployees: Employee[];
}

export function EmployeeHierarchyNode({ employee, allEmployees }: EmployeeHierarchyNodeProps) {
  const directReports = allEmployees.filter(emp => employee.directReports?.includes(emp.id));

  return (
    <div className="inline-flex flex-col items-center p-2 text-center">
      {/* Employee Node */}
      <Link href={`/employees/${employee.id}`} passHref>
        <div className="bg-primary/20 text-primary-foreground hover:bg-primary/30 transition-colors cursor-pointer p-3 rounded-md shadow-md min-w-[140px] max-w-[180px] z-10">
          <p className="font-semibold text-sm truncate" title={employee.name}>{employee.name}</p>
          <p className="text-xs truncate text-primary-foreground/80" title={employee.jobTitle}>{employee.jobTitle}</p>
        </div>
      </Link>

      {/* Connectors and Children */}
      {directReports.length > 0 && (
        <div className="flex flex-col items-center w-auto">
          {/* Vertical line from parent node */}
          <div className="w-px h-6 bg-muted-foreground mt-1"></div>
          
          {/* Horizontal line connecting children if more than one child */}
          {directReports.length > 1 && (
            <div className="h-px w-full bg-muted-foreground"></div>
          )}
          
          {/* Container for direct reports */}
          <div className="flex flex-row justify-center items-start mt-0 w-auto">
            {directReports.map((report, idx) => (
              <div key={report.id} className="relative flex flex-col items-center px-1">
                {/* Vertical line from child up to horizontal line (or parent if single child) */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-6 bg-muted-foreground"></div>
                
                {/* Horizontal line segment for this child connecting to the main horizontal line */}
                {/* This ensures each child's vertical line appears to connect to the parent's horizontal bar */}
                {directReports.length > 1 && (
                   <div className={cn(
                      "absolute top-0 h-px bg-muted-foreground",
                      idx === 0 && directReports.length > 1 ? "left-1/2 right-0" : "", // First child: line from center to right
                      idx === directReports.length - 1 && directReports.length > 1 ? "left-0 right-1/2" : "", // Last child: line from center to left
                      idx > 0 && idx < directReports.length - 1 ? "left-0 right-0" : "" // Middle children: line spans full width
                   )}></div>
                )}
                <div className="mt-6"> {/* Add margin-top to create space for the connector line */}
                  <EmployeeHierarchyNode
                    employee={report}
                    allEmployees={allEmployees}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
