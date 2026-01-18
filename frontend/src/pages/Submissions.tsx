import { Link } from 'react-router-dom';
import { useCodeReview } from '@/hooks/useCodeReview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Clock, CheckCircle, XCircle } from 'lucide-react';

export const Submissions = () => {
  const { useSubmissions } = useCodeReview();
  const { data: submissions, isLoading } = useSubmissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Submissions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View all your code submissions and reviews
          </p>
        </div>
        <Link to="/submit">
          <Button>
            <Code className="mr-2 h-4 w-4" />
            Submit New Code
          </Button>
        </Link>
      </div>

      {submissions && submissions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Link to={`/review/${submission.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {submission.assignmentName}
                        </h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {submission.language}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {submission.reviews && submission.reviews.length > 0 ? (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">Reviewed</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <XCircle className="h-4 w-4 text-yellow-500" />
                            <span className="text-yellow-600 dark:text-yellow-400">Pending Review</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 text-sm text-gray-500 dark:text-gray-500">
                        <p className="line-clamp-2">{submission.code.substring(0, 150)}...</p>
                      </div>
                    </div>

                    {submission.reviews && submission.reviews.length > 0 && (
                      <div className="ml-6 text-center">
                        <div className="text-4xl font-bold text-primary-600">
                          {submission.reviews[0].overallScore}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
                      </div>
                    )}
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Code className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No submissions yet</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Get started by submitting your first code for review
              </p>
              <Link to="/submit">
                <Button className="mt-4">
                  Submit Your First Code
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
