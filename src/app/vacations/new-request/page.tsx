
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, CalendarIcon, Send, CaseSensitive } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, differenceInCalendarDays } from 'date-fns';
import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useEmployees } from '@/contexts/employee-context';

const vacationTypes = ["Annual Leave", "Sick Leave", "Unpaid Leave", "Public Holiday", "Other"] as const;

const vacationRequestSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  vacationType: z.string({
    required_error: "Vacation type is required.",
  }).min(1, "Vacation type is required."),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});

type VacationRequestFormValues = z.infer<typeof vacationRequestSchema>;

interface MyVacationRequest {
  id: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  vacationType: string;
  submittingDate: Date;
  approvedFrom?: string;
  status: "Pending" | "Approved" | "Rejected";
}

const initialMockRequests: MyVacationRequest[] = [
  {
    id: 'req1',
    startDate: new Date(2024, 6, 20), // July 20, 2024
    endDate: new Date(2024, 6, 22), // July 22, 2024
    numberOfDays: 3,
    vacationType: "Annual Leave",
    submittingDate: new Date(2024, 6, 1), // July 1, 2024
    approvedFrom: "Bob The Builder",
    status: "Approved",
  },
  {
    id: 'req2',
    startDate: new Date(2024, 7, 5), // Aug 5, 2024
    endDate: new Date(2024, 7, 9), // Aug 9, 2024
    numberOfDays: 5,
    vacationType: "Annual Leave",
    submittingDate: new Date(2024, 6, 15), // July 15, 2024
    approvedFrom: "Bob The Builder",
    status: "Pending",
  },
];


export default function NewVacationRequestPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const [myRequests, setMyRequests] = useState<MyVacationRequest[]>(initialMockRequests);
  const { toast } = useToast();
  const { employees } = useEmployees();

  const form = useForm<VacationRequestFormValues>({
    resolver: zodResolver(vacationRequestSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      vacationType: "",
    },
  });

  const onSubmit: SubmitHandler<VacationRequestFormValues> = (data) => {
    const numberOfDays = differenceInCalendarDays(data.endDate, data.startDate) + 1;
    const submittingDate = new Date();
    const requesterId = '1'; // Assuming Alice Wonderland is the requester
    const requester = employees.find(emp => emp.id === requesterId);
    let managerName = "N/A";

    if (requester && requester.reportsTo && requester.reportsTo.length > 0) {
      const manager = employees.find(emp => emp.id === requester.reportsTo![0]); // Assuming first manager
      if (manager) {
        managerName = manager.name;
        console.log(`Simulating: Email notification sent to manager ${manager.name} (${manager.email}) for vacation request by ${requester.name}.`);
        console.log(`Simulating: In-app notification created for manager ${manager.name} for vacation request by ${requester.name}.`);
      } else {
         console.log(`Simulating: Manager with ID ${requester.reportsTo[0]} not found for ${requester.name}.`);
      }
    } else if (requester) {
        console.log(`Simulating: Requester ${requester.name} has no manager defined to notify.`);
    } else {
        console.log(`Simulating: Requester with ID ${requesterId} not found.`);
    }


    const newRequest: MyVacationRequest = {
      id: `req${Date.now()}`,
      startDate: data.startDate,
      endDate: data.endDate,
      numberOfDays,
      vacationType: data.vacationType,
      submittingDate,
      approvedFrom: managerName, 
      status: "Pending",
    };

    setMyRequests(prevRequests => [newRequest, ...prevRequests]);

    toast({
      title: "Vacation Request Submitted",
      description: `${data.vacationType}: From ${format(data.startDate, "PPP")} to ${format(data.endDate, "PPP")}`,
    });
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <>
      <PageHeader
        title="New Vacation Request"
        description="Submit your vacation request and view your request history."
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/vacations" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vacations
              </Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Vacation Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request Time Off</DialogTitle>
                  <DialogDescription>
                    Select the start and end dates, and type for your vacation. Click submit when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover modal={false} open={isStartDatePopoverOpen} onOpenChange={setIsStartDatePopoverOpen}>
                            <PopoverTrigger asChild>
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
                                  <span>Pick a start date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                              onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  if (form.getValues("endDate") && date && form.getValues("endDate") < date) {
                                    form.setValue("endDate", date);
                                  }
                                  form.trigger("endDate");
                                  setIsStartDatePopoverOpen(false);
                                }}
                                disabled={(date) =>
                                  date < new Date(new Date().setDate(new Date().getDate() -1))
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
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover modal={false} open={isEndDatePopoverOpen} onOpenChange={setIsEndDatePopoverOpen}>
                            <PopoverTrigger asChild>
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
                                  <span>Pick an end date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                              onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsEndDatePopoverOpen(false);
                                }}
                                disabled={(date) => {
                                  const startDate = form.getValues("startDate");
                                  const yesterday = new Date(new Date().setDate(new Date().getDate() -1));
                                  if (startDate) {
                                    return date < startDate || date < yesterday;
                                  }
                                  return date < yesterday;
                                }}
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
                      name="vacationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <CaseSensitive className="mr-2 h-4 w-4 text-muted-foreground" />
                            Vacation Type
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a vacation type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vacationTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                         <Send className="mr-2 h-4 w-4" />
                        {form.formState.isSubmitting ? "Submitting..." : "Submit Request"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', fontSize: '18px', textAlign: 'center', margin: '10px 0' }}>
        DEBUG: CONTENT BEFORE MY REQUESTS SECTION
      </div>

      <div className="mt-8 p-4 border-2 border-dashed border-blue-500 rounded-md">
        <h2 className="text-xl font-semibold mb-4">My Requests</h2>
        {myRequests.length > 0 ? (
          <Table>
            <TableCaption>A list of your recent vacation requests.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Days</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Approved From</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{format(request.startDate, "PPP")}</TableCell>
                  <TableCell>{format(request.endDate, "PPP")}</TableCell>
                  <TableCell className="text-right">{request.numberOfDays}</TableCell>
                  <TableCell>{request.vacationType}</TableCell>
                  <TableCell>{format(request.submittingDate, "PPP p")}</TableCell>
                  <TableCell>{request.approvedFrom || 'N/A'}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-semibold rounded-full",
                        request.status === "Approved" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
                        request.status === "Pending" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
                        request.status === "Rejected" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                      )}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              You haven't submitted any vacation requests yet.
            </p>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', fontSize: '18px', textAlign: 'center', margin: '10px 0' }}>
        DEBUG: CONTENT AFTER MY REQUESTS SECTION
      </div>
    </>
  );
}

