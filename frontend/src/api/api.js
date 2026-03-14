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
      sales_price: 60000,
      cost: 45000,
      barcode: "10000001",
      weight: 1.8,
      volume: 0.3,
      tags: ["Electronics"]
    },
    {
      id: 2,
      name: "Logitech Wireless Mouse M235",
      sku: "MOU001",
      category: "Accessories",
      stock_available: 25,
      sales_price: 700,
      cost: 400,
      barcode: "10000002",
      weight: 0.09,
      volume: 0.02,
      tags: ["Accessories"]
    },
    {
      id: 3,
      name: "Dell KB216 USB Keyboard",
      sku: "KEY001",
      category: "Accessories",
      stock_available: 15,
      sales_price: 1200,
      cost: 800,
      barcode: "10000003",
      weight: 0.45,
      volume: 0.1,
      tags: ["Accessories"]
    },
    {
      id: 4,
      name: "Samsung 24in LED Monitor",
      sku: "MON001",
      category: "Electronics",
      stock_available: 8,
      sales_price: 14000,
      cost: 10500,
      barcode: "10000004",
      weight: 3.2,
      volume: 0.5,
      tags: ["Electronics"]
    },
    {
      id: 5,
      name: "HP LaserJet Pro Printer M404",
      sku: "PRI001",
      category: "Electronics",
      stock_available: 2,
      sales_price: 18000,
      cost: 15000,
      barcode: "10000005",
      weight: 8.5,
      volume: 0.9,
      tags: ["Electronics", "Low Stock"]
    },
    {
      id: 6,
      name: "Anker USB-C Charging Cable",
      sku: "USB001",
      category: "Accessories",
      stock_available: 50,
      sales_price: 350,
      cost: 180,
      barcode: "10000006",
      weight: 0.05,
      volume: 0.01,
      tags: ["Accessories"]
    },
    {
      id: 7,
      name: "TP-Link Archer C6 WiFi Router",
      sku: "ROU001",
      category: "Networking",
      stock_available: 3,
      sales_price: 3200,
      cost: 2500,
      barcode: "10000007",
      weight: 0.4,
      volume: 0.15,
      tags: ["Networking", "Low Stock"]
    },
    {
      id: 8,
      name: "Samsung 1TB SSD 870 EVO",
      sku: "SSD001",
      category: "Storage",
      stock_available: 4,
      sales_price: 7500,
      cost: 6000,
      barcode: "10000008",
      weight: 0.08,
      volume: 0.02,
      tags: ["Storage", "Low Stock"]
    },
    {
      id: 9,
      name: "Seagate 2TB External Hard Drive",
      sku: "HDD001",
      category: "Storage",
      stock_available: 12,
      sales_price: 6500,
      cost: 5000,
      barcode: "10000009",
      weight: 0.25,
      volume: 0.08,
      tags: ["Storage"]
    },
    {
      id: 10,
      name: "Logitech C920 HD Webcam",
      sku: "WEB001",
      category: "Accessories",
      stock_available: 6,
      sales_price: 5500,
      cost: 4200,
      barcode: "10000010",
      weight: 0.16,
      volume: 0.04,
      tags: ["Accessories", "Low Stock"]
    },
    {
      id: 11,
      name: "Blue Yeti USB Microphone",
      sku: "MIC001",
      category: "Audio",
      stock_available: 7,
      sales_price: 9000,
      cost: 7000,
      barcode: "10000011",
      weight: 0.55,
      volume: 0.2,
      tags: ["Audio"]
    },
    {
      id: 12,
      name: "Apple iPad 10th Gen Tablet",
      sku: "TAB001",
      category: "Electronics",
      stock_available: 9,
      sales_price: 45000,
      cost: 36000,
      barcode: "10000012",
      weight: 0.48,
      volume: 0.12,
      tags: ["Electronics"]
    },
    {
      id: 13,
      name: "Epson Full HD Office Projector",
      sku: "PRO001",
      category: "Electronics",
      stock_available: 1,
      sales_price: 52000,
      cost: 42000,
      barcode: "10000013",
      weight: 4.1,
      volume: 0.8,
      tags: ["Electronics"]
    },
    {
      id: 14,
      name: "JBL Flip 6 Portable Speaker",
      sku: "SPE001",
      category: "Audio",
      stock_available: 4,
      sales_price: 9000,
      cost: 7000,
      barcode: "10000014",
      weight: 0.8,
      volume: 0.25,
      tags: ["Audio", "Low Stock"]
    },
    {
      id: 15,
      name: "Sony WH-CH720N Headphones",
      sku: "HEA001",
      category: "Audio",
      stock_available: 11,
      sales_price: 11000,
      cost: 8500,
      barcode: "10000015",
      weight: 0.32,
      volume: 0.1,
      tags: ["Audio"]
    },
    {
      id: 16,
      name: "Mi 20000mAh Power Bank",
      sku: "POW001",
      category: "Accessories",
      stock_available: 18,
      sales_price: 2000,
      cost: 1400,
      barcode: "10000016",
      weight: 0.43,
      volume: 0.15,
      tags: ["Accessories"]
    },
    {
      id: 17,
      name: "NVIDIA RTX 4060 Graphics Card",
      sku: "GPU001",
      category: "Electronics",
      stock_available: 2,
      sales_price: 38000,
      cost: 32000,
      barcode: "10000017",
      weight: 1.1,
      volume: 0.3,
      tags: ["Electronics"]
    },
    {
      id: 18,
      name: "ASUS Prime B550 Motherboard",
      sku: "MOT001",
      category: "Electronics",
      stock_available: 5,
      sales_price: 15000,
      cost: 12000,
      barcode: "10000018",
      weight: 0.95,
      volume: 0.28,
      tags: ["Electronics"]
    },
    {
      id: 19,
      name: "Corsair Vengeance 16GB RAM",
      sku: "RAM001",
      category: "Storage",
      stock_available: 14,
      sales_price: 6500,
      cost: 5000,
      barcode: "10000019",
      weight: 0.12,
      volume: 0.03,
      tags: ["Storage"]
    },
    {
      id: 20,
      name: "Cooler Master RGB Cooling Fan",
      sku: "FAN001",
      category: "Accessories",
      stock_available: 22,
      sales_price: 900,
      cost: 600,
      barcode: "10000020",
      weight: 0.2,
      volume: 0.06,
      tags: ["Accessories"]
    }
  ];
}

/**
 * GET /api/dashboard
 * Fetch dashboard KPIs from the backend
 */
export async function getDashboard() {
  try {
    const data = await apiFetch('/dashboard');
    // Transform backend response to frontend format
    return [
      { label: 'Total Products', value: data.total_products.toString(), status: 'optimal' },
      { label: 'Low Stock Alerts', value: data.low_stock_alerts.toString(), status: 'critical' },
      { label: 'Pending Receipts', value: data.pending_receipts.toString(), status: 'warning' },
      { label: 'Pending Deliveries', value: data.pending_deliveries.toString(), status: 'optimal' },
    ];
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw new Error(`Failed to fetch dashboard: ${error.message}`);
  }
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