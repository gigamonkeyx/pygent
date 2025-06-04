import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Star, 
  Zap, 
  Code, 
  Brain,
  Target,
  Loader2
} from 'lucide-react';
import { useModelPerformance } from '../../hooks/useModelPerformance';
import { ModelPerformanceCard } from './ModelPerformanceCard';

export const ModelRecommendations: React.FC = () => {
  const [taskType, setTaskType] = useState<string>('general');
  const [priority, setPriority] = useState<string>('balanced');
  const [maxSize, setMaxSize] = useState<number | undefined>(undefined);
  const [minUsefulness, setMinUsefulness] = useState<number | undefined>(undefined);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { getRecommendations } = useModelPerformance();

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const result = await getRecommendations({
        task_type: taskType,
        priority: priority,
        max_size_gb: maxSize,
        min_usefulness_score: minUsefulness
      });
      setRecommendations(result);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const taskTypes = [
    { value: 'general', label: 'General Tasks', icon: Target },
    { value: 'coding', label: 'Coding & Programming', icon: Code },
    { value: 'reasoning', label: 'Reasoning & Analysis', icon: Brain },
  ];

  const priorities = [
    { value: 'speed', label: 'Speed Priority', description: 'Fastest response times' },
    { value: 'quality', label: 'Quality Priority', description: 'Best performance scores' },
    { value: 'balanced', label: 'Balanced', description: 'Good balance of speed and quality' },
  ];

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Get Model Recommendations
          </CardTitle>
          <CardDescription>
            Find the best models for your specific use case and requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Task Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">Task Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {taskTypes.map((task) => {
                const Icon = task.icon;
                return (
                  <button
                    key={task.value}
                    onClick={() => setTaskType(task.value)}
                    className={`
                      p-3 border rounded-lg text-left transition-colors
                      ${taskType === task.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{task.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {priorities.map((prio) => (
                <button
                  key={prio.value}
                  onClick={() => setPriority(prio.value)}
                  className={`
                    p-3 border rounded-lg text-left transition-colors
                    ${priority === prio.value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium">{prio.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{prio.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Max Size (GB)</label>
              <input
                type="number"
                value={maxSize || ''}
                onChange={(e) => setMaxSize(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Min Usefulness Score</label>
              <input
                type="number"
                value={minUsefulness || ''}
                onChange={(e) => setMinUsefulness(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="No minimum"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button 
            onClick={handleGetRecommendations}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-2" />
                Get Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations Results */}
      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Models</CardTitle>
            <CardDescription>
              {recommendations.reasoning}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendations.recommended_models.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {recommendations.recommended_models.map((model: any, index: number) => (
                  <div key={model.id} className="relative">
                    <Badge 
                      className="absolute -top-2 -left-2 z-10"
                      variant={index === 0 ? 'default' : 'secondary'}
                    >
                      #{index + 1}
                    </Badge>
                    <ModelPerformanceCard
                      model={model}
                      isSelected={false}
                      onSelect={() => {}}
                      onRate={() => {}}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No models match your criteria. Try adjusting your requirements.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
