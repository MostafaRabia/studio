
"use client";

import type { Resource } from '@/lib/placeholder-data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ExternalLink, PlusCircle, FolderPlus, FileText, ShieldCheck, Handshake, type LucideIcon } from 'lucide-react'; // Added more icons
import React, { useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

// Helper function to get the icon component based on name
const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return ExternalLink; // Default icon
  switch (iconName) {
    case 'FileText':
      return FileText;
    case 'ShieldCheck':
      return ShieldCheck;
    case 'ExternalLink':
      return ExternalLink;
    case 'Handshake':
      return Handshake;
    // Add other icons used in your resources here
    default:
      return ExternalLink; // Fallback icon
  }
};

interface ResourceCardProps {
  resource: Resource;
}

function ResourceCard({ resource }: ResourceCardProps) {
  const IconComponent = getIconComponent(resource.iconName);
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

const newCategoryFormSchema = z.object({
  categoryName: z.string().min(1, "Category name is required.").max(50, "Category name must be 50 characters or less."),
});
type NewCategoryFormValues = z.infer<typeof newCategoryFormSchema>;

interface ResourceHubClientProps {
  initialResources: Resource[];
}

export function ResourceHubClient({ initialResources }: ResourceHubClientProps) {
  const { toast } = useToast();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const initialDerivedCategories = useMemo(() => {
    const categoriesSet = new Set(initialResources.map(r => r.category || 'Other'));
    return Array.from(categoriesSet);
  }, [initialResources]);

  const [allCategories, setAllCategories] = useState<string[]>(initialDerivedCategories);

  const categoryForm = useForm<NewCategoryFormValues>({
    resolver: zodResolver(newCategoryFormSchema),
    defaultValues: {
      categoryName: "",
    },
  });

  const handleAddCategory: SubmitHandler<NewCategoryFormValues> = (data) => {
    const newCategoryName = data.categoryName.trim();
    if (newCategoryName && !allCategories.some(cat => cat.toLowerCase() === newCategoryName.toLowerCase())) {
      setAllCategories(prev => [...prev, newCategoryName]);
      toast({
        title: "Category Added",
        description: `Category "${newCategoryName}" has been successfully added.`,
      });
    } else if (allCategories.some(cat => cat.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({
        title: "Category Exists",
        description: `Category "${newCategoryName}" already exists.`,
        variant: "destructive",
      });
    }
    setIsCategoryDialogOpen(false);
    categoryForm.reset();
  };

  const displayCategorizedResources = useMemo(() => {
    return initialResources.reduce((acc, resource) => {
      const category = resource.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(resource);
      return acc;
    }, {} as Record<string, Resource[]>);
  }, [initialResources]);

  const sortedDisplayCategories = useMemo(() => {
    const uniqueCategories = new Set(allCategories); // Ensures uniqueness if somehow duplicates are added
    return Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b));
  }, [allCategories]);


  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Resource Category</DialogTitle>
            </DialogHeader>
            <Form {...categoryForm}>
              <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} className="space-y-4 py-4">
                <FormField
                  control={categoryForm.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Training Materials" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Category</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedDisplayCategories.length > 0 ? (
        sortedDisplayCategories.map((category) => {
          const resourcesForCategory = displayCategorizedResources[category] || [];
          return (
            <section key={category}>
              <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-border">{category}</h2>
              {resourcesForCategory.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resourcesForCategory.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">No resources in this category yet.</p>
                </div>
              )}
            </section>
          );
        })
      ) : (
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
           <p className="text-center text-muted-foreground py-8">
            No resource categories available. Add a category to get started.
          </p>
        </div>
      )}
    </div>
  );
}
