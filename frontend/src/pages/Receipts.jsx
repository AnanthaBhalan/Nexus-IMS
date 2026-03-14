import React, { useState, useEffect } from 'react';
import { getTransactionHistory } from '../api/api';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatINR } from '../utils';

const Receipts = ({ products, onUpdateStock }) => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'receipts', 'deliveries'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('receipt'); // 'receipt' or 'delivery'

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTransactionHistory();
        setTransactions(data);
      } catch (error) {
        setError(error.message);
        console.error('Failed to load transaction history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleCreateTransaction = (formData) => {
    // 1. Calculate change (Positive for Receipt, Negative for Delivery)
    const change = modalType === 'receipt' ? parseInt(formData.qty) : -parseInt(formData.qty);
    
    // 2. Update the Global State!
    onUpdateStock(formData.product, change);
    
    // 3. Create the transaction entry
    const newEntry = {
      id: modalType === 'receipt' ? `REC-${Date.now().toString().slice(-3)}` : `ORD-${Date.now().toString().slice(-3)}`,
      type: modalType === 'receipt' ? 'Receipt' : 'Delivery',
      partner: formData.partner,
      product: formData.product,
      quantity: modalType === 'receipt' ? `+${formData.qty}` : `-${formData.qty}`,
      status: 'Pending',
      date: 'Just Now',
      amount: formatINR(formData.price * formData.qty)
    };
    
    setTransactions([newEntry, ...transactions]);
    setShowModal(false);
    // showToast(`${modalType === 'receipt' ? 'Receipt' : 'Order'} created successfully!`, 'success');
  };

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'all') return true;
    return activeTab === 'receipts' ? t.type === 'Receipt' : t.type === 'Delivery';
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans pb-24">
      
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Operation History</h1>
          <p className="text-neutral-500">Track all inbound receipts and outbound customer orders.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => { setModalType('receipt'); setShowModal(true); }}
              className="bg-[#ccff00] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition-all"
            >
              <ArrowDownLeft size={20} /> Receive Stock
            </button>
            
            <button 
              onClick={() => { setModalType('delivery'); setShowModal(true); }}
              className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-white/10 hover:bg-white/20 transition-all"
            >
              <ArrowUpRight size={20} /> Create Delivery
            </button>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            {['all', 'receipts', 'deliveries'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  activeTab === tab ? 'bg-[#ccff00] text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Partner</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Quantity</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="p-4 font-mono text-sm text-[#ccff00]">{transaction.id}</td>
                      <td className="p-4">
                        <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                          transaction.type === 'Receipt' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium">{transaction.partner}</td>
                      <td className="p-4 text-sm font-medium">{transaction.product}</td>
                      <td className={`p-4 text-sm font-bold ${
                        transaction.quantity.startsWith('+') ? 'text-[#ccff00]' : 'text-white'
                      }`}>
                        {transaction.quantity}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            transaction.status === 'Completed' ? 'bg-[#ccff00]' :
                            transaction.status === 'Processing' ? 'bg-orange-400' :
                            transaction.status === 'Shipped' ? 'bg-blue-400' :
                            'bg-green-400'
                          }`}></div>
                          <span className="text-sm text-neutral-400">{transaction.status}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-neutral-500">{transaction.date}</td>
                      <td className="p-4 text-sm font-bold text-white">{transaction.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-500">
                        <svg className="w-12 h-12 mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="text-lg font-medium text-neutral-400 mb-1">No transactions found</p>
                        <p className="text-sm">Try selecting a different tab or check back later.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
          <div className={`bg-[#0A0A0A] border rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ${
            modalType === 'receipt' 
              ? 'border-green-500/20' 
              : 'border-purple-500/20'
          }`}>
            <div className={`p-6 border-b flex justify-between items-center bg-white/[0.02] ${
              modalType === 'receipt' 
                ? 'border-green-500/20' 
                : 'border-purple-500/20'
            }`}>
              <h2 className="text-xl font-bold">
                {modalType === 'receipt' ? 'Receive Stock' : 'Create Delivery'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                partner: e.target.partner.value,
                product: e.target.product.value,
                qty: parseInt(e.target.qty.value),
                price: parseFloat(e.target.price.value),
              };
              handleCreateTransaction(formData);
            }} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  {modalType === 'receipt' ? 'Supplier' : 'Customer'} *
                </label>
                <input 
                  type="text" 
                  name="partner"
                  required 
                  placeholder={modalType === 'receipt' ? 'e.g. NVIDIA Corp' : 'e.g. TechRetail Inc'}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#ccff00] transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Product *</label>
                <input 
                  type="text" 
                  name="product"
                  required 
                  placeholder="e.g. NVIDIA RTX 4060"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#ccff00] transition-colors" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Quantity *</label>
                  <input 
                    type="number" 
                    name="qty"
                    min="1" 
                    required 
                    defaultValue="1"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#ccff00] transition-colors" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Unit Price *</label>
                  <input 
                    type="number" 
                    name="price"
                    min="0" 
                    step="0.01"
                    required 
                    defaultValue="1000"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#ccff00] transition-colors" 
                  />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3 rounded-xl font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  modalType === 'receipt' 
                    ? 'bg-green-500 text-black hover:bg-green-400' 
                    : 'bg-purple-500 text-white hover:bg-purple-400'
                }`}>
                  {modalType === 'receipt' ? 'Receive Stock' : 'Create Delivery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;
