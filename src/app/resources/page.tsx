import { PageHeader } from '@/components/page-header';
import { ResourceHubClient } from '@/components/resources/resource-hub-client';
import { resources } from '@/lib/placeholder-data';

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        title="Resource Hub"
        description="Find important company documents, links, and policies."
      />
      <ResourceHubClient initialResources={resources} />
    </>
  );
}
