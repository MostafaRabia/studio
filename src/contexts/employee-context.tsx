
"use client";

import type { Employee, Attachment } from '@/lib/placeholder-data';
import { employees as initialEmployeesData } from '@/lib/placeholder-data';
import type { NewEmployeeFormValues } from '@/app/employees/new/page'; 
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employeeData: NewEmployeeFormValues) => void;
  updateEmployee: (id: string, employeeData: NewEmployeeFormValues) => void;
  deleteEmployee: (id: string) => { deletedEmployeeName: string | undefined; managersNotified: Array<{ name: string; email: string }> };
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployeesData);

  const addEmployee = (employeeData: NewEmployeeFormValues) => {
    const newEmployee: Employee = {
      id: Date.now().toString(), 
      name: employeeData.name,
      jobTitle: employeeData.position,
      department: employeeData.department || "N/A",
      email: employeeData.email,
      phone: employeeData.phone || "N/A",
      avatarDataUrl: employeeData.avatarDataUrl, 
      dataAiHint: employeeData.avatarDataUrl ? 'custom profile' : 'new profile', 
      
      idNumber: employeeData.idNumber,
      officeLocation: employeeData.officeLocation,
      mobile: employeeData.mobile,
      fax: employeeData.fax,
      reportsTo: employeeData.reportsTo,
      directReports: employeeData.directReports,
      hiringDate: employeeData.hiringDate ? new Date(employeeData.hiringDate).toISOString() : undefined,
      hiredBy: employeeData.hiredBy,
      attachments: employeeData.attachments || [],
      jobDescription: employeeData.jobDescription || "",
    };
    setEmployees((prevEmployees) => {
      const updatedEmployees = [newEmployee, ...prevEmployees];
      
      if (newEmployee.reportsTo && newEmployee.reportsTo.length > 0) {
        console.log(`Simulating notifications for new employee: ${newEmployee.name}`);
        newEmployee.reportsTo.forEach(managerId => {
          const manager = updatedEmployees.find(emp => emp.id === managerId);
          if (manager) {
            console.log(`--> Would send email notification to manager: ${manager.name} (${manager.email}) about new team member ${newEmployee.name}.`);
          } else {
            console.log(`--> Could not find manager with ID: ${managerId} to notify about new team member ${newEmployee.name}.`);
          }
        });
      }
      return updatedEmployees;
    });
  };

  const updateEmployee = (id: string, employeeData: NewEmployeeFormValues) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              name: employeeData.name,
              jobTitle: employeeData.position,
              department: employeeData.department || emp.department,
              email: employeeData.email,
              phone: employeeData.phone || emp.phone,
              avatarDataUrl: employeeData.avatarDataUrl || emp.avatarDataUrl, 
              dataAiHint: employeeData.avatarDataUrl ? 'custom profile' : emp.dataAiHint,
              idNumber: employeeData.idNumber,
              officeLocation: employeeData.officeLocation,
              mobile: employeeData.mobile,
              fax: employeeData.fax,
              reportsTo: employeeData.reportsTo,
              directReports: employeeData.directReports,
              hiringDate: employeeData.hiringDate ? new Date(employeeData.hiringDate).toISOString() : emp.hiringDate,
              hiredBy: employeeData.hiredBy,
              attachments: employeeData.attachments || emp.attachments || [],
              jobDescription: employeeData.jobDescription || emp.jobDescription,
            }
          : emp
      )
    );
  };

  const deleteEmployee = (id: string) => {
    const employeeToDelete = employees.find(emp => emp.id === id);
    const managersNotified: Array<{ name: string; email: string }> = [];

    if (employeeToDelete) {
      if (employeeToDelete.reportsTo && employeeToDelete.reportsTo.length > 0) {
        console.log(`Simulating notifications for deletion of employee: ${employeeToDelete.name}`);
        employeeToDelete.reportsTo.forEach(managerId => {
          const manager = employees.find(emp => emp.id === managerId && emp.id !== id); // Ensure manager is not the employee themselves
          if (manager && manager.email) {
            managersNotified.push({ name: manager.name, email: manager.email });
            console.log(`--> Would send email notification to manager: ${manager.name} (${manager.email}) about the departure/deletion of ${employeeToDelete.name}.`);
          } else {
            console.log(`--> Could not find manager with ID: ${managerId} (or manager has no email) to notify about deletion of ${employeeToDelete.name}.`);
          }
        });
      }
    }

    setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));
    return { deletedEmployeeName: employeeToDelete?.name, managersNotified };
  };


  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
}
