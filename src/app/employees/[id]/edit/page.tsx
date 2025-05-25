
"use client"; 

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation'; 
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Save, UserCog, X, AtSign, Building, Fingerprint, Users, ChevronDown, UserCheck, Briefcase, ArrowLeft } from "lucide-react";
import { employees as existingEmployeesForSelection } from '@/lib/placeholder-data'; 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useEmployees } from "@/contexts/employee-context";
import { useToast } from "@/hooks/use-toast";
import type { NewEmployeeFormValues } from '@/app/employees/new/page'; // Reusing the type

// Reusing the schema from new employee page, can be moved to a shared location later
const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  position: z.string().min(2, { message: "Position must be at least 2 characters." }).max(100),
  department: z.string().min(2, { message: "Department is required." }).max(100),
  idNumber: z.string().min(1, { message: "ID number is required." }).max(50),
  email: z.string().email({ message: "Invalid email address." }).min(5).max(100),
  officeLocation: z.string().max(100).optional(),
  mobile: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional().refine(val => !val || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val), { message: "Invalid fax number format." }),
  reportsTo: z.array(z.string()).optional().default([]), 
  directReports: z.array(z.string()).optional().default([]),
  hiringDate: z.date({
    required_error: "Hiring date is required.",
  }).optional(), // Optional for existing employees if not set
  hiredBy: z.string().max(100).optional(),
});


export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const { id: employeeId } = params;
  const { employees, updateEmployee } = useEmployees();
  const { toast } = useToast();

  const employeeToEdit = employees.find(emp => emp.id === employeeId);

  const form = useForm<NewEmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: { // Initialize all fields to ensure they are controlled
      name: "",
      position: "",
      department: "",
      idNumber: "",
      email: "",
      officeLocation: "",
      mobile: "",
      phone: "",
      fax: "",
      reportsTo: [],
      directReports: [],
      hiringDate: undefined, // Calendar component handles undefined
      hiredBy: "",
    },
  });

  useEffect(() => {
    if (employeeToEdit) {
      form.reset({
        name: employeeToEdit.name || "",
        position: employeeToEdit.jobTitle || "",
        department: employeeToEdit.department || "",
        idNumber: employeeToEdit.idNumber || "",
        email: employeeToEdit.email || "",
        officeLocation: employeeToEdit.officeLocation || "",
        mobile: employeeToEdit.mobile || "",
        phone: employeeToEdit.phone || "",
        fax: employeeToEdit.fax || "",
        reportsTo: employeeToEdit.reportsTo || [],
        directReports: employeeToEdit.directReports || [],
        hiringDate: employeeToEdit.hiringDate ? new Date(employeeToEdit.hiringDate) : undefined,
        hiredBy: employeeToEdit.hiredBy || "",
      });
    }
  }, [employeeToEdit, form]);

  const onSubmit: SubmitHandler<NewEmployeeFormValues> = (data) => {
    if (!employeeId || typeof employeeId !== 'string') {
        toast({ title: "Error", description: "Employee ID is missing.", variant: "destructive" });
        return;
    }
    console.log("Updated Employee Data:", data);
    updateEmployee(employeeId as string, data);
    toast({
      title: "Employee Updated",
      description: `${data.name}'s profile has been successfully updated.`,
    });
    router.push(`/employees/${employeeId}`); 
  };
  
  const selectedReportsToNames = React.useMemo(() => {
    const selectedIds = form.watch('reportsTo') || [];
    return selectedIds
      .map(id => existingEmployeesForSelection.find(emp => emp.id === id)?.name)
      .filter(name => !!name) as string[];
  }, [form.watch('reportsTo')]);

  const selectedDirectReportsNames = React.useMemo(() => {
    const selectedIds = form.watch('directReports') || [];
    return selectedIds
      .map(id => existingEmployeesForSelection.find(emp => emp.id === id)?.name)
      .filter(name => !!name) as string[];
  }, [form.watch('directReports')]);

  if (!employeeToEdit) {
    return (
      <>
        <PageHeader title="Employee Not Found" description="Cannot edit an employee that does not exist." />
        <div className="text-center">
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
        title={`Edit ${employeeToEdit.name}`}
        description="Update the employee's profile information."
      />
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCog className="mr-2 h-5 w-5" />
            Edit Employee Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position / Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                        Department
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Engineering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Fingerprint className="mr-2 h-4 w-4 text-muted-foreground" />
                      ID Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., EMP12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <AtSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g., john.doe@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., +1-555-123-4567" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., +1-555-987-6543" {...field} value={field.value || ''}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="fax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fax Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., +1-555-111-2222" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="officeLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                       <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      Office Location
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Building A, Floor 3" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>

              <FormField
                control={form.control}
                name="reportsTo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      Reports To (Manager/s)
                    </FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full justify-between", !field.value?.length && "text-muted-foreground")}>
                            {selectedReportsToNames.length > 0 
                              ? (
                                <div className="flex flex-wrap gap-1">
                                  {selectedReportsToNames.slice(0,2).map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                                  {selectedReportsToNames.length > 2 && <Badge variant="secondary">+{selectedReportsToNames.length - 2} more</Badge>}
                                </div>
                                )
                              : "Select manager(s)"}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                        <DropdownMenuLabel>Select Managers</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {existingEmployeesForSelection.filter(emp => emp.id !== employeeId).map((employee) => (
                          <DropdownMenuCheckboxItem
                            key={employee.id}
                            checked={field.value?.includes(employee.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, employee.id]);
                              } else {
                                field.onChange(currentValue.filter((id) => id !== employee.id));
                              }
                            }}
                          >
                            {employee.name} ({employee.jobTitle})
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="directReports"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center">
                      <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                      Direct Reports (Team Members)
                    </FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full justify-between", !field.value?.length && "text-muted-foreground")}>
                            {selectedDirectReportsNames.length > 0 
                              ? (
                                <div className="flex flex-wrap gap-1">
                                  {selectedDirectReportsNames.slice(0,2).map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                                  {selectedDirectReportsNames.length > 2 && <Badge variant="secondary">+{selectedDirectReportsNames.length - 2} more</Badge>}
                                </div>
                                )
                              : "Select team member(s)"}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                        <DropdownMenuLabel>Select Team Members</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {existingEmployeesForSelection.filter(emp => emp.id !== employeeId).map((employee) => (
                          <DropdownMenuCheckboxItem
                            key={employee.id}
                            checked={field.value?.includes(employee.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, employee.id]);
                              } else {
                                field.onChange(currentValue.filter((id) => id !== employee.id));
                              }
                            }}
                          >
                            {employee.name} ({employee.jobTitle})
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                     <FormDescription>
                      Who reports to this employee?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="hiringDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Hiring Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hiredBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hired By</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., HR Department or Hiring Manager" {...field} value={field.value || ''}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push(`/employees/${employeeId}`)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
