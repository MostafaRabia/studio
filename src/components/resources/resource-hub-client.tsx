
"use client";

import type { Resource } from '@/lib/placeholder-data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button'; // Added buttonVariants import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ExternalLink, PlusCircle, FolderPlus, FileText, ShieldCheck, Handshake, type LucideIcon, Pencil, Trash2, BookOpen, Info, Folder, Link as LinkIcon } from 'lucide-react'; // Added Folder and LinkIcon
import React, { useMemo, useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const iconOptions = [
  { value: 'FileText', label: 'File Text' },
  { value: 'ExternalLink', label: 'External Link' },
  { value: 'ShieldCheck', label: 'Shield Check' },
  { value: 'Handshake', label: 'Handshake' },
  { value: 'BookOpen', label: 'Book Open' },
  { value: 'LinkIcon', label: 'Link Icon' }, // Changed 'Link' to 'LinkIcon' to avoid conflict with Link from next/link
  { value: 'Folder', label: 'Folder Icon' },
  { value: 'Info', label: 'Info Icon' },
];

const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return ExternalLink;
  switch (iconName) {
    case 'FileText': return FileText;
    case 'ShieldCheck': return ShieldCheck;
    case 'ExternalLink': return ExternalLink;
    case 'Handshake': return Handshake;
    case 'BookOpen': return BookOpen;
    case 'LinkIcon': return LinkIcon; // Changed 'Link' to 'LinkIcon'
    case 'Folder': return Folder;
    case 'Info': return Info;
    default: return ExternalLink;
  }
};

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onRemove: (resourceId: string) => void;
}

function ResourceCard({ resource, onEdit, onRemove }: ResourceCardProps) {
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
      <CardContent className="flex-grow">
        <Link href={resource.link} target="_blank" rel="noopener noreferrer" className="mt-auto">
          <span className="inline-flex items-center text-sm font-medium text-primary hover:underline group">
            Access Resource
            <ExternalLink className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </CardContent>
      <CardFooter className="pt-4 border-t mt-auto">
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => onEdit(resource)}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onRemove(resource.id)}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Remove
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

const newCategoryFormSchema = z.object({
  categoryName: z.string().min(1, "Category name is required.").max(50, "Category name must be 50 characters or less."),
});
type NewCategoryFormValues = z.infer<typeof newCategoryFormSchema>;

const resourceFormSchema = z.object({
  id: z.string().optional(), // Only present for editing
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().max(200).optional(),
  link: z.string().url("Please enter a valid URL."),
  category: z.string().min(1, "Category is required."),
  iconName: z.string().min(1, "Icon is required."),
});
export type ResourceFormValues = z.infer<typeof resourceFormSchema>;


interface ResourceHubClientProps {
  initialResources: Resource[];
}

export function ResourceHubClient({ initialResources }: ResourceHubClientProps) {
  const { toast } = useToast();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [resourceToRemove, setResourceToRemove] = useState<string | null>(null);

  const derivedCategories = useMemo(() => {
    const categoriesSet = new Set(resources.map(r => r.category || 'Other'));
    return Array.from(categoriesSet);
  }, [resources]);

  const [allCategories, setAllCategories] = useState<string[]>(derivedCategories);

  useEffect(() => {
    const newDerivedCategories = Array.from(new Set(resources.map(r => r.category || 'Other')));
    setAllCategories(newDerivedCategories);
  }, [resources]);


  const categoryForm = useForm<NewCategoryFormValues>({
    resolver: zodResolver(newCategoryFormSchema),
    defaultValues: { categoryName: "" },
  });

  const resourceForm = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      category: "",
      iconName: "ExternalLink",
    },
  });

  const handleAddCategory: SubmitHandler<NewCategoryFormValues> = (data) => {
    const newCategoryName = data.categoryName.trim();
    if (newCategoryName && !allCategories.some(cat => cat.toLowerCase() === newCategoryName.toLowerCase())) {
      setAllCategories(prev => [...prev, newCategoryName].sort((a, b) => a.localeCompare(b)));
      toast({ title: "Category Added", description: `Category "${newCategoryName}" has been successfully added.` });
    } else if (allCategories.some(cat => cat.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({ title: "Category Exists", description: `Category "${newCategoryName}" already exists.`, variant: "destructive" });
    }
    setIsCategoryDialogOpen(false);
    categoryForm.reset();
  };
  
  const handleOpenEditResourceDialog = (resource: Resource) => {
    setEditingResource(resource);
    resourceForm.reset({
      id: resource.id,
      title: resource.title,
      description: resource.description || "",
      link: resource.link,
      category: resource.category,
      iconName: resource.iconName,
    });
    setIsResourceFormOpen(true);
  };

  const handleResourceFormSubmit: SubmitHandler<ResourceFormValues> = (data) => {
    if (editingResource) { // Editing existing resource
      setResources(prev => prev.map(r => r.id === editingResource.id ? { ...r, ...data, id: editingResource.id } : r));
      toast({ title: "Resource Updated", description: `"${data.title}" has been updated.` });
    } else {
      // Add new resource logic (placeholder for now, can be expanded)
      const newResource: Resource = {
        id: Date.now().toString(),
        ...data,
        description: data.description || "", // ensure description is string
      };
      setResources(prev => [newResource, ...prev]);
      toast({ title: "Resource Added", description: `"${data.title}" has been added.` });
    }
    setIsResourceFormOpen(false);
    setEditingResource(null);
    resourceForm.reset();
  };

  const handleOpenRemoveResourceDialog = (resourceId: string) => {
    setResourceToRemove(resourceId);
  };

  const confirmRemoveResource = () => {
    if (resourceToRemove) {
      const resourceBeingRemoved = resources.find(r => r.id === resourceToRemove);
      setResources(prev => prev.filter(r => r.id !== resourceToRemove));
      toast({ title: "Resource Removed", description: `"${resourceBeingRemoved?.title}" has been removed.`, variant: "destructive" });
      setResourceToRemove(null);
    }
  };


  const displayCategorizedResources = useMemo(() => {
    return resources.reduce((acc, resource) => {
      const category = resource.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(resource);
      return acc;
    }, {} as Record<string, Resource[]>);
  }, [resources]);

  const sortedDisplayCategories = useMemo(() => {
    return [...allCategories].sort((a, b) => a.localeCompare(b));
  }, [allCategories]);


  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-2">
        <Button onClick={() => {
          setEditingResource(null);
          resourceForm.reset({ title: "", description: "", link: "", category: "", iconName: "ExternalLink" });
          setIsResourceFormOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Resource
        </Button>
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FolderPlus className="mr-2 h-4 w-4" /> Add New Category
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
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit">Save Category</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit/Add Resource Dialog */}
      <Dialog open={isResourceFormOpen} onOpenChange={(isOpen) => {
        setIsResourceFormOpen(isOpen);
        if (!isOpen) {
          setEditingResource(null);
          resourceForm.reset();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
          </DialogHeader>
          <Form {...resourceForm}>
            <form onSubmit={resourceForm.handleSubmit(handleResourceFormSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
              <FormField control={resourceForm.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input placeholder="Resource Title" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={resourceForm.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Brief description of the resource" {...field} value={field.value || ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={resourceForm.control} name="link" render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL</FormLabel>
                  <FormControl><Input type="url" placeholder="https://example.com/resource" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={resourceForm.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {sortedDisplayCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={resourceForm.control} name="iconName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {iconOptions.map(icon => <SelectItem key={icon.value} value={icon.value}>{icon.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsResourceFormOpen(false)}>Cancel</Button>
                <Button type="submit">{editingResource ? "Save Changes" : "Add Resource"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Remove Resource Confirmation Dialog */}
      <AlertDialog open={!!resourceToRemove} onOpenChange={(isOpen) => !isOpen && setResourceToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource
              "{resources.find(r => r.id === resourceToRemove)?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResourceToRemove(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveResource} className={buttonVariants({ variant: "destructive" })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {sortedDisplayCategories.length > 0 ? (
        sortedDisplayCategories.map((category) => {
          const resourcesForCategory = displayCategorizedResources[category] || [];
          return (
            <section key={category}>
              <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-border">{category}</h2>
              {resourcesForCategory.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resourcesForCategory.map((resource) => (
                    <ResourceCard 
                      key={resource.id} 
                      resource={resource} 
                      onEdit={handleOpenEditResourceDialog}
                      onRemove={() => handleOpenRemoveResourceDialog(resource.id)} // Ensure correct call
                    />
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
            No resource categories or resources available. Add a category and resources to get started.
          </p>
        </div>
      )}
    </div>
  );
}
