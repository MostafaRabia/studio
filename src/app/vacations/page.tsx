
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Wallet, Users, PlusCircle, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

export default function VacationsPage() {
  return (
    <>
      <PageHeader
        title="Employee Vacations"
        description="Manage and view employee vacation requests and schedules."
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/vacations/my-balance" passHref>
              <Button variant="outline">
                <Wallet className="mr-2 h-4 w-4" />
                My Balance
              </Button>
            </Link>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              My Team Balance
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Vacation Request
            </Button>
            <Button variant="secondary">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Approval Requests
            </Button>
          </div>
        }
      />
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground text-center">
          Vacation management features will be implemented here. <br />
          Use the buttons above to navigate different vacation-related sections.
        </p>
      </div>
    </>
  );
}
