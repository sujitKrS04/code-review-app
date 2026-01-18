import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SkillProgress {
  category: string;
  level: number;
  submissionsCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface SkillMatrixProps {
  skills: SkillProgress[];
}

export const SkillMatrix = ({ skills }: SkillMatrixProps) => {
  // Safety check for empty or invalid skills
  if (!skills || skills.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skill Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No skill data available yet. Start submitting code to track your progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCategory = (category: string) => {
    if (!category) return 'Unknown';
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatCategory(skill.category)}
                  </span>
                  {getTrendIcon(skill.trend)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.submissionsCount} submissions
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {Math.round(skill.level)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(skill.level, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
