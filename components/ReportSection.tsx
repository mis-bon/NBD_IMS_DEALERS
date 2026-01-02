
import React from 'react';
import { ReportData } from '../types';
import DataCard from './DataCard';
import PercentageCard from './PercentageCard';
import { LeadIcon, ConnectIcon, InterestIcon, ConvertIcon } from './Icons';

interface ReportSectionProps {
  data: ReportData;
  colorConfig: {
    title: string;
    subtitle: string;
    gradient: string;
  };
  animationDelay: string;
}

const ReportSection: React.FC<ReportSectionProps> = ({ data, colorConfig, animationDelay }) => {
  const isRange = colorConfig.subtitle.includes(' - ');

  return (
    <div className="animate-fade-in-up flex flex-col h-full space-y-4" style={{ animationDelay }}>
      <div className={`flex flex-col rounded-xl bg-gradient-to-r ${colorConfig.gradient} text-white shadow-xl flex-shrink-0 p-2 overflow-hidden border border-white/10`}>
        <h2 className="text-xl lg:text-2xl font-extrabold text-center uppercase tracking-tight">
          {colorConfig.title}
        </h2>
        <div className="flex justify-between items-center px-4 mt-1 border-t border-white/20 pt-1">
          {isRange ? (
            <>
              <span className="text-[10px] lg:text-xs font-bold opacity-90 tabular-nums">
                {colorConfig.subtitle.split(' - ')[0]}
              </span>
              <span className="text-[10px] lg:text-xs font-bold opacity-90 tabular-nums">
                {colorConfig.subtitle.split(' - ')[1]}
              </span>
            </>
          ) : (
            <span className="w-full text-center text-[10px] lg:text-xs font-bold opacity-90 tabular-nums">
              {colorConfig.subtitle}
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DataCard title="Total Leads" value={data.totalLeads} icon={<LeadIcon />} colorConfig={colorConfig} />
        <DataCard title="Connected Leads" value={data.connectedLeads} icon={<ConnectIcon />} colorConfig={colorConfig} />
        <DataCard title="Interested Leads" value={data.interestedLeads} icon={<InterestIcon />} colorConfig={colorConfig} />
        <DataCard title="Client Converted" value={data.clientConverted} icon={<ConvertIcon />} colorConfig={colorConfig} />
      </div>
      <div className="flex-grow flex flex-col justify-around space-y-2">
        <PercentageCard title="First Phase Conversion" value={data.firstPhase} colorConfig={colorConfig} />
        <PercentageCard title="Second Phase Conversion" value={data.secondPhase} colorConfig={colorConfig} />
        <PercentageCard title="Third Phase Conversion" value={data.thirdPhase} colorConfig={colorConfig} />
      </div>
    </div>
  );
};

export default ReportSection;
