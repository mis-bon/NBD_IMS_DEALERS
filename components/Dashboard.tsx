
import React, { useMemo } from 'react';
import ReportSection from './ReportSection';
import LoadingSpinner from './LoadingSpinner';
import { DashboardData } from '../types';

interface DashboardProps {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ data, loading, error }) => {
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const config = useMemo(() => {
    const now = new Date();
    
    // Today
    const todayStr = formatDate(now);

    // Week (Monday to Sunday)
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekStr = `${formatDate(monday)} - ${formatDate(sunday)}`;

    // Month
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthStr = `${formatDate(firstDay)} - ${formatDate(lastDay)}`;

    return {
      yesterday: {
        title: "Today's Report",
        subtitle: todayStr,
        gradient: 'from-violet-500 to-purple-600',
      },
      week: {
        title: "This Week's Report",
        subtitle: weekStr,
        gradient: 'from-fuchsia-500 to-pink-600',
      },
      month: {
        title: "This Month's Report",
        subtitle: monthStr,
        gradient: 'from-teal-400 to-cyan-500',
      },
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div className="bg-red-900/50 border border-red-500 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Error Fetching Data</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 flex-grow">
      <ReportSection 
        data={data.yesterday} 
        colorConfig={config.yesterday} 
        animationDelay="0s" 
      />
      <ReportSection 
        data={data.week} 
        colorConfig={config.week} 
        animationDelay="0.2s" 
      />
      <ReportSection 
        data={data.month} 
        colorConfig={config.month} 
        animationDelay="0.4s" 
      />
    </div>
  );
};

export default Dashboard;
