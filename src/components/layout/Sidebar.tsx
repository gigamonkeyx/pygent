import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Brain,
  Dna,
  Search,
  Activity,
  Package,
  Settings,
  ChevronLeft,
  Bot,
  Server,
  FileSearch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUI, useSystem } from '@/stores/appStore';
import { ViewType } from '@/types';
import { cn } from '@/utils/cn';

// Map ViewType to route paths
const viewTypeToRoute: Record<ViewType, string> = {
  [ViewType.CHAT]: '/chat',
  [ViewType.REASONING]: '/reasoning',
  [ViewType.EVOLUTION]: '/evolution',
  [ViewType.SEARCH]: '/search',
  [ViewType.RESEARCH_ANALYSIS]: '/research-analysis',
  [ViewType.MONITORING]: '/monitoring',
  [ViewType.MCP_MARKETPLACE]: '/mcp-marketplace',
  [ViewType.OLLAMA]: '/ollama',
  [ViewType.SETTINGS]: '/settings'
};

// Map route paths to ViewType
const routeToViewType: Record<string, ViewType> = {
  '/chat': ViewType.CHAT,
  '/reasoning': ViewType.REASONING,
  '/evolution': ViewType.EVOLUTION,
  '/search': ViewType.SEARCH,
  '/research-analysis': ViewType.RESEARCH_ANALYSIS,
  '/monitoring': ViewType.MONITORING,
  '/mcp-marketplace': ViewType.MCP_MARKETPLACE,
  '/ollama': ViewType.OLLAMA,
  '/settings': ViewType.SETTINGS
};

const navigationItems = [
  {
    id: ViewType.CHAT,
    label: 'Chat',
    icon: MessageSquare,
    description: 'AI Agent Conversations',
    route: '/chat'
  },
  {
    id: ViewType.REASONING,
    label: 'Reasoning',
    icon: Brain,
    description: 'Tree of Thought Analysis',
    route: '/reasoning'
  },
  {
    id: ViewType.EVOLUTION,
    label: 'Evolution',
    icon: Dna,
    description: 'Recipe Optimization',
    route: '/evolution'
  },
  {
    id: ViewType.SEARCH,
    label: 'Search',
    icon: Search,
    description: 'Vector Search & Retrieval',
    route: '/search'
  },
  {
    id: ViewType.RESEARCH_ANALYSIS,
    label: 'Research & Analysis',
    icon: FileSearch,
    description: 'Automated Research Pipeline',
    route: '/research-analysis'
  },
  {
    id: ViewType.MONITORING,
    label: 'Monitoring',
    icon: Activity,
    description: 'System Performance',
    route: '/monitoring'
  },
  {
    id: ViewType.MCP_MARKETPLACE,
    label: 'MCP Servers',
    icon: Package,
    description: 'Model Context Protocol',
    route: '/mcp-marketplace'
  },
  {
    id: ViewType.OLLAMA,
    label: 'Ollama',
    icon: Server,
    description: 'AI Model Management',
    route: '/ollama'
  },
  {
    id: ViewType.SETTINGS,
    label: 'Settings',
    icon: Settings,
    description: 'Configuration & Preferences',
    route: '/settings'
  }
];

export const Sidebar: React.FC = () => {
  const { ui, setActiveView, setSidebarOpen } = useUI();
  const { systemMetrics, mcpServers } = useSystem();
  const navigate = useNavigate();
  const location = useLocation();

  const getStatusIndicator = (viewType: ViewType) => {
    switch (viewType) {
      case ViewType.MONITORING:
        if (systemMetrics) {
          const isHealthy = systemMetrics.cpu.usage_percent < 80 && 
                           systemMetrics.memory.usage_percent < 80;
          return (
            <div className={cn(
              'w-2 h-2 rounded-full',
              isHealthy ? 'bg-green-500' : 'bg-yellow-500'
            )} />
          );
        }
        break;
      case ViewType.MCP_MARKETPLACE:
        const runningServers = mcpServers.filter(s => s.status === 'running').length;
        if (runningServers > 0) {
          return (
            <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
              {runningServers}
            </span>
          );
        }
        break;
    }
    return null;
  };

  return (
    <div className="h-full bg-card border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <h2 className="font-semibold text-lg">PyGent Factory</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Advanced AI Reasoning System
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = ui.activeView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3",
                isActive && "bg-primary text-primary-foreground"
              )}
              onClick={() => {
                // Update both the state and navigate to the route
                setActiveView(item.id);
                navigate(item.route);
                // Close sidebar on mobile after selection
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <div className="flex items-center space-x-3 w-full">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    {getStatusIndicator(item.id)}
                  </div>
                  <p className="text-xs opacity-70 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* System Status */}
      <div className="p-4 border-t">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">System Status</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
            
            {systemMetrics && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">CPU</span>
                  <span>{systemMetrics.cpu.usage_percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Memory</span>
                  <span>{systemMetrics.memory.usage_percent.toFixed(1)}%</span>
                </div>
                {systemMetrics.gpu && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">GPU</span>
                    <span>{systemMetrics.gpu.usage_percent.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">MCP Servers</span>
              <span>{mcpServers.filter(s => s.status === 'running').length}/{mcpServers.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
