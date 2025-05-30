
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, UserMinus, FileText, BookOpen } from 'lucide-react';
import Link from 'next/link';

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
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-md mb-8">
        <p className="text-muted-foreground text-center">
          General application configuration options will be available here.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Employee Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <UserMinus className="mr-3 h-5 w-5 text-destructive" />
               <div>
                <p className="font-medium">Manage Existing Employees</p>
                <p className="text-xs text-muted-foreground">View directory to select and manage employees.</p>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Policy & Document Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/resources/7" passHref> {/* ID '7' is for Employee Rules */}
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
              <BookOpen className="mr-3 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">View Employee Rules</p>
                <p className="text-xs text-muted-foreground">Access the company's employee rules and guidelines.</p>
              </div>
            </Button>
          </Link>
           {/* Placeholder for other policy management links */}
           {/* 
            <Button variant="outline" className="w-full justify-start text-left h-auto py-3" disabled>
              <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Manage Company Handbook</p>
                <p className="text-xs text-muted-foreground">Edit or update the main company handbook (feature coming soon).</p>
              </div>
            </Button>
            */}
        </div>
      </div>
    </>
  );
}
