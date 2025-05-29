
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { format, differenceInCalendarDays } from 'date-fns';
// import { cn } from '@/lib/utils';

// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
//   TableCaption,
// } from '@/components/ui/table';
// import { useToast } from '@/hooks/use-toast';
// import { useEmployees } from '@/contexts/employee-context';
// import { CalendarIcon, Send, CaseSensitive } from 'lucide-react';

// const vacationTypes = ["Annual Leave", "Sick Leave", "Unpaid Leave", "Public Holiday", "Other"] as const;

// const vacationRequestSchema = z.object({
//   startDate: z.date({
//     required_error: "Start date is required.",
//   }),
//   endDate: z.date({
//     required_error: "End date is required.",
//   }),
//   vacationType: z.string({
//     required_error: "Vacation type is required.",
//   }).min(1, "Vacation type is required."),
// }).refine(data => data.endDate >= data.startDate, {
//   message: "End date cannot be before start date.",
//   path: ["endDate"],
// });

// type VacationRequestFormValues = z.infer<typeof vacationRequestSchema>;

// interface MyVacationRequest {
//   id: string;
//   startDate: Date;
//   endDate: Date;
//   numberOfDays: number;
//   vacationType: string;
//   submittingDate: Date;
//   approvedFrom?: string;
//   status: "Pending" | "Approved" | "Rejected";
// }

// const initialMockRequests: MyVacationRequest[] = [
//   {
//     id: 'req1',
//     startDate: new Date(2024, 6, 20), // July 20, 2024
//     endDate: new Date(2024, 6, 22), // July 22, 2024
//     numberOfDays: 3,
//     vacationType: "Annual Leave",
//     submittingDate: new Date(2024, 6, 1), // July 1, 2024
//     approvedFrom: "Bob The Builder",
//     status: "Approved",
//   },
//   {
//     id: 'req2',
//     startDate: new Date(2024, 7, 5), // Aug 5, 2024
//     endDate: new Date(2024, 7, 9), // Aug 9, 2024
//     numberOfDays: 5,
//     vacationType: "Annual Leave",
//     submittingDate: new Date(2024, 6, 15), // July 15, 2024
//     approvedFrom: "Bob The Builder",
//     status: "Pending",
//   },
// ];


export default function NewVacationRequestPage() {
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  // const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  // const [myRequests, setMyRequests] = useState<MyVacationRequest[]>(initialMockRequests);
  // const { toast } = useToast();
  // const { employees } = useEmployees();

  // const form = useForm<VacationRequestFormValues>({
  //   resolver: zodResolver(vacationRequestSchema),
  //   defaultValues: {
  //     startDate: undefined,
  //     endDate: undefined,
  //     vacationType: "",
  //   },
  // });

  // const onSubmit: SubmitHandler<VacationRequestFormValues> = (data) => {
    // const numberOfDays = differenceInCalendarDays(data.endDate, data.startDate) + 1;
    // const submittingDate = new Date();
    // const requesterId = '1'; // Assuming Alice Wonderland is the requester
    // const requester = employees.find(emp => emp.id === requesterId);
    // let managerName = "N/A";

    // if (requester && requester.reportsTo && requester.reportsTo.length > 0) {
    //   const manager = employees.find(emp => emp.id === requester.reportsTo![0]); // Assuming first manager
    //   if (manager) {
    //     managerName = manager.name;
    //     console.log(`Simulating: Email notification sent to manager ${manager.name} (${manager.email}) for vacation request by ${requester.name}.`);
    //     console.log(`Simulating: In-app notification created for manager ${manager.name} for vacation request by ${requester.name}.`);
    //   } else {
    //      console.log(`Simulating: Manager with ID ${requester.reportsTo[0]} not found for ${requester.name}.`);
    //   }
    // } else if (requester) {
    //     console.log(`Simulating: Requester ${requester.name} has no manager defined to notify.`);
    // } else {
    //     console.log(`Simulating: Requester with ID ${requesterId} not found.`);
    // }


    // const newRequest: MyVacationRequest = {
    //   id: `req${Date.now()}`,
    //   startDate: data.startDate,
    //   endDate: data.endDate,
    //   numberOfDays,
    //   vacationType: data.vacationType,
    //   submittingDate,
    //   approvedFrom: managerName, 
    //   status: "Pending",
    // };

    // setMyRequests(prevRequests => [newRequest, ...prevRequests]);

    // toast({
    //   title: "Vacation Request Submitted",
    //   description: `${data.vacationType}: From ${format(data.startDate, "PPP")} to ${format(data.endDate, "PPP")}`,
    // });
    // form.reset();
    // setIsDialogOpen(false);
  // };

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
            {/* Temporarily simplified actions - complex dialog removed */}
            {/* <Button onClick={() => console.log("Test button clicked")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Test New Request Button
            </Button> */}
          </div>
        }
      />

      <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', fontSize: '18px', textAlign: 'center', margin: '10px 0' }}>
        DEBUG: CONTENT BEFORE MY REQUESTS SECTION (IF THIS DOES NOT SHOW, PROBLEM IS HIGH UP)
      </div>

      {/* <div className="mt-8 p-4 border-2 border-dashed border-blue-500 rounded-md">
        <h2 className="text-xl font-semibold mb-4">My Requests</h2>
        <p>Table placeholder</p>
      </div> */}

      <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', fontSize: '18px', textAlign: 'center', margin: '10px 0' }}>
        DEBUG: CONTENT AFTER MY REQUESTS SECTION (IF THIS DOES NOT SHOW, PROBLEM IS HIGH UP)
      </div>
    </>
  );
}

