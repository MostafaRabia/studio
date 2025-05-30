
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resources as allPlaceholderResources } from '@/lib/placeholder-data';
import type { Resource, Employee, Attachment } from '@/lib/placeholder-data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, FileText, Download, Edit, Trash2, Settings, Users, Briefcase, Tv, FolderOpen, PlusSquare, Edit3, Trash, CircleDollarSign, Columns, SlidersHorizontal, ShieldQuestion, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from '@/contexts/employee-context';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";


interface EmployeeRuleSettings {
  canViewHierarchyOnly: boolean;
  canViewAnnouncements: boolean;
  canAddAnnouncements: boolean;
  canEditDeleteAnnouncements: boolean;
  canViewResourceHubOnly: boolean;
  canAddResource: boolean;
  canEditDeleteResource: boolean;
  canViewMyBalance: boolean;
  canViewTeamBalance: boolean;
  canViewTeamSalaries: boolean;
  canAccessConfigurator: boolean;
}

const allConfigurableRules: Array<{ key: keyof EmployeeRuleSettings; label: string; icon: React.ElementType }> = [
  { key: 'canViewHierarchyOnly', label: 'View only the hierarchy', icon: Users },
  { key: 'canViewAnnouncements', label: 'View company announcements', icon: Tv },
  { key: 'canAddAnnouncements', label: 'Add new announcement', icon: PlusSquare },
  { key: 'canEditDeleteAnnouncements', label: 'Edit or delete existing announcement', icon: Edit3 },
  { key: 'canViewResourceHubOnly', label: 'View resource hub only', icon: FolderOpen },
  { key: 'canAddResource', label: 'Add new resource in resource hub', icon: PlusSquare },
  { key: 'canEditDeleteResource', label: 'Edit or remove existing resource in resource hub', icon: Trash },
  { key: 'canViewMyBalance', label: 'View my balance (vacations)', icon: CircleDollarSign },
  { key: 'canViewTeamBalance', label: 'View team balance (vacations)', icon: Columns },
  { key: 'canViewTeamSalaries', label: 'View my team salaries page', icon: CircleDollarSign },
  { key: 'canAccessConfigurator', label: 'Access configurator page', icon: SlidersHorizontal },
];


export default function ResourceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const resource = allPlaceholderResources.find(r => r.id === id);

  const { employees } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  const [employeeRuleSettings, setEmployeeRuleSettings] = useState<Record<string, EmployeeRuleSettings>>({});

  useEffect(() => {
    if (selectedEmployeeId && !employeeRuleSettings[selectedEmployeeId]) {
      const defaultSettings: EmployeeRuleSettings = {
        canViewHierarchyOnly: false,
        canViewAnnouncements: true, 
        canAddAnnouncements: false,
        canEditDeleteAnnouncements: false,
        canViewResourceHubOnly: true, 
        canAddResource: false,
        canEditDeleteResource: false,
        canViewMyBalance: true, 
        canViewTeamBalance: false,
        canViewTeamSalaries: false,
        canAccessConfigurator: false,
      };
      setEmployeeRuleSettings(prevSettings => ({
        ...prevSettings,
        [selectedEmployeeId]: defaultSettings
      }));
    }
  }, [selectedEmployeeId, employeeRuleSettings]);

  const handleRuleChange = (employeeId: string, ruleName: keyof EmployeeRuleSettings, value: boolean) => {
    setEmployeeRuleSettings(prevSettings => ({
      ...prevSettings,
      [employeeId]: {
        ...(prevSettings[employeeId] || {} as EmployeeRuleSettings),
        [ruleName]: value,
      }
    }));
  };

  const handleSaveSettings = () => {
    if (selectedEmployee) {
      toast({
        title: "Settings Saved",
        description: `Rule configurations for ${selectedEmployee.name} have been notionally saved.`,
      });
      // In a real app, this is where you'd send data to a backend.
      console.log("Saving settings for employee:", selectedEmployee.id, employeeRuleSettings[selectedEmployee.id]);
    }
  };


  if (!resource) {
    return (
      <>
        <PageHeader title="Resource Not Found" description="The resource you are looking for does not exist." />
        <div className="text-center">
          {/* Removed "Back to Resource Hub" button */}
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
            {resource.id === '7' && (
                <Link href="/configurator" passHref>
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Configurator
                    </Button>
                </Link>
            )}
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

      {resource.id === '7' && (
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Employee-Specific Rule Configuration
            </CardTitle>
            <CardDescription>
              Select an employee to view or set rules specific to them. These settings are illustrative and not connected to application behavior in this prototype.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedEmployeeId} value={selectedEmployeeId || undefined}>
              <SelectTrigger className="w-full md:w-[300px] mb-4">
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
            
            {selectedEmployee && employeeRuleSettings[selectedEmployee.id] && (
              <div className="mt-1 space-y-1">
                <p className="text-sm text-muted-foreground mb-3">
                  Configuring rules for: <span className="font-medium text-primary">{selectedEmployee.name}</span>
                </p>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/20">
                  <div className="space-y-5">
                    {allConfigurableRules.map((rule) => {
                      const IconComponent = rule.icon || ShieldQuestion; // Fallback icon
                      return (
                        <div key={rule.key} className="flex items-center justify-between space-x-2 p-3 border-b last:border-b-0 hover:bg-background/50 rounded-md transition-colors">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-5 w-5 text-muted-foreground" />
                            <Label htmlFor={`${rule.key}-${selectedEmployee.id}`} className="text-sm cursor-pointer flex-grow">
                              {rule.label}
                            </Label>
                          </div>
                          <Switch
                            id={`${rule.key}-${selectedEmployee.id}`}
                            checked={employeeRuleSettings[selectedEmployee.id!]?.[rule.key] || false}
                            onCheckedChange={(value) => handleRuleChange(selectedEmployee.id, rule.key, value)}
                            aria-label={rule.label}
                          />
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
            {!selectedEmployee && resource.id === '7' && (
              <div className="mt-4 flex items-center justify-center h-20 border-2 border-dashed rounded-md">
                <p className="text-muted-foreground text-center">
                  Select an employee to see specific rule configurations.
                </p>
              </div>
            )}
          </CardContent>
          {selectedEmployee && resource.id === '7' && (
            <CardFooter className="border-t pt-4 mt-4 flex justify-end">
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {/* Conditionally render the main resource content card */}
      {resource.id !== '7' && (
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

            {!hasInternalText && !hasTextAttachment && !hasExternalLink && resource.id !== '7' && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground text-center">
                    No specific content configured for this resource.
                  </p>
                </div>
            )}
            {/* This specific fallback for id === '7' is no longer needed if the whole card is hidden */}
            {/* {!hasInternalText && !hasTextAttachment && !hasExternalLink && resource.id === '7' && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground text-center">
                    No general content for "Employee Rules". 
                    <br /> Select an employee above to configure their specific rules.
                  </p>
                </div>
            )} */}
          </CardContent>
        </Card>
      )}
      
      {/* Fallback message if it's resource '7' AND no employee is selected (to guide the user) */}
      {/* This might be redundant if the primary interaction is clear from the config card */}
      {resource.id === '7' && !selectedEmployee && (
        <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              No general content to display for "Employee Rules".
              <br /> Select an employee above to configure their specific rules.
            </p>
          </div>
      )}
    </>
  );
}
    
