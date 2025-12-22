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

      // Get current month and year for filtering
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Process Closed Dealers Data (from 'nbd' key in JSON)
      // Filter logic: Only include dealers where Date matches current month and year
      const mappedDealers: ClosedDealer[] = [];

      for (const item of rawNbd) {
          // Skip if no Dealer Name
          if (!item.colB) continue;

          let dateStr = item.colA;
          let dateObj: Date | null = null;

          if (dateStr) {
             if (typeof dateStr === 'string' && (dateStr.indexOf('T') > -1 || dateStr.match(/^\d{4}-\d{2}-\d{2}/))) {
                 // ISO-like or YYYY-MM-DD
                 const d = new Date(dateStr);
                 if (!isNaN(d.getTime())) {
                    dateObj = d;
                 }
             } else if (typeof dateStr === 'string' && dateStr.includes('/')) {
                 // Assume DD/MM/YYYY
                 const parts = dateStr.split('/');
                 if (parts.length === 3) {
                     const day = Number(parts[0]);
                     const month = Number(parts[1]) - 1; // Month is 0-indexed
                     const year = Number(parts[2]);
                     const d = new Date(year, month, day);
                     if (!isNaN(d.getTime())) {
                        dateObj = d;
                     }
                 }
             }
          }

          // If we have a valid date object, check if it matches current month/year
          if (dateObj) {
              if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
                  // Format date consistently as DD/MM/YYYY
                  const dayStr = String(dateObj.getDate()).padStart(2, '0');
                  const monthStr = String(dateObj.getMonth() + 1).padStart(2, '0');
                  const yearStr = dateObj.getFullYear();

                  mappedDealers.push({
                      date: `${dayStr}/${monthStr}/${yearStr}`,
                      dealerName: item.colB || '',
                      businessName: item.colC || '',
                      state: item.colE || '', // Updated to Column E
                      city: item.colF || ''   // Updated to Column F
                  });
              }
          }
      }

      // Show in descending order: last entry from the sheet at the top
      setInventoryData(mappedInventory);
      setClosedDealersData(mappedDealers.reverse());

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
