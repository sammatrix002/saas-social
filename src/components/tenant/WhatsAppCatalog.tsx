import React, { useState } from 'react';
import { CatalogItem } from '../../types.ts';
import {
  ShoppingBag,
  Plus,
  ShoppingCart,
  CheckCircle2,
  ExternalLink,
  Tag,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface WhatsAppCatalogProps {
  catalogItems: CatalogItem[];
  onAddToCart?: (item: CatalogItem) => void;
  onLaunchCart?: () => void;
}

export const WhatsAppCatalog: React.FC<WhatsAppCatalogProps> = ({
  catalogItems,
}) => {
  const [cart, setCart] = useState<{ item: CatalogItem; qty: number }[]>([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleAddToCart = (item: CatalogItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => (i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const totalAmount = cart.reduce((acc, curr) => acc + curr.item.price * curr.qty, 0);

  const handleSimulateCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCart([]);
      setCheckoutSuccess(false);
    }, 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              WhatsApp Interactive Catalog & Cart Checkout
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              In-Chat eCommerce
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Sync catalog items, showcase multi-item carousels, and allow buyers to complete 1-click cart checkouts inside WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-[#0A1020] border border-[#1E2B45] text-xs text-slate-300 flex items-center gap-2 shadow-sm">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span>Cart Items: <strong className="text-white">{cart.reduce((a, b) => a + b.qty, 0)}</strong></span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-bold tabular-nums font-mono">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Products Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {catalogItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#10182A] border border-[#1E2B45] hover:border-[#2B3D60] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-slate-700">
                      {item.sku}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-white line-clamp-1">{item.name}</h3>
                      <span className="text-sm font-extrabold text-emerald-400 tabular-nums">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                      <Tag className="w-3 h-3 text-cyan-400" />
                      <span>{item.category}</span>
                      <span>·</span>
                      <span className="text-emerald-400">In Stock</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to WhatsApp Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live WhatsApp Cart Checkout Simulation Drawer */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                WhatsApp In-Chat Cart
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">1-Click Checkout</span>
          </div>

          {checkoutSuccess ? (
            <div className="p-6 text-center space-y-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-xs font-bold text-white">WhatsApp Order Placed!</div>
              <div className="text-[11px] text-slate-300">
                Automated payment link generated via Stripe / MyFatoorah. Notification dispatched to customer.
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Your WhatsApp cart is empty. Tap "Add to WhatsApp Cart" on any product to simulate customer in-chat checkout.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cart.map((c) => (
                  <div
                    key={c.item.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-white truncate">{c.item.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Qty: {c.qty} × ${c.item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400 tabular-nums">
                        ${(c.item.price * c.qty).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveFromCart(c.item.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs px-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-white tabular-nums">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>VAT / Taxes (Auto Calc)</span>
                  <span className="text-slate-400">$0.00 (Inclusive)</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
                  <span>Total In-Chat Order</span>
                  <span className="text-emerald-400 tabular-nums">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSimulateCheckout}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Simulate 1-Click WhatsApp Checkout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
