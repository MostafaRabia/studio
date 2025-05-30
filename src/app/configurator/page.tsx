
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Users, FileText, UserCircle, Settings } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import { useEmployees } from '@/contexts/employee-context';
import type { Employee } from '@/lib/placeholder-data';

export default function ConfiguratorPage() {
  const { employees } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  return (
    <>
      <PageHeader
        title="Application Configurator"
        description="Manage and customize application settings and features."
        actions={
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        }
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Global & Employee Specific Configurations
            </CardTitle>
            <CardDescription>
              Select an employee below to see employee-specific configurations or manage global settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId || undefined}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select an employee to configure..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.jobTitle})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEmployee && (
              <p className="mt-3 text-sm text-muted-foreground">
                Configuring for: <span className="font-medium text-primary">{selectedEmployee.name}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User & Employee Management</CardTitle>
            <CardDescription>Configure employee profiles and user access (global settings).</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Link href="/employees/new" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <UserPlus className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Add New Employee</p>
                  <p className="text-xs text-muted-foreground">Go to the form to create a new employee profile.</p>
                </div>
              </Button>
            </Link>
            <Link href="/employees" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <Users className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage Existing Employees</p>
                  <p className="text-xs text-muted-foreground">View, edit, or delete employee profiles from the directory.</p>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy & Document Management</CardTitle>
            <CardDescription>Access and manage company policies and key documents (global settings).</CardDescription> 
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Link href="/resources/7" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <FileText className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">View Employee Rules</p>
                  <p className="text-xs text-muted-foreground">Access and review the company's employee rules document.</p>
                </div>
              </Button>
            </Link>
             {/* Placeholder for other policy management buttons */}
          </CardContent>
        </Card>
        
        {/* Placeholder for more configurator sections */}
        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
          <p className="text-muted-foreground text-center">
            {selectedEmployee ? 
              `More configuration options specific to ${selectedEmployee.name} could appear here.` :
              "More global configurator sections will be added here."
            }
          </p>
        </div>
      </div>
    </>
  );
}
