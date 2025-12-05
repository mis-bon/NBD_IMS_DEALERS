
import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, ClosedDealer } from '../types';

// Updated Script URL that returns both Inventory and NBD (Closed Dealers) data
const DATA_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw693VDGI82bl1swagnrQbo22ouBnt9_h5f801EZgRlOCvBe_UcTGeL4RrmMbhJYClo/exec';

export const useInventoryData = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [closedDealersData, setClosedDealersData] = useState<ClosedDealer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(DATA_SCRIPT_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      
      // The new script returns { inventory: [...], nbd: [...] }
      const rawInventory = json.inventory || [];
      const rawNbd = json.nbd || [];

      // Process Inventory Data
      const mappedInventory: InventoryItem[] = rawInventory.map((item: any) => ({
        tool: item.tool || 'Unknown Tool',
        brand: item.brand || 'Unknown',
        availableStock: Number(item.available_stock || 0),
        sold: Number(item.sold || 0)
      }));

      // Process Closed Dealers Data (from 'nbd' key in JSON)
      const mappedDealers: ClosedDealer[] = rawNbd.map((item: any) => {
        // Handle Date formatting
        let dateStr = item.colA;
        if (dateStr && !isNaN(Date.parse(dateStr)) && dateStr.indexOf('T') > -1) {
             const d = new Date(dateStr);
             dateStr = d.toLocaleDateString('en-GB'); // DD/MM/YYYY format commonly used in India
        }
        
        return {
          date: dateStr || '',
          dealerName: item.colB || '',
          businessName: item.colC || '',
          state: item.colE || '', // Updated to Column E
          city: item.colF || ''   // Updated to Column F
        };
      }).filter((d: ClosedDealer) => d.dealerName); // Filter out empty rows if any

      setInventoryData(mappedInventory);
      setClosedDealersData(mappedDealers);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { inventoryData, closedDealersData, loading, error, refresh: fetchData };
};
