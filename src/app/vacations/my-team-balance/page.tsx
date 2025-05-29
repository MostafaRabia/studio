
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEmployees } from '@/contexts/employee-context';
import type { Employee } from '@/lib/placeholder-data';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder for the current manager's ID. In a real app, this would come from auth.
const CURRENT_MANAGER_ID = '2'; // Assuming Bob The Builder (ID '2') is the manager

interface TeamMemberVacationBalance extends Employee {
  totalEntitlementDays: number;
  availableDays: number;
  consumedDays: number;
}

export default function MyTeamBalancePage() {
  const { employees } = useEmployees();

  const teamMembers = employees.filter(
    (emp) => emp.reportsTo?.includes(CURRENT_MANAGER_ID)
  );

  const teamMemberBalances: TeamMemberVacationBalance[] = teamMembers.map(
    (member) => ({
      ...member,
      // Using consistent placeholder values
      totalEntitlementDays: 25,
      availableDays: 18,
      consumedDays: 7,
    })
  );

  // Find the manager's name for the PageHeader description
  const manager = employees.find(emp => emp.id === CURRENT_MANAGER_ID);
  const pageDescription = manager
    ? `View the vacation balances for ${manager.name}'s team members.`
    : "View the vacation balances for your team members.";


  return (
    <>
      <PageHeader
        title="My Team's Vacation Balance"
        description={pageDescription}
        actions={
          <Link href="/vacations" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vacations
            </Button>
          </Link>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Team Vacation Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMemberBalances.length > 0 ? (
            <Table>
              <TableCaption>A summary of your team's vacation days.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead className="text-right">Total Entitlement</TableHead>
                  <TableHead className="text-right">Available Days</TableHead>
                  <TableHead className="text-right">Consumed Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMemberBalances.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <Link href={`/vacations/employee-balance/${member.id}`} passHref>
                        <span className="hover:text-primary hover:underline cursor-pointer">
                          {member.name} ({member.jobTitle})
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">{member.totalEntitlementDays}</TableCell>
                    <TableCell className="text-right">{member.availableDays}</TableCell>
                    <TableCell className="text-right">{member.consumedDays}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground text-center">
                { manager ? `${manager.name} does not have any direct reports listed.` : "No team members found to display."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
