
"use client"; 

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import React, { useState, useMemo } from "react";
import Image from 'next/image';

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
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Save, UserPlus, X, AtSign, Building, Fingerprint, Users, ChevronDown, UserCheck, Briefcase, UploadCloud, UserCircle, Paperclip, FileText, BookText } from "lucide-react";
import type { Attachment } from '@/lib/placeholder-data';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEmployees } from "@/contexts/employee-context";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const attachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  dataUrl: z.string(),
  size: z.number(),
});

const newEmployeeFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  position: z.string().min(2, { message: "Position must be at least 2 characters." }).max(100),
  department: z.string().min(1, { message: "Department is required." }).max(100),
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
  }),
  hiredBy: z.string().max(100).optional(),
  avatarDataUrl: z.string().optional(), 
  attachments: z.array(attachmentSchema).optional().default([]),
  jobDescription: z.string().max(2000, "Job description must be 2000 characters or less.").optional(),
});

export type NewEmployeeFormValues = z.infer<typeof newEmployeeFormSchema>;

export default function NewEmployeePage() {
  const router = useRouter();
  const { employees: existingEmployeesForSelection, addEmployee } = useEmployees();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<NewEmployeeFormValues>({
    resolver: zodResolver(newEmployeeFormSchema),
    defaultValues: {
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
      hiredBy: "",
      avatarDataUrl: "",
      attachments: [],
      jobDescription: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        form.setValue('avatarDataUrl', dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      form.setValue('avatarDataUrl', '', { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<NewEmployeeFormValues> = (data) => {
    console.log("New Employee Data to be added:", data);
    addEmployee(data);
    toast({
      title: "Employee Added",
      description: `${data.name} has been successfully added to the directory.`,
    });
    router.push('/employees'); 
  };

  const selectedReportsToNames = React.useMemo(() => {
    const selectedIds = form.watch('reportsTo') || [];
    return selectedIds
      .map(id => existingEmployeesForSelection.find(emp => emp.id === id)?.name)
      .filter(name => !!name) as string[];
  }, [form.watch('reportsTo'), existingEmployeesForSelection]);

  const selectedDirectReportsNames = React.useMemo(() => {
    const selectedIds = form.watch('directReports') || [];
    return selectedIds
      .map(id => existingEmployeesForSelection.find(emp => emp.id === id)?.name)
      .filter(name => !!name) as string[];
  }, [form.watch('directReports'), existingEmployeesForSelection]);

  const uniqueDepartments = useMemo(() => {
    const departments = new Set(existingEmployeesForSelection.map(emp => emp.department).filter(Boolean));
    return Array.from(departments).sort();
  }, [existingEmployeesForSelection]);

  return (
    <>
      <PageHeader
        title="Add New Employee"
        description="Fill in the details to create a new employee profile."
      />
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Employee Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="avatarDataUrl"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>Profile Photo</FormLabel>
                    <Avatar className="h-32 w-32 mb-2">
                      {imagePreview ? (
                        <AvatarImage src={imagePreview} alt="Profile Preview" />
                      ) : (
                        <AvatarFallback>
                          <UserCircle className="h-20 w-20 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <FormControl>
                       <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="max-w-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </FormControl>
                    <FormDescription>Upload a square image for best results.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uniqueDepartments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input type="tel" placeholder="e.g., +1-555-123-4567" {...field} />
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
                        <Input type="tel" placeholder="e.g., +1-555-987-6543" {...field} />
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
                        <Input type="tel" placeholder="e.g., +1-555-111-2222" {...field} />
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
                      <Input placeholder="e.g., Building A, Floor 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>

              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <BookText className="mr-2 h-4 w-4 text-muted-foreground" />
                      Job Description & Responsibilities
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the job description and key responsibilities..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        {existingEmployeesForSelection.map((employee) => (
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
                        {existingEmployeesForSelection.map((employee) => (
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
                      Who will report to this new employee?
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
                        <Input placeholder="e.g., HR Department or Hiring Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Attachments field could be added here in the future if needed */}

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push('/employees')}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? "Saving..." : "Save Employee"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

    
