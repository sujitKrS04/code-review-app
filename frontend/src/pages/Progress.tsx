import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { SkillMatrix } from '@/components/dashboard/SkillMatrix';
import { Trophy, TrendingUp, Code, Target } from 'lucide-react';

export const Progress = () => {
  const { currentUser } = useAuth();
  const { progress, skills, isLoading } = useProgress(currentUser?.id);

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Overall Progress',
        data: [45, 52, 68, progress?.overallLevel || 70],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Progress</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your learning journey and skill development
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Level</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.round(progress?.overallLevel || 0)}%
                </p>
              </div>
              <Target className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {progress?.submissionsCount || 0}
                </p>
              </div>
              <Code className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Skills Tracked</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {skills?.length || 0}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {progress?.achievements?.length || 0}
                </p>
              </div>
              <Trophy className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {progress && <ProgressChart data={chartData} />}
        {skills && skills.length > 0 && <SkillMatrix skills={skills} />}
      </div>

      {/* Achievements */}
      {progress?.achievements && progress.achievements.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {progress.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800"
                >
                  <Trophy className="h-8 w-8 text-yellow-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                No achievements yet. Keep submitting code to unlock achievements!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
