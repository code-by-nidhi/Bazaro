import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import CartDrawer from '../cart/CartDrawer';
import FlashDealModal from '../common/FlashDealModal';

const MainLayout = ({ children }) => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [flashDealOpen, setFlashDealOpen] = useState(false);

  useEffect(() => {
    // Auto popup Flash Deal on every website refresh/mount after 600ms
    const timer = setTimeout(() => {
      setFlashDealOpen(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenFlashDeal={() => setFlashDealOpen(true)}
      />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <FlashDealModal isOpen={flashDealOpen} onClose={() => setFlashDealOpen(false)} />
    </div>
  );
};

export default MainLayout;
