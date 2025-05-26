
"use client";

import type { Employee } from '@/lib/placeholder-data';
import { employees as initialEmployeesData } from '@/lib/placeholder-data';
import type { NewEmployeeFormValues } from '@/app/employees/new/page'; 
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employeeData: NewEmployeeFormValues) => void;
  updateEmployee: (id: string, employeeData: NewEmployeeFormValues) => void;
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
    };
    setEmployees((prevEmployees) => [newEmployee, ...prevEmployees]);
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
              avatarDataUrl: employeeData.avatarDataUrl || emp.avatarDataUrl, // Preserve if not changed
              dataAiHint: employeeData.avatarDataUrl ? 'custom profile' : emp.dataAiHint,
              idNumber: employeeData.idNumber,
              officeLocation: employeeData.officeLocation,
              mobile: employeeData.mobile,
              fax: employeeData.fax,
              reportsTo: employeeData.reportsTo,
              directReports: employeeData.directReports,
              hiringDate: employeeData.hiringDate ? new Date(employeeData.hiringDate).toISOString() : emp.hiringDate,
              hiredBy: employeeData.hiredBy,
            }
          : emp
      )
    );
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee }}>
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
