import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Trophy, 
  Zap, 
  BarChart3, 
  Cpu,
  TrendingUp,
  Target
} from 'lucide-react';

interface ModelStats {
  total_models: number;
  average_usefulness: number;
  best_model: {
    name: string;
    usefulness_score: number;
    architecture: string;
  };
  fastest_model: {
    name: string;
    speed_seconds: number;
    architecture: string;
  } | null;
  architectures: Record<string, {
    count: number;
    avg_usefulness: number;
  }>;
}

interface ModelStatsProps {
  stats: ModelStats;
  className?: string;
}

export const ModelStats: React.FC<ModelStatsProps> = ({ stats, className }) => {
  const topArchitectures = Object.entries(stats.architectures)
    .sort(([,a], [,b]) => b.avg_usefulness - a.avg_usefulness)
    .slice(0, 3);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Total Models */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Models</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_models}</div>
          <p className="text-xs text-muted-foreground">
            Empirically tested models
          </p>
        </CardContent>
      </Card>

      {/* Average Usefulness */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Usefulness</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.average_usefulness.toFixed(1)}/100</div>
          <p className="text-xs text-muted-foreground">
            Average performance score
          </p>
        </CardContent>
      </Card>

      {/* Best Model */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Model</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-green-600">
            {stats.best_model.name}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="success" className="text-xs">
              {stats.best_model.usefulness_score.toFixed(1)}/100
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stats.best_model.architecture}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Fastest Model */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fastest Model</CardTitle>
          <Zap className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          {stats.fastest_model ? (
            <>
              <div className="text-lg font-bold text-green-600">
                {stats.fastest_model.name}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="success" className="text-xs">
                  {stats.fastest_model.speed_seconds.toFixed(1)}s
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {stats.fastest_model.architecture}
                </Badge>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">No speed data available</div>
          )}
        </CardContent>
      </Card>

      {/* Architecture Performance */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cpu className="h-5 w-5 mr-2" />
            Architecture Performance
          </CardTitle>
          <CardDescription>
            Performance breakdown by model architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topArchitectures.map(([arch, data]) => (
              <div key={arch} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium capitalize">{arch}</div>
                  <div className="text-sm text-gray-500">
                    {data.count} model{data.count !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {data.avg_usefulness.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">avg score</div>
                </div>
              </div>
            ))}
          </div>

          {Object.keys(stats.architectures).length > 3 && (
            <div className="mt-4 text-center">
              <Badge variant="outline" className="text-xs">
                +{Object.keys(stats.architectures).length - 3} more architectures
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
