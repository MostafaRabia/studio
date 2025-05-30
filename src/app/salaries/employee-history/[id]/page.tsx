
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployees } from '@/contexts/employee-context';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
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
import { ArrowLeft } from 'lucide-react';
import React from 'react';

// Re-using the same mock data as it's generic for now
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

export default function EmployeeSalaryHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const { id: employeeId } = params;
  const { employees } = useEmployees();

  const employee = employees.find(emp => emp.id === employeeId);

  if (!employee) {
    return (
      <>
        <PageHeader title="Employee Not Found" description="Could not find salary history for this employee." />
        <div className="text-center">
          <p className="text-muted-foreground mb-4">The employee you are looking for does not exist or may have been removed.</p>
          <Link href="/salaries" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team Salaries
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Monthly Salary History - ${employee.name}`}
        description={`View ${employee.name}'s detailed salary breakdown per month.`}
        actions={
          <Link href="/salaries" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team Salaries
            </Button>
          </Link>
        }
      />
      <Card className="mt-4 shadow-lg">
        <CardHeader>
          <CardTitle>{employee.name}'s Monthly Salary History</CardTitle>
        </CardHeader>
        <CardContent>
          {mockSalaryHistory.length > 0 ? (
            <Table>
              <TableCaption>A list of {employee.name}'s monthly salary details.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Month</TableHead>
                  <TableHead className="text-right">Gross Value</TableHead>
                  <TableHead className="text-right">Net Value</TableHead>
                  <TableHead>Benefits Description</TableHead>
                  <TableHead className="text-right">Benefits Value</TableHead>
                  <TableHead className="text-right">Total Net Income</TableHead>
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
                    <TableCell className="text-right font-semibold">${(entry.netValue + entry.benefitsValue).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground text-center">
                No monthly salary history available for {employee.name}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
