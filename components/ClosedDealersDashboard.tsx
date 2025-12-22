import React from 'react';
import { ClosedDealer } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ClosedDealersDashboardProps {
  data: ClosedDealer[];
  loading: boolean;
  error: string | null;
}

const ClosedDealersDashboard: React.FC<ClosedDealersDashboardProps> = ({ data, loading, error }) => {
  if (loading) return <LoadingSpinner />;
  
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

  // Theme styling constants for Closed Dealers View (Fuchsia/Purple to match spreadsheet screenshot)
  const containerBorder = "border-fuchsia-600";
  const containerShadow = "shadow-[0_0_25px_rgba(192,38,211,0.15)]";
  const headerBg = "bg-[#800080]"; // Exact purple from description/screenshot roughly
  const cellBorder = "border-fuchsia-700/50";
  const headerText = "text-white";
  const rowHover = "hover:bg-fuchsia-500/10";
  const textHighlight = "group-hover:text-fuchsia-200";
  
  const cellPadding = "p-2.5"; // Slightly more padding for readability

  return (
    <div className="w-full h-full flex flex-col animate-fade-in-up">
      <div className={`flex-grow overflow-hidden rounded-xl bg-gray-900/40 backdrop-blur-md border-2 ${containerBorder} ${containerShadow}`}>
        <div className="overflow-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead className={`sticky top-0 z-10 ${headerBg} backdrop-blur-xl shadow-md`}>
              <tr>
                <th className={`${cellPadding} text-sm font-bold tracking-wider ${headerText} uppercase border-r border-b ${cellBorder} w-16 text-center`}>S.No</th>
                <th className={`${cellPadding} text-sm font-bold tracking-wider ${headerText} uppercase border-r border-b ${cellBorder}`}>Date</th>
                <th className={`${cellPadding} text-sm font-bold tracking-wider ${headerText} uppercase border-r border-b ${cellBorder}`}>Dealer Name</th>
                <th className={`${cellPadding} text-sm font-bold tracking-wider ${headerText} uppercase border-r border-b ${cellBorder}`}>Business Name</th>
                <th className={`${cellPadding} text-sm font-bold tracking-wider ${headerText} uppercase border-r border-b ${cellBorder}`}>State</th>
                <th className={`${cellPadding} text-sm font-bold tracking-wider ${headerText} uppercase border-b ${cellBorder}`}>City</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {data.map((item, index) => (
                <tr 
                  key={`${item.dealerName}-${index}`}
                  className={`${rowHover} transition-colors duration-200 group border-b border-gray-800/50`}
                >
                  <td className={`${cellPadding} text-center font-bold text-fuchsia-400 border-r ${cellBorder}`}>
                    {data.length - index}
                  </td>
                  <td className={`${cellPadding} text-gray-300 border-r ${cellBorder} whitespace-nowrap`}>
                    {item.date}
                  </td>
                  <td className={`${cellPadding} font-medium text-white ${textHighlight} transition-colors border-r ${cellBorder}`}>
                    {item.dealerName}
                  </td>
                  <td className={`${cellPadding} text-gray-300 border-r ${cellBorder}`}>
                     {item.businessName}
                  </td>
                  <td className={`${cellPadding} text-gray-300 border-r ${cellBorder}`}>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-800/80 text-gray-300 border border-gray-600">
                      {item.state}
                    </span>
                  </td>
                  <td className={`${cellPadding} text-gray-300 ${cellBorder}`}>
                     {item.city}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                        No closed dealers found for this month yet.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClosedDealersDashboard;
