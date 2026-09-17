import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import CartDrawer from '../cart/CartDrawer';
import FlashDealModal from '../common/FlashDealModal';

// Marks that this browsing session has already been shown the flash deal.
const FLASH_DEAL_SEEN_KEY = 'bazaro_flash_deal_seen';

const MainLayout = ({ children }) => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [flashDealOpen, setFlashDealOpen] = useState(false);

  useEffect(() => {
    // Every page mounts its own MainLayout, so this effect runs again on each
    // route change as well as on refresh. Gate it on sessionStorage so the deal
    // is shown once when the visitor first opens the site, and not again until
    // they come back in a new session.
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(FLASH_DEAL_SEEN_KEY) === '1';
    } catch {
      // Private mode / blocked storage: fall through and show it this once.
      alreadySeen = false;
    }

    if (alreadySeen) return undefined;

    const timer = setTimeout(() => {
      setFlashDealOpen(true);
      try {
        sessionStorage.setItem(FLASH_DEAL_SEEN_KEY, '1');
      } catch {
        // Nothing to do — worst case it shows again next navigation.
      }
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
