"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { mockClients, Client, Video } from "@/data/mockData";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { ClientSatisfactionChart } from "@/components/ClientSatisfactionChart";
import { DeliveryTrendsChart } from "@/components/DeliveryTrendsChart";
import { ClientStatusOverview } from "@/components/ClientStatusOverview";
import {
  Gauge,
  Users,
  CalendarCheck,
  Clock,
  TrendingUp,
  Star,
  Package,
  Hourglass,
  CalendarDays,
} from "lucide-react";
import { format, parseISO, getMonth, getYear, isBefore, isAfter, addMonths } from "date-fns";

const AnalyticsDashboardPage = () => {
  const [clients, setClients] = useState<Client[]>(mockClients); // Using mockClients for now, will integrate Supabase later
  const [kpis, setKpis] = useState({
    totalDeliveries: 0,
    avgSatisfaction: 0,
    onTimeDeliveryRate: 0,
    activeClients: 0,
    onHoldClients: 0,
    archivedClients: 0,
    totalClients: 0,
    deliveriesThisMonth: 0,
    expectedDeliveriesThisMonth: 0,
    deliveriesLastMonth: 0,
    expectedDeliveriesLastMonth: 0,
  });
  const [satisfactionChartData, setSatisfactionChartData] = useState<
    { month: string; rating: number }[]
  >([]);
  const [deliveryChartData, setDeliveryChartData] = useState<
    { month: string; delivered: number; onTime: number; delayed: number; expected: number }[]
  >([]);

  useEffect(() => {
    const calculateAnalytics = () => {
      let totalDeliveries = 0;
      let totalSatisfaction = 0;
      let ratedDeliveries = 0;
      let onTimeDeliveries = 0;
      let totalCompletedDeliveries = 0;
      let totalDelayedDeliveries = 0;

      const now = new Date();
      const currentMonth = getMonth(now);
      const currentYear = getYear(now);
      const lastMonth = getMonth(addMonths(now, -1));
      const lastMonthYear = getYear(addMonths(now, -1));

      let deliveriesThisMonth = 0;
      let expectedDeliveriesThisMonth = 0;
      let deliveriesLastMonth = 0;
      let expectedDeliveriesLastMonth = 0;

      const monthlyDeliveryData: {
        [key: string]: {
          delivered: number;
          onTime: number;
          delayed: number;
          expected: number;
        };
      } = {};
      const monthlySatisfactionData: { [key: string]: { sum: number; count: number } } = {};

      const activeClients = clients.filter((c) => c.status === "Active").length;
      const onHoldClients = clients.filter((c) => c.status === "On Hold").length;
      const archivedClients = clients.filter((c) => c.status === "Archived").length;
      const totalClients = clients.length;

      clients.forEach((client) => {
        client.videos.forEach((video) => {
          if (video.delivery_timestamp) { // Use delivery_timestamp for actual delivery
            totalDeliveries++;
            totalCompletedDeliveries++;

            const actualDate = parseISO(video.delivery_timestamp);
            const deadlineDate = parseISO(video.adjusted_deadline_timestamp || video.initial_deadline_timestamp);
            const deliveryMonth = getMonth(actualDate);
            const deliveryYear = getYear(actualDate);
            const monthKey = format(actualDate, "MMM yy");

            if (!monthlyDeliveryData[monthKey]) {
              monthlyDeliveryData[monthKey] = { delivered: 0, onTime: 0, delayed: 0, expected: 0 };
            }
            monthlyDeliveryData[monthKey].delivered++;

            if (isBefore(actualDate, deadlineDate) || actualDate.toDateString() === deadlineDate.toDateString()) {
              onTimeDeliveries++;
              monthlyDeliveryData[monthKey].onTime++;
            } else {
              totalDelayedDeliveries++;
              monthlyDeliveryData[monthKey].delayed++;
            }

            if (deliveryMonth === currentMonth && deliveryYear === currentYear) {
              deliveriesThisMonth++;
            }
            if (deliveryMonth === lastMonth && deliveryYear === lastMonthYear) {
              deliveriesLastMonth++;
            }
          }

          // Calculate expected deliveries for current and last month
          if (video.current_status !== "Completed" && video.current_status !== "Approved") {
            const expectedDate = parseISO(video.adjusted_deadline_timestamp || video.initial_deadline_timestamp);
            const expectedMonth = getMonth(expectedDate);
            const expectedYear = getYear(expectedDate);

            if (expectedMonth === currentMonth && expectedYear === currentYear) {
              expectedDeliveriesThisMonth++;
            }
            if (expectedMonth === lastMonth && expectedYear === lastMonthYear) {
              expectedDeliveriesLastMonth++;
            }
          }

          if (video.satisfactionRating !== undefined) {
            totalSatisfaction += video.satisfactionRating;
            ratedDeliveries++;
          }
        });

        client.satisfactionRatings?.forEach((rating) => {
          if (!monthlySatisfactionData[rating.month]) {
            monthlySatisfactionData[rating.month] = { sum: 0, count: 0 };
          }
          monthlySatisfactionData[rating.month].sum += rating.rating;
          monthlySatisfactionData[rating.month].count++;
        });
      });

      const avgSatisfaction = ratedDeliveries > 0 ? totalSatisfaction / ratedDeliveries : 0;
      const onTimeDeliveryRate =
        totalCompletedDeliveries > 0
          ? (onTimeDeliveries / totalCompletedDeliveries) * 100
          : 0;

      // Prepare satisfaction chart data
      const sortedSatisfactionMonths = Object.keys(monthlySatisfactionData).sort((a, b) => {
        const dateA = parseISO(`01 ${a}`); // Assuming 'MMM yy' format
        const dateB = parseISO(`01 ${b}`);
        return isBefore(dateA, dateB) ? -1 : 1;
      });
      const formattedSatisfactionData = sortedSatisfactionMonths.map((month) => ({
        month,
        rating: monthlySatisfactionData[month].sum / monthlySatisfactionData[month].count,
      }));

      // Prepare delivery chart data
      const allMonths = new Set<string>();
      clients.forEach(client => {
        client.videos.forEach(video => {
          if (video.delivery_timestamp) {
            allMonths.add(format(parseISO(video.delivery_timestamp), "MMM yy"));
          }
          if (video.adjusted_deadline_timestamp || video.initial_deadline_timestamp) {
            allMonths.add(format(parseISO(video.adjusted_deadline_timestamp || video.initial_deadline_timestamp), "MMM yy"));
          }
        });
        client.satisfactionRatings?.forEach(rating => allMonths.add(rating.month));
      });

      // Add current and last month if not present
      allMonths.add(format(now, "MMM yy"));
      allMonths.add(format(addMonths(now, -1), "MMM yy"));

      const sortedMonths = Array.from(allMonths).sort((a, b) => {
        const dateA = parseISO(`01 ${a}`);
        const dateB = parseISO(`01 ${b}`);
        return isBefore(dateA, dateB) ? -1 : 1;
      });

      const formattedDeliveryData = sortedMonths.map((month) => {
        let monthExpected = 0;
        clients.forEach(client => {
          client.videos.forEach(video => {
            if (video.current_status !== "Completed" && video.current_status !== "Approved") {
              const expectedDeadline = video.adjusted_deadline_timestamp || video.initial_deadline_timestamp;
              if (expectedDeadline) {
                const expectedMonthKey = format(parseISO(expectedDeadline), "MMM yy");
                if (expectedMonthKey === month) {
                  monthExpected++;
                }
              }
            }
          });
        });

        return {
          month,
          delivered: monthlyDeliveryData[month]?.delivered || 0,
          onTime: monthlyDeliveryData[month]?.onTime || 0,
          delayed: monthlyDeliveryData[month]?.delayed || 0,
          expected: monthExpected,
        };
      });


      setKpis({
        totalDeliveries,
        avgSatisfaction,
        onTimeDeliveryRate,
        activeClients,
        onHoldClients,
        archivedClients,
        totalClients,
        deliveriesThisMonth,
        expectedDeliveriesThisMonth,
        deliveriesLastMonth,
        expectedDeliveriesLastMonth,
      });
      setSatisfactionChartData(formattedSatisfactionData);
      setDeliveryChartData(formattedDeliveryData);
    };

    calculateAnalytics();
  }, [clients]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 mt-16">
        <div className="max-w-screen-2xl mx-auto">
          <WelcomeHeader userName="Yadish" />
          <h1 className="text-3xl font-bold tracking-tight mb-8 text-left px-4">Analytics Dashboard</h1>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4">
            <AnalyticsCard
              title="Total Deliveries"
              value={kpis.totalDeliveries}
              description="All videos delivered to clients"
              icon={<Package className="h-5 w-5 text-muted-foreground" />}
            />
            <AnalyticsCard
              title="Avg. Client Satisfaction"
              value={kpis.avgSatisfaction.toFixed(1)}
              description="Based on client ratings (1-5)"
              icon={<Star className="h-5 w-5 text-yellow-500" />}
            />
            <AnalyticsCard
              title="On-Time Delivery Rate"
              value={`${kpis.onTimeDeliveryRate.toFixed(1)}%`}
              description="Projects delivered by deadline"
              icon={<CalendarCheck className="h-5 w-5 text-green-500" />}
            />
            <AnalyticsCard
              title="Active Clients"
              value={kpis.activeClients}
              description="Clients with ongoing projects"
              icon={<Users className="h-5 w-5 text-primary" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4">
            <AnalyticsCard
              title="Deliveries This Month"
              value={kpis.deliveriesThisMonth}
              description={`Expected: ${kpis.expectedDeliveriesThisMonth}`}
              icon={<CalendarDays className="h-5 w-5 text-muted-foreground" />}
            />
            <AnalyticsCard
              title="Deliveries Last Month"
              value={kpis.deliveriesLastMonth}
              description={`Expected: ${kpis.expectedDeliveriesLastMonth}`}
              icon={<CalendarDays className="h-5 w-5 text-muted-foreground" />}
            />
            <AnalyticsCard
              title="Total Clients"
              value={kpis.totalClients}
              description="All clients managed"
              icon={<Users className="h-5 w-5 text-muted-foreground" />}
            />
            <AnalyticsCard
              title="Projects in Review"
              value={mockClients.reduce((acc, client) => acc + client.videos.filter(v => v.current_status === "Review" || v.current_status === "Awaiting Feedback").length, 0)}
              description="Awaiting client feedback"
              icon={<Hourglass className="h-5 w-5 text-orange-500" />}
            />
          </div>

          {/* Charts and Overviews */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
            <ClientSatisfactionChart data={satisfactionChartData} />
            <DeliveryTrendsChart data={deliveryChartData} />
            <ClientStatusOverview
              activeClients={kpis.activeClients}
              onHoldClients={kpis.onHoldClients}
              archivedClients={kpis.archivedClients}
              totalClients={kpis.totalClients}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboardPage;