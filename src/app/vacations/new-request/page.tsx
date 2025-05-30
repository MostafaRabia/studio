
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ListChecks } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { format } from 'date-fns';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MyVacationRequest {
  id: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  vacationType: string; // Still in data, but column removed from table based on previous request
  submittingDate: Date;
  approvedFrom?: string; // Manager's name or ID
  status: 'Pending' | 'Approved' | 'Rejected';
}

const initialMockRequests: MyVacationRequest[] = [
  {
    id: 'req1',
    startDate: new Date('2024-08-15'),
    endDate: new Date('2024-08-19'),
    numberOfDays: 5,
    vacationType: 'Annual Leave',
    submittingDate: new Date('2024-07-20'),
    approvedFrom: 'Bob The Builder',
    status: 'Approved',
  },
  {
    id: 'req2',
    startDate: new Date('2024-09-02'),
    endDate: new Date('2024-09-04'),
    numberOfDays: 3,
    vacationType: 'Sick Leave',
    submittingDate: new Date('2024-08-28'),
    // approvedFrom: 'N/A', // Field is optional
    status: 'Pending',
  },
  {
    id: 'req3',
    startDate: new Date('2024-07-10'),
    endDate: new Date('2024-07-10'),
    numberOfDays: 1,
    vacationType: 'Personal Day',
    submittingDate: new Date('2024-07-01'),
    approvedFrom: 'Bob The Builder',
    status: 'Rejected',
  },
  {
    id: 'req4',
    startDate: new Date('2024-10-21'),
    endDate: new Date('2024-10-25'),
    numberOfDays: 5,
    vacationType: 'Annual Leave',
    submittingDate: new Date('2024-09-15'),
    status: 'Pending',
  },
];

export default function NewVacationRequestPage() {
  const [myRequests, setMyRequests] = useState<MyVacationRequest[]>(initialMockRequests);
  // Form and dialog logic is currently simplified for table visibility debugging

  return (
    <>
      <PageHeader
        title="New Vacation Request & Status"
        description="Submit new vacation requests and view your request history."
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/vacations" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vacations
              </Button>
            </Link>
            {/* Dialog button for new request is simplified for now to debug table visibility */}
            {/* 
            <Button onClick={() => console.log("New Request Dialog would open")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Request Time Off
            </Button> 
            */}
          </div>
        }
      />

      {/* Debug wrapper for My Requests Status Section */}
      <div className="border-4 border-red-500 p-4 my-4 bg-yellow-100 min-h-[200px]">
        <p className="text-black font-bold text-lg mb-2">DEBUG: 'My Requests Status' Section Container</p>
        
        <Card className="shadow-lg border-2 border-blue-600 bg-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center text-black"> {/* Explicit text color */}
              <ListChecks className="mr-2 h-5 w-5 text-primary" />
              My Requests Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6"> {/* Ensure padding is applied */}
            {myRequests.length > 0 ? (
              <Table>
                <TableCaption className="text-gray-700">A list of your submitted vacation requests.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">Request Date</TableHead>
                    <TableHead className="text-center text-black">Number of Days</TableHead>
                    <TableHead className="text-black">Starts From</TableHead>
                    <TableHead className="text-black">End At</TableHead>
                    <TableHead className="text-black">Approval By</TableHead>
                    <TableHead className="text-right text-black">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.map((request) => (
                    <TableRow key={request.id} className="bg-white even:bg-gray-50">
                      <TableCell className="text-black">{format(request.submittingDate, 'PPP')}</TableCell>
                      <TableCell className="text-center text-black">{request.numberOfDays}</TableCell>
                      <TableCell className="text-black">{format(request.startDate, 'PPP')}</TableCell>
                      <TableCell className="text-black">{format(request.endDate, 'PPP')}</TableCell>
                      <TableCell className="text-black">{request.approvedFrom || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            request.status === 'Approved'
                              ? 'default'
                              : request.status === 'Pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className={
                             request.status === 'Approved' ? 'bg-green-500 hover:bg-green-600 text-white' 
                             : request.status === 'Pending' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                             : 'bg-red-500 hover:bg-red-600 text-white'
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
                <p className="text-muted-foreground">You haven't submitted any vacation requests yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
