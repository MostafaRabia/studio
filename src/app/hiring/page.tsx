
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, CalendarIcon } from 'lucide-react';
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
import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from '@/contexts/employee-context'; // Import useEmployees

const hiringRequestFormSchema = z.object({
  hiringManagerName: z.string().min(1, { message: "Please select a hiring manager." }), // Changed min to 1 as it's a selection
  department: z.string().min(2, { message: "Department is required." }).max(100),
  positionName: z.string().min(3, { message: "Position name must be at least 3 characters." }).max(100),
  startingDate: z.date({
    required_error: "Starting date is required.",
  }),
  qualificationsRequested: z.string().min(10, { message: "Qualifications must be at least 10 characters." }).max(1000),
  countryOfHiring: z.string().min(2, { message: "Country of hiring is required." }).max(50),
});

type HiringRequestFormValues = z.infer<typeof hiringRequestFormSchema>;

export default function HiringPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const { toast } = useToast();
  const { employees } = useEmployees(); // Get employees from context

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
    console.log("New Hiring Request Data:", data);
    toast({
      title: "Hiring Request Submitted",
      description: `Request for ${data.positionName} by ${data.hiringManagerName} has been submitted.`,
    });
    setIsDialogOpen(false); // Close the dialog
    form.reset(); // Reset form fields
  };

  return (
    <>
      <PageHeader
        title="Hiring"
        description="Manage job openings, candidates, and the hiring process."
        actions={
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
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
                          <FormControl>
                            <Input placeholder="e.g., Engineering" {...field} />
                          </FormControl>
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
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsStartDatePopoverOpen(false);
                                }}
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
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
                          <FormControl>
                            <Input placeholder="e.g., United States" {...field} />
                          </FormControl>
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
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground text-center">
          Hiring management features will be implemented here.
        </p>
      </div>
    </>
  );
}

