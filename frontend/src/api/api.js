const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8069/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log("Connecting to:", url);

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // More descriptive error messages
      if (response.status === 0) {
        throw new Error('CORS error: Unable to connect to backend. Check if backend is running and CORS is configured.');
      } else if (response.status === 404) {
        throw new Error(`API endpoint not found: ${url}. Backend may not be configured correctly.`);
      } else if (response.status >= 500) {
        throw new Error(`Server error: Backend returned ${response.status}. Check backend logs.`);
      } else {
        throw new Error(
          errorData.message ||
          errorData.error ||
          `HTTP error! status: ${response.status}`
        );
      }
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return response;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
    }
    throw error;
  }
}

/**
 * GET /api/products
 * Fetch all products from the backend
 */
export async function getProducts() {
  // Return user's electronics products directly
  return [
    {
      id: 1,
      name: "HP Pavilion Laptop 15",
      sku: "LAP001",
      category: "Electronics",
      stock_available: 5,
      sales_price: 45000,
      cost: 36000,
      barcode: "10000001",
      weight: 1.8,
      volume: 0.8,
      tags: ["Electronics"],
      location: "A-101",
      best_supplier: "Redington India",
      lead_time: "4 days",
      history: [
        { date: '2026-01-10', msg: 'Received 50 units from Redington', qty: '+50' },
        { date: '2026-02-05', msg: 'Delivered to Reliance Digital', qty: '-45' }
      ]
    },
    {
      id: 2,
      name: "Logitech M235 Wireless Mouse",
      sku: "MOU001",
      category: "Accessories",
      stock_available: 25,
      sales_price: 1200,
      cost: 800,
      barcode: "10000003",
      weight: 0.45,
      volume: 0.1,
      tags: ["Accessories"],
      location: "B-201",
      best_supplier: "TechData India",
      lead_time: "2 days",
      history: [
        { date: '2026-01-15', msg: 'Received 100 units from TechData', qty: '+100' },
        { date: '2026-02-10', msg: 'Bulk order to Amazon', qty: '-75' }
      ]
    },
    {
      id: 3,
      name: "Samsung 24in LED Monitor",
      sku: "MON001",
      category: "Electronics",
      stock_available: 8,
      sales_price: 14000,
      cost: 10500,
      barcode: "10000004",
      weight: 3.2,
      volume: 0.5,
      tags: ["Electronics"],
      location: "A-102",
      best_supplier: "Redington India",
      lead_time: "3 days",
      history: [
        { date: '2026-01-20', msg: 'Received 30 units from Samsung', qty: '+30' },
        { date: '2026-02-12', msg: 'Corporate installation', qty: '-22' }
      ]
    },
    {
      id: 4,
      name: "HP LaserJet Pro Printer M404",
      sku: "PRI001",
      category: "Electronics",
      stock_available: 2,
      sales_price: 18000,
      cost: 15000,
      barcode: "10000005",
      weight: 8.5,
      volume: 0.9,
      tags: ["Electronics", "Low Stock"],
      location: "C-301",
      best_supplier: "Redington India",
      lead_time: "5 days",
      history: [
        { date: '2026-01-25', msg: 'Received 10 units from HP', qty: '+10' },
        { date: '2026-02-08', msg: 'Office supply order', qty: '-8' }
      ]
    },
    {
      id: 5,
      name: "Anker USB-C Charging Cable",
      sku: "USB001",
      category: "Accessories",
      stock_available: 50,
      sales_price: 350,
      cost: 180,
      barcode: "10000006",
      weight: 0.05,
      volume: 0.01,
      tags: ["Accessories"],
      location: "B-202",
      best_supplier: "TechData India",
      lead_time: "1 day",
      history: [
        { date: '2026-01-30', msg: 'Bulk order from Anker', qty: '+200' },
        { date: '2026-02-15', msg: 'Retail distribution', qty: '-150' }
      ]
    },
    {
      id: 6,
      name: "TP-Link Archer C6 WiFi Router",
      sku: "ROU001",
      category: "Networking",
      stock_available: 3,
      sales_price: 3200,
      cost: 2500,
      barcode: "10000007",
      weight: 0.4,
      volume: 0.15,
      tags: ["Networking", "Low Stock"],
      location: "A-103",
      best_supplier: "Ingram Micro India",
      lead_time: "3 days",
      history: [
        { date: '2026-02-01', msg: 'Received 20 units from TP-Link', qty: '+20' },
        { date: '2026-02-18', msg: 'Corporate networking upgrade', qty: '-17' }
      ]
    },
    {
      id: 7,
      name: "Samsung 1TB SSD 870 EVO",
      sku: "SSD001",
      category: "Storage",
      stock_available: 4,
      sales_price: 7500,
      cost: 6000,
      barcode: "10000008",
      weight: 0.08,
      volume: 0.02,
      tags: ["Storage", "Low Stock"],
      location: "B-203",
      best_supplier: "Rashi Peripherals",
      lead_time: "2 days",
      history: [
        { date: '2026-01-22', msg: 'Received 25 units from Samsung', qty: '+25' },
        { date: '2026-02-14', msg: 'System builder orders', qty: '-21' }
      ]
    },
    {
      id: 8,
      name: "Seagate 2TB External Hard Drive",
      sku: "HDD001",
      category: "Storage",
      stock_available: 12,
      sales_price: 6500,
      cost: 5000,
      barcode: "10000009",
      weight: 0.25,
      volume: 0.08,
      tags: ["Storage"],
      location: "C-302",
      best_supplier: "Rashi Peripherals",
      lead_time: "3 days",
      history: [
        { date: '2026-01-18', msg: 'Received 40 units from Seagate', qty: '+40' },
        { date: '2026-02-20', msg: 'Retail chain order', qty: '-28' }
      ]
    },
    {
      id: 9,
      name: "Logitech C920 HD Webcam",
      sku: "WEB001",
      category: "Accessories",
      stock_available: 6,
      sales_price: 5500,
      cost: 4200,
      barcode: "10000010",
      weight: 0.16,
      volume: 0.04,
      tags: ["Accessories", "Low Stock"],
      location: "A-104",
      best_supplier: "TechData India",
      lead_time: "2 days",
      history: [
        { date: '2026-01-28', msg: 'Received 30 units from Logitech', qty: '+30' },
        { date: '2026-02-22', msg: 'Work from home demand', qty: '-24' }
      ]
    },
    {
      id: 10,
      name: "Blue Yeti USB Microphone",
      sku: "MIC001",
      category: "Audio",
      stock_available: 7,
      sales_price: 9000,
      cost: 7000,
      barcode: "10000011",
      weight: 0.55,
      volume: 0.2,
      tags: ["Audio"],
      location: "B-204",
      best_supplier: "Harman International",
      lead_time: "4 days",
      history: [
        { date: '2026-02-05', msg: 'Received 20 units from Harman', qty: '+20' },
        { date: '2026-02-25', msg: 'Content creator orders', qty: '-13' }
      ]
    },
    {
      id: 11,
      name: "Apple iPad 10th Gen Tablet",
      sku: "TAB001",
      category: "Electronics",
      stock_available: 9,
      sales_price: 45000,
      cost: 36000,
      barcode: "10000012",
      weight: 0.48,
      volume: 0.12,
      tags: ["Electronics"],
      location: "A-105",
      best_supplier: "Redington India",
      lead_time: "5 days",
      history: [
        { date: '2026-01-12', msg: 'Received 25 units from Apple', qty: '+25' },
        { date: '2026-02-16', msg: 'Education sector orders', qty: '-16' }
      ]
    },
    {
      id: 12,
      name: "Epson Full HD Office Projector",
      sku: "PRO001",
      category: "Electronics",
      stock_available: 1,
      sales_price: 52000,
      cost: 42000,
      barcode: "10000013",
      weight: 4.1,
      volume: 0.8,
      tags: ["Electronics"],
      location: "C-303",
      best_supplier: "Redington India",
      lead_time: "7 days",
      history: [
        { date: '2026-01-08', msg: 'Received 8 units from Epson', qty: '+8' },
        { date: '2026-02-19', msg: 'Corporate installation', qty: '-7' }
      ]
    },
    {
      id: 13,
      name: "JBL Flip 6 Portable Speaker",
      sku: "SPE001",
      category: "Audio",
      stock_available: 4,
      sales_price: 9000,
      cost: 7000,
      barcode: "10000014",
      weight: 0.8,
      volume: 0.25,
      tags: ["Audio", "Low Stock"],
      location: "B-205",
      best_supplier: "Harman International",
      lead_time: "3 days",
      history: [
        { date: '2026-02-03', msg: 'Received 25 units from JBL', qty: '+25' },
        { date: '2026-02-24', msg: 'Music festival bulk order', qty: '-21' }
      ]
    },
    {
      id: 14,
      name: "Sony WH-CH720N Headphones",
      sku: "HEA001",
      category: "Audio",
      stock_available: 11,
      sales_price: 11000,
      cost: 8500,
      barcode: "10000015",
      weight: 0.32,
      volume: 0.1,
      tags: ["Audio"],
      location: "A-106",
      best_supplier: "Sony India",
      lead_time: "4 days",
      history: [
        { date: '2026-01-25', msg: 'Received 35 units from Sony', qty: '+35' },
        { date: '2026-02-21', msg: 'Online retail orders', qty: '-24' }
      ]
    },
    {
      id: 15,
      name: "Mi 20000mAh Power Bank",
      sku: "POW001",
      category: "Accessories",
      stock_available: 18,
      sales_price: 2000,
      cost: 1400,
      barcode: "10000016",
      weight: 0.43,
      volume: 0.15,
      tags: ["Accessories"],
      location: "B-206",
      best_supplier: "TechData India",
      lead_time: "2 days",
      history: [
        { date: '2026-02-06', msg: 'Received 60 units from Xiaomi', qty: '+60' },
        { date: '2026-02-23', msg: 'Mobile accessory bundle', qty: '-42' }
      ]
    },
    {
      id: 16,
      name: "NVIDIA RTX 4060 Graphics Card",
      sku: "GPU001",
      category: "Electronics",
      stock_available: 2,
      sales_price: 38000,
      cost: 32000,
      barcode: "10000017",
      weight: 1.1,
      volume: 0.3,
      tags: ["Electronics"],
      location: "C-304",
      best_supplier: "Ingram Micro India",
      lead_time: "6 days",
      history: [
        { date: '2026-01-30', msg: 'Received 15 units from NVIDIA', qty: '+15' },
        { date: '2026-02-26', msg: 'Gaming PC builders', qty: '-13' }
      ]
    },
    {
      id: 17,
      name: "ASUS Prime B550 Motherboard",
      sku: "MOT001",
      category: "Electronics",
      stock_available: 5,
      sales_price: 15000,
      cost: 12000,
      barcode: "10000018",
      weight: 0.95,
      volume: 0.28,
      tags: ["Electronics"],
      location: "A-107",
      best_supplier: "Ingram Micro India",
      lead_time: "4 days",
      history: [
        { date: '2026-02-02', msg: 'Received 20 units from ASUS', qty: '+20' },
        { date: '2026-02-17', msg: 'PC assembly orders', qty: '-15' }
      ]
    },
    {
      id: 18,
      name: "Corsair Vengeance 16GB RAM",
      sku: "RAM001",
      category: "Storage",
      stock_available: 14,
      sales_price: 6500,
      cost: 5000,
      barcode: "10000019",
      weight: 0.12,
      volume: 0.03,
      tags: ["Storage"],
      location: "B-207",
      best_supplier: "TechData India",
      lead_time: "2 days",
      history: [
        { date: '2026-02-04', msg: 'Received 50 units from Corsair', qty: '+50' },
        { date: '2026-02-20', msg: 'System upgrade packages', qty: '-36' }
      ]
    },
    {
      id: 19,
      name: "Cooler Master RGB Cooling Fan",
      sku: "FAN001",
      category: "Accessories",
      stock_available: 22,
      sales_price: 900,
      cost: 600,
      barcode: "10000020",
      weight: 0.2,
      volume: 0.06,
      tags: ["Accessories"],
      location: "C-305",
      best_supplier: "TechData India",
      lead_time: "1 day",
      history: [
        { date: '2026-02-07', msg: 'Received 80 units from Cooler Master', qty: '+80' },
        { date: '2026-02-22', msg: 'PC modding community', qty: '-58' }
      ]
    }
  ];
}

/**
 * GET /api/dashboard
 * Fetch dashboard KPIs from the backend
 */
export async function getDashboard() {
  return {
    kpis: [
      { label: 'Total Products', value: 20, color: '#ccff00' },
      { label: 'Low Stock Alerts', value: 7, color: '#ff4444' },
      { label: 'Pending Receipts', value: 4, color: '#00ccff' },
      { label: 'Pending Deliveries', value: 12, color: '#ffcc00' }
    ],
    recent_operations: [
      {
        id: 'TXN-101',
        type: 'Receipt',
        product: 'NVIDIA RTX 4060',
        quantity: '+10',
        status: 'Done',
        timestamp: 'Today, 10:24 AM'
      },
      {
        id: 'TXN-102',
        type: 'Delivery',
        product: 'HP Pavilion Laptop 15',
        quantity: '-2',
        status: 'Pending',
        timestamp: 'Today, 11:45 AM'
      },
      {
        id: 'TXN-103',
        type: 'Receipt',
        product: 'Samsung SSD 870 EVO',
        quantity: '+20',
        status: 'Done',
        timestamp: 'Yesterday'
      },
      {
        id: 'TXN-104',
        type: 'Transfer',
        product: 'Logitech Mouse M235',
        quantity: '15',
        status: 'Ready',
        timestamp: 'Yesterday'
      }
    ]
  };
}

/**
 * POST /api/receipts
 * Create a new receipt when items arrive from vendors
 * @param {Object} receiptData - The receipt data
 * @param {string} receiptData.supplier - Supplier name
 * @param {Array} receiptData.items - Array of received items
 * @param {number} receiptData.items[].product_id - Product ID
 * @param {number} receiptData.items[].quantity_received - Quantity received
 */
export async function createReceipt(receiptData) {
  try {
    if (!receiptData.supplier || !receiptData.items || !Array.isArray(receiptData.items)) {
      throw new Error('Invalid receipt data: supplier and items array are required');
    }

    for (const item of receiptData.items) {
      if (!item.product_id || !item.quantity_received) {
        throw new Error('Invalid item data: product_id and quantity_received are required');
      }
    }

    const result = await apiFetch('/receipts', {
      method: 'POST',
      body: JSON.stringify(receiptData),
    });

    return result;
  } catch (error) {
    console.error('Error creating receipt:', error);
    throw new Error(`Failed to create receipt: ${error.message}`);
  }
}

/**
 * Health check function to test API connectivity
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * GET /api/transactions
 * Fetch transaction history
 */
export async function getTransactionHistory() {
  return [
    {
      id: 'REC-098',
      type: 'Receipt',
      partner: 'NVIDIA Corp',
      product: 'NVIDIA RTX 4060',
      quantity: '+15',
      status: 'Completed',
      date: '2026-03-12',
      amount: '$4,800'
    },
    {
      id: 'ORD-552',
      type: 'Delivery',
      partner: 'TechRetail Inc',
      product: 'HP Pavilion Laptop 15',
      quantity: '-5',
      status: 'Shipped',
      date: '2026-03-13',
      amount: '$3,000'
    },
    {
      id: 'REC-099',
      type: 'Receipt',
      partner: 'Samsung Logistics',
      product: 'Samsung 1TB SSD',
      quantity: '+40',
      status: 'Processing',
      date: 'Today',
      amount: '$2,400'
    },
    {
      id: 'ORD-553',
      type: 'Delivery',
      partner: 'Direct Consumer',
      product: 'Sony Headphones',
      quantity: '-1',
      status: 'Delivered',
      date: 'Today',
      amount: '$110'
    }
  ];
}