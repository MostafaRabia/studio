
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react'; // Added PlusCircle
import Link from 'next/link';

export default function NewVacationRequestPage() {
  return (
    <>
      <PageHeader
        title="New Vacation Request"
        description="Fill out the form below to submit your vacation request."
        actions={
          <div className="flex flex-col sm:flex-row gap-2"> {/* Wrapper for buttons */}
            <Link href="/vacations" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vacations
              </Button>
            </Link>
            {/* New Button Added Here */}
            <Link href="/vacations/new-request" passHref> {/* Links to itself */}
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Vacation Request
              </Button>
            </Link>
          </div>
        }
      />
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground">
          Vacation request form will be here.
        </p>
      </div>
    </>
  );
}
