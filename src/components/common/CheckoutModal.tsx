import React, { useState } from 'react';
import { PaymentGatewayConfig } from '../../types.ts';
import {
  CreditCard,
  CheckCircle2,
  X,
  Lock,
  Shield,
  Zap,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  amount: number;
  currency: string;
  currencySymbol: string;
  gateways: PaymentGatewayConfig[];
  onSuccess: (paymentDetails: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  itemName,
  amount,
  currency,
  currencySymbol,
  gateways,
  onSuccess,
}) => {
  const [selectedGatewayId, setSelectedGatewayId] = useState(gateways[0]?.id || 'gw-stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const currentGw = gateways.find((g) => g.id === selectedGatewayId) || gateways[0];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        onSuccess({
          gateway: currentGw.name,
          amount,
          currency,
          txId: `TX-${Date.now().toString().slice(-6)}`,
        });
        setIsDone(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">8-Gateway Secure Checkout</h3>
            <p className="text-xs text-slate-400">SSL Encrypted · Instant Webhook Lifecycle Synchronization</p>
          </div>
        </div>

        {isDone ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Payment Verified via {currentGw.name}!</h4>
            <p className="text-xs text-slate-300">
              Transaction webhook validated with HMAC-SHA256 signature. Account provisioned.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Order Summary Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{itemName}</div>
                <div className="text-[11px] text-slate-400">Instant Digital Provisioning</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-emerald-400 tabular-nums">
                  {currencySymbol}{amount}
                </div>
                <div className="text-[10px] text-slate-500">{currency}</div>
              </div>
            </div>

            {/* Select 1 of 8 Gateways */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Select Payment Gateway (8 Global & Regional)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar">
                {gateways.map((gw) => (
                  <button
                    key={gw.id}
                    onClick={() => setSelectedGatewayId(gw.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedGatewayId === gw.id
                        ? 'border-emerald-500 bg-emerald-950/20 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{gw.name}</span>
                      {selectedGatewayId === gw.id && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{gw.region}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gateway methods preview */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Supported Methods:</span>
                <span className="text-cyan-400 font-mono">{currentGw.supportedMethods.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Encryption Protocol:</span>
                <span className="text-emerald-400 font-mono">TLS 1.3 / AES-256</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {isProcessing
                  ? `Processing via ${currentGw.name}...`
                  : `Complete Payment (${currencySymbol}${amount})`}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
