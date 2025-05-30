
"use client";

import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import React from 'react';
import { useEmployees } from '@/contexts/employee-context';
import type { Employee } from '@/lib/placeholder-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';


interface MonthlySalaryEntry {
  id: string;
  month: string;
  grossValue: number;
  netValue: number;
  benefits: string;
  benefitsValue: number;
}

const mockSalaryHistory: MonthlySalaryEntry[] = [
  { id: '1', month: 'January 2024', grossValue: 5000, netValue: 4000, benefits: 'Health Insurance, Gym', benefitsValue: 500 },
  { id: '2', month: 'February 2024', grossValue: 5000, netValue: 4000, benefits: 'Health Insurance, Gym', benefitsValue: 500 },
  { id: '3', month: 'March 2024', grossValue: 5200, netValue: 4150, benefits: 'Health Insurance, Gym, Bonus', benefitsValue: 550 },
  { id: '4', month: 'April 2024', grossValue: 5200, netValue: 4150, benefits: 'Health Insurance, Gym', benefitsValue: 550 },
];

// Placeholder for the current manager's ID. In a real app, this would come from auth.
const CURRENT_MANAGER_ID = '2'; // Assuming Bob The Builder (ID '2') is the manager


export default function SalariesPage() {
  const { employees } = useEmployees();

  const teamMembers = employees.filter(
    (emp) => emp.reportsTo?.includes(CURRENT_MANAGER_ID)
  );

  const manager = employees.find(emp => emp.id === CURRENT_MANAGER_ID);
  const teamSalariesDescription = manager
    ? `View salary information for ${manager.name}'s team members.`
    : "View salary information for your team members.";


  return (
    <>
      <PageHeader
        title="Salaries"
        description="Manage and view employee salary information."
      />
      <Tabs defaultValue="team-salaries" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="team-salaries">My Team Salaries</TabsTrigger>
          <TabsTrigger value="history">My Monthly Salary History</TabsTrigger>
        </TabsList>
        <TabsContent value="team-salaries">
          <Card className="mt-4 shadow-lg">
            <CardHeader>
              <CardTitle>My Team Salaries</CardTitle>
              <CardContent className="text-sm text-muted-foreground">{teamSalariesDescription}</CardContent>
            </CardHeader>
            <CardContent>
              {teamMembers.length > 0 ? (
                <ul className="space-y-3">
                  {teamMembers.map((member) => (
                    <li key={member.id} className="border p-3 rounded-md hover:bg-muted/50 transition-colors">
                      <Link href={`/salaries/employee-history/${member.id}`} passHref>
                        <div className="flex items-center space-x-3 cursor-pointer">
                          <User className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-foreground hover:underline">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.jobTitle}</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                 <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground text-center">
                    { manager ? `${manager.name} does not have any direct reports listed.` : "No team members found to display."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card className="mt-4 shadow-lg">
            <CardHeader>
              <CardTitle>My Monthly Salary History</CardTitle>
            </CardHeader>
            <CardContent>
              {mockSalaryHistory.length > 0 ? (
                <Table>
                  <TableCaption>A list of my monthly salary details.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Month</TableHead>
                      <TableHead className="text-right">Gross Value</TableHead>
                      <TableHead className="text-right">Net Value</TableHead>
                      <TableHead>Benefits Description</TableHead>
                      <TableHead className="text-right">Benefits Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSalaryHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.month}</TableCell>
                        <TableCell className="text-right">${entry.grossValue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${entry.netValue.toLocaleString()}</TableCell>
                        <TableCell>{entry.benefits}</TableCell>
                        <TableCell className="text-right">${entry.benefitsValue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground text-center">
                    No monthly salary history available to display.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
