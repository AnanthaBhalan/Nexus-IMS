import React, { useState } from 'react';
import SkeletonTable from '../ui/SkeletonTable';
import { useToast } from '../ui/ToastContext';

// Mock Data
const mockProducts = [
  { id: 1, name: "Steel Rods", sku: "STL-01", category: "Raw Materials", uom: "kg", stock_available: 150 },
  { id: 2, name: "Lithium Batteries", sku: "BAT-99", category: "Components", uom: "Units", stock_available: 5 },
  { id: 3, name: "Copper Wire", sku: "COP-02", category: "Raw Materials", uom: "m", stock_available: 1200 },
  { id: 4, name: "Pallet Racks", sku: "RACK-10", category: "Assets", uom: "Units", stock_available: 0 },
  { id: 5, name: "Safety Helmets", sku: "SAF-01", category: "Consumables", uom: "Units", stock_available: 45 },
];

const categories = ['All', 'Raw Materials', 'Components', 'Consumables', 'Assets'];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const { addToast } = useToast(); // Initialize the toast system

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      addToast("No products to export.", "error");
      return;
    }

    // 1. Define the CSV headers
    const headers = ["SKU", "Product Name", "Category", "Stock Level", "UOM"];
    
    // 2. Map the filtered data to CSV rows
    const rows = filteredProducts.map(p => 
      `${p.sku},"${p.name}",${p.category},${p.stock_available},${p.uom}` 
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
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Components">Components</option>
                    <option value="Consumables">Consumables</option>
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
        <div className="flex gap-3 w-full md:w-auto">
          
          {/* NEW EXPORT BUTTON */}
          <button 
            onClick={handleExportCSV}
            className="flex-1 md:flex-none bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export CSV
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
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-mono text-sm text-[#ccff00]">{product.sku}</td>
                      <td className="p-4 text-sm font-bold text-white">{product.name}</td>
                      <td className="p-4">
                        <span className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full text-neutral-300 border border-white/5">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-bold ${product.stock_available === 0 ? 'text-red-500' : product.stock_available < 10 ? 'text-orange-400' : 'text-white'}`}>
                            {product.stock_available}
                          </span>
                          <span className="text-xs text-neutral-500 uppercase">{product.uom}</span>

                          {product.stock_available === 0 && (
                            <span className="text-[10px] font-bold text-black bg-red-500 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                              Empty
                            </span>
                          )}
                        </div>
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
                    <td colSpan="5" className="p-16 text-center">
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

    </div>
  );
};

export default Products;
