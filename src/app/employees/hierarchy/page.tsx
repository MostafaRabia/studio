
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeHierarchyPage() {
  return (
    <>
      <PageHeader
        title="Employee Hierarchy Chart"
        description="Visualize the reporting structure of the organization."
        actions={
            <Link href="/employees" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Hierarchy Chart</CardTitle>
          <CardDescription>
            This is where the employee hierarchy chart will be displayed. 
            Currently under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground">Employee Hierarchy Chart Coming Soon!</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
