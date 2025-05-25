import { PageHeader } from '@/components/page-header';
import { AiFaqClient } from '@/components/faq/ai-faq-client';

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="AI-Powered FAQ"
        description="Ask our AI assistant your HR-related questions."
      />
      <AiFaqClient />
    </>
  );
}
