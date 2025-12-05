import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import Dashboard from './components/Dashboard';
import InventoryDashboard from './components/InventoryDashboard';
import ClosedDealersDashboard from './components/ClosedDealersDashboard';
import ScrollingBanner from './components/ScrollingBanner';
import { AnimatedBackground } from './components/AnimatedBackground';
import { useGoogleSheetData } from './hooks/useGoogleSheetData';
import { useInventoryData } from './hooks/useInventoryData';

type ViewType = 'NBD' | 'INVENTORY' | 'CLOSED_DEALERS';

// 30 seconds in milliseconds
const SWITCH_INTERVAL = 30000; 

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('NBD');
  const [nextSwitchTime, setNextSwitchTime] = useState<number>(Date.now() + SWITCH_INTERVAL);

  // NBD Report Data Hook (Source 1)
  const { 
    data: nbdData, 
    loading: nbdLoading, 
    error: nbdError, 
    overallConversionRatio, 
    remainingTarget, 
    isLive 
  } = useGoogleSheetData();

  // Inventory & Closed Dealers Data Hook (Source 2 - Single Script)
  const { 
    inventoryData,
    closedDealersData,
    loading: combinedLoading, 
    error: combinedError 
  } = useInventoryData();

  // Calculate generic stats for header
  const totalStock = inventoryData?.reduce((acc, item) => acc + item.availableStock, 0) || 0;
  const totalSold = inventoryData?.reduce((acc, item) => acc + item.sold, 0) || 0;
  const totalClosedDealers = closedDealersData?.length || 0;

  // Calculate today's closed dealers
  const todaysDate = new Date().toLocaleDateString('en-GB');
  const todaysClosedDealers = closedDealersData?.filter(d => d.date === todaysDate).length || 0;

  // Handler for manual toggle
  const toggleView = () => {
    setCurrentView(prev => {
        if (prev === 'NBD') return 'INVENTORY';
        if (prev === 'INVENTORY') return 'CLOSED_DEALERS';
        return 'NBD';
    });
  };

  useEffect(() => {
    // Reset the target time whenever the view changes
    setNextSwitchTime(Date.now() + SWITCH_INTERVAL);

    const timer = setInterval(() => {
      setCurrentView(prev => {
        if (prev === 'NBD') return 'INVENTORY';
        if (prev === 'INVENTORY') return 'CLOSED_DEALERS';
        return 'NBD';
      });
    }, SWITCH_INTERVAL);

    return () => clearInterval(timer);
  }, [currentView]);

  const getBackgroundShapeColor = () => {
    switch(currentView) {
      case 'INVENTORY': return 'rgba(96, 165, 250, 0.08)'; // Blue
      case 'CLOSED_DEALERS': return 'rgba(232, 121, 249, 0.08)'; // Fuchsia
      default: return undefined;
    }
  };

  const getPageIndicator = () => {
    switch(currentView) {
      case 'NBD': return 'Page 1 of 3';
      case 'INVENTORY': return 'Page 2 of 3';
      case 'CLOSED_DEALERS': return 'Page 3 of 3';
      default: return '';
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900 text-white flex flex-col">
      {/* Animated Gradient Background */}
      <div className="animated-gradient fixed inset-0 z-[-2]"></div>
      
      {/* Animated Shapes Background - change color slightly based on view */}
      <AnimatedBackground shapeColor={getBackgroundShapeColor()} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col flex-grow overflow-hidden relative z-10">
        <Header 
          view={currentView}
          stats={{
            conversion: overallConversionRatio,
            target: remainingTarget,
            totalStock: totalStock,
            totalSold: totalSold,
            totalClosedDealers: totalClosedDealers,
            todaysClosedDealers: todaysClosedDealers
          }}
          isLive={isLive}
          onToggleView={toggleView}
          nextSwitchTime={nextSwitchTime}
          totalDuration={SWITCH_INTERVAL}
        />
        
        {/* Conditional Rendering of Dashboard Views */}
        <div className="flex-grow overflow-hidden relative pb-8">
          {currentView === 'NBD' && (
            <Dashboard data={nbdData} loading={nbdLoading && !nbdData} error={nbdError} />
          )}
          {currentView === 'INVENTORY' && (
            <InventoryDashboard data={inventoryData} loading={combinedLoading && inventoryData.length === 0} error={combinedError} />
          )}
          {currentView === 'CLOSED_DEALERS' && (
             <ClosedDealersDashboard data={closedDealersData} loading={combinedLoading && closedDealersData.length === 0} error={combinedError} />
          )}
        </div>
      </main>
      
      {/* Footer Container */}
      <footer className="absolute bottom-0 left-0 w-full z-50 pointer-events-none">
        {/* Scrolling Banner */}
        <ScrollingBanner data={closedDealersData} />

        {/* Page Number Indicator */}
        <div className="absolute bottom-2 right-4 flex justify-end z-[60]">
            <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
                <span className="text-[10px] font-medium text-white/70 tracking-widest uppercase">
                    {getPageIndicator()}
                </span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
