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
  try {
    const products = await apiFetch('/products');
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
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