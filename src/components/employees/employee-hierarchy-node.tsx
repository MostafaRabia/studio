
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
  level: number;
}

export function EmployeeHierarchyNode({ employee, allEmployees, level }: EmployeeHierarchyNodeProps) {
  const directReports = allEmployees.filter(emp => employee.directReports?.includes(emp.id));
  const displayAvatarSrc = employee.avatarDataUrl || employee.avatarUrl;

  return (
    <div style={{ marginLeft: `${level * 2}rem` }} className="my-4">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center space-x-3 pb-3">
          <Avatar className="h-12 w-12">
            {displayAvatarSrc ? (
              <AvatarImage src={displayAvatarSrc} alt={employee.name} asChild>
                <Image src={displayAvatarSrc} alt={employee.name} width={48} height={48} data-ai-hint={employee.dataAiHint || 'profile picture'} />
              </AvatarImage>
            ) : null}
            <AvatarFallback>
              <UserCircle className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/employees/${employee.id}`} passHref>
              <CardTitle className="text-lg hover:text-primary hover:underline cursor-pointer transition-colors">
                {employee.name}
              </CardTitle>
            </Link>
            <CardDescription className="flex items-center text-xs">
              <Briefcase className="h-3 w-3 mr-1.5 text-muted-foreground" />
              {employee.jobTitle}
            </CardDescription>
          </div>
        </CardHeader>
        {/* You can add more details to CardContent if needed */}
      </Card>

      {directReports.length > 0 && (
        <div className="mt-2 border-l-2 border-primary/50 pl-4">
          {directReports.map(report => (
            <EmployeeHierarchyNode
              key={report.id}
              employee={report}
              allEmployees={allEmployees}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
