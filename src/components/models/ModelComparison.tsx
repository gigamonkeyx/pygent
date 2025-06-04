import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  BarChart3, 
  Trophy, 
  Zap, 
  Cpu, 
  HardDrive,
  Clock,
  Target,
  TrendingUp,
  X
} from 'lucide-react';
import { useModelPerformance } from '../../hooks/useModelPerformance';

interface ModelComparisonProps {
  selectedModels: string[];
  className?: string;
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({ 
  selectedModels, 
  className 
}) => {
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { getModel } = useModelPerformance();

  useEffect(() => {
    const loadComparisonData = async () => {
      if (selectedModels.length === 0) {
        setComparisonData([]);
        return;
      }

      setLoading(true);
      try {
        const modelPromises = selectedModels.map(modelName => getModel(modelName));
        const models = await Promise.all(modelPromises);
        setComparisonData(models.filter(Boolean));
      } catch (error) {
        console.error('Error loading comparison data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComparisonData();
  }, [selectedModels, getModel]);

  const formatContextWindow = (size: number) => {
    if (size >= 100000) return `${(size / 1000).toFixed(0)}k`;
    if (size >= 1000) return `${(size / 1000).toFixed(1)}k`;
    return size.toString();
  };

  const formatParameters = (params: number) => {
    return `${params.toFixed(1)}B`;
  };

  const getUsefulnessColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 90) return 'text-green-600';
    if (score >= 85) return 'text-blue-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSpeedColor = (rating: string) => {
    switch (rating) {
      case 'fast': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'slow': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (selectedModels.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Model Comparison
          </CardTitle>
          <CardDescription>
            Select models from the Models tab to compare their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No models selected for comparison</p>
            <p className="text-sm text-gray-400 mt-2">
              Go to the Models tab and click on models to select them for comparison
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Model Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const comparisonMetrics = [
    {
      key: 'usefulness_score',
      label: 'Usefulness Score',
      icon: Trophy,
      format: (value: number) => `${value.toFixed(1)}/100`,
      getColor: getUsefulnessColor
    },
    {
      key: 'speed_rating',
      label: 'Speed Rating',
      icon: Zap,
      format: (value: string) => value,
      getColor: getSpeedColor
    },
    {
      key: 'model_size_gb',
      label: 'Model Size',
      icon: HardDrive,
      format: (value: number) => `${value}GB`,
      getColor: () => 'text-gray-600'
    },
    {
      key: 'parameters_billions',
      label: 'Parameters',
      icon: Cpu,
      format: formatParameters,
      getColor: () => 'text-gray-600'
    },
    {
      key: 'context_window',
      label: 'Context Window',
      icon: Target,
      format: (value: number) => `${formatContextWindow(value)} tokens`,
      getColor: () => 'text-gray-600'
    },
    {
      key: 'gpu_utilization',
      label: 'GPU Utilization',
      icon: BarChart3,
      format: (value: number) => `${value}%`,
      getColor: (value: number) => value === 100 ? 'text-green-600' : 'text-yellow-600'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Model Comparison
          </CardTitle>
          <CardDescription>
            Comparing {comparisonData.length} selected models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {comparisonData.map((model) => (
              <Badge key={model.id} variant="outline" className="flex items-center">
                {model.model_name}
                <X className="h-3 w-3 ml-1 cursor-pointer" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Metric</th>
                  {comparisonData.map((model) => (
                    <th key={model.id} className="text-left py-3 px-4 font-medium">
                      <div className="flex flex-col">
                        <span className="font-bold">{model.model_name}</span>
                        <Badge variant="outline" className="text-xs mt-1 w-fit">
                          {model.architecture}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <tr key={metric.key} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Icon className="h-4 w-4 mr-2 text-gray-500" />
                          {metric.label}
                        </div>
                      </td>
                      {comparisonData.map((model) => {
                        const value = model[metric.key];
                        const formattedValue = metric.format(value);
                        const color = metric.getColor(value);
                        
                        return (
                          <td key={model.id} className="py-3 px-4">
                            <span className={`font-medium ${color}`}>
                              {formattedValue}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Best Use Cases Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Best Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparisonData.map((model) => (
              <div key={model.id} className="border rounded-lg p-4">
                <div className="font-medium mb-2">{model.model_name}</div>
                <div className="flex flex-wrap gap-2">
                  {model.best_use_cases.map((useCase: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {useCase}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Highest Usefulness */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-green-800">Highest Usefulness</div>
              {(() => {
                const best = comparisonData.reduce((prev, current) => 
                  prev.usefulness_score > current.usefulness_score ? prev : current
                );
                return (
                  <div className="text-sm text-green-600 mt-1">
                    {best.model_name} ({best.usefulness_score.toFixed(1)}/100)
                  </div>
                );
              })()}
            </div>

            {/* Fastest */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-blue-800">Fastest</div>
              {(() => {
                const fastest = comparisonData
                  .filter(model => model.speed_seconds)
                  .reduce((prev, current) => 
                    prev.speed_seconds < current.speed_seconds ? prev : current
                  );
                return fastest ? (
                  <div className="text-sm text-blue-600 mt-1">
                    {fastest.model_name} ({fastest.speed_seconds.toFixed(1)}s)
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mt-1">No speed data</div>
                );
              })()}
            </div>

            {/* Most Efficient */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-purple-800">Most Efficient</div>
              {(() => {
                const efficient = comparisonData.reduce((prev, current) => {
                  const prevRatio = prev.usefulness_score / prev.model_size_gb;
                  const currentRatio = current.usefulness_score / current.model_size_gb;
                  return prevRatio > currentRatio ? prev : current;
                });
                return (
                  <div className="text-sm text-purple-600 mt-1">
                    {efficient.model_name} ({(efficient.usefulness_score / efficient.model_size_gb).toFixed(1)} score/GB)
                  </div>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
