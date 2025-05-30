
import type { LucideIcon } from 'lucide-react';
import { FileText, ExternalLink, ShieldCheck, Handshake, BookOpen } from 'lucide-react';
import Image from 'next/image';

export interface Attachment {
  id: string; // Unique ID for the attachment
  name: string;
  type: string; // MIME type
  dataUrl: string;
  size: number; // size in bytes
}

export interface Employee {
  id: string;
  name: string;
  avatarUrl?: string; // For initial placeholder images
  avatarDataUrl?: string; // For user-uploaded images (data URI)
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
  attachments?: Attachment[];
  jobDescription?: string; // New field
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
  link?: string; // Made optional
  category: string;
  iconName: string; // Changed from LucideIcon to string
  dataAiHint?: string;
  internalText?: string; // New field for internal text content
  textAttachment?: Attachment; // New field for attachment related to internal text
}

export const employees: Employee[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    avatarUrl: 'https://placehold.co/128x128.png',
    avatarDataUrl: 'https://placehold.co/128x128.png',
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
    attachments: [],
    jobDescription: 'Develops and maintains software applications. Collaborates with the product team to define new features and ensure technical feasibility. Writes clean, scalable, and well-documented code. Participates in code reviews and contributes to a high-quality codebase.',
  },
  {
    id: '2',
    name: 'Bob The Builder',
    avatarUrl: 'https://placehold.co/128x128.png',
    avatarDataUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'man portrait',
    department: 'Product',
    jobTitle: 'Product Manager',
    email: 'bob.b@example.com',
    phone: '555-0102',
    idNumber: 'EMP002',
    directReports: ['1'], // Alice Wonderland's ID
    attachments: [],
    jobDescription: 'Defines product vision, strategy, and roadmap. Gathers and prioritizes product and customer requirements. Works closely with engineering, sales, marketing, and support to ensure revenue and customer satisfaction goals are met.',
  },
  {
    id: '3',
    name: 'Carol Danvers',
    avatarUrl: 'https://placehold.co/128x128.png',
    avatarDataUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'woman smiling',
    department: 'Marketing',
    jobTitle: 'Marketing Lead',
    email: 'carol.d@example.com',
    phone: '555-0103',
    idNumber: 'EMP003',
    attachments: [],
    jobDescription: 'Leads the marketing team in developing and executing marketing strategies. Manages campaigns, branding, and public relations.',
  },
  {
    id: '4',
    name: 'David Copperfield',
    avatarUrl: 'https://placehold.co/128x128.png',
    avatarDataUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'man professional',
    department: 'Sales',
    jobTitle: 'Sales Executive',
    email: 'david.c@example.com',
    phone: '555-0104',
    idNumber: 'EMP004',
    attachments: [],
    jobDescription: 'Drives sales and manages client accounts. Identifies new business opportunities and builds strong customer relationships.',
  },
    {
    id: '5',
    name: 'Eve Harrington',
    avatarUrl: 'https://placehold.co/128x128.png',
    avatarDataUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'woman face',
    department: 'Human Resources',
    jobTitle: 'HR Specialist',
    email: 'eve.h@example.com',
    phone: '555-0105',
    idNumber: 'EMP005',
    attachments: [],
    jobDescription: 'Manages recruitment, employee relations, benefits administration, and HR policies. Ensures compliance with labor laws.',
  },
  {
    id: '6',
    name: 'Frank Castle',
    avatarUrl: 'https://placehold.co/128x128.png',
    avatarDataUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'man serious',
    department: 'Operations',
    jobTitle: 'Operations Manager',
    email: 'frank.c@example.com',
    phone: '555-0106',
    idNumber: 'EMP006',
    attachments: [],
    jobDescription: 'Oversees daily operations, supply chain management, and process optimization. Ensures operational efficiency and quality standards.',
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
    category: 'Company Policies',
    iconName: 'FileText', // Changed from component to string
    dataAiHint: 'document policy',
    internalText: 'This is the main employee handbook. Please read it carefully. It covers topics such as code of conduct, leave policies, and more.',
  },
  {
    id: '2',
    title: 'Benefits Portal',
    description: 'Access your health insurance, retirement plans, and other benefits.',
    link: 'https://example.com/benefits', // Example external link
    category: 'Benefits',
    iconName: 'ShieldCheck', // Changed from component to string
    dataAiHint: 'health benefits',
  },
  {
    id: '3',
    title: 'IT Support Wiki',
    description: 'Find help for common IT issues and request support.',
    link: 'https://example.com/it-support', // Example external link
    category: 'IT & Support',
    iconName: 'ExternalLink', // Changed from component to string
    dataAiHint: 'tech support',
  },
  {
    id: '4',
    title: 'Performance Review Guidelines',
    description: 'Information on the performance review process.',
    category: 'Career Development',
    iconName: 'Handshake', // Changed from component to string
    dataAiHint: 'career growth',
    internalText: 'The annual performance review cycle begins on November 1st. Ensure all self-assessments are submitted by October 15th. Manager reviews are due by November 15th.',
  },
   {
    id: '5',
    title: 'Code of Conduct',
    description: 'Our principles for ethical behavior and professional conduct.',
    category: 'Company Policies',
    iconName: 'BookOpen', // Changed from component to string
    dataAiHint: 'ethics conduct',
    internalText: 'All employees are expected to adhere to the highest standards of professional conduct. This includes treating colleagues with respect, maintaining confidentiality, and avoiding conflicts of interest. Please refer to the full document for detailed guidelines.',
  },
  {
    id: '6',
    title: 'Vacation Request Portal',
    description: 'Submit your time-off requests here using the external portal.',
    link: 'https://example.com/vacation-request', // Clearly an external link
    category: 'Benefits',
    iconName: 'ExternalLink', // Changed from component to string
    dataAiHint: 'travel vacation',
  },
  {
    id: '7',
    title: 'Employee Rules',
    description: 'Key rules and regulations all employees must follow.',
    category: 'Company Policies',
    iconName: 'FileText',
    dataAiHint: 'rules regulations',
    internalText: '', // Content removed as per request
  },
];

