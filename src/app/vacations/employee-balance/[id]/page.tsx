
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployees } from '@/contexts/employee-context';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, CheckCircle, ListChecks, UserCircle } from 'lucide-react';

export default function EmployeeBalancePage() {
  const params = useParams();
  const router = useRouter();
  const { id: employeeId } = params;
  const { employees } = useEmployees();

  const employee = employees.find(emp => emp.id === employeeId);

  // Placeholder values, same as in MyBalancePage for now
  const totalEntitlementVacationDays = 25;
  const availableDays = 18;
  const usedDays = 7;

  if (!employee) {
    return (
      <>
        <PageHeader title="Employee Not Found" description="Could not find vacation balance for this employee." />
        <div className="text-center">
          <p className="text-muted-foreground mb-4">The employee you are looking for does not exist or may have been removed.</p>
          <Link href="/vacations/my-team-balance" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team Balance
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Vacation Balance - ${employee.name}`}
        description={`View ${employee.name}'s current vacation allowance and usage.`}
        actions={
          <div className="flex gap-2">
            <Link href="/vacations/my-team-balance" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Team Balance
              </Button>
            </Link>
            <Link href="/vacations" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vacations
              </Button>
            </Link>
          </div>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Entitlement
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEntitlementVacationDays} days
            </div>
            <p className="text-xs text-muted-foreground">
              Current entitlement for this year.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Days
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {availableDays} days
            </div>
            <p className="text-xs text-muted-foreground">
              Remaining days that can be requested.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Used Days
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usedDays} days
            </div>
            <p className="text-xs text-muted-foreground">
              Days already taken or approved.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
