"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { Client } from "@/data/mockData"; // Keep Client from mockData
import { Video } from "@/components/VideoTrackingCard"; // Import Video from VideoTrackingCard
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
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";
import { showError } from "@/utils/toast";

const AnalyticsDashboardPage = () => {
  const { user, isLoading: isSessionLoading, profile } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [allProjects, setAllProjects] = useState<Video[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
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
    projectsInReview: 0,
  });
  const [satisfactionChartData, setSatisfactionChartData] = useState<
    { month: string; rating: number }[]
  >([]);
  const [deliveryChartData, setDeliveryChartData] = useState<
    { month: string; delivered: number; onTime: number; delayed: number; expected: number }[]
  >([]);

  const fetchAnalyticsData = useCallback(async () => {
    if (!user || !profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      // Fetch all clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      if (clientsError) {
        console.error("Error fetching clients for analytics:", clientsError);
        showError("Failed to load client data for analytics.");
        setClients([]);
        return;
      }
      setClients(clientsData);

      // Fetch all projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      if (projectsError) {
        console.error("Error fetching projects for analytics:", projectsError);
        showError("Failed to load project data for analytics.");
        setAllProjects([]);
        return;
      }

      const formattedProjects: Video[] = projectsData.map(project => ({
        id: project.id,
        client_id: project.client_id,
        manager_id: project.manager_id || undefined,
        editor_id: project.editor_id || undefined,
        title: project.title,
        description: project.description || '',
        raw_files_link: project.raw_files_link || undefined,
        instructions_link: project.instructions_link || undefined,
        current_status: project.current_status,
        credits_cost: project.credits_cost,
        priority: project.priority,
        submission_timestamp: project.submission_timestamp,
        initial_deadline_timestamp: project.initial_deadline_timestamp,
        adjusted_deadline_timestamp: project.adjusted_deadline_timestamp || undefined,
        delivery_timestamp: project.delivery_timestamp || undefined,
        draft_link: project.draft_link || undefined,
        final_delivery_link: project.final_delivery_link || undefined,
        thumbnail_url: project.thumbnail_url || "https://via.placeholder.com/150/cccccc/ffffff?text=Video",
        updates: [], // Initialize updates as an empty array
        satisfactionRating: undefined,
        projectType: undefined,
        notes: [], // Initialize notes as an empty array
      }));
      setAllProjects(formattedProjects);

    } catch (error) {
      console.error("Unexpected error fetching analytics data:", error);
      showError("An unexpected error occurred while fetching analytics data.");
    } finally {
      setIsLoadingData(false);
    }
  }, [user, profile]);

  useEffect(() => {
    if (!isSessionLoading && user && (profile?.role === 'admin' || profile?.role === 'super_admin')) {
      fetchAnalyticsData();
    }
  }, [isSessionLoading, user, profile, fetchAnalyticsData]);

  useEffect(() => {
    if (clients.length === 0 && allProjects.length === 0) return;

    let totalDeliveries = 0;
    let totalSatisfaction = 0;
    let ratedDeliveries = 0;
    let onTimeDeliveries = 0;
    let totalCompletedDeliveries = 0;
    let totalDelayedDeliveries = 0;
    let projectsInReview = 0;

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

    allProjects.forEach((project) => {
      if (project.delivery_timestamp) {
        totalDeliveries++;
        totalCompletedDeliveries++;

        const actualDate = parseISO(project.delivery_timestamp);
        const deadlineDate = parseISO(project.adjusted_deadline_timestamp || project.initial_deadline_timestamp);
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

      if (project.current_status === "Review" || project.current_status === "Awaiting Feedback") {
        projectsInReview++;
      }

      // Calculate expected deliveries for current and last month
      if (project.current_status !== "Completed" && project.current_status !== "Approved") {
        const expectedDate = parseISO(project.adjusted_deadline_timestamp || project.initial_deadline_timestamp);
        const expectedMonth = getMonth(expectedDate);
        const expectedYear = getYear(expectedDate);

        if (expectedMonth === currentMonth && expectedYear === currentYear) {
          expectedDeliveriesThisMonth++;
        }
        if (expectedMonth === lastMonth && expectedYear === lastMonthYear) {
          expectedDeliveriesLastMonth++;
        }
      }

      // Placeholder for satisfaction ratings
      // if (project.satisfactionRating !== undefined) {
      //   totalSatisfaction += project.satisfactionRating;
      //   ratedDeliveries++;
      // }
    });

    const avgSatisfaction = ratedDeliveries > 0 ? totalSatisfaction / ratedDeliveries : 0;
    const onTimeDeliveryRate =
      totalCompletedDeliveries > 0
        ? (onTimeDeliveries / totalCompletedDeliveries) * 100
        : 0;

    // Prepare satisfaction chart data (placeholder for now)
    const formattedSatisfactionData = [
      { month: "Jan 24", rating: 4.5 },
      { month: "Feb 24", rating: 4.2 },
      { month: "Mar 24", rating: 4.7 },
      { month: "Apr 24", rating: 4.6 },
      { month: "May 24", rating: 4.8 },
    ];

    // Prepare delivery chart data
    const allMonths = new Set<string>();
    allProjects.forEach(project => {
      if (project.delivery_timestamp) {
        allMonths.add(format(parseISO(project.delivery_timestamp), "MMM yy"));
      }
      if (project.adjusted_deadline_timestamp || project.initial_deadline_timestamp) {
        allMonths.add(format(parseISO(project.adjusted_deadline_timestamp || project.initial_deadline_timestamp), "MMM yy"));
      }
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
      allProjects.forEach(project => {
        if (project.current_status !== "Completed" && project.current_status !== "Approved") {
          const expectedDeadline = project.adjusted_deadline_timestamp || project.initial_deadline_timestamp;
          if (expectedDeadline) {
            const expectedMonthKey = format(parseISO(expectedDeadline), "MMM yy");
            if (expectedMonthKey === month) {
              monthExpected++;
            }
          }
        }
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
      projectsInReview,
    });
    setSatisfactionChartData(formattedSatisfactionData);
    setDeliveryChartData(formattedDeliveryData);
  }, [clients, allProjects]);

  if (isSessionLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading analytics dashboard...</p>
      </div>
    );
  }

  if (!user || (profile?.role !== 'admin' && profile?.role !== 'super_admin')) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 mt-16">
          <p className="text-xl text-muted-foreground">Access Denied: You must be an admin or super admin to view this page.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 mt-16">
        <div className="max-w-screen-2xl mx-auto">
          <WelcomeHeader userName={profile?.first_name || "Admin"} />
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
              value={kpis.projectsInReview}
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