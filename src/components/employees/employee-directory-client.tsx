
"use client";

import type { Employee } from '@/lib/placeholder-data';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Briefcase, Building, UserCircle } from 'lucide-react';
import { useEmployees } from '@/contexts/employee-context';

interface EmployeeCardProps {
  employee: Employee;
}

function EmployeeCard({ employee }: EmployeeCardProps) {
  const displayAvatarSrc = employee.avatarDataUrl || employee.avatarUrl;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-4 pb-4">
        <Avatar className="h-16 w-16">
          {displayAvatarSrc ? (
            <AvatarImage src={displayAvatarSrc} alt={employee.name} asChild>
              <Image src={displayAvatarSrc} alt={employee.name} width={64} height={64} data-ai-hint={employee.dataAiHint || 'profile picture'} />
            </AvatarImage>
          ) : null}
          <AvatarFallback>
            <UserCircle className="h-10 w-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div>
          <Link href={`/employees/${employee.id}`} passHref>
            <CardTitle className="text-xl hover:text-primary hover:underline cursor-pointer transition-colors">
              {employee.name}
            </CardTitle>
          </Link>
          <CardDescription>{employee.jobTitle}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>{employee.department}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <a href={`mailto:${employee.email}`} className="hover:text-primary transition-colors">
            {employee.email}
          </a>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{employee.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmployeeDirectoryClient() {
  const { employees } = useEmployees(); 
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    const employeesToFilter = employees || []; 
    if (!searchTerm) return employeesToFilter;
    return employeesToFilter.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, employees]);

  return (
    <div className="space-y-6">
      <Input
        type="search"
        placeholder="Search employees by name, title, or department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md text-base"
      />
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          {searchTerm ? "No employees found matching your search." : "No employees in the directory yet."}
        </p>
      )}
    </div>
  );
}
