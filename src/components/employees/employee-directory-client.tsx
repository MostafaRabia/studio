
"use client";

import type { Employee } from '@/lib/placeholder-data';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Briefcase, Building, UserCircle, Trash2 } from 'lucide-react';
import { useEmployees } from '@/contexts/employee-context';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface EmployeeCardProps {
  employee: Employee;
  onDeleteRequest: (employee: Employee) => void;
}

function EmployeeCard({ employee, onDeleteRequest }: EmployeeCardProps) {
  const displayAvatarSrc = employee.avatarDataUrl || employee.avatarUrl;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start space-x-4 pb-4">
        <Avatar className="h-16 w-16 flex-shrink-0">
          {displayAvatarSrc ? (
            <AvatarImage src={displayAvatarSrc} alt={employee.name} asChild>
              <Image src={displayAvatarSrc} alt={employee.name} width={64} height={64} data-ai-hint={employee.dataAiHint || 'profile picture'} />
            </AvatarImage>
          ) : null}
          <AvatarFallback>
            <UserCircle className="h-10 w-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow min-w-0"> {/* Added flex-grow and min-w-0 for proper truncation */}
          <Link href={`/employees/${employee.id}`} passHref>
            <CardTitle className="text-xl hover:text-primary hover:underline cursor-pointer transition-colors truncate" title={employee.name}>
              {employee.name}
            </CardTitle>
          </Link>
          <CardDescription className="truncate" title={employee.jobTitle}>{employee.jobTitle}</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click-through if button is over linked area
            onDeleteRequest(employee);
          }}
          aria-label={`Delete ${employee.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>{employee.department}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <a href={`mailto:${employee.email}`} className="hover:text-primary transition-colors truncate" title={employee.email}>
            {employee.email}
          </a>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{employee.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmployeeDirectoryClient() {
  const { employees, deleteEmployee } = useEmployees(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const { toast } = useToast();

  const filteredEmployees = useMemo(() => {
    const employeesToFilter = employees || []; 
    if (!searchTerm) return employeesToFilter;
    return employeesToFilter.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, employees]);

  const handleDeleteRequest = (employee: Employee) => {
    setEmployeeToDelete(employee);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      const { deletedEmployeeName, managersNotified } = deleteEmployee(employeeToDelete.id);
      toast({
        title: "Employee Deleted",
        description: `${deletedEmployeeName || 'The employee'} has been removed from the directory.`,
        variant: "destructive",
      });
      if (managersNotified.length > 0) {
        // You might want to show a different toast or log for manager notifications
        console.log(`Simulated email notifications sent to ${managersNotified.length} manager(s) for ${deletedEmployeeName}.`);
      }
      setEmployeeToDelete(null); // Close the dialog
    }
  };

  return (
    <div className="space-y-6">
      <Input
        type="search"
        placeholder="Search employees by name, title, or department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md text-base"
      />
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} onDeleteRequest={handleDeleteRequest} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          {searchTerm ? "No employees found matching your search." : "No employees in the directory yet."}
        </p>
      )}

      {employeeToDelete && (
        <AlertDialog open={!!employeeToDelete} onOpenChange={(isOpen) => !isOpen && setEmployeeToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this employee?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the profile for 
                <span className="font-semibold"> {employeeToDelete.name}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete} 
                className={cn(Button.defaultProps?.variant === "destructive" ? "" : "bg-destructive hover:bg-destructive/90 text-destructive-foreground")}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
