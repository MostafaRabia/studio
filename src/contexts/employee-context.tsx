
"use client";

import type { Employee } from '@/lib/placeholder-data';
import { employees as initialEmployeesData } from '@/lib/placeholder-data';
import type { NewEmployeeFormValues } from '@/app/employees/new/page'; 
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employeeData: NewEmployeeFormValues) => void;
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
      phone: employeeData.phone || "N/A", // Keep office phone primarily
      avatarUrl: 'https://placehold.co/100x100.png', 
      dataAiHint: 'new profile', 
      
      // Adding all new fields from the form
      idNumber: employeeData.idNumber,
      officeLocation: employeeData.officeLocation,
      mobile: employeeData.mobile,
      fax: employeeData.fax,
      reportsTo: employeeData.reportsTo,
      directReports: employeeData.directReports,
      hiringDate: employeeData.hiringDate ? new Date(employeeData.hiringDate).toISOString() : undefined,
      hiredBy: employeeData.hiredBy,
    };
    setEmployees((prevEmployees) => [newEmployee, ...prevEmployees]);
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee }}>
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
