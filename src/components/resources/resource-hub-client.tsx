
import type { Resource } from '@/lib/placeholder-data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

interface ResourceCardProps {
  resource: Resource;
}

function ResourceCard({ resource }: ResourceCardProps) {
  const IconComponent = resource.icon;
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg">{resource.title}</CardTitle>
           {resource.description && (
            <CardDescription className="text-xs mt-1 line-clamp-2">
              {resource.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Link href={resource.link} target="_blank" rel="noopener noreferrer" className="mt-auto">
          <span className="inline-flex items-center text-sm font-medium text-primary hover:underline group">
            Access Resource
            <ExternalLink className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}

interface ResourceHubClientProps {
  initialResources: Resource[];
}

export function ResourceHubClient({ initialResources }: ResourceHubClientProps) {
  const categorizedResources = useMemo(() => {
    return initialResources.reduce((acc, resource) => {
      const category = resource.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(resource);
      return acc;
    }, {} as Record<string, Resource[]>);
  }, [initialResources]);

  const categories = Object.keys(categorizedResources).sort();

  return (
    <div className="space-y-8">
      {categories.length > 0 ? (
        categories.map((category) => (
          <section key={category}>
            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-border">{category}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categorizedResources[category].map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">No resources available at this time.</p>
      )}
    </div>
  );
}
