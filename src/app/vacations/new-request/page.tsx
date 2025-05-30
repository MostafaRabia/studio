
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ListChecks, Users, CheckCircle, XCircle } from 'lucide-react';
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
  vacationType: string; 
  submittingDate: Date;
  approvedFrom?: string; 
  status: 'Pending' | 'Approved' | 'Rejected';
}

const initialMockRequests: MyVacationRequest[] = [
  {
    id: 'myReq1',
    startDate: new Date('2024-08-15'),
    endDate: new Date('2024-08-19'),
    numberOfDays: 5,
    vacationType: 'Annual Leave',
    submittingDate: new Date('2024-07-20'),
    approvedFrom: 'Bob The Builder',
    status: 'Approved',
  },
  {
    id: 'myReq2',
    startDate: new Date('2024-09-02'),
    endDate: new Date('2024-09-04'),
    numberOfDays: 3,
    vacationType: 'Sick Leave',
    submittingDate: new Date('2024-08-28'),
    status: 'Pending',
  },
  {
    id: 'myReq3',
    startDate: new Date('2024-07-10'),
    endDate: new Date('2024-07-10'),
    numberOfDays: 1,
    vacationType: 'Personal Day',
    submittingDate: new Date('2024-07-01'),
    approvedFrom: 'Bob The Builder',
    status: 'Rejected',
  },
  {
    id: 'myReq4',
    startDate: new Date('2024-10-21'),
    endDate: new Date('2024-10-25'),
    numberOfDays: 5,
    vacationType: 'Annual Leave',
    submittingDate: new Date('2024-09-15'),
    status: 'Pending',
  },
];

interface TeamVacationRequest {
  id: string;
  requesterName: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  submittingDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const initialTeamMockRequests: TeamVacationRequest[] = [
  {
    id: 'teamReq1',
    requesterName: 'Alice Wonderland',
    startDate: new Date('2024-09-10'),
    endDate: new Date('2024-09-12'),
    numberOfDays: 3,
    submittingDate: new Date('2024-09-01'),
    status: 'Pending',
  },
  {
    id: 'teamReq2',
    requesterName: 'Charlie Brown',
    startDate: new Date('2024-09-15'),
    endDate: new Date('2024-09-16'),
    numberOfDays: 2,
    submittingDate: new Date('2024-09-05'),
    status: 'Pending',
  },
  {
    id: 'teamReq3',
    requesterName: 'Diana Prince',
    startDate: new Date('2024-08-20'),
    endDate: new Date('2024-08-22'),
    numberOfDays: 3,
    submittingDate: new Date('2024-08-10'),
    status: 'Approved',
  },
];

export default function NewVacationRequestPage() {
  const [myRequests, setMyRequests] = useState<MyVacationRequest[]>(initialMockRequests);
  const [teamRequests, setTeamRequests] = useState<TeamVacationRequest[]>(initialTeamMockRequests);

  // Dialog and form related states and functions (currently simplified)
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Add form handling logic here if re-enabling the dialog

  const handleApprove = (requestId: string) => {
    setTeamRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: 'Approved' } : req
      )
    );
  };

  const handleReject = (requestId: string) => {
    setTeamRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: 'Rejected' } : req
      )
    );
  };


  return (
    <>
      <PageHeader
        title="New Vacation Request & Status"
        description="Submit new vacation requests and view your request history. Manage team requests."
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/vacations" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vacations
              </Button>
            </Link>
            {/* Temporarily simplified button - re-enable DialogTrigger later */}
            {/* 
            <Button onClick={() => console.log("New Request Dialog would open")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Request Time Off
            </Button> 
            */}
          </div>
        }
      />
      
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-primary" />
            My Requests Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            My Team Member Vacations Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {teamRequests.length > 0 ? (
            <Table>
              <TableCaption>Vacation requests from your team members requiring action.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Requester Name</TableHead>
                  <TableHead>Starts From</TableHead>
                  <TableHead>End At</TableHead>
                  <TableHead className="text-center">Number of Days</TableHead>
                  <TableHead>Submitting Date</TableHead>
                  <TableHead className="text-center">Status / Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.requesterName}</TableCell>
                    <TableCell>{format(request.startDate, 'PPP')}</TableCell>
                    <TableCell>{format(request.endDate, 'PPP')}</TableCell>
                    <TableCell className="text-center">{request.numberOfDays}</TableCell>
                    <TableCell>{format(request.submittingDate, 'PPP')}</TableCell>
                    <TableCell className="text-center">
                      {request.status === 'Pending' ? (
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" /> Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-700 hover:bg-red-50 hover:text-red-800"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <Badge
                          variant={request.status === 'Approved' ? 'default' : 'destructive'}
                          className={
                           request.status === 'Approved' ? 'bg-green-500 hover:bg-green-600 text-white' 
                           : 'bg-red-500 hover:bg-red-600 text-white'
                          }
                        >
                          {request.status}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground">No pending vacation requests from your team members.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

