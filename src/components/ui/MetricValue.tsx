import React from 'react';

interface MetricValueProps {
  value: string | number;
  prefix?: string;
  suffix?: string;
  className?: string;
  highlight?: boolean;
}

export const MetricValue: React.FC<MetricValueProps> = ({
  value,
  prefix,
  suffix,
  className = '',
  highlight = false,
}) => {
  const displayVal = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <span
      className={`tabular-nums font-extrabold ${
        highlight ? 'text-emerald-400' : 'text-white'
      } ${className}`}
    >
      {prefix}
      {displayVal}
      {suffix}
    </span>
  );
};
