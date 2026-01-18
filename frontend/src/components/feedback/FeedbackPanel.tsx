import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FeedbackItem, SuggestionItem, LearningResource, Review } from '@/types/feedback.types';
import { getSeverityColor } from '@/lib/utils';

interface FeedbackPanelProps {
  review: Review;
}

export const FeedbackPanel = ({ review }: FeedbackPanelProps) => {
  const feedback = review.feedback || [];
  const suggestions = review.suggestions || [];
  const resources = review.resources || [];
  const positives = review.positives || [];
  const overallScore = review.overallScore || 0;
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2" style={{ 
              color: overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444' 
            }}>
              {overallScore}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Overall Score</div>
          </div>
        </CardContent>
      </Card>

      {/* Positives */}
      {positives && positives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="mr-2 h-5 w-5" />
              Good Practices Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {positives.map((positive, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{positive}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Feedback Items */}
      {feedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedback.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg ${getSeverityColor(item.severity)}`}>
                  <div className="flex items-start">
                    {getSeverityIcon(item.severity)}
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{item.message}</span>
                        {item.line && (
                          <span className="text-xs px-2 py-1 rounded bg-black/10 dark:bg-white/10">
                            Line {item.line}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-2 opacity-90">{item.explanation}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-black/10 dark:bg-white/10">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4">
                  {suggestion.line && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Line {suggestion.line}
                    </div>
                  )}
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Before:</div>
                      <pre className="bg-gray-100 dark:bg-dark-800 p-2 rounded text-sm overflow-x-auto">
                        <code>{suggestion.before}</code>
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">After:</div>
                      <pre className="bg-gray-100 dark:bg-dark-800 p-2 rounded text-sm overflow-x-auto">
                        <code>{suggestion.after}</code>
                      </pre>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {suggestion.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Resources */}
      {resources && resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {resource.title}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                      {resource.type}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
