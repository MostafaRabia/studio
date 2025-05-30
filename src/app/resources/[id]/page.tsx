
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resources as allPlaceholderResources } from '@/lib/placeholder-data';
import type { Resource } from '@/lib/placeholder-data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import React from 'react';

export default function ResourceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const resource = allPlaceholderResources.find(r => r.id === id);

  if (!resource) {
    return (
      <>
        <PageHeader title="Resource Not Found" description="The resource you are looking for does not exist." />
        <div className="text-center">
          <Button variant="outline" onClick={() => router.push('/resources')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resource Hub
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={resource.title}
        description="Details for this resource."
        actions={
          <Button variant="outline" onClick={() => router.push('/resources')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resource Hub
          </Button>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{resource.title}</CardTitle>
          {resource.description && (
            <CardDescription>{resource.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            You can access this resource externally using the link below:
          </p>
          <Button asChild variant="default" size="lg">
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Access External Resource
            </a>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
