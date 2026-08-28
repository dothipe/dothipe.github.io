import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import MainDashboard from './components/MainDashboard';
import VscPortal from './components/VscPortal';
import NcsPortal from './components/NcsPortal';

type Route = 'home' | 'vsc' | 'ncs';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');

  // Intercept paths on startup & manage browser navigation
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/vsc')) {
        setCurrentRoute('vsc');
      } else if (path.includes('/ncs')) {
        setCurrentRoute('ncs');
      } else {
        setCurrentRoute('home');
      }
    };

    // Run once on load
    handleUrlRouting();

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []);

  // Professional Navigation helper that updates url path
  const navigateTo = (route: Route) => {
    setCurrentRoute(route);
    
    // Set appropriate path suffix
    let targetPath = '/';
    if (route === 'vsc') targetPath = '/vsc';
    if (route === 'ncs') targetPath = '/ncs';

    // Push history state to browser address bar
    window.history.pushState({ route }, '', targetPath);
    
    // Ensure we scroll back to top of new view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <AnimatePresence mode="wait">
        {currentRoute === 'home' && (
          <motion.div
            key="home-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <MainDashboard onNavigateTo={navigateTo} />
          </motion.div>
        )}

        {currentRoute === 'vsc' && (
          <motion.div
            key="vsc-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <VscPortal onBackToHome={() => navigateTo('home')} onNavigateTo={navigateTo} />
          </motion.div>
        )}

        {currentRoute === 'ncs' && (
          <motion.div
            key="ncs-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <NcsPortal onBackToHome={() => navigateTo('home')} onNavigateTo={navigateTo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
