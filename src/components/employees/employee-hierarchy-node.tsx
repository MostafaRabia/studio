
"use client";

import type { Employee } from '@/lib/placeholder-data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { UserCircle } from 'lucide-react';

interface EmployeeHierarchyNodeProps {
  employee: Employee;
  allEmployees: Employee[];
}

export function EmployeeHierarchyNode({ employee, allEmployees }: EmployeeHierarchyNodeProps) {
  const directReports = allEmployees.filter(emp => employee.directReports?.includes(emp.id));
  const displayAvatarSrc = employee.avatarDataUrl || employee.avatarUrl;

  return (
    <div className="inline-flex flex-col items-center p-2 text-center">
      {/* Employee Node */}
      <Link href={`/employees/${employee.id}`} passHref>
        <div className="bg-card border border-border text-card-foreground hover:shadow-lg transition-shadow cursor-pointer p-3 rounded-lg shadow-md min-w-[160px] max-w-[200px] z-10">
          <div className="flex flex-col items-center">
            <Avatar className="h-12 w-12 mb-2">
              {displayAvatarSrc ? (
                <AvatarImage src={displayAvatarSrc} alt={employee.name} asChild>
                  <Image src={displayAvatarSrc} alt={employee.name} width={48} height={48} data-ai-hint={employee.dataAiHint || 'profile picture'} />
                </AvatarImage>
              ) : null}
              <AvatarFallback>
                <UserCircle className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm truncate" title={employee.name}>{employee.name}</p>
            <p className="text-xs truncate text-muted-foreground" title={employee.jobTitle}>{employee.jobTitle}</p>
            <p className="text-xs truncate text-muted-foreground/80 mt-0.5" title={employee.department}>{employee.department}</p>
          </div>
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
                {directReports.length > 1 && (
                   <div className={cn(
                      "absolute top-0 h-px bg-muted-foreground",
                      idx === 0 && directReports.length > 1 ? "left-1/2 right-0" : "", 
                      idx === directReports.length - 1 && directReports.length > 1 ? "left-0 right-1/2" : "", 
                      idx > 0 && idx < directReports.length - 1 ? "left-0 right-0" : "" 
                   )}></div>
                )}
                <div className="mt-6"> 
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

