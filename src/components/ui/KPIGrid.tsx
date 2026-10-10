import React from 'react';

interface KPIGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ children, columns = 4 }) => {
  const colClasses = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  }[columns];

  return <div className={colClasses}>{children}</div>;
};
