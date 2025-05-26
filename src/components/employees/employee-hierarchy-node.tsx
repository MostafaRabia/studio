
"use client";

import type { Employee } from '@/lib/placeholder-data';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Briefcase } from 'lucide-react';

interface EmployeeHierarchyNodeProps {
  employee: Employee;
  allEmployees: Employee[];
}

export function EmployeeHierarchyNode({ employee, allEmployees }: EmployeeHierarchyNodeProps) {
  const directReports = allEmployees.filter(emp => employee.directReports?.includes(emp.id));
  const displayAvatarSrc = employee.avatarDataUrl || employee.avatarUrl;

  return (
    <div className="my-2"> {/* Reduced vertical margin, removed style-based marginLeft */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center space-x-3 p-3"> {/* Compact padding */}
          <Avatar className="h-10 w-10"> {/* Smaller avatar */}
            {displayAvatarSrc ? (
              <AvatarImage src={displayAvatarSrc} alt={employee.name} asChild>
                <Image src={displayAvatarSrc} alt={employee.name} width={40} height={40} data-ai-hint={employee.dataAiHint || 'profile picture'} />
              </AvatarImage>
            ) : null}
            <AvatarFallback>
              <UserCircle className="h-6 w-6 text-muted-foreground" /> {/* Adjusted icon size for smaller avatar */}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/employees/${employee.id}`} passHref>
              <CardTitle className="text-base hover:text-primary hover:underline cursor-pointer transition-colors"> {/* Smaller title */}
                {employee.name}
              </CardTitle>
            </Link>
            <CardDescription className="flex items-center text-xs">
              <Briefcase className="h-3 w-3 mr-1.5 text-muted-foreground" />
              {employee.jobTitle}
            </CardDescription>
          </div>
        </CardHeader>
        {/* CardContent can be added here if more details per node are needed later */}
      </Card>

      {directReports.length > 0 && (
        <div className="mt-2 border-l-2 border-primary/50 pl-4"> {/* Indentation and connector line for children */}
          {directReports.map(report => (
            <EmployeeHierarchyNode
              key={report.id}
              employee={report}
              allEmployees={allEmployees}
              // No 'level' prop passed down anymore
            />
          ))}
        </div>
      )}
    </div>
  );
}
