
"use client";

import type { Employee } from '@/lib/placeholder-data';
import { employees as initialEmployeesData } from '@/lib/placeholder-data';
import type { NewEmployeeFormValues } from '@/app/employees/new/page'; // Assuming this type is exported
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
      id: Date.now().toString(), // Simple ID generation for prototype
      name: employeeData.name,
      jobTitle: employeeData.position,
      department: employeeData.department || "N/A", // Ensure department is handled
      email: employeeData.email,
      phone: employeeData.phone || employeeData.mobile || "N/A", // Prioritize office phone
      avatarUrl: 'https://placehold.co/100x100.png', // Default avatar
      dataAiHint: 'new profile', // Default AI hint
      // Note: reportsTo and directReports are not part of the base Employee type
      // and are not directly stored on the employee object in this simple context.
      // This context focuses on the list of employees themselves.
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
