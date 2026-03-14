import { getProducts as getRealProducts } from './api';
import { getProducts as getMockProducts } from './mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getProducts = async () => {
  if (USE_MOCK) {
    return getMockProducts();
  }

  try {
    return await getRealProducts();
  } catch (error) {
    console.error('Real API failed, falling back to mock:', error);
    return getMockProducts();
  }
};
