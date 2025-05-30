
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resources as allPlaceholderResources } from '@/lib/placeholder-data';
import type { Resource, Employee } from '@/lib/placeholder-data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, FileText, Download, Edit, Trash2, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from '@/contexts/employee-context';


export default function ResourceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const resource = allPlaceholderResources.find(r => r.id === id);

  const { employees } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);


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

  const hasInternalText = resource.internalText && resource.internalText.trim() !== '';
  const hasTextAttachment = !!resource.textAttachment;
  const hasExternalLink = !!resource.link && resource.link.trim() !== '';


  return (
    <>
      <PageHeader
        title={resource.title}
        description={resource.description || "Details for this resource."}
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            {resource.id !== '7' && ( 
              <Link href={`/resources?edit=${resource.id}`} passHref>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Resource
                </Button>
              </Link>
            )}
            {resource.id !== '7' && ( 
              <Link href={`/resources?delete=${resource.id}`} passHref>
                <Button variant="destructive" className="bg-destructive hover:bg-destructive/90">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Resource
                </Button>
              </Link>
            )}
          </div>
        }
      />
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>{resource.title}</CardTitle>
          {resource.description && (
            <CardDescription>{resource.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {hasInternalText && (
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert p-4 border rounded-md bg-muted/20">
              <h3 className="text-lg font-semibold mb-2 border-b pb-2">Content:</h3>
              <ReactMarkdown>{resource.internalText!}</ReactMarkdown>
            </div>
          )}

          {hasTextAttachment && resource.textAttachment && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Attachment:</h3>
              <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/50">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{resource.textAttachment.name}</span>
                  <span className="text-xs text-muted-foreground">({(resource.textAttachment.size / 1024).toFixed(1)} KB)</span>
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href={resource.textAttachment.dataUrl} download={resource.textAttachment.name}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Attachment
                  </a>
                </Button>
              </div>
            </div>
          )}

          {hasExternalLink && resource.link && (
            <div>
              <h3 className="text-lg font-semibold mb-2">External Link:</h3>
              <Button asChild variant="default" size="lg">
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Access External Resource
                </a>
              </Button>
            </div>
          )}

          {!hasInternalText && !hasTextAttachment && !hasExternalLink && (
            <p className="text-muted-foreground">This resource does not have any content or an external link configured.</p>
          )}
        </CardContent>
      </Card>

      {/* Employee specific rule configuration section */}
      {resource.id === '7' && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Employee-Specific Rule Configuration
            </CardTitle>
            <CardDescription>
              Select an employee to view or set rules specific to them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId || undefined}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select an employee..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.jobTitle})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEmployee && (
              <p className="mt-3 text-sm text-muted-foreground">
                Configuring rules for: <span className="font-medium text-primary">{selectedEmployee.name}</span>
              </p>
            )}
            <div className="mt-4 flex items-center justify-center h-20 border-2 border-dashed rounded-md">
              <p className="text-muted-foreground text-center">
                {selectedEmployee ?
                  `Rule configurations specific to ${selectedEmployee.name} would appear here.` :
                  "Select an employee to see specific rule configurations."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
