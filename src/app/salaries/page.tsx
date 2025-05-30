
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

interface MonthlySalaryEntry {
  id: string;
  month: string;
  grossValue: number;
  netValue: number;
  benefits: string;
  benefitsValue: number; // New field
}

const mockSalaryHistory: MonthlySalaryEntry[] = [
  { id: '1', month: 'January 2024', grossValue: 5000, netValue: 4000, benefits: 'Health Insurance, Gym', benefitsValue: 500 },
  { id: '2', month: 'February 2024', grossValue: 5000, netValue: 4000, benefits: 'Health Insurance, Gym', benefitsValue: 500 },
  { id: '3', month: 'March 2024', grossValue: 5200, netValue: 4150, benefits: 'Health Insurance, Gym, Bonus', benefitsValue: 550 },
  { id: '4', month: 'April 2024', grossValue: 5200, netValue: 4150, benefits: 'Health Insurance, Gym', benefitsValue: 550 },
];

export default function SalariesPage() {
  return (
    <>
      <PageHeader
        title="Salaries"
        description="Manage and view employee salary information."
      />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Monthly Salary History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="mt-4 shadow-lg">
            <CardHeader>
              <CardTitle>Salary Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
                <p className="text-muted-foreground text-center">
                  General salary management features will be implemented here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card className="mt-4 shadow-lg">
            <CardHeader>
              <CardTitle>Monthly Salary History</CardTitle>
            </CardHeader>
            <CardContent>
              {mockSalaryHistory.length > 0 ? (
                <Table>
                  <TableCaption>A list of monthly salary details.</TableCaption>
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
