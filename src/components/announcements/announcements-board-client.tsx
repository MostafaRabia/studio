
"use client";

import type { Announcement } from '@/lib/placeholder-data';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarDays, User, PlusCircle, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from '@/components/ui/scroll-area'; // Added ScrollArea

interface AnnouncementCardProps {
  announcement: Announcement;
}

function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {announcement.imageUrl && (
        <div className="aspect-[2/1] relative w-full">
          <Image 
            src={announcement.imageUrl} 
            alt={announcement.title} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint={announcement.dataAiHint}
           />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{announcement.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{announcement.content}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 pt-4 border-t">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span>{announcement.author}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          <time dateTime={announcement.date}>
            {format(new Date(announcement.date), 'MMMM d, yyyy')}
          </time>
        </div>
      </CardFooter>
    </Card>
  );
}

const announcementFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }).max(2000),
  author: z.string().min(2, { message: "Author name is required." }).max(50),
  imageFile: z.custom<FileList>().optional(), // For file input
  imageDataUrl: z.string().optional(), // To store the data URI
  dataAiHint: z.string().max(50).optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;


interface AnnouncementsBoardClientProps {
  initialAnnouncements: Announcement[];
}

export function AnnouncementsBoardClient({ initialAnnouncements }: AnnouncementsBoardClientProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "Alice Wonderland", // Pre-filled author
      imageDataUrl: "",
      dataAiHint: "",
    },
  });

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        form.setValue('imageDataUrl', dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      form.setValue('imageDataUrl', '', { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<AnnouncementFormValues> = (data) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      author: data.author,
      date: new Date().toISOString(),
      imageUrl: data.imageDataUrl,
      dataAiHint: data.imageDataUrl ? data.dataAiHint : undefined,
    };

    setAnnouncements(prevAnnouncements => [newAnnouncement, ...prevAnnouncements]);
    toast({
      title: "Announcement Created",
      description: `"${data.title}" has been successfully posted.`,
    });
    setIsDialogOpen(false);
    form.reset({ // Reset form to default values, including pre-filled author
      title: "",
      content: "",
      author: "Alice Wonderland", 
      imageDataUrl: "",
      dataAiHint: "",
    });
    setImagePreview(null);
  };
  
  const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { // Reset form on dialog close
            form.reset({
              title: "",
              content: "",
              author: "Alice Wonderland",
              imageDataUrl: "",
              dataAiHint: "",
            });
            setImagePreview(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-3"> {/* Scrollable area for form fields */}
              <Form {...form}>
                <form 
                  id="announcementFormDialog" // Give form an ID
                  onSubmit={form.handleSubmit(onSubmit)} 
                  className="space-y-4 py-4 pl-1 pr-3" // Adjusted padding
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter announcement title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter announcement details" rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter author's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageFile" 
                    render={({ field: { onChange, value, ...restField } }) => ( 
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <UploadCloud className="mr-2 h-4 w-4 text-muted-foreground" />
                          Optional Image
                        </FormLabel>
                         {imagePreview && (
                          <div className="mt-2 mb-2 relative w-full aspect-[2/1] rounded-md overflow-hidden border">
                            <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" />
                          </div>
                        )}
                        <FormControl>
                           <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              handleImageFileChange(e); 
                              onChange(e.target.files); 
                            }}
                            {...restField}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('imageDataUrl') && (
                    <FormField
                      control={form.control}
                      name="dataAiHint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Hint for Image (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'team meeting' or 'product launch'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </form>
              </Form>
            </div>
            <DialogFooter className="border-t pt-4 mt-auto"> {/* Ensure footer is at the bottom */}
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                type="submit" 
                form="announcementFormDialog" // Associate with the form
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Announcement"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {sortedAnnouncements.length > 0 ? (
        sortedAnnouncements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))
      ) : (
        <p className="text-center text-muted-foreground py-8">No announcements available at this time.</p>
      )}
    </div>
  );
}
