
import { PageHeader } from '@/components/page-header';

export default function VacationsPage() {
  return (
    <>
      <PageHeader
        title="Employee Vacations"
        description="Manage and view employee vacation requests and schedules."
      />
      <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
        <p className="text-muted-foreground">Vacation management features will be implemented here.</p>
      </div>
    </>
  );
}
