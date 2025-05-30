
"use client";

import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartTooltipContent, type ChartConfig, ChartContainer } from '@/components/ui/chart'; // Assuming ChartContainer is available for styling

// Mock data for the last 12 months
const generateMockData = () => {
  const data = [];
  const currentDate = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    const numEmployees = Math.floor(Math.random() * 20) + 30; // e.g., 30-50 employees
    const baseSalary = 5000 + Math.random() * 1000; // Average base salary
    const totalSalaries = Math.floor(numEmployees * baseSalary * (1 + (Math.random() - 0.5) * 0.2)); // Fluctuate total
    
    // Ensure averageSalary is 0 if numEmployees is 0 (though current logic for numEmployees prevents this)
    const averageSalary = numEmployees > 0 ? Math.floor(totalSalaries / numEmployees) : 0;

    data.push({
      monthYear,
      totalSalaries,
      numEmployees,
      averageSalary,
    });
  }
  return data;
};

const chartData = generateMockData();

const chartConfig = {
  totalSalaries: {
    label: "Total Salaries",
    color: "hsl(var(--chart-1))",
  },
  numEmployees: {
    label: "Number of Employees",
    color: "hsl(var(--chart-2))",
  },
  averageSalary: {
    label: "Average Salary",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function SalaryHeadcountReportPage() {
  return (
    <>
      <PageHeader
        title="Salary & Headcount Report"
        description="Total salaries, number of employees, and average salary over time."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>
            This chart displays total salaries, employee count, and average salary for the past 12 months.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[450px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 50, // Increased bottom margin for legend
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="monthYear"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    angle={-30} // Angle labels for better fit
                    textAnchor="end"
                    height={60} // Allocate space for angled labels
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--chart-1))"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Salary ($)', angle: -90, position: 'insideLeft', offset: -10, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--chart-2))"
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'No. of Employees', angle: 90, position: 'insideRight', offset: -10, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } }}
                  />
                  <Tooltip
                    cursor={true}
                    content={<ChartTooltipContent
                        indicator="line"
                        labelKey="monthYear"
                        formatter={(value, name) => {
                            if (name === 'totalSalaries' || name === 'averageSalary') {
                                return `$${value.toLocaleString()}`;
                            }
                            return value.toString();
                        }}
                    />}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{paddingTop: 20}} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalSalaries"
                    stroke="var(--color-totalSalaries)"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "var(--color-totalSalaries)",
                      strokeWidth: 2,
                    }}
                    name="Total Salaries"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="averageSalary"
                    stroke="var(--color-averageSalary)"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "var(--color-averageSalary)",
                      strokeWidth: 2,
                    }}
                    name="Average Salary"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="numEmployees"
                    stroke="var(--color-numEmployees)"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "var(--color-numEmployees)",
                      strokeWidth: 2,
                    }}
                    name="Number of Employees"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
