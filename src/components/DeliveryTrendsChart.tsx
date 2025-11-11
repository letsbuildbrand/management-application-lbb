"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DeliveryTrendData {
  month: string;
  delivered: number;
  onTime: number;
  delayed: number;
  expected: number;
}

interface DeliveryTrendsChartProps {
  data: DeliveryTrendData[];
}

export const DeliveryTrendsChart: React.FC<DeliveryTrendsChartProps> = ({ data }) => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Monthly Delivery Performance</CardTitle>
        <CardDescription>Comparison of delivered, on-time, and delayed videos.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Bar dataKey="expected" fill="hsl(var(--muted))" name="Expected" />
              <Bar dataKey="delivered" fill="hsl(var(--primary))" name="Delivered" />
              <Bar dataKey="onTime" fill="hsl(var(--success))" name="On Time" />
              <Bar dataKey="delayed" fill="hsl(var(--destructive))" name="Delayed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};