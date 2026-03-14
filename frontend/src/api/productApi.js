import { getProducts as getMockProducts } from './mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getProducts = async () => {
  if (USE_MOCK) {
    return getMockProducts();
  }

  const res = await fetch(`${API_BASE_URL}/api/products`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }
  return res.json();
};
