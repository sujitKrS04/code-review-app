import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Flame, Trophy } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastSubmission?: Date | string;
}

export function StreakCard({ currentStreak, longestStreak, lastSubmission }: StreakCardProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 7) return 'text-orange-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your streak today!';
    if (streak === 1) return 'Great start! Keep it going!';
    if (streak < 7) return 'Building momentum!';
    if (streak < 30) return 'On fire! Keep pushing!';
    return 'Legendary streak! 🔥';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className={`h-5 w-5 ${getStreakColor(currentStreak)}`} />
          Daily Coding Streak
        </CardTitle>
        <CardDescription>{getStreakMessage(currentStreak)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Current Streak</div>
            <div className={`text-4xl font-bold ${getStreakColor(currentStreak)}`}>
              {currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentStreak === 1 ? 'day' : 'days'}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Longest Streak
            </div>
            <div className="text-4xl font-bold text-amber-600">
              {longestStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              {longestStreak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>

        {lastSubmission && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              Last submission: {new Date(lastSubmission).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Streak milestones */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs font-medium mb-2">Next Milestones</div>
          <div className="flex gap-2">
            {[7, 30, 100].map((milestone) => (
              <div
                key={milestone}
                className={`flex-1 text-center py-2 rounded-md border ${
                  currentStreak >= milestone
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <div className="text-lg font-bold">{milestone}</div>
                <div className="text-xs">days</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
