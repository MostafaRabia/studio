
"use client";

import type { Resource, Attachment } from '@/lib/placeholder-data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ExternalLink, PlusCircle, FolderPlus, FileText, ShieldCheck, Handshake, type LucideIcon, Pencil, Trash2, BookOpen, Info, Folder, Link as LinkIconLucide, Paperclip, X } from 'lucide-react';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSearchParams, useRouter } from 'next/navigation';

const iconOptions = [
  { value: 'FileText', label: 'File Text' },
  { value: 'ExternalLink', label: 'External Link' },
  { value: 'ShieldCheck', label: 'Shield Check' },
  { value: 'Handshake', label: 'Handshake' },
  { value: 'BookOpen', label: 'Book Open' },
  { value: 'LinkIconLucide', label: 'Link Icon' },
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
    case 'LinkIconLucide': return LinkIconLucide;
    case 'Folder': return Folder;
    case 'Info': return Info;
    default: return ExternalLink;
  }
};

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onRemoveRequest: (resourceId: string) => void;
}

function ResourceCard({ resource, onEdit, onRemoveRequest }: ResourceCardProps) {
  const IconComponent = getIconComponent(resource.iconName);
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <Link href={`/resources/${resource.id}`} passHref legacyBehavior>
        <a className="flex flex-col flex-grow focus:outline-none focus:ring-2 focus:ring-ring rounded-t-lg group cursor-pointer">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4 group-hover:bg-accent/50 transition-colors">
            <div className="bg-primary/10 p-3 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{resource.title}</CardTitle>
               {resource.description && (
                <CardDescription className="text-xs mt-1 line-clamp-2">
                  {resource.description}
                </CardDescription>
              )}
            </div>
          </CardHeader>
        </a>
      </Link>
      <CardFooter className="pt-4 border-t">
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => onEdit(resource)}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onRemoveRequest(resource.id)}>
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

const attachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  dataUrl: z.string(),
  size: z.number(),
});

const resourceFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().max(200).optional(),
  link: z.string().url("Please enter a valid URL for external links.").optional().or(z.literal('')),
  category: z.string().min(1, "Category is required."),
  iconName: z.string().min(1, "Icon is required."),
  internalText: z.string().optional(),
  textAttachmentFile: z.custom<FileList>().optional(),
  textAttachment: attachmentSchema.optional(), 
}).refine(data => !!data.link || !!data.internalText || !!data.textAttachment, {
  message: "Either an external link, internal text content, or an attachment is required.",
  path: ["link"], 
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ResourceHubClientProps {
  initialResources: Resource[];
}

export function ResourceHubClient({ initialResources }: ResourceHubClientProps) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  // Filter out resource with ID '7' from the initial display
  const [resources, setResources] = useState<Resource[]>(initialResources.filter(r => r.id !== '7'));
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [resourceToRemove, setResourceToRemove] = useState<string | null>(null);
  const [textAttachmentPreview, setTextAttachmentPreview] = useState<{ name: string; size: number; type: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);


  const derivedCategories = useMemo(() => {
    const categoriesSet = new Set(resources.map(r => r.category || 'Other'));
    return Array.from(categoriesSet);
  }, [resources]);

  const [allCategories, setAllCategories] = useState<string[]>(derivedCategories);

  useEffect(() => {
    const newDerivedCategories = Array.from(new Set([...resources.map(r => r.category || 'Other'), ...allCategories])).filter(Boolean);
    setAllCategories(newDerivedCategories.sort((a, b) => a.localeCompare(b)));
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
      internalText: "",
      textAttachment: undefined,
    },
  });

  useEffect(() => {
    const editResourceId = searchParams.get('edit');
    const deleteResourceId = searchParams.get('delete');

    if (editResourceId && editResourceId !== '7') { // Ensure we don't try to edit '7' this way
      const resourceToEdit = resources.find(r => r.id === editResourceId);
      if (resourceToEdit) {
        handleOpenEditResourceDialog(resourceToEdit);
      }
      router.replace('/resources', { scroll: false }); 
    } else if (deleteResourceId && deleteResourceId !== '7') { // Ensure we don't try to delete '7' this way
      handleOpenRemoveResourceDialog(deleteResourceId);
      router.replace('/resources', { scroll: false }); 
    }
  }, [searchParams, resources, router]); 


  const handleTextAttachmentFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({ title: "File too large", description: `${file.name} exceeds 5MB limit.`, variant: "destructive" });
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          dataUrl: reader.result as string,
          size: file.size,
        };
        resourceForm.setValue('textAttachment', newAttachment, { shouldValidate: true });
        setTextAttachmentPreview({ name: file.name, size: file.size, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTextAttachment = () => {
    resourceForm.setValue('textAttachment', undefined, { shouldValidate: true });
    resourceForm.setValue('textAttachmentFile', undefined);
    setTextAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };


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
      link: resource.link || "",
      category: resource.category,
      iconName: resource.iconName,
      internalText: resource.internalText || "",
      textAttachment: resource.textAttachment,
    });
    if (resource.textAttachment) {
      setTextAttachmentPreview({ name: resource.textAttachment.name, size: resource.textAttachment.size, type: resource.textAttachment.type });
    } else {
      setTextAttachmentPreview(null);
    }
    setIsResourceFormOpen(true);
  };

  const handleResourceFormSubmit: SubmitHandler<ResourceFormValues> = (data) => {
    const processedData: Partial<Resource> = {
      ...data,
      link: data.link || undefined, 
      internalText: data.internalText || undefined,
      textAttachment: data.textAttachment,
    };
    
    if (editingResource) {
      setResources(prev => prev.map(r => r.id === editingResource.id ? { ...r, ...processedData, id: editingResource.id } as Resource : r));
      toast({ title: "Resource Updated", description: `"${data.title}" has been updated.` });
    } else {
      const newResource: Resource = {
        id: Date.now().toString(),
        ...processedData,
        title: data.title,
        category: data.category,
        iconName: data.iconName,
      };
      setResources(prev => [newResource, ...prev]);
      toast({ title: "Resource Added", description: `"${data.title}" has been added.` });
    }
    setIsResourceFormOpen(false);
    setEditingResource(null);
    resourceForm.reset({ title: "", description: "", link: "", category: "", iconName: "ExternalLink", internalText: "", textAttachment: undefined });
    setTextAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          resourceForm.reset({ title: "", description: "", link: "", category: sortedDisplayCategories[0] || "", iconName: "ExternalLink", internalText: "", textAttachment: undefined });
          setTextAttachmentPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
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

      <Dialog open={isResourceFormOpen} onOpenChange={(isOpen) => {
        setIsResourceFormOpen(isOpen);
        if (!isOpen) {
          setEditingResource(null);
          resourceForm.reset();
          setTextAttachmentPreview(null);
           if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }}>
        <DialogContent className="sm:max-w-lg">
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
              <FormField control={resourceForm.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || (sortedDisplayCategories[0] || "")} >
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
              
              <div className="my-4 border-t pt-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Content Type (provide at least one source)</h3>
                 <FormField control={resourceForm.control} name="internalText" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internal Text Content</FormLabel>
                    <FormControl><Textarea placeholder="Enter text content for this resource..." rows={5} {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>

                <FormField
                  control={resourceForm.control}
                  name="textAttachmentFile" 
                  render={() => ( 
                    <FormItem className="mt-4">
                      <FormLabel className="flex items-center">
                        <Paperclip className="mr-2 h-4 w-4 text-muted-foreground" />
                        Attach File to Internal Text (Optional)
                      </FormLabel>
                      {!textAttachmentPreview && !resourceForm.getValues('textAttachment') && (
                        <FormControl>
                          <Input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleTextAttachmentFileChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(textAttachmentPreview || resourceForm.getValues('textAttachment')) && (
                  <div className="mt-2 p-2 border rounded-md bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate max-w-xs" title={textAttachmentPreview?.name || resourceForm.getValues('textAttachment')?.name}>
                          {textAttachmentPreview?.name || resourceForm.getValues('textAttachment')?.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {((textAttachmentPreview?.size || resourceForm.getValues('textAttachment')?.size || 0) / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={removeTextAttachment} className="h-6 w-6">
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="my-4 border-t pt-4">
                <FormField control={resourceForm.control} name="link" render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Link URL (Optional)</FormLabel>
                    <FormControl><Input type="url" placeholder="https://example.com/resource" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsResourceFormOpen(false)}>Cancel</Button>
                <Button type="submit">{editingResource ? "Save Changes" : "Add Resource"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction onClick={confirmRemoveResource} className={cn(buttonVariants({ variant: "destructive" }))}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {sortedDisplayCategories.length > 0 ? (
        sortedDisplayCategories.map((category) => {
          const resourcesForCategory = displayCategorizedResources[category] || [];
          // Skip rendering the category if it's empty (e.g., after filtering or deletion)
          if (resourcesForCategory.length === 0 && !allCategories.includes(category)) {
            return null;
          }
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
                      onRemoveRequest={() => handleOpenRemoveResourceDialog(resource.id)}
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

