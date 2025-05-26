
"use client"; 

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation'; 
import React, { useEffect, useState } from "react";
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
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Save, UserCog, X, AtSign, Building, Fingerprint, Users, ChevronDown, UserCheck, Briefcase, ArrowLeft, UploadCloud, UserCircle, Paperclip, FileText, Trash2 } from "lucide-react";
import { employees as existingEmployeesForSelection } from '@/lib/placeholder-data'; 
import type { Attachment } from '@/lib/placeholder-data';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useEmployees } from "@/contexts/employee-context";
import { useToast } from "@/hooks/use-toast";
import type { NewEmployeeFormValues } from '@/app/employees/new/page'; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Schema is imported via NewEmployeeFormValues type, ensure it includes attachments
// const employeeFormSchema is implicitly defined by NewEmployeeFormValues

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];


export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const { id: employeeId } = params;
  const { employees, updateEmployee } = useEmployees();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const employeeToEdit = employees.find(emp => emp.id === employeeId);

  const form = useForm<NewEmployeeFormValues>({
    // resolver: zodResolver(employeeFormSchema) // This now comes from NewEmployeeFormValues
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
      hiringDate: undefined, 
      hiredBy: "",
      avatarDataUrl: "",
      attachments: [],
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
        avatarDataUrl: employeeToEdit.avatarDataUrl || "",
        attachments: employeeToEdit.attachments || [],
      });
      if (employeeToEdit.avatarDataUrl) {
        setImagePreview(employeeToEdit.avatarDataUrl);
      }
    }
  }, [employeeToEdit, form]);
  
  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        form.setValue('avatarDataUrl', dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments: Attachment[] = [...(form.getValues('attachments') || [])];
      const filePromises = Array.from(files).map(file => {
        return new Promise<Attachment | null>((resolve, reject) => {
          if (file.size > MAX_FILE_SIZE) {
            toast({ title: "File too large", description: `${file.name} exceeds 5MB limit.`, variant: "destructive" });
            resolve(null);
            return;
          }
          // if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          //   toast({ title: "Invalid file type", description: `${file.name} is not an allowed file type.`, variant: "destructive" });
          //   resolve(null);
          //   return;
          // }

          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: Date.now().toString() + Math.random().toString(36).substring(2), // simple unique id
              name: file.name,
              type: file.type,
              dataUrl: reader.result as string,
              size: file.size,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      try {
        const results = await Promise.all(filePromises);
        results.forEach(att => {
          if (att) newAttachments.push(att);
        });
        form.setValue('attachments', newAttachments, { shouldValidate: true });
      } catch (error) {
        console.error("Error reading attachments:", error);
        toast({ title: "Error reading files", description: "Could not process all selected files.", variant: "destructive" });
      }
    }
  };

  const removeAttachment = (attachmentId: string) => {
    const currentAttachments = form.getValues('attachments') || [];
    form.setValue('attachments', currentAttachments.filter(att => att.id !== attachmentId), { shouldValidate: true });
  };


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

  const currentAttachments = form.watch('attachments') || [];


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
                name="avatarDataUrl"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>Profile Photo</FormLabel>
                    <Avatar className="h-32 w-32 mb-2">
                      {imagePreview ? (
                        <AvatarImage src={imagePreview} alt="Profile Preview" />
                      ) : employeeToEdit.avatarUrl ? (
                        <AvatarImage src={employeeToEdit.avatarUrl} alt={employeeToEdit.name} />
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
                        onChange={handleAvatarFileChange}
                        className="max-w-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </FormControl>
                    <FormDescription>Upload a new square image to change it.</FormDescription>
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

              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Paperclip className="mr-2 h-4 w-4 text-muted-foreground" />
                      Attachments
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        multiple 
                        onChange={handleAttachmentChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </FormControl>
                    <FormDescription>
                      Attach relevant documents (PDF, Word, Images accepted. Max 5MB per file).
                    </FormDescription>
                    {currentAttachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Current Attachments:</p>
                        <ul className="list-none space-y-2">
                          {currentAttachments.map((att) => (
                            <li key={att.id} className="flex items-center justify-between p-2 border rounded-md bg-secondary/50">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm truncate max-w-xs" title={att.name}>{att.name}</span>
                                <Badge variant="outline" className="text-xs">{(att.size / 1024).toFixed(1)} KB</Badge>
                              </div>
                              <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(att.id)} className="h-6 w-6">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Remove {att.name}</span>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />


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
