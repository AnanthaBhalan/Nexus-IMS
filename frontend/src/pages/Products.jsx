import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productApi';

const categories = ['All', 'Raw Materials', 'Components', 'Consumables', 'Assets'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        setProducts(await getProducts());
      } catch (e) {
        console.error('Failed to load products', e);
      }
    };

    load();
  }, []);

  // Frontend Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans pb-24">
      
      {/* Header & Primary Action */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Inventory Master</h1>
          <p className="text-neutral-500">Manage your product catalog and view live stock levels.</p>
        </div>
        
        <button className="bg-[#ccff00] text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.15)] flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Product
        </button>
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
                <tr>
                  <td colSpan="5" className="p-8 text-center text-neutral-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Products;
