
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, CalendarIcon, Check, X } from 'lucide-react';
import Link from 'next/link';
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, { useState, useMemo, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from '@/contexts/employee-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Employee } from '@/lib/placeholder-data';
import { Card, CardContent, CardHeader, CardTitle as TableCardTitle } from '@/components/ui/card'; // Renamed CardTitle to avoid conflict
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';


const hiringRequestFormSchema = z.object({
  hiringManagerName: z.string().min(1, { message: "Please select a hiring manager." }),
  department: z.string().min(1, { message: "Department is required." }).max(100),
  positionName: z.string().min(3, { message: "Position name must be at least 3 characters." }).max(100),
  startingDate: z.date({
    required_error: "Starting date is required.",
  }),
  qualificationsRequested: z.string().min(10, { message: "Qualifications must be at least 10 characters." }).max(1000),
  countryOfHiring: z.string().min(2, { message: "Country of hiring is required." }).max(100),
});

type HiringRequestFormValues = z.infer<typeof hiringRequestFormSchema>;

interface DisplayedHiringRequest {
  id: string;
  createdDate: Date;
  createdBy: string; // Hiring Manager Name
  positionName: string;
  department: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  hrResponsible: string;
  comment: string;
  // Store other form values if needed for detailed view later
  startingDate: Date;
  qualificationsRequested: string;
  countryOfHiring: string;
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the",
  "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];


export default function HiringPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const { toast } = useToast();
  const { employees } = useEmployees();

  const initialMockRequests: DisplayedHiringRequest[] = [
    {
      id: 'HR001', createdDate: new Date('2024-05-01'), createdBy: 'Bob The Builder', positionName: 'Senior Frontend Developer', department: 'Engineering', status: 'Approved', hrResponsible: 'Eve Harrington', comment: 'Approved by management.',
      startingDate: new Date('2024-06-15'), qualificationsRequested: '5+ years React, TypeScript', countryOfHiring: 'Canada'
    },
    {
      id: 'HR002', createdDate: new Date('2024-05-10'), createdBy: 'Alice Wonderland', positionName: 'UX Designer', department: 'Product', status: 'Pending', hrResponsible: 'Eve Harrington', comment: 'Awaiting final review.',
      startingDate: new Date('2024-07-01'), qualificationsRequested: 'Portfolio, Figma, User Research', countryOfHiring: 'United States of America'
    },
    {
      id: 'HR003', createdDate: new Date('2024-04-20'), createdBy: 'Carol Danvers', positionName: 'Marketing Intern', department: 'Marketing', status: 'Rejected', hrResponsible: 'Eve Harrington', comment: 'Budget constraints.',
      startingDate: new Date('2024-05-01'), qualificationsRequested: 'Social media skills, good communication', countryOfHiring: 'United Kingdom'
    },
  ];
  const [hiringRequests, setHiringRequests] = useState<DisplayedHiringRequest[]>(initialMockRequests);


  const uniqueDepartments = useMemo(() => {
    const departmentsSet = new Set(employees.map(emp => emp.department).filter(Boolean));
    return Array.from(departmentsSet).sort();
  }, [employees]);

  const form = useForm<HiringRequestFormValues>({
    resolver: zodResolver(hiringRequestFormSchema),
    defaultValues: {
      hiringManagerName: "",
      department: "",
      positionName: "",
      qualificationsRequested: "",
      countryOfHiring: "",
    },
  });

  const onSubmit: SubmitHandler<HiringRequestFormValues> = (data) => {
    const hiringManager = employees.find(emp => emp.name === data.hiringManagerName);
    
    let hrContact: Employee | undefined = employees.find(emp => emp.id === '5' && emp.department === 'Human Resources'); // Prefer Eve Harrington
    if (!hrContact) {
        hrContact = employees.find(emp => emp.department === 'Human Resources');
    }
    const hrResponsibleName = hrContact ? hrContact.name : "HR (Pending Assignment)";

    const newRequest: DisplayedHiringRequest = {
      id: `HR${Date.now().toString().slice(-4)}`, // Simple unique ID
      createdDate: new Date(),
      createdBy: data.hiringManagerName,
      positionName: data.positionName,
      department: data.department,
      status: 'Pending',
      hrResponsible: hrResponsibleName,
      comment: '', // Empty initially
      startingDate: data.startingDate,
      qualificationsRequested: data.qualificationsRequested,
      countryOfHiring: data.countryOfHiring,
    };

    setHiringRequests(prevRequests => [newRequest, ...prevRequests]);

    toast({
      title: "Hiring Request Submitted",
      description: `Request for ${data.positionName} by ${data.hiringManagerName} has been submitted.`,
    });

    if (hiringManager && hiringManager.email) {
      console.log(`SIMULATE: Email notification sent to Hiring Manager: ${hiringManager.name} (${hiringManager.email}) about new hiring request for ${data.positionName}.`);
      console.log(`SIMULATE: In-app notification created for Hiring Manager: ${hiringManager.name} about new hiring request for ${data.positionName}.`);
    } else if (hiringManager) {
      console.log(`SIMULATE: Hiring Manager ${hiringManager.name} found, but no email address available for notification.`);
    } else {
      console.log(`SIMULATE: Hiring Manager "${data.hiringManagerName}" not found in the system for notification.`);
    }
    
    if (hrContact && hrContact.email) {
        console.log(`SIMULATE: Email notification sent to HR Representative ${hrResponsibleName} (${hrContact.email}) about new hiring request for ${data.positionName} in ${data.department}.`);
        console.log(`SIMULATE: In-app notification created for HR Representative: ${hrResponsibleName} about new hiring request for ${data.positionName} in ${data.department}.`);
    } else if (hrContact) {
        console.log(`SIMULATE: HR Representative ${hrResponsibleName} found, but no email address available for notification.`);
    } else {
        console.log(`SIMULATE: No HR Representative found for ${data.department} to notify about new hiring request for ${data.positionName}.`);
    }
    
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <>
      <PageHeader
        title="Hiring"
        description="Manage job openings, candidates, and the hiring process."
        actions={
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) form.reset(); 
            }}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Hiring Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>New Hiring Request</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new hiring request.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} id="hiringRequestForm" className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
                    <FormField
                      control={form.control}
                      name="hiringManagerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hiring Manager Name</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a hiring manager" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employees.map((employee) => (
                                <SelectItem key={employee.id} value={employee.name}>
                                  {employee.name} ({employee.jobTitle})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="positionName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Senior Software Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startingDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Starting Date</FormLabel>
                           <Popover open={isStartDatePopoverOpen} onOpenChange={setIsStartDatePopoverOpen} modal={false}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : <span>Pick a start date</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsStartDatePopoverOpen(false);
                                }}
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))}
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
                      name="qualificationsRequested"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualifications Requested</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe the required skills and experience..." rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="countryOfHiring"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country of Hiring</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <ScrollArea className="h-[200px]"> 
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); form.reset(); }}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" form="hiringRequestForm" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link href="/" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        }
      />
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <TableCardTitle>Hiring Requests Overview</TableCardTitle>
        </CardHeader>
        <CardContent>
          {hiringRequests.length > 0 ? (
            <Table>
              <TableCaption>A list of submitted hiring requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Hiring ID</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>HR Responsible</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hiringRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.positionName}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{format(request.createdDate, 'PPP')}</TableCell>
                    <TableCell>{request.createdBy}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === 'Approved' ? 'default' :
                          request.status === 'Pending' ? 'secondary' :
                          'destructive'
                        }
                        className={cn(
                            request.status === 'Approved' && 'bg-green-500 hover:bg-green-600 text-white',
                            request.status === 'Pending' && 'bg-yellow-500 hover:bg-yellow-600 text-black',
                            request.status === 'Rejected' && 'bg-red-500 hover:bg-red-600 text-white'
                        )}
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.hrResponsible}</TableCell>
                    <TableCell className="max-w-xs truncate" title={request.comment || undefined}>
                      {request.comment || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground text-center">
                No hiring requests submitted yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

    