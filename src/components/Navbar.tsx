import React from 'react';
import { TopNavbar, TopNavbarProps } from './navigation/TopNavbar.tsx';

export const Navbar: React.FC<TopNavbarProps> = (props) => {
  return <TopNavbar {...props} />;
};

export { TopNavbar };
