
"use client";

import { useParams } from 'next/navigation';
import { useEmployees } from '@/contexts/employee-context';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Mail, Phone, Briefcase, Building, UserCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EmployeeProfilePage() {
  const params = useParams();
  const { id } = params;
  const { employees } = useEmployees();

  const employee = employees.find(emp => emp.id === id);

  if (!employee) {
    return (
      <>
        <PageHeader title="Employee Not Found" description="Could not find an employee with this ID." />
        <div className="text-center">
          <p className="text-muted-foreground mb-4">The employee you are looking for does not exist or may have been removed.</p>
          <Link href="/employees" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title={employee.name} 
        description={employee.jobTitle}
        actions={
          <Link href="/employees" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        }
      />
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="h-32 w-32 mb-4">
            {employee.avatarUrl ? (
              <AvatarImage src={employee.avatarUrl} alt={employee.name} asChild>
                <Image src={employee.avatarUrl} alt={employee.name} width={128} height={128} data-ai-hint={employee.dataAiHint || 'profile picture'} />
              </AvatarImage>
            ) : null}
            <AvatarFallback>
              <UserCircle className="h-20 w-20 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{employee.name}</CardTitle>
          <CardDescription>{employee.jobTitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-base">
          <div className="flex items-center gap-3 p-3 border-b">
            <Building className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p>{employee.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border-b">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a href={`mailto:${employee.email}`} className="hover:text-primary transition-colors">
                {employee.email}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{employee.phone}</p>
            </div>
          </div>
           {/* Placeholder for future details like reports to, direct reports, etc. */}
        </CardContent>
      </Card>
    </>
  );
}
