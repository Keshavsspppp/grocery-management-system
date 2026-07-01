import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingBasket, Store, ShoppingCart, Package, Plus, Trash2, Hexagon, Sparkles } from 'lucide-react';
import UiverseButton from '@/components/UiverseButton';

const API_URL = 'http://127.0.0.1:5000/api';

const CATEGORIES = [
  'Dairy', 'Beverages', 'Snacks', 'Fruits and Vegetables',
  'Grains and Cereals', 'Bakery', 'Meat and Seafood',
  'Frozen Foods', 'Household', 'Other'
];

export default function App() {
  const [view, setView] = useState('customer');
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const [newItem, setNewItem] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newCategory, setNewCategory] = useState('Other');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('All');

  const loadData = async () => {
    try {
      const prodRes = await fetch(`${API_URL}/products`);
      if (prodRes.ok) setInventory(await prodRes.json());
      
      const cartRes = await fetch(`${API_URL}/cart`);
      if (cartRes.ok) {
        const data = await cartRes.json();
        setCart(data.cart);
        setTotalPrice(data.total_price);
      }
    } catch (e) {
      console.error('API Error:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToCart = async (item) => {
    await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, qty: 1 })
    });
    loadData();
  };

  const updateCartQty = async (item, qty) => {
    await fetch(`${API_URL}/cart/${item}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty: parseInt(qty) })
    });
    loadData();
  };

  const removeFromCart = async (item) => {
    await fetch(`${API_URL}/cart/${item}`, { method: 'DELETE' });
    loadData();
  };

  const addProduct = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: newItem, price: parseFloat(newPrice), qty: parseInt(newQty), category: newCategory })
    });
    setNewItem(''); setNewPrice(''); setNewQty(''); setNewCategory('Other');
    loadData();
  };

  const updateProductPrice = async (item, price) => {
    await fetch(`${API_URL}/products/${item}/price`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: parseFloat(price) })
    });
    loadData();
  };

  const updateProductQty = async (item, qty) => {
    await fetch(`${API_URL}/products/${item}/qty`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty: parseInt(qty) })
    });
    loadData();
  };

  const deleteProduct = async (item) => {
    await fetch(`${API_URL}/products/${item}`, { method: 'DELETE' });
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-200 flex flex-col items-center overflow-x-hidden font-sans selection:bg-indigo-500/30 relative">
      
      {/* Decorative ambient background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>
      
      <div className="w-full max-w-7xl p-4 sm:p-6 lg:p-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center py-6 px-8 mb-10 bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl rounded-3xl shadow-2xl gap-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <Hexagon className="w-8 h-8 text-indigo-400" strokeWidth={2} /> 
            Stock Smart
          </div>
          <nav className="flex gap-2 p-1 bg-black/40 rounded-full border border-white/[0.05]">
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${view === 'customer' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              onClick={() => setView('customer')}>
              Customer Shop
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${view === 'admin' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              onClick={() => setView('admin')}>
              Admin Dashboard
            </button>
          </nav>
        </header>

        {view === 'customer' && (
          <>
            {/* Category Filter Pills */}
            <div className="mb-10 flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              <button 
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${selectedCategory === 'All' ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 hover:border-white/10'}`}
                onClick={() => setSelectedCategory('All')}>
                All
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${selectedCategory === cat ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 hover:border-white/10'}`}
                  onClick={() => setSelectedCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Product Grid Panel */}
              <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Store className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-200 tracking-tight">Products</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(inventory).length === 0 ? (
                     <div className="col-span-full text-center text-slate-500 py-12 flex flex-col items-center gap-4">
                       <Sparkles className="w-8 h-8 text-slate-600" />
                       <p>No products available right now.</p>
                     </div>
                  ) : (
                    Object.keys(inventory).filter(item => {
                      const [, , category = 'Other'] = inventory[item];
                      return selectedCategory === 'All' || category === selectedCategory;
                    }).map(item => {
                      const [price, qty, category = 'Other'] = inventory[item];
                      return (
                        <div key={item} className="group relative border border-white/[0.05] rounded-3xl p-6 text-center bg-white/[0.01] hover:bg-white/[0.04] hover:border-indigo-500/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.3)] transition-all duration-500">
                          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/0 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          
                          <div className="text-4xl mb-5 text-indigo-400/80 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                            <Package className="w-12 h-12 drop-shadow-[0_0_15px_rgba(79,70,229,0.2)]" strokeWidth={1.5} />
                          </div>
                          <div className="font-semibold text-slate-200 capitalize text-lg mb-1">{item}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/70 mb-4">{category}</div>
                          
                          <div className="flex items-end justify-center gap-1 mb-6">
                            <span className="text-sm text-slate-400 mb-1">$</span>
                            <span className="text-2xl font-bold text-slate-200">{price}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs text-slate-400 mb-6 bg-black/30 px-3 py-1.5 rounded-full border border-white/5">
                            <span>Stock</span>
                            <span className={qty > 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>{qty > 0 ? qty : 'Sold Out'}</span>
                          </div>

                          <UiverseButton className="w-full text-sm font-semibold h-11 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)]" disabled={qty === 0} onClick={() => addToCart(item)}>
                            <Plus className="w-4 h-4 mr-2"/> Add to Cart
                          </UiverseButton>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
              
              {/* Cart Panel */}
              <div>
                <div className="sticky top-6 bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-200 tracking-tight">Your Cart</h2>
                  </div>
                  
                  <div className="max-h-[500px] overflow-y-auto pr-4 flex flex-col gap-4 mb-8 custom-scrollbar">
                    {Object.keys(cart).length === 0 ? (
                      <div className="text-slate-500 text-sm text-center py-8">Your cart is feeling light.</div>
                    ) : (
                      Object.keys(cart).map(item => {
                        const [price, qty] = cart[item];
                        return (
                          <div key={item} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
                            <div>
                              <div className="font-semibold text-slate-200 capitalize text-sm mb-1">{item}</div>
                              <div className="text-xs font-medium text-slate-400">${price} <span className="text-slate-600 mx-1">×</span> {qty}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Input 
                                type="number" 
                                className="w-16 h-9 bg-black/40 border-white/10 text-slate-300 text-sm px-2 text-center rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" 
                                value={qty} 
                                onChange={(e) => updateCartQty(item, e.target.value)}
                                min="0"
                              />
                              <button className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors" onClick={() => removeFromCart(item)}>
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex justify-between items-center text-sm font-semibold text-indigo-100 mb-8">
                    <span>Total Amount</span>
                    <span className="text-lg text-indigo-300">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <UiverseButton className="w-full text-sm font-semibold h-12 shadow-[0_0_20px_rgba(79,70,229,0.25)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]" disabled={Object.keys(cart).length === 0}>
                    Proceed to Checkout
                  </UiverseButton>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'admin' && (
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Add Product Panel */}
            <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Store className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-200 tracking-tight">Add New Product</h2>
              </div>
              
              <form onSubmit={addProduct} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
                <Input placeholder="Product Name" className="md:col-span-1 bg-black/40 border-white/10 text-slate-200 h-12 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" value={newItem} onChange={e => setNewItem(e.target.value)} required />
                <Input type="number" step="0.01" min="0" placeholder="Price ($)" className="md:col-span-1 bg-black/40 border-white/10 text-slate-200 h-12 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" value={newPrice} onChange={e => setNewPrice(e.target.value)} required />
                <Input type="number" min="1" placeholder="Stock Qty" className="md:col-span-1 bg-black/40 border-white/10 text-slate-200 h-12 rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" value={newQty} onChange={e => setNewQty(e.target.value)} required />
                <select className="md:col-span-1 bg-black/40 border-white/10 text-slate-200 rounded-xl px-4 border text-sm h-12 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
                </select>
                <UiverseButton type="submit" className="md:col-span-1 h-12 text-sm font-semibold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)]">Add Product</UiverseButton>
              </form>
            </div>

            {/* Inventory Panel */}
            <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Package className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-200 tracking-tight">Live Inventory</h2>
                </div>
                
                <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-xl border border-white/10">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-3">Filter:</span>
                  <select className="bg-transparent border-0 text-indigo-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-0 cursor-pointer" value={adminCategoryFilter} onChange={e => setAdminCategoryFilter(e.target.value)}>
                    <option value="All" className="bg-slate-900">All Categories</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-slate-400 font-semibold h-12 px-6">Product</TableHead>
                      <TableHead className="text-slate-400 font-semibold h-12">Category</TableHead>
                      <TableHead className="text-slate-400 font-semibold text-right h-12">Price</TableHead>
                      <TableHead className="text-slate-400 font-semibold text-right h-12">Stock</TableHead>
                      <TableHead className="h-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(inventory).filter(item => {
                      const [, , category = 'Other'] = inventory[item];
                      return adminCategoryFilter === 'All' || category === adminCategoryFilter;
                    }).length === 0 ? (
                      <TableRow className="border-0">
                        <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                          <div className="flex flex-col items-center gap-3">
                            <Sparkles className="w-6 h-6 text-slate-600" />
                            <span>Inventory matches no results.</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      Object.keys(inventory).filter(item => {
                        const [, , category = 'Other'] = inventory[item];
                        return adminCategoryFilter === 'All' || category === adminCategoryFilter;
                      }).map(item => {
                        const [price, qty, category = 'Other'] = inventory[item];
                        return (
                          <TableRow key={item} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                            <TableCell className="capitalize font-medium text-slate-200 px-6 py-4">{item}</TableCell>
                            <TableCell>
                              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-widest uppercase">
                                {category}
                              </span>
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-slate-500 text-sm">$</span>
                                <Input type="number" step="0.01" className="w-24 h-9 bg-black/40 border-white/5 text-slate-200 text-right px-3 rounded-lg focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" defaultValue={price} onBlur={(e) => updateProductPrice(item, e.target.value)} />
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <Input type="number" className="w-20 ml-auto h-9 bg-black/40 border-white/5 text-slate-200 text-right px-3 rounded-lg focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" defaultValue={qty} onBlur={(e) => updateProductQty(item, e.target.value)} />
                            </TableCell>
                            <TableCell className="text-right px-6 py-4">
                              <button className="text-slate-500 hover:text-red-400 p-2.5 rounded-xl hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" onClick={() => deleteProduct(item)} title="Delete Product">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Global Scrollbar Customization embedded to avoid external CSS requirements */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
