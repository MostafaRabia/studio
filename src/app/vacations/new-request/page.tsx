
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
import { ListChecks } from 'lucide-react';

interface MyVacationRequest {
  id: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  vacationType: string; // Still in data, but column removed from table
  submittingDate: Date;
  approvedFrom?: string; // Manager's name or ID
  status: 'Pending' | 'Approved' | 'Rejected';
}

// Mock data - ensure fields align with new column order logic in TableCell
const initialMockRequests: MyVacationRequest[] = [
  {
    id: 'req1',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-08-05'),
    numberOfDays: 5,
    vacationType: 'Annual Leave',
    submittingDate: new Date('2024-07-15'),
    approvedFrom: 'Bob The Builder',
    status: 'Approved',
  },
  {
    id: 'req2',
    startDate: new Date('2024-09-10'),
    endDate: new Date('2024-09-12'),
    numberOfDays: 3,
    vacationType: 'Sick Leave',
    submittingDate: new Date('2024-09-09'),
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
            {/* Placeholder for New Request Button that would open a dialog - currently simplified */}
            {/* <Button onClick={() => console.log("New Request Dialog would open")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Request Time Off
            </Button> */}
          </div>
        }
      />

      {/* My Requests Status Section */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-primary" />
            My Requests Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myRequests.length > 0 ? (
            <Table>
              <TableCaption>A list of your submitted vacation requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Date</TableHead>
                  <TableHead className="text-center">Number of Days</TableHead>
                  <TableHead>Starts From</TableHead>
                  <TableHead>End At</TableHead>
                  <TableHead>Approval By</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{format(request.submittingDate, 'PPP')}</TableCell>
                    <TableCell className="text-center">{request.numberOfDays}</TableCell>
                    <TableCell>{format(request.startDate, 'PPP')}</TableCell>
                    <TableCell>{format(request.endDate, 'PPP')}</TableCell>
                    <TableCell>{request.approvedFrom || 'N/A'}</TableCell>
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
    </>
  );
}
