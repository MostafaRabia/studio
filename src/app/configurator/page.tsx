
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground text-center">
          Application configuration options will be available here.
        </p>
      </div>
    </>
  );
}
