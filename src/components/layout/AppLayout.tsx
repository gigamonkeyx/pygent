import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUI, useAuth } from '@/stores/appStore';
import { websocketService } from '@/services/websocket';
import { ViewType } from '@/types';
import { cn } from '@/utils/cn';

interface AppLayoutProps {
  children: React.ReactNode;
}

// Map route paths to ViewType
const routeToViewType: Record<string, ViewType> = {
  '/chat': ViewType.CHAT,
  '/reasoning': ViewType.REASONING,
  '/evolution': ViewType.EVOLUTION,
  '/search': ViewType.SEARCH,
  '/monitoring': ViewType.MONITORING,
  '/mcp-marketplace': ViewType.MCP_MARKETPLACE,
  '/ollama': ViewType.OLLAMA,
  '/settings': ViewType.SETTINGS
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { ui, setSidebarOpen, setActiveView } = useUI();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Initialize WebSocket connection when authenticated
    if (isAuthenticated) {
      // Use relative path - Vite proxy will handle routing to backend
      websocketService.connect().catch((error) => {
        console.warn('WebSocket connection failed - running in offline mode:', error.message);
        // UI continues to work without real-time features
      });
    }

    return () => {
      if (websocketService.isConnected()) {
        websocketService.disconnect();
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    // Synchronize activeView with current URL
    const currentViewType = routeToViewType[location.pathname];
    if (currentViewType && currentViewType !== ui.activeView) {
      setActiveView(currentViewType);
    }
  }, [location.pathname, ui.activeView, setActiveView]);

  useEffect(() => {
    // Handle responsive sidebar behavior
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className={cn(
        'transition-all duration-300 ease-in-out',
        ui.sidebarOpen ? 'w-64' : 'w-0',
        'md:relative absolute z-50 h-full'
      )}>
        <Sidebar />
      </div>

      {/* Sidebar Overlay for Mobile */}
      {ui.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Header />
        <main className="flex-1 overflow-hidden h-full">
          {children}
        </main>
      </div>
    </div>
  );
};
