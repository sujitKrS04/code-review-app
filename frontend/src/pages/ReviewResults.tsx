import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FeedbackPanel } from '@/components/feedback/FeedbackPanel';
import { useCodeReview } from '@/hooks/useCodeReview';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const ReviewResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useSubmission, useReview } = useCodeReview();
  
  const { data: submission, isLoading: submissionLoading } = useSubmission(id);
  const { data: review, isLoading: reviewLoading } = useReview(id);

  if (submissionLoading || reviewLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!submission || !review) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Review not found or still processing. Please try again later.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Code Review Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {submission.assignmentName}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code className="language-{submission.language}">
                    {submission.code}
                  </code>
                </pre>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Language: <span className="font-semibold">{submission.language}</span></span>
                <span>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-dark-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(review.overallScore / 100) * 351.86} 351.86`}
                      className={`${
                        review.overallScore >= 80
                          ? 'text-green-500'
                          : review.overallScore >= 60
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {review.overallScore}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                {review.overallScore >= 80
                  ? 'Excellent work!'
                  : review.overallScore >= 60
                  ? 'Good job! Room for improvement.'
                  : 'Keep practicing!'}
              </p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => navigate('/submit')}
                className="w-full"
                variant="outline"
              >
                Submit Another
              </Button>
              <Button
                onClick={() => navigate('/practice')}
                className="w-full"
                variant="outline"
              >
                Practice Similar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <FeedbackPanel review={review} />
    </div>
  );
};
