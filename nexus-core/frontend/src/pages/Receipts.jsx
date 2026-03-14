import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/api';
import { useToast } from '../ui/ToastContext';

const Receipts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [supplier, setSupplier] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      addToast('Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = (product) => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      addToast('Product already added', 'warning');
      return;
    }
    
    setSelectedProducts([...selectedProducts, { 
      ...product, 
      quantity: 1 
    }]);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(selectedProducts.map(p => 
      p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplier) {
      addToast('Please enter supplier name', 'error');
      return;
    }
    
    if (selectedProducts.length === 0) {
      addToast('Please add at least one product', 'error');
      return;
    }

    // TODO: Call API to create receipt
    addToast('Receipt created successfully', 'success');
    
    // Reset form
    setSupplier('');
    setSelectedProducts([]);
  };

  const getTotalValue = () => {
    return selectedProducts.reduce((total, product) => {
      return total + (product.cost * product.quantity);
    }, 0);
  };

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

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Receipt</h1>
          <p className="text-gray-400">Record incoming inventory from suppliers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Receipt Form */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Receipt Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Supplier Name</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#ccff00]"
                  placeholder="Enter supplier name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Selected Products</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedProducts.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No products selected</p>
                  ) : (
                    selectedProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between bg-gray-800 rounded p-3">
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-400">{product.sku}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                            className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center"
                          />
                          <span className="text-sm text-gray-400">× ₹{product.cost}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total Value:</span>
                  <span className="text-xl font-bold text-[#ccff00]">₹{getTotalValue().toLocaleString()}</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#ccff00] text-black hover:bg-[#ccff00]/90 rounded-lg font-medium transition-colors"
                >
                  Create Receipt
                </button>
              </div>
            </form>
          </div>

          {/* Product Selection */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Available Products</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between bg-gray-800 rounded p-3 hover:bg-gray-700 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-400">{product.sku} • {product.category}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">₹{product.cost}</span>
                    <button
                      type="button"
                      onClick={() => handleAddProduct(product)}
                      className="px-3 py-1 bg-[#ccff00] text-black hover:bg-[#ccff00]/90 rounded text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipts;
