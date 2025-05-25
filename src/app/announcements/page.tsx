import { PageHeader } from '@/components/page-header';
import { AnnouncementsBoardClient } from '@/components/announcements/announcements-board-client';
import { announcements } from '@/lib/placeholder-data';

export default function AnnouncementsPage() {
  return (
    <>
      <PageHeader
        title="Company Announcements"
        description="Stay up-to-date with the latest news and updates."
      />
      <AnnouncementsBoardClient initialAnnouncements={announcements} />
    </>
  );
}
