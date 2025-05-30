
import { PageHeader } from '@/components/page-header';

export default function SalariesPage() {
  return (
    <>
      <PageHeader
        title="Salaries"
        description="Manage and view employee salary information."
      />
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground text-center">
          Salary management features will be implemented here.
        </p>
      </div>
    </>
  );
}
