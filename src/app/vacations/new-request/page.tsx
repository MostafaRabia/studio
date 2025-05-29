
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, CalendarIcon, Send, CaseSensitive } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
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
import { useToast } from '@/hooks/use-toast';

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
  path: ["endDate"], // Path to the field that gets the error
});

type VacationRequestFormValues = z.infer<typeof vacationRequestSchema>;

export default function NewVacationRequestPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<VacationRequestFormValues>({
    resolver: zodResolver(vacationRequestSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      vacationType: "",
    },
  });

  const onSubmit: SubmitHandler<VacationRequestFormValues> = (data) => {
    console.log("Vacation Request Data:", data);
    toast({
      title: "Vacation Request Submitted",
      description: `${data.vacationType}: From ${format(data.startDate, "PPP")} to ${format(data.endDate, "PPP")}`,
    });
    form.reset();
    setIsDialogOpen(false); // Close the dialog on successful submission
  };

  return (
    <>
      <PageHeader
        title="New Vacation Request"
        description="Submit your vacation request."
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
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground text-center">
          Your vacation requests and history will be displayed here. <br/>
          Click "New Vacation Request" above to submit a new request.
        </p>
      </div>
    </>
  );
}
