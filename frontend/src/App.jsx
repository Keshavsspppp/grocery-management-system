import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingBasket, Store, ShoppingCart, Package, Plus, Trash2 } from 'lucide-react';
import UiverseButton from '@/components/UiverseButton';
import Scene3D from '@/components/Scene3D';
import Tilt from 'react-parallax-tilt';

const API_URL = 'http://127.0.0.1:5000/api';

export default function App() {
  const [view, setView] = useState('customer');
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const [newItem, setNewItem] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newQty, setNewQty] = useState('');

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
      body: JSON.stringify({ item: newItem, price: parseFloat(newPrice), qty: parseInt(newQty) })
    });
    setNewItem(''); setNewPrice(''); setNewQty('');
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center overflow-x-hidden relative">
      <Scene3D />
      
      <div className="z-10 w-full max-w-6xl p-6 relative backdrop-blur-[2px]">
        <header className="flex flex-col md:flex-row justify-between items-center py-6 mb-8 border-b border-slate-700 gap-4">
          <div className="text-2xl font-bold text-blue-500 flex items-center gap-2">
            <ShoppingBasket /> Stock Smart
          </div>
          <nav className="flex gap-2">
            <Button variant={view === 'customer' ? 'default' : 'secondary'} onClick={() => setView('customer')}>Customer View</Button>
            <Button variant={view === 'admin' ? 'default' : 'secondary'} onClick={() => setView('admin')}>Admin Dashboard</Button>
          </nav>
        </header>

        {view === 'customer' && (
          <div className="grid md:grid-cols-3 gap-6">
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.15} glareBorderRadius="0.75rem" scale={1.01} className="md:col-span-2">
              <Card className="h-full bg-slate-800/80 backdrop-blur-md border-slate-700/50 text-slate-100 shadow-2xl">
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><Store /> Shop</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(inventory).length === 0 ? (
                   <div className="col-span-full text-center text-slate-400 py-10">No products available.</div>
                ) : (
                  Object.keys(inventory).map(item => {
                    const [price, qty] = inventory[item];
                    return (
                      <div key={item} className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center hover:border-blue-500 transition-colors">
                        <div className="text-3xl mb-3 text-slate-400 flex justify-center"><Package className="w-10 h-10" /></div>
                        <div className="font-semibold text-lg capitalize">{item}</div>
                        <div className="text-green-400 font-bold mb-1">${price}</div>
                        <div className="text-sm text-slate-500 mb-4">{qty} in stock</div>
                        <UiverseButton className="w-full" disabled={qty === 0} onClick={() => addToCart(item)}>
                          <Plus className="w-4 h-4 mr-2"/> Add
                        </UiverseButton>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
            </Tilt>
            
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.15} glareBorderRadius="0.75rem" scale={1.01} className="h-full">
              <Card className="bg-slate-800/80 backdrop-blur-md border-slate-700/50 text-slate-100 shadow-2xl h-full flex flex-col">
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShoppingCart /> Your Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto pr-2 flex flex-col gap-4">
                  {Object.keys(cart).length === 0 ? (
                    <div className="text-center text-slate-400 py-6">Your cart is empty.</div>
                  ) : (
                    Object.keys(cart).map(item => {
                      const [price, qty] = cart[item];
                      return (
                        <div key={item} className="flex justify-between items-center pb-3 border-b border-slate-700">
                          <div>
                            <div className="font-semibold capitalize">{item}</div>
                            <div className="text-sm text-slate-400">${price} x {qty}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number" 
                              className="w-16 h-8 bg-slate-900 border-slate-700 text-white" 
                              value={qty} 
                              onChange={(e) => updateCartQty(item, e.target.value)}
                              min="0"
                            />
                            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-400">${totalPrice.toFixed(2)}</span>
                </div>
                <UiverseButton className="w-full mt-auto" size="lg">Checkout</UiverseButton>
              </CardContent>
            </Card>
            </Tilt>
          </div>
        )}

        {view === 'admin' && (
          <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable={true} glareMaxOpacity={0.1} glareBorderRadius="0.75rem" scale={1.01}>
            <Card className="bg-slate-800/80 backdrop-blur-md border-slate-700/50 text-slate-100 shadow-2xl">
              <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package /> Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addProduct} className="flex flex-col sm:flex-row gap-4 mb-6 bg-slate-900 p-4 rounded-xl border border-slate-700">
                <Input placeholder="Product Name" className="bg-slate-800 border-slate-700 text-white" value={newItem} onChange={e => setNewItem(e.target.value)} required />
                <Input type="number" step="0.01" min="0" placeholder="Price" className="bg-slate-800 border-slate-700 text-white" value={newPrice} onChange={e => setNewPrice(e.target.value)} required />
                <Input type="number" min="1" placeholder="Quantity" className="bg-slate-800 border-slate-700 text-white" value={newQty} onChange={e => setNewQty(e.target.value)} required />
                <UiverseButton type="submit" className="whitespace-nowrap">Add Product</UiverseButton>
              </form>

              <div className="overflow-x-auto rounded-lg border border-slate-700">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="border-slate-700 hover:bg-transparent">
                      <TableHead className="text-slate-400">Product</TableHead>
                      <TableHead className="text-slate-400">Price</TableHead>
                      <TableHead className="text-slate-400">Quantity</TableHead>
                      <TableHead className="text-slate-400 w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(inventory).length === 0 ? (
                      <TableRow className="border-slate-700">
                        <TableCell colSpan={4} className="text-center py-6 text-slate-400">Inventory is empty.</TableCell>
                      </TableRow>
                    ) : (
                      Object.keys(inventory).map(item => {
                        const [price, qty] = inventory[item];
                        return (
                          <TableRow key={item} className="border-slate-700 hover:bg-slate-800/50">
                            <TableCell className="capitalize font-medium">{item}</TableCell>
                            <TableCell>
                              <Input type="number" step="0.01" className="w-24 bg-slate-900 border-slate-700 text-white" defaultValue={price} onBlur={(e) => updateProductPrice(item, e.target.value)} />
                            </TableCell>
                            <TableCell>
                              <Input type="number" className="w-24 bg-slate-900 border-slate-700 text-white" defaultValue={qty} onBlur={(e) => updateProductQty(item, e.target.value)} />
                            </TableCell>
                            <TableCell>
                              <Button variant="destructive" size="sm" onClick={() => deleteProduct(item)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          </Tilt>
        )}
      </div>
    </div>
  );
}
