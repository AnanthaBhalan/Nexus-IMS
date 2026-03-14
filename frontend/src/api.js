const API_BASE_URL = 'http://localhost:8069/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
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
      throw new Error(
        errorData.message || 
        errorData.error || 
        `HTTP error! status: ${response.status}`
      );
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
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}
