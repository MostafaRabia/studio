
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default function MyBalancePage() {
  // Placeholder value, can be made dynamic later
  const totalAvailableVacationDays = 25;

  return (
    <>
      <PageHeader
        title="My Vacation Balance"
        description="View your current vacation allowance and usage."
        actions={
          <Link href="/vacations" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vacations
            </Button>
          </Link>
        }
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Available Vacation Days
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAvailableVacationDays} days
            </div>
            <p className="text-xs text-muted-foreground">
              Current entitlement for this year.
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Placeholder for other balance details that might be added later */}
      {/* 
      <div className="mt-8 flex items-center justify-center h-40 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground">
          More vacation balance details will be displayed here.
        </p>
      </div> 
      */}
    </>
  );
}
