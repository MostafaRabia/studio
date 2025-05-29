
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApprovalRequestsPage() {
  return (
    <>
      <PageHeader
        title="Vacation Approval Requests"
        description="Review and manage pending vacation requests from your team."
        actions={
          <Link href="/vacations" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vacations
            </Button>
          </Link>
        }
      />
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground text-center">
          Pending approval requests will be displayed here.
        </p>
      </div>
    </>
  );
}
