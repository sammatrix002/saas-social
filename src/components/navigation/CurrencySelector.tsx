import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, DollarSign } from 'lucide-react';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onSelectCurrency: (code: string) => void;
  currencies: { code: string; symbol: string }[];
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onSelectCurrency,
  currencies,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentObj = currencies.find((c) => c.code === selectedCurrency) || currencies[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0A1020] hover:bg-[#10182A] border border-[#1E2B45] text-slate-300 hover:text-white text-xs font-semibold transition-all"
        title="Select Platform Currency"
      >
        <span className="text-emerald-400 font-mono">{currentObj.symbol}</span>
        <span className="font-mono">{currentObj.code}</span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-[#10182A] border border-[#1E2B45] rounded-xl shadow-2xl p-1 z-50 animate-in fade-in-50 zoom-in-95">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Select Currency
          </div>
          <div className="space-y-0.5">
            {currencies.map((c) => {
              const isSelected = c.code === selectedCurrency;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    onSelectCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-300 font-bold'
                      : 'text-slate-300 hover:bg-[#141E34] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{c.symbol}</span>
                    <span>{c.code}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
