import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Trophy, 
  Zap, 
  Clock, 
  Cpu, 
  HardDrive, 
  Star,
  CheckCircle,
  Circle,
  BarChart3,
  Info
} from 'lucide-react';

interface ModelPerformanceData {
  id: string;
  model_name: string;
  model_size_gb: number;
  usefulness_score: number;
  speed_rating: string;
  speed_seconds?: number;
  gpu_utilization: number;
  gpu_layers_offloaded: number;
  gpu_layers_total: number;
  context_window: number;
  parameters_billions: number;
  architecture: string;
  best_use_cases: string[];
  cost_per_token?: number;
  last_tested: string;
  test_results: Record<string, any>;
  user_ratings: Array<Record<string, any>>;
  performance_metrics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface ModelPerformanceCardProps {
  model: ModelPerformanceData;
  isSelected: boolean;
  onSelect: () => void;
  onRate: (rating: number) => void;
  className?: string;
}

export const ModelPerformanceCard: React.FC<ModelPerformanceCardProps> = ({
  model,
  isSelected,
  onSelect,
  onRate,
  className
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [rating, setRating] = useState(0);

  const getUsefulnessColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 85) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSpeedIcon = (rating: string) => {
    switch (rating) {
      case 'fast': return <Zap className="h-4 w-4 text-green-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'slow': return <Clock className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSpeedBadgeColor = (rating: string) => {
    switch (rating) {
      case 'fast': return 'success';
      case 'medium': return 'warning';
      case 'slow': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatContextWindow = (size: number) => {
    if (size >= 100000) return `${(size / 1000).toFixed(0)}k`;
    if (size >= 1000) return `${(size / 1000).toFixed(1)}k`;
    return size.toString();
  };

  const formatParameters = (params: number) => {
    return `${params.toFixed(1)}B`;
  };

  const averageUserRating = model.user_ratings.length > 0
    ? model.user_ratings.reduce((sum, r) => sum + r.rating, 0) / model.user_ratings.length
    : 0;

  return (
    <Card 
      className={`
        relative transition-all duration-200 hover:shadow-lg cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
        ${className}
      `}
      onClick={onSelect}
    >
      {/* Selection Indicator */}
      <div className="absolute top-3 right-3">
        {isSelected ? (
          <CheckCircle className="h-5 w-5 text-blue-500" />
        ) : (
          <Circle className="h-5 w-5 text-gray-300" />
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 pr-8">
              {model.model_name}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                {model.architecture}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatParameters(model.parameters_billions)} • {model.model_size_gb}GB
              </span>
            </CardDescription>
          </div>
        </div>

        {/* Usefulness Score */}
        <div className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-2
          ${getUsefulnessColor(model.usefulness_score)}
        `}>
          <Trophy className="h-4 w-4 mr-1" />
          {model.usefulness_score.toFixed(1)}/100 Usefulness
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            {getSpeedIcon(model.speed_rating)}
            <div>
              <p className="text-xs text-gray-500">Speed</p>
              <Badge variant={getSpeedBadgeColor(model.speed_rating) as any} className="text-xs">
                {model.speed_rating}
                {model.speed_seconds && ` (${model.speed_seconds.toFixed(1)}s)`}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">GPU</p>
              <p className="text-sm font-medium">
                {model.gpu_layers_offloaded}/{model.gpu_layers_total}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500">Context</p>
              <p className="text-sm font-medium">
                {formatContextWindow(model.context_window)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <HardDrive className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Size</p>
              <p className="text-sm font-medium">{model.model_size_gb}GB</p>
            </div>
          </div>
        </div>

        {/* Best Use Cases */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Best for:</p>
          <div className="flex flex-wrap gap-1">
            {model.best_use_cases.slice(0, 3).map((useCase, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {useCase}
              </Badge>
            ))}
            {model.best_use_cases.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{model.best_use_cases.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* User Rating */}
        {model.user_ratings.length > 0 && (
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">
              {averageUserRating.toFixed(1)}/5 ({model.user_ratings.length} ratings)
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            className="flex-1"
          >
            <Info className="h-3 w-3 mr-1" />
            Details
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Open rating modal
              const newRating = prompt('Rate this model (1-5):');
              if (newRating && !isNaN(Number(newRating))) {
                const ratingNum = Math.max(1, Math.min(5, Number(newRating)));
                onRate(ratingNum);
              }
            }}
            className="flex-1"
          >
            <Star className="h-3 w-3 mr-1" />
            Rate
          </Button>
        </div>

        {/* Detailed Information */}
        {showDetails && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">GPU Utilization:</span>
                <span className="ml-1">{model.gpu_utilization}%</span>
              </div>
              <div>
                <span className="font-medium">Parameters:</span>
                <span className="ml-1">{formatParameters(model.parameters_billions)}</span>
              </div>
              <div>
                <span className="font-medium">Context Window:</span>
                <span className="ml-1">{formatContextWindow(model.context_window)} tokens</span>
              </div>
              <div>
                <span className="font-medium">Last Tested:</span>
                <span className="ml-1">{new Date(model.last_tested).toLocaleDateString()}</span>
              </div>
            </div>
            
            {model.cost_per_token && (
              <div className="text-xs">
                <span className="font-medium">Cost per token:</span>
                <span className="ml-1">${model.cost_per_token.toFixed(6)}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
