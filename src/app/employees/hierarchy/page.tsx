
"use client";

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, PlusCircle, Building } from 'lucide-react';
import { useEmployees } from '@/contexts/employee-context';
import { EmployeeHierarchyNode } from '@/components/employees/employee-hierarchy-node';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast";

const departmentFormSchema = z.object({
  departmentName: z.string().min(2, { message: "Department name must be at least 2 characters." }).max(50),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

export default function EmployeeHierarchyPage() {
  const { employees } = useEmployees();
  const { toast } = useToast();

  const [departments, setDepartments] = useState<string[]>(() => {
    // Initialize with unique departments from employees
    const uniqueDepartments = Array.from(new Set(employees.map(emp => emp.department).filter(Boolean)));
    return uniqueDepartments.sort();
  });
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);

  const departmentForm = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      departmentName: "",
    },
  });

  const handleAddDepartment: SubmitHandler<DepartmentFormValues> = (data) => {
    const newDepartmentName = data.departmentName.trim();
    if (newDepartmentName && !departments.some(dep => dep.toLowerCase() === newDepartmentName.toLowerCase())) {
      setDepartments(prev => [...prev, newDepartmentName].sort());
      toast({
        title: "Department Added",
        description: `Department "${newDepartmentName}" has been successfully added.`,
      });
      setIsDepartmentDialogOpen(false);
      departmentForm.reset();
    } else if (departments.some(dep => dep.toLowerCase() === newDepartmentName.toLowerCase())) {
       toast({
        title: "Department Exists",
        description: `Department "${newDepartmentName}" already exists.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Invalid Name",
        description: "Department name cannot be empty.",
        variant: "destructive",
      });
    }
  };


  const employeeIds = new Set(employees.map(e => e.id));
  const rootEmployees = employees.filter(emp => {
    if (!emp.reportsTo || emp.reportsTo.length === 0) {
      return true;
    }
    return !emp.reportsTo.some(managerId => employeeIds.has(managerId));
  });

  return (
    <>
      <PageHeader
        title="Employee Hierarchy Chart"
        description="Visual representation of the reporting structure and departments."
        actions={
          <div className="flex gap-2">
            <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                  <DialogDescription>
                    Enter the name for the new department.
                  </DialogDescription>
                </DialogHeader>
                <Form {...departmentForm}>
                  <form onSubmit={departmentForm.handleSubmit(handleAddDepartment)} id="departmentForm" className="space-y-4 py-2">
                    <FormField
                      control={departmentForm.control}
                      name="departmentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Research & Development" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" form="departmentForm" disabled={departmentForm.formState.isSubmitting}>
                    {departmentForm.formState.isSubmitting ? "Adding..." : "Add Department"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link href="/employees" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
          </div>
        }
      />
      <Card className="shadow-lg mb-6">
        <CardHeader className="hidden">
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5 text-primary" />
            Company Departments
          </CardTitle>
          <CardDescription>
            List of registered departments. Click a department to view its members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {departments.length > 0 ? (
            <ul className="space-y-2">
              {departments.map((dept, index) => (
                <li key={index}>
                  <Link href={`/employees/department/${encodeURIComponent(dept)}`} passHref>
                    <Button variant="link" className="p-3 border rounded-md bg-muted/50 hover:bg-muted/80 w-full justify-start text-left text-foreground hover:no-underline hover:text-primary">
                      {dept}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-20 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground">No departments added or found. Click "Add Department" to create one.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
