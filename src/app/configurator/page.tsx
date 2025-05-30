
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ConfiguratorPage() {
  return (
    <>
      <PageHeader
        title="Application Configurator"
        description="Manage and customize application settings and features."
        actions={
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        }
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>User & Employee Management</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Link href="/employees/new" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <UserPlus className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Add New Employee</p>
                  <p className="text-xs text-muted-foreground">Go to the form to create a new employee profile.</p>
                </div>
              </Button>
            </Link>
            <Link href="/employees" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <Users className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage Existing Employees</p>
                  <p className="text-xs text-muted-foreground">View, edit, or delete employee profiles from the directory.</p>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy & Document Management</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Link href="/resources/7" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <FileText className="mr-3 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">View Employee Rules</p>
                  <p className="text-xs text-muted-foreground">Access and review the company's employee rules document.</p>
                </div>
              </Button>
            </Link>
             {/* Placeholder for other policy management buttons */}
          </CardContent>
        </Card>
        
        {/* Placeholder for more configurator sections */}
        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md">
          <p className="text-muted-foreground text-center">
            More configurator sections will be added here.
          </p>
        </div>
      </div>
    </>
  );
}
