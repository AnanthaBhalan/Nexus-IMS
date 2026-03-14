// Dashboard API mocks (no real backend endpoints defined yet)

export const getDashboardKPIs = async () => {
  return [
    { label: 'Total Products', value: '1,204', status: 'optimal' },
    { label: 'Low Stock Alerts', value: '14', status: 'critical' },
    { label: 'Pending Receipts', value: '8', status: 'warning' },
    { label: 'Pending Deliveries', value: '23', status: 'optimal' },
  ];
};

export const getRecentActivity = async () => {
  return [
    { id: 'TXN-092', type: 'Receipt', item: 'Steel Rods', qty: '+500', status: 'Done', date: 'Today, 08:42 AM' },
    { id: 'TXN-093', type: 'Delivery', item: 'Lithium Batteries', qty: '-40', status: 'Pending', date: 'Today, 09:15 AM' },
    { id: 'TXN-094', type: 'Transfer', item: 'Copper Wire', qty: '120', status: 'Ready', date: 'Yesterday' },
    { id: 'TXN-095', type: 'Adjustment', item: 'Pallet Racks', qty: '-2', status: 'Done', date: 'Yesterday' },
  ];
};
