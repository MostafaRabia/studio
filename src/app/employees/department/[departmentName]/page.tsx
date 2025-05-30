
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployees } from '@/contexts/employee-context';
import type { Employee } from '@/lib/placeholder-data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { ArrowLeft, UserCircle, Briefcase, Mail, Phone } from 'lucide-react';
import React, { useMemo } from 'react';

interface DepartmentEmployeeCardProps {
  employee: Employee;
}

function DepartmentEmployeeCard({ employee }: DepartmentEmployeeCardProps) {
  const displayAvatarSrc = employee.avatarDataUrl || employee.avatarUrl;
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center space-x-4 pb-3">
        <Avatar className="h-12 w-12">
          {displayAvatarSrc ? (
            <AvatarImage src={displayAvatarSrc} alt={employee.name} asChild>
               <Image src={displayAvatarSrc} alt={employee.name} width={48} height={48} data-ai-hint={employee.dataAiHint || 'profile picture'} />
            </AvatarImage>
          ) : null}
          <AvatarFallback><UserCircle className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
        </Avatar>
        <div>
          <Link href={`/employees/${employee.id}`} passHref>
            <CardTitle className="text-lg hover:text-primary hover:underline cursor-pointer transition-colors">
              {employee.name}
            </CardTitle>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="mr-2 h-4 w-4" />
          <span>{employee.jobTitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function HrContactCard({ contact }: { contact: Employee }) {
  const displayAvatarSrc = contact.avatarDataUrl || contact.avatarUrl;
  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle>HR Contact</CardTitle>
        <CardDescription>Your point of contact in Human Resources for this department.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          {displayAvatarSrc ? (
            <AvatarImage src={displayAvatarSrc} alt={contact.name} asChild>
              <Image src={displayAvatarSrc} alt={contact.name} width={64} height={64} data-ai-hint={contact.dataAiHint || 'profile picture'} />
            </AvatarImage>
          ) : null }
          <AvatarFallback><UserCircle className="h-10 w-10 text-muted-foreground" /></AvatarFallback>
        </Avatar>
        <div>
          <Link href={`/employees/${contact.id}`} passHref>
            <h3 className="text-lg font-semibold hover:text-primary hover:underline cursor-pointer transition-colors">{contact.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{contact.jobTitle}</p>
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                {contact.email}
              </a>
            </div>
          )}
          {contact.phone && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Phone className="h-4 w-4" />
              <span>{contact.phone}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


export default function DepartmentEmployeesPage() {
  const params = useParams();
  const router = useRouter();
  const { employees } = useEmployees();

  const departmentNameParam = params.departmentName;
  const departmentName = useMemo(() => {
    return typeof departmentNameParam === 'string' ? decodeURIComponent(departmentNameParam) : '';
  }, [departmentNameParam]);

  const departmentEmployees = useMemo(() => {
    if (!departmentName) return [];
    return employees.filter(emp => emp.department.toLowerCase() === departmentName.toLowerCase());
  }, [employees, departmentName]);

  const hrContact = useMemo(() => {
    // Prefer Eve Harrington (ID '5') if she exists and is in HR
    const eve = employees.find(emp => emp.id === '5' && emp.department === 'Human Resources');
    if (eve) return eve;
    // Fallback to the first HR person found
    return employees.find(emp => emp.department === 'Human Resources');
  }, [employees]);

  if (!departmentName) {
    // Handle case where departmentName is not a string (e.g., array or undefined)
    return (
      <>
        <PageHeader title="Invalid Department" description="The department specified is not valid." />
        <div className="text-center">
          <Link href="/employees/hierarchy" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hierarchy
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Employees in ${departmentName}`}
        description={`Listing all employees in the ${departmentName} department.`}
        actions={
          <Link href="/employees/hierarchy" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hierarchy
            </Button>
          </Link>
        }
      />

      {hrContact ? (
        <HrContactCard contact={hrContact} />
      ) : (
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>HR Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No designated HR contact found for this department.</p>
          </CardContent>
        </Card>
      )}

      {departmentEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentEmployees.map(employee => (
            <DepartmentEmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
          <p className="text-muted-foreground text-center">
            No employees found in the {departmentName} department.
          </p>
        </div>
      )}
    </>
  );
}

