import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Trophy, 
  Zap, 
  Cpu, 
  Clock, 
  Star, 
  Filter,
  TrendingUp,
  BarChart3,
  Search
} from 'lucide-react';
import { ModelPerformanceCard } from './ModelPerformanceCard';
import { ModelRecommendations } from './ModelRecommendations';
import { ModelStats } from './ModelStats';
import { ModelComparison } from './ModelComparison';
import { useModelPerformance } from '../../hooks/useModelPerformance';

interface ModelDashboardProps {
  className?: string;
}

export const ModelDashboard: React.FC<ModelDashboardProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchitecture, setSelectedArchitecture] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'usefulness_score' | 'speed_seconds' | 'model_size_gb'>('usefulness_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const {
    models,
    stats,
    loading,
    error,
    fetchModels,
    fetchStats
  } = useModelPerformance();

  useEffect(() => {
    fetchModels({
      architecture: selectedArchitecture === 'all' ? undefined : selectedArchitecture,
      sort_by: sortBy,
      sort_order: sortOrder
    });
    fetchStats();
  }, [selectedArchitecture, sortBy, sortOrder]);

  const filteredModels = models.filter(model =>
    model.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.architecture.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.best_use_cases.some(useCase => 
      useCase.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const architectures = ['all', ...new Set(models.map(m => m.architecture))];

  const handleModelSelect = (modelName: string) => {
    setSelectedModels(prev => 
      prev.includes(modelName)
        ? prev.filter(name => name !== modelName)
        : [...prev, modelName]
    );
  };

  const getSpeedIcon = (rating: string) => {
    switch (rating) {
      case 'fast': return <Zap className="h-4 w-4 text-green-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'slow': return <Clock className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUsefulnessColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading model performance data: {error}</p>
        <Button onClick={() => fetchModels()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Model Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Empirically validated AI model performance metrics and recommendations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Trophy className="h-3 w-3 mr-1" />
            {stats?.total_models || 0} Models Tested
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && <ModelStats stats={stats} />}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Architecture Filter */}
            <select
              value={selectedArchitecture}
              onChange={(e) => setSelectedArchitecture(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {architectures.map(arch => (
                <option key={arch} value={arch}>
                  {arch === 'all' ? 'All Architectures' : arch}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="usefulness_score">Usefulness Score</option>
              <option value="speed_seconds">Speed</option>
              <option value="model_size_gb">Model Size</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="models" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Compare
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <Cpu className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <ModelPerformanceCard
                key={model.id}
                model={model}
                isSelected={selectedModels.includes(model.model_name)}
                onSelect={() => handleModelSelect(model.model_name)}
                onRate={(rating) => {
                  // Handle rating - will implement this
                  console.log('Rating model:', model.model_name, rating);
                }}
              />
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No models match your search criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations">
          <ModelRecommendations />
        </TabsContent>

        <TabsContent value="comparison">
          <ModelComparison selectedModels={selectedModels} />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Model performance analysis over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Performance trend charts coming soon...</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>
                  Model usage patterns and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Usage analytics coming soon...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
