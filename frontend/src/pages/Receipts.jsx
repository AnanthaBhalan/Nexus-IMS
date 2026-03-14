import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/api';

const Receipts = () => {
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState('');
  const [reference, setReference] = useState('');
  // Initialize with one empty line item
  const [lineItems, setLineItems] = useState([{ productId: '', quantity: 1 }]);
  const [isValidating, setIsValidating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products for receipts:', error);
      }
    };

    loadProducts();
  }, []);

  const handleAddLine = () => {
    setLineItems([...lineItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveLine = (indexToRemove) => {
    if (lineItems.length === 1) return; // Keep at least one line
    setLineItems(lineItems.filter((_, index) => index !== indexToRemove));
  };

  const handleLineChange = (index, field, value) => {
    const newLines = [...lineItems];
    newLines[index][field] = value;
    setLineItems(newLines);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsValidating(true);

    // This is the exact JSON structure defined in your API_CONTRACT.md
    const payload = {
      supplier: supplier,
      reference: reference,
      items: lineItems.map(line => ({
        product_id: parseInt(line.productId),
        quantity_received: parseInt(line.quantity)
      }))
    };

    console.log("Payload ready for Odoo API:", payload);

    // Simulate network delay for the hackathon presentation
    setTimeout(() => {
      setIsValidating(false);
      setShowSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setSupplier('');
        setReference('');
        setLineItems([{ productId: '', quantity: 1 }]);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans pb-24 relative">

      {/* Toast Notification (Pops up when successful) */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className="bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          Receipt Validated Successfully! Stock Increased.
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Incoming Receipts</h1>
        <p className="text-neutral-500">Log incoming deliveries from vendors to update live stock.</p>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
        <form onSubmit={handleSubmit}>

          {/* Top Section: General Info */}
          <div className="p-6 md:p-8 border-b border-white/10 bg-white/[0.02]">
            <h2 className="text-xl font-bold mb-6">Delivery Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Supplier / Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g. Apex Industrial Corp"
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Reference / PO Number</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. PO-2026-089"
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Middle Section: Line Items */}
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Received Items</h2>
            </div>

            <div className="space-y-4">
              {lineItems.map((line, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-black/20 p-4 rounded-xl border border-white/5">

                  <div className="w-full md:w-2/3">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Product *</label>
                    <select
                      required
                      value={line.productId}
                      onChange={(e) => handleLineChange(index, 'productId', e.target.value)}
                      className="w-full bg-black/80 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#ccff00] transition-colors appearance-none"
                    >
                      <option value="" disabled>Select a product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full md:w-1/4">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={line.quantity}
                      onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                      className="w-full bg-black/80 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#ccff00] transition-colors"
                    />
                  </div>

                  <div className="w-full md:w-auto flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(index)}
                      disabled={lineItems.length === 1}
                      className="p-3 text-neutral-500 hover:text-red-500 disabled:opacity-30 disabled:hover:text-neutral-500 transition-colors bg-white/5 hover:bg-red-500/10 rounded-xl"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Line Button */}
            <button
              type="button"
              onClick={handleAddLine}
              className="mt-4 px-4 py-2 border border-[#ccff00]/50 text-[#ccff00] text-sm font-bold rounded-xl hover:bg-[#ccff00]/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Add Another Product
            </button>
          </div>

          {/* Bottom Section: Submit */}
          <div className="p-6 md:p-8 border-t border-white/10 bg-black/40 flex justify-end items-center">
            <button
              type="submit"
              disabled={isValidating}
              className="w-full md:w-auto bg-[#ccff00] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isValidating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Syncing to Odoo...
                </>
              ) : (
                'Validate Receipt'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Receipts;
