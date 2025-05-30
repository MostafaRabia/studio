
"use client";

import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SalariesPage() {
  return (
    <>
      <PageHeader
        title="Salaries"
        description="Manage and view employee salary information."
      />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Monthly Salary History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="mt-4 shadow-lg">
            <CardHeader>
              <CardTitle>Salary Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
                <p className="text-muted-foreground text-center">
                  General salary management features will be implemented here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card className="mt-4 shadow-lg">
            <CardHeader>
              <CardTitle>Monthly Salary History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-md">
                <p className="text-muted-foreground text-center">
                  Employee monthly salary history will be displayed here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
