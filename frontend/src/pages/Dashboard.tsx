import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useCodeReview } from '@/hooks/useCodeReview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillMatrix } from '@/components/dashboard/SkillMatrix';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { Code, TrendingUp, Award, FileCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const { progress, skills, isLoading, error } = useProgress(currentUser?.id);
  const { useSubmissions } = useCodeReview();
  const { data: submissions, isLoading: submissionsLoading } = useSubmissions();

  console.log('Dashboard render:', { currentUser, progress, skills, isLoading, error });

  // Generate mock chart data
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

  // Show loading only while initial data loads
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="ml-4 text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {currentUser?.name}!
          </p>
        </div>
        <Link to="/submit">
          <Button>
            <Code className="mr-2 h-4 w-4" />
            Submit Code
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Level</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(progress?.overallLevel || 0)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Submissions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progress?.submissionsCount || 0}
                </p>
              </div>
              <FileCode className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Skills Tracked</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {skills?.length || 0}
                </p>
              </div>
              <Code className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progress?.achievements?.length || 0}
                </p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Card - Full Width */}
      {progress?.streak && (
        <StreakCard
          currentStreak={progress.streak.current}
          longestStreak={progress.streak.longest}
          lastSubmission={progress.streak.lastSubmission}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        {progress && <ProgressChart data={chartData} />}

        {/* Skill Matrix */}
        {skills && skills.length > 0 && <SkillMatrix skills={skills} />}
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : submissions && submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.slice(0, 5).map((submission) => (
                <Link
                  key={submission.id}
                  to={`/review/${submission.id}`}
                  className="block p-4 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {submission.assignmentName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {submission.language} • {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {submission.reviews && submission.reviews.length > 0 && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {submission.reviews[0].overallScore}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Code className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">No submissions yet</p>
              <Link to="/submit">
                <Button variant="outline" className="mt-4">
                  Submit Your First Code
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      {progress?.achievements && progress.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {progress.achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800"
                >
                  <Award className="h-8 w-8 text-yellow-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
