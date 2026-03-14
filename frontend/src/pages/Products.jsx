import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/api';
import SkeletonTable from '../ui/SkeletonTable';
import { useToast } from '../ui/ToastContext';
import { Plus, AlertCircle, Truck } from 'lucide-react';
import { formatINR } from '../utils';

const ProductDrawer = ({ product, isOpen, onClose }) => {
  if (!product) return null;
  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-[#0a0a0a] border-l border-white/10 p-6 transform transition-transform z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <button onClick={onClose} className="text-white mb-6">✕ Close</button>
      <h2 className="text-2xl font-bold text-[#ccff00] mb-1">{product.name}</h2>
      <p className="text-neutral-500 mb-6 font-mono">{product.sku}</p>
      
      <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Product Journey</h3>
      <div className="space-y-4">
        {product.history?.map((h, i) => (
          <div key={i} className="flex gap-4 border-l-2 border-white/10 pl-4 pb-4">
            <div className="text-xs text-neutral-500">{h.date}</div>
            <div className="text-sm text-white">{h.msg} <span className="text-[#ccff00]">{h.qty}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Heatmap = ({ products, onSelectLocation }) => {
  const locations = ['A-101', 'A-102', 'A-103', 'B-201', 'B-202', 'C-301'];
  
  return (
    <div className="grid grid-cols-6 gap-2 mb-8">
      {locations.map(loc => {
        const product = products.find(p => p.location === loc);
        const hasStock = product?.stock_available > 10;
        return (
          <div 
            key={loc}
            onClick={() => onSelectLocation && onSelectLocation(loc)}
            className={`h-12 rounded cursor-pointer transition-all flex items-center justify-center text-[10px] font-bold
              ${hasStock ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-white/40 border border-white/10 hover:border-[#ccff00]'}`}
          >
            {loc}
          </div>
        );
      })}
    </div>
  );
};

const categories = ['All', 'Electronics', 'Accessories', 'Networking', 'Storage', 'Audio'];

const Products = ({ products: initialProducts = [] }) => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAuditMode, setIsAuditMode] = useState(false);
  const [auditAdjustments, setAuditAdjustments] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Update local products when prop changes
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const handleQuickRestock = (productName) => {
    // Simulate an API call to Odoo
    addToast(`Restock request sent for ${productName}`, 'success');
    
    // Optional: In a real app, this would create a 'Draft' Purchase Order in Odoo
    console.log(`Triggering Odoo purchase.order creation for: ${productName}`);
  };

  const handleAdjustment = (productId, newValue) => {
    setAuditAdjustments(prev => ({
      ...prev,
      [productId]: parseInt(newValue)
    }));
  };

  const handleSaveAudit = () => {
    // 1. Loop through your local changes and update the global state
    const adjustments = Object.entries(auditAdjustments).filter(([id, newValue]) => {
      const product = products.find(p => p.id === parseInt(id));
      return product && newValue !== product.stock_available;
    });

    if (adjustments.length > 0) {
      // In a real app, this would update global state and create adjustment transactions
      addToast("Inventory Audit Completed & Synced", "success");
      setAuditAdjustments({});
      setIsAuditMode(false);
    } else {
      addToast('No adjustments needed', 'info');
      setIsAuditMode(false);
    }
  };

  const handleBulkRestock = () => {
    const lowStockItems = products.filter(p => p.stock_available < 10);
    if (lowStockItems.length === 0) {
      addToast('All items are sufficiently stocked', 'info');
      return;
    }
    
    // Simulation of Odoo API call
    addToast(`Draft PO #882 created in Odoo for ${lowStockItems.length} items`, 'success');
    
    // Logic to show "Requested" status in UI
    setProducts(prev => prev.map(p => 
      p.stock_available < 10 ? { ...p, status: 'Restock Requested' } : p
    ));
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    const product = products.find(p => p.location === location);
    if (product) {
      setSelectedProduct(product);
    }
  };

  // Clear lastUpdated flag after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(prev => prev.map(p => ({ ...p, lastUpdated: false })));
    }, 2000); // Clear after 2 seconds
    return () => clearTimeout(timer);
  }, [products]);

  // Frontend Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      addToast("No products to export.", "error");
      return;
    }

    // 1. Define the CSV headers
    const headers = ["SKU", "Product Name", "Category", "Stock Level", "UOM"];
    
    // 2. Map the filtered data to CSV rows
    const rows = filteredProducts.map(p => 
      `${p.sku},"${p.name}",${p.category},${p.qty_available || p.stock_available},${p.uom}` 
    );
    
    // 3. Combine headers and rows
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    
    // 4. Trigger the hidden download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexus_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 5. Show the premium success popup!
    addToast("Inventory exported to CSV successfully!", "success");
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      // Integration Manager will add logic here to refresh the product list
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans pb-24 relative">

      {/* Error State */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span className="text-sm font-medium">Backend Offline: {error}</span>
          </div>
        </div>
      )}

      {/* NEW: Create Product Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-bold">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Product Name *</label>
                  <input type="text" required placeholder="e.g. Titanium Screws" className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">SKU / Code *</label>
                  <input type="text" required placeholder="e.g. TIT-01" className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none transition-colors font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Category</label>
                  <select className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none transition-colors appearance-none">
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Networking">Networking</option>
                    <option value="Storage">Storage</option>
                    <option value="Audio">Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Unit of Measure</label>
                  <select className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none transition-colors appearance-none">
                    <option value="Units">Units</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="m">Meters (m)</option>
                    <option value="L">Liters (L)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Initial Stock</label>
                  <input type="number" min="0" defaultValue="0" className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:border-[#ccff00] outline-none transition-colors" />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 rounded-xl font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-[#ccff00] text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header & Primary Action */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Inventory Master</h1>
          <p className="text-neutral-500">Manage your product catalog and view live stock levels.</p>
        </div>
        
        {/* BUTTON CONTAINER */}
        <div className="flex gap-3 w-full md:w-auto flex-wrap">
          
          {/* AUDIT MODE TOGGLE */}
          {isAuditMode ? (
            <button 
              onClick={handleSaveAudit}
              className="flex-1 md:flex-none bg-red-500 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Save Audit
            </button>
          ) : (
            <button 
              onClick={() => setIsAuditMode(true)}
              className="flex-1 md:flex-none bg-orange-500/20 border border-orange-500/30 text-orange-400 px-5 py-3 rounded-xl font-bold text-sm hover:bg-orange-500/30 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              Audit Mode
            </button>
          )}
          
          {/* NEW EXPORT BUTTON */}
          <button 
            onClick={handleExportCSV}
            className="flex-1 md:flex-none bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export CSV
          </button>

          {/* PROCUREMENT BUTTON */}
          <button 
            onClick={handleBulkRestock}
            className="flex-1 md:flex-none bg-purple-500/20 border border-purple-500/30 text-purple-400 px-5 py-3 rounded-xl font-bold text-sm hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            Bulk Restock
          </button>

          {/* YOUR EXISTING ADD PRODUCT BUTTON */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-[#ccff00] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.15)] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Product
          </button>

        </div>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">

        {/* Search Bar */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input
            type="text"
            placeholder="Search by Product Name or SKU..."
            className="w-full bg-black/50 border border-white/10 pl-11 pr-4 py-3 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto items-center pb-2 md:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Warehouse Heatmap */}
      <Heatmap products={products} onSelectLocation={handleSelectLocation} />

      {/* The Product Data Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">SKU</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Product Name</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock Level</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock-Out Risk</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Sales Price</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Cost</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr 
                      key={product.id} 
                      onClick={() => setSelectedProduct(product)}
                      className={`transition-all duration-1000 hover:bg-white/5 group cursor-pointer ${
                        product.lastUpdated ? 'bg-[#ccff00]/20 border-[#ccff00]' : 'border-white/5'
                      }`}
                    >
                      <td className="p-4 font-mono text-sm text-[#ccff00]">{product.sku}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{product.name}</div>
                        <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-1">
                          <Truck size={10} /> {product.best_supplier} ({product.lead_time})
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full text-neutral-300 border border-white/5">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {isAuditMode ? (
                            <input
                              type="number"
                              defaultValue={product.qty_available || product.stock_available}
                              onChange={(event) => {
                                const newValue = parseInt(event.target.value) || 0;
                                // Call your update logic
                                handleAdjustment(product.id, newValue);
                                
                                // Dynamic styling: change border color based on discrepancy
                                if (newValue !== (product.qty_available || product.stock_available)) {
                                  event.target.style.borderColor = '#ef4444'; // Red for discrepancy
                                  event.target.style.color = '#ef4444';
                                } else {
                                  event.target.style.borderColor = '#ccff00'; // Electric Lime for match
                                  event.target.style.color = '#ccff00';
                                }
                              }}
                              className="w-24 bg-black/40 border border-white/20 rounded-lg px-2 py-1 outline-none transition-all font-mono text-sm"
                            />
                          ) : (
                            <span className={`font-mono transition-all duration-500 ${
                              (product.qty_available || product.stock_available) < 10 ? 'text-red-400' : 'text-[#ccff00]'
                            } ${product.lastUpdated ? 'text-[#ccff00] scale-125' : ''}`}>
                              {product.qty_available || product.stock_available}
                            </span>
                          )}
                          
                          {/* THE QUICK RESTOCK BUTTON */}
                          {!isAuditMode && (product.qty_available || product.stock_available) < 10 && (
                            <button 
                              onClick={() => handleQuickRestock(product.name)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all group"
                              title="Quick Restock"
                            >
                              <Plus size={14} className="group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {/* Stock-Out Predictor */}
                        {(() => {
                          const velocity = product.category === 'Electronics' ? 2 : 5; // units per day
                          const daysLeft = Math.floor((product.qty_available || product.stock_available) / velocity);
                          return (
                            <div className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              daysLeft < 3 ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-[#ccff00]/10 border-[#ccff00]/50 text-[#ccff00]'
                            }`}>
                              {daysLeft <= 0 ? 'OUT OF STOCK' : `${daysLeft} Days Left`}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="p-4">
                        {/* Sales Price with Margin Alert */}
                        {(() => {
                          const margin = ((product.sales_price - product.cost) / product.sales_price) * 100;
                          return (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#ccff00]">
                                {formatINR(product.sales_price)}
                              </span>
                              {margin < 15 && (
                                <span className="text-orange-500" title="Low Margin Warning!">
                                  <AlertCircle size={14} />
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-neutral-400">
                          {formatINR(product.cost)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-neutral-500 hover:text-white transition-colors p-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Premium Empty State */
                  <tr>
                    <td colSpan="8" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-500">
                        <svg className="w-12 h-12 mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        <p className="text-lg font-medium text-neutral-400 mb-1">No products found</p>
                        <p className="text-sm">Try adjusting your search or add a new product.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Journey Drawer */}
      <ProductDrawer 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

    </div>
  );
};

export default Products;
