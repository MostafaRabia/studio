
import type { LucideIcon } from 'lucide-react';
import { FileText, ExternalLink, ShieldCheck, Handshake } from 'lucide-react';
import Image from 'next/image';


export interface Employee {
  id: string;
  name: string;
  avatarUrl?: string;
  department: string;
  jobTitle: string;
  email: string;
  phone: string;
  dataAiHint?: string;

  // Additional fields from the new employee form
  idNumber?: string;
  officeLocation?: string;
  mobile?: string;
  fax?: string;
  reportsTo?: string[]; // Array of employee IDs
  directReports?: string[]; // Array of employee IDs
  hiringDate?: string; // Store as ISO string for consistency
  hiredBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  imageUrl?: string;
  dataAiHint?: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  link: string;
  category: string;
  icon: LucideIcon; // Lucide icon component
  dataAiHint?: string;
}

export const employees: Employee[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    email: 'alice.w@example.com',
    phone: '555-0101',
    idNumber: 'EMP001',
    officeLocation: 'Building A, Floor 1',
    mobile: '555-0201',
    hiringDate: new Date('2022-08-15').toISOString(),
    hiredBy: 'Bob The Builder',
    reportsTo: ['2'], // Bob The Builder's ID
  },
  {
    id: '2',
    name: 'Bob The Builder',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    department: 'Product',
    jobTitle: 'Product Manager',
    email: 'bob.b@example.com',
    phone: '555-0102',
    idNumber: 'EMP002',
    directReports: ['1'], // Alice Wonderland's ID
  },
  {
    id: '3',
    name: 'Carol Danvers',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman smiling',
    department: 'Marketing',
    jobTitle: 'Marketing Lead',
    email: 'carol.d@example.com',
    phone: '555-0103',
    idNumber: 'EMP003',
  },
  {
    id: '4',
    name: 'David Copperfield',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man professional',
    department: 'Sales',
    jobTitle: 'Sales Executive',
    email: 'david.c@example.com',
    phone: '555-0104',
    idNumber: 'EMP004',
  },
    {
    id: '5',
    name: 'Eve Harrington',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman face',
    department: 'Human Resources',
    jobTitle: 'HR Specialist',
    email: 'eve.h@example.com',
    phone: '555-0105',
    idNumber: 'EMP005',
  },
  {
    id: '6',
    name: 'Frank Castle',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man serious',
    department: 'Operations',
    jobTitle: 'Operations Manager',
    email: 'frank.c@example.com',
    phone: '555-0106',
    idNumber: 'EMP006',
  },
];

export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Company Picnic Next Saturday!',
    content: 'Join us for our annual company picnic at Central Park. Food, games, and fun for the whole family! Please RSVP by Wednesday.',
    date: '2024-07-15',
    author: 'HR Department',
    imageUrl: 'https://placehold.co/600x300.png',
    dataAiHint: 'park picnic',
  },
  {
    id: '2',
    title: 'New Q3 Goals Announced',
    content: 'We have set ambitious new goals for the third quarter. Please review the detailed document shared via email and discuss with your team leads.',
    date: '2024-07-10',
    author: 'Management Team',
    imageUrl: 'https://placehold.co/600x300.png',
    dataAiHint: 'business goals',
  },
  {
    id: '3',
    title: 'Welcome to Our New Hires!',
    content: 'Let\'s give a warm welcome to our new team members starting this week: John Doe (Engineering) and Jane Smith (Marketing).',
    date: '2024-07-08',
    author: 'HR Department',
    imageUrl: 'https://placehold.co/600x300.png',
    dataAiHint: 'team welcome',
  },
];

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Employee Handbook',
    description: 'Comprehensive guide to company policies and procedures.',
    link: '#',
    category: 'Company Policies',
    icon: FileText,
    dataAiHint: 'document policy',
  },
  {
    id: '2',
    title: 'Benefits Portal',
    description: 'Access your health insurance, retirement plans, and other benefits.',
    link: '#',
    category: 'Benefits',
    icon: ShieldCheck,
    dataAiHint: 'health benefits',
  },
  {
    id: '3',
    title: 'IT Support Wiki',
    description: 'Find help for common IT issues and request support.',
    link: '#',
    category: 'IT & Support',
    icon: ExternalLink,
    dataAiHint: 'tech support',
  },
  {
    id: '4',
    title: 'Performance Review Guidelines',
    description: 'Information on the performance review process.',
    link: '#',
    category: 'Career Development',
    icon: Handshake,
    dataAiHint: 'career growth',
  },
   {
    id: '5',
    title: 'Code of Conduct',
    description: 'Our principles for ethical behavior and professional conduct.',
    link: '#',
    category: 'Company Policies',
    icon: FileText,
    dataAiHint: 'ethics conduct',
  },
  {
    id: '6',
    title: 'Vacation Request Form',
    description: 'Submit your time-off requests here.',
    link: '#',
    category: 'Benefits',
    icon: ExternalLink,
    dataAiHint: 'travel vacation',
  },
];
