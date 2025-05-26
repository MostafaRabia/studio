
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEmployees } from '@/contexts/employee-context';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { 
  Mail, Phone, Briefcase, Building, UserCircle, ArrowLeft, Fingerprint, 
  Smartphone, Printer, Users, UserCheck, CalendarDays, UserCog, Edit, Paperclip, FileText, Download
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { Attachment } from '@/lib/placeholder-data';

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value?: string | React.ReactNode;
  isLink?: boolean;
  href?: string;
}

function DetailItem({ icon: Icon, label, value, isLink, href }: DetailItemProps) {
  if (!value && typeof value !== 'number' && typeof value !== 'boolean') return null;

  const content = isLink && href ? (
    <a href={href} className="hover:text-primary hover:underline transition-colors break-all">
      {value}
    </a>
  ) : (
    <span className="break-all">{value}</span>
  );

  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-base">{content}</p>
      </div>
    </div>
  );
}

function AttachmentItem({ attachment }: { attachment: Attachment }) {
  return (
    <li className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">{attachment.name}</span>
        <Badge variant="outline" className="text-xs">{(attachment.size / 1024).toFixed(1)} KB</Badge>
      </div>
      <a href={attachment.dataUrl} download={attachment.name}>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </a>
    </li>
  );
}


export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { employees } = useEmployees();

  const employee = employees.find(emp => emp.id === id);

  if (!employee) {
    return (
      <>
        <PageHeader title="Employee Not Found" description="Could not find an employee with this ID." />
        <div className="text-center">
          <p className="text-muted-foreground mb-4">The employee you are looking for does not exist or may have been removed.</p>
          <Link href="/employees" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </>
    );
  }

  const getEmployeeNameById = (empId: string) => {
    const foundEmp = employees.find(e => e.id === empId);
    return foundEmp ? foundEmp.name : 'Unknown Employee';
  };

  const reportsToNames = employee.reportsTo?.map(getEmployeeNameById).join(', ');
  const directReportsNames = employee.directReports?.map(getEmployeeNameById).join(', ');

  const displayAvatarSrc = employee.avatarDataUrl || employee.avatarUrl;

  return (
    <>
      <PageHeader 
        title={employee.name} 
        description={employee.jobTitle}
        actions={
          <div className="flex gap-2">
            <Link href={`/employees/${id}/edit`} passHref>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
            <Link href="/employees" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-lg">
          <CardHeader className="items-center text-center">
            <Avatar className="h-32 w-32 mb-4">
              {displayAvatarSrc ? (
                <AvatarImage src={displayAvatarSrc} alt={employee.name} asChild>
                  <Image src={displayAvatarSrc} alt={employee.name} width={128} height={128} data-ai-hint={employee.dataAiHint || 'profile picture'} />
                </AvatarImage>
              ) : null}
              <AvatarFallback>
                <UserCircle className="h-20 w-20 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{employee.name}</CardTitle>
            <CardDescription>{employee.jobTitle}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             <Badge variant="secondary">{employee.department}</Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Employee Details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            <DetailItem icon={Fingerprint} label="ID Number" value={employee.idNumber} />
            <DetailItem icon={Mail} label="Email" value={employee.email} isLink href={`mailto:${employee.email}`} />
            <DetailItem icon={Phone} label="Office Phone" value={employee.phone} />
            <DetailItem icon={Smartphone} label="Mobile Number" value={employee.mobile} />
            <DetailItem icon={Printer} label="Fax Number" value={employee.fax} />
            <DetailItem icon={Building} label="Office Location" value={employee.officeLocation} />
            {employee.hiringDate && (
              <DetailItem icon={CalendarDays} label="Hiring Date" value={format(new Date(employee.hiringDate), 'PPP')} />
            )}
            <DetailItem icon={UserCog} label="Hired By" value={employee.hiredBy} />
            {reportsToNames && (
               <DetailItem icon={Users} label="Reports To" value={reportsToNames} />
            )}
            {directReportsNames && (
               <DetailItem icon={UserCheck} label="Direct Reports" value={directReportsNames} />
            )}
          </CardContent>
        </Card>

        {employee.attachments && employee.attachments.length > 0 && (
          <Card className="md:col-span-3 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Paperclip className="mr-2 h-5 w-5" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {employee.attachments.map((att) => (
                  <AttachmentItem key={att.id} attachment={att} />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
