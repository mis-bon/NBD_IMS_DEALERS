import React, { useMemo } from 'react';
import { ClosedDealer } from '../types';

interface ScrollingBannerProps {
  data: ClosedDealer[];
}

const ScrollingBanner: React.FC<ScrollingBannerProps> = ({ data }) => {
  const todaysDealers = useMemo(() => {
    // Get today's date in DD/MM/YYYY format to match the data format
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-GB'); // "04/12/2025"
    
    return data.filter(dealer => dealer.date === todayStr);
  }, [data]);

  if (todaysDealers.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 w-full bg-white/20 backdrop-blur-[2px] border-t border-white/20 overflow-hidden py-3 z-50 pointer-events-none shadow-[0_-4px_30px_rgba(255,255,255,0.1)]">
      <div className="animate-marquee pl-full whitespace-nowrap">
        {todaysDealers.map((dealer, index) => (
          <span key={`${dealer.businessName}-${index}`} className="inline-flex items-center mx-16 text-xl font-bold text-white tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            <span className="text-2xl mr-3">🎉</span>
            <span className="text-cyan-300 drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]">{dealer.businessName}</span>
            <span className="mx-3 text-gray-100 font-semibold drop-shadow-md">has joined us as New Dealer in</span>
            <span className="text-fuchsia-300 uppercase drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]">{dealer.state}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanner;