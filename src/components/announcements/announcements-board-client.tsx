"use client";

import type { Announcement } from '@/lib/placeholder-data';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CalendarDays, User } from 'lucide-react';
import { format } from 'date-fns';

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


interface AnnouncementsBoardClientProps {
  initialAnnouncements: Announcement[];
}

export function AnnouncementsBoardClient({ initialAnnouncements }: AnnouncementsBoardClientProps) {
  // Sort announcements by date, newest first
  const sortedAnnouncements = [...initialAnnouncements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
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
