import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/api';
import { useToast } from '../ui/ToastContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const { addToast } = useToast();

  // Sample product data from your Excel
  const sampleProducts = [
    {
      id: 1,
      name: 'HP Pavilion Laptop 15',
      type: 'Storable Product',
      sales_price: 60000,
      cost: 45000,
      category: 'Electronics',
      sku: 'LAP001',
      barcode: '10000001',
      tags: 'Electronics',
      weight: 1.8,
      volume: 0.3,
      lead_time: 3,
      stock_available: 15,
      description: 'Store in electronics rack A1'
    },
    {
      id: 2,
      name: 'Logitech Wireless Mouse M235',
      type: 'Storable Product',
      sales_price: 700,
      cost: 400,
      category: 'Accessories',
      sku: 'MOU001',
      barcode: '10000002',
      tags: 'Accessories',
      weight: 0.09,
      volume: 0.02,
      lead_time: 2,
      stock_available: 45,
      description: 'Place in accessories bin B1'
    },
    {
      id: 3,
      name: 'Dell KB216 USB Keyboard',
      type: 'Storable Product',
      sales_price: 1200,
      cost: 800,
      category: 'Accessories',
      sku: 'KEY001',
      barcode: '10000003',
      tags: 'Accessories',
      weight: 0.45,
      volume: 0.1,
      lead_time: 2,
      stock_available: 32,
      description: 'Store in accessories rack B2'
    },
    {
      id: 4,
      name: 'Samsung 24in LED Monitor',
      type: 'Storable Product',
      sales_price: 14000,
      cost: 10500,
      category: 'Electronics',
      sku: 'MON001',
      barcode: '10000004',
      tags: 'Electronics',
      weight: 3.2,
      volume: 0.5,
      lead_time: 4,
      stock_available: 8,
      description: 'Store upright in monitor section'
    },
    {
      id: 5,
      name: 'HP LaserJet Pro Printer M404',
      type: 'Storable Product',
      sales_price: 18000,
      cost: 15000,
      category: 'Electronics',
      sku: 'PRI001',
      barcode: '10000005',
      tags: 'Electronics, Low Stock',
      weight: 8.5,
      volume: 0.9,
      lead_time: 5,
      stock_available: 3,
      description: 'Place in heavy equipment rack'
    },
    {
      id: 6,
      name: 'Anker USB-C Charging Cable',
      type: 'Storable Product',
      sales_price: 350,
      cost: 180,
      category: 'Accessories',
      sku: 'USB001',
      barcode: '10000006',
      tags: 'Accessories',
      weight: 0.05,
      volume: 0.01,
      lead_time: 1,
      stock_available: 67,
      description: 'Store in cable drawer'
    },
    {
      id: 7,
      name: 'TP-Link Archer C6 WiFi Router',
      type: 'Storable Product',
      sales_price: 3200,
      cost: 2500,
      category: 'Networking',
      sku: 'ROU001',
      barcode: '10000007',
      tags: 'Networking, Low Stock',
      weight: 0.4,
      volume: 0.15,
      lead_time: 3,
      stock_available: 4,
      description: 'Place in networking shelf'
    },
    {
      id: 8,
      name: 'Samsung 1TB SSD 870 EVO',
      type: 'Storable Product',
      sales_price: 7500,
      cost: 6000,
      category: 'Storage',
      sku: 'SSD001',
      barcode: '10000008',
      tags: 'Storage, Low Stock',
      weight: 0.08,
      volume: 0.02,
      lead_time: 3,
      stock_available: 2,
      description: 'Store in anti-static storage box'
    },
    {
      id: 9,
      name: 'Seagate 2TB External Hard Drive',
      type: 'Storable Product',
      sales_price: 6500,
      cost: 5000,
      category: 'Storage',
      sku: 'HDD001',
      barcode: '10000009',
      tags: 'Storage',
      weight: 0.25,
      volume: 0.08,
      lead_time: 3,
      stock_available: 12,
      description: 'Place in storage device rack'
    },
    {
      id: 10,
      name: 'Logitech C920 HD Webcam',
      type: 'Storable Product',
      sales_price: 5500,
      cost: 4200,
      category: 'Accessories',
      sku: 'WEB001',
      barcode: '10000010',
      tags: 'Accessories, Low Stock',
      weight: 0.16,
      volume: 0.04,
      lead_time: 2,
      stock_available: 5,
      description: 'Store in camera accessories section'
    },
    {
      id: 11,
      name: 'Blue Yeti USB Microphone',
      type: 'Storable Product',
      sales_price: 9000,
      cost: 7000,
      category: 'Audio',
      sku: 'MIC001',
      barcode: '10000011',
      tags: 'Audio',
      weight: 0.55,
      volume: 0.2,
      lead_time: 3,
      stock_available: 7,
      description: 'Store in audio equipment shelf'
    },
    {
      id: 12,
      name: 'Apple iPad 10th Gen Tablet',
      type: 'Storable Product',
      sales_price: 45000,
      cost: 36000,
      category: 'Electronics',
      sku: 'TAB001',
      barcode: '10000012',
      tags: 'Electronics',
      weight: 0.48,
      volume: 0.12,
      lead_time: 4,
      stock_available: 6,
      description: 'Store in tablet locker'
    },
    {
      id: 13,
      name: 'Epson Full HD Office Projector',
      type: 'Storable Product',
      sales_price: 52000,
      cost: 42000,
      category: 'Electronics',
      sku: 'PRO001',
      barcode: '10000013',
      tags: 'Electronics',
      weight: 4.1,
      volume: 0.8,
      lead_time: 5,
      stock_available: 2,
      description: 'Store in projector rack'
    },
    {
      id: 14,
      name: 'JBL Flip 6 Portable Speaker',
      type: 'Storable Product',
      sales_price: 9000,
      cost: 7000,
      category: 'Audio',
      sku: 'SPE001',
      barcode: '10000014',
      tags: 'Audio, Low Stock',
      weight: 0.8,
      volume: 0.25,
      lead_time: 2,
      stock_available: 3,
      description: 'Place in audio accessories bin'
    },
    {
      id: 15,
      name: 'Sony WH-CH720N Headphones',
      type: 'Storable Product',
      sales_price: 11000,
      cost: 8500,
      category: 'Audio',
      sku: 'HEA001',
      barcode: '10000015',
      tags: 'Audio',
      weight: 0.32,
      volume: 0.1,
      lead_time: 3,
      stock_available: 9,
      description: 'Store in headphone rack'
    },
    {
      id: 16,
      name: 'Mi 20000mAh Power Bank',
      type: 'Storable Product',
      sales_price: 2000,
      cost: 1400,
      category: 'Accessories',
      sku: 'POW001',
      barcode: '10000016',
      tags: 'Accessories',
      weight: 0.43,
      volume: 0.15,
      lead_time: 2,
      stock_available: 28,
      description: 'Place in mobile accessories section'
    },
    {
      id: 17,
      name: 'NVIDIA RTX 4060 Graphics Card',
      type: 'Storable Product',
      sales_price: 38000,
      cost: 32000,
      category: 'Electronics',
      sku: 'GPU001',
      barcode: '10000017',
      tags: 'Electronics',
      weight: 1.1,
      volume: 0.3,
      lead_time: 4,
      stock_available: 4,
      description: 'Store in GPU anti-static rack'
    },
    {
      id: 18,
      name: 'ASUS Prime B550 Motherboard',
      type: 'Storable Product',
      sales_price: 15000,
      cost: 12000,
      category: 'Electronics',
      sku: 'MOT001',
      barcode: '10000018',
      tags: 'Electronics',
      weight: 0.95,
      volume: 0.28,
      lead_time: 3,
      stock_available: 5,
      description: 'Store in motherboard shelf'
    },
    {
      id: 19,
      name: 'Corsair Vengeance 16GB RAM',
      type: 'Storable Product',
      sales_price: 6500,
      cost: 5000,
      category: 'Storage',
      sku: 'RAM001',
      barcode: '10000019',
      tags: 'Storage',
      weight: 0.12,
      volume: 0.03,
      lead_time: 2,
      stock_available: 18,
      description: 'Place in RAM module case'
    },
    {
      id: 20,
      name: 'Cooler Master RGB Cooling Fan',
      type: 'Storable Product',
      sales_price: 900,
      cost: 600,
      category: 'Accessories',
      sku: 'FAN001',
      barcode: '10000020',
      tags: 'Accessories',
      weight: 0.2,
      volume: 0.06,
      lead_time: 2,
      stock_available: 35,
      description: 'Store in cooling accessories rack'
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to load from API first
      try {
        const apiProducts = await getProducts();
        setProducts(apiProducts);
      } catch (apiError) {
        console.log('API not available, using sample data');
        // Fallback to sample data if API fails
        setProducts(sampleProducts);
        addToast('Using sample data - API not available', 'warning');
      }
    } catch (err) {
      setError(err.message);
      addToast('Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setCsvFile(file);
      } else {
        addToast('Please upload a CSV file', 'error');
      }
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const product = {
        id: Date.now() + i,
        name: values[0] || '',
        type: values[1] || 'Storable Product',
        sales_price: parseFloat(values[2]) || 0,
        cost: parseFloat(values[3]) || 0,
        category: values[4] || 'General',
        sku: values[5] || '',
        barcode: values[6] || '',
        tags: values[7] || '',
        weight: parseFloat(values[8]) || 0,
        volume: parseFloat(values[9]) || 0,
        lead_time: parseInt(values[10]) || 1,
        stock_available: 0,
        description: values[11] || ''
      };
      data.push(product);
    }
    return data;
  };

  const handleImport = async () => {
    if (!csvFile) {
      addToast('Please select a CSV file', 'error');
      return;
    }

    setIsImporting(true);
    try {
      const text = await csvFile.text();
      const importedProducts = parseCSV(text);
      
      // Add imported products to existing products
      setProducts([...products, ...importedProducts]);
      setShowImportModal(false);
      setCsvFile(null);
      addToast(`Successfully imported ${importedProducts.length} products`, 'success');
    } catch (error) {
      addToast('Failed to import products', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Product Name', 'Product Type', 'Sales Price', 'Cost', 'Category',
      'SKU', 'Barcode', 'Tags', 'Weight', 'Volume', 'Lead Time', 'Stock Available', 'Description'
    ];
    
    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        product.name,
        product.type,
        product.sales_price,
        product.cost,
        product.category,
        product.sku,
        product.barcode,
        product.tags,
        product.weight,
        product.volume,
        product.lead_time,
        product.stock_available,
        product.description
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    addToast('Products exported successfully', 'success');
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ccff00]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">Error: {error}</p>
            <button 
              onClick={loadProducts}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Products</h1>
          <p className="text-gray-400">Manage your inventory and product catalog</p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-[#ccff00] text-black hover:bg-[#ccff00]/90 rounded font-medium transition-colors"
          >
            Import CSV
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#ccff00] flex-1 min-w-[200px]"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#ccff00]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-400">{product.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{product.sku}</td>
                    <td className="px-4 py-4 text-sm">{product.category}</td>
                    <td className="px-4 py-4 text-sm">₹{product.sales_price.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm">{product.stock_available}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock_available <= 5 
                          ? 'bg-red-900/50 text-red-400' 
                          : 'bg-green-900/50 text-green-400'
                      }`}>
                        {product.stock_available <= 5 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Import Products from CSV</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#ccff00]"
                />
              </div>
              <div className="mb-4 text-sm text-gray-400">
                <p>CSV should have columns: Product Name, Product Type, Sales Price, Cost, Category, SKU, Barcode, Tags, Weight, Volume, Lead Time, Description</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleImport}
                  disabled={isImporting || !csvFile}
                  className="px-4 py-2 bg-[#ccff00] text-black hover:bg-[#ccff00]/90 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? 'Importing...' : 'Import'}
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
