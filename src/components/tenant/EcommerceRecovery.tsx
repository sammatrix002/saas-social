import React, { useState } from 'react';
import { AbandonedCart } from '../../types.ts';
import {
  ShoppingBag,
  Clock,
  Send,
  CheckCircle2,
  TrendingUp,
  Tag,
  ExternalLink,
  DollarSign,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface EcommerceRecoveryProps {
  abandonedCarts: AbandonedCart[];
  onDispatchRecovery: (cartId: string) => void;
}

export const EcommerceRecovery: React.FC<EcommerceRecoveryProps> = ({
  abandonedCarts,
  onDispatchRecovery,
}) => {
  const [carts, setCarts] = useState<AbandonedCart[]>(abandonedCarts);

  const handleDispatch = (cartId: string) => {
    setCarts((prev) =>
      prev.map((c) => (c.id === cartId ? { ...c, recoveryStatus: 'dispatched' } : c))
    );
    onDispatchRecovery(cartId);
    alert('Automated 30-min WhatsApp abandoned cart recovery dispatch sent with unique merchant discount coupon!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              E-Commerce Sync & Abandoned Cart Recovery
            </h1>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-mono px-2.5 py-0.5 rounded-lg border border-emerald-500/25 font-bold">
              Shopify & WooCommerce Webhooks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Auto-sync checkouts, generate merchant coupons, and dispatch automated 30-minute delayed recovery over WhatsApp.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Recovered Revenue</span>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">$24,850</div>
          <div className="text-[10px] text-emerald-400 mt-1">+18.4% this month</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recovery Conversion Rate</span>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">34.2%</div>
          <div className="text-[10px] text-slate-500 mt-1">4.5x vs Traditional Email</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Delayed Queue Window</span>
          </div>
          <div className="text-2xl font-bold text-white">30 Min</div>
          <div className="text-[10px] text-slate-500 mt-1">Non-blocking background worker</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
            <span>Connected Stores</span>
          </div>
          <div className="text-2xl font-bold text-white">2 Stores</div>
          <div className="text-[10px] text-emerald-400 mt-1">Shopify Plus & WooCommerce</div>
        </div>
      </div>

      {/* Abandoned Carts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Live Abandoned Carts Queue
          </h2>
          <span className="text-[11px] text-slate-400">{carts.length} Active Abandonments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Customer & Store</th>
                <th className="p-3.5">Abandoned Items</th>
                <th className="p-3.5">Cart Value</th>
                <th className="p-3.5">Abandonment Time</th>
                <th className="p-3.5">30-Min Queue Status</th>
                <th className="p-3.5">Coupon Generated</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {carts.map((cart) => (
                <tr key={cart.id} className="hover:bg-slate-850">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{cart.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {cart.customerPhone} ({cart.store})
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-0.5">
                      {cart.items.map((it, idx) => (
                        <div key={idx} className="text-[11px] text-slate-300">
                          {it.qty}x {it.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-400 tabular-nums">
                    ${cart.cartTotal.toFixed(2)}
                  </td>
                  <td className="p-3.5 text-slate-400">{cart.abandonedAt}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        cart.recoveryStatus === 'recovered'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : cart.recoveryStatus === 'dispatched'
                          ? 'bg-cyan-500/15 text-cyan-400'
                          : 'bg-amber-500/15 text-amber-300 animate-pulse'
                      }`}
                    >
                      {cart.recoveryStatus === 'pending'
                        ? cart.recoveryScheduledAt
                        : cart.recoveryStatus}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                      {cart.couponCode}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDispatch(cart.id)}
                      disabled={cart.recoveryStatus === 'recovered'}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Send className="w-3 h-3" />
                      <span>{cart.recoveryStatus === 'recovered' ? 'Recovered' : 'Dispatch Now'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
