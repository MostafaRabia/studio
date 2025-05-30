import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Megaphone, HelpCircle, Library, ArrowRight } from 'lucide-react';

const features = [
  {
    title: "Employee Directory",
    description: "Find contact information and roles of all employees.",
    href: "/employees",
    icon: Users,
    dataAiHint: "team collaboration",
  },
  {
    title: "Announcements",
    description: "Stay updated with the latest company news.",
    href: "/announcements",
    icon: Megaphone,
    dataAiHint: "communication broadcast",
  },
  {
    title: "AI-Powered FAQ",
    description: "Get instant answers to your HR questions.",
    href: "/faq",
    icon: HelpCircle,
    dataAiHint: "support chatbot",
  },
  {
    title: "Resource Hub",
    description: "Access important documents, policies, and links.",
    href: "/resources",
    icon: Library,
    dataAiHint: "knowledge base",
  },
];

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="HR Dashboard"
      />
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.href} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              <feature.icon className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="text-sm mb-4">{feature.description}</CardDescription>
            </CardContent>
            <CardContent className="pt-0">
               <Link href={feature.href} passHref>
                <Button variant="outline" className="w-full group">
                  Go to {feature.title}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
