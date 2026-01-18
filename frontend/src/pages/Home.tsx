import { Link } from 'react-router-dom';
import { Code2, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary-600" />,
      title: 'AI-Powered Feedback',
      description: 'Get intelligent, educational feedback on your code using Groq AI',
    },
    {
      icon: <Code2 className="h-8 w-8 text-primary-600" />,
      title: 'Multi-Language Support',
      description: 'Support for Python, JavaScript, Java, C++, and TypeScript',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
      title: 'Progress Tracking',
      description: 'Visualize your skill improvement over time with detailed analytics',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Security Analysis',
      description: 'Detect security vulnerabilities and learn best practices',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Code2 className="h-16 w-16 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            AI Code Review
            <span className="block text-primary-600 dark:text-primary-400 mt-2">
              Teaching Assistant
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Learn to write better code with intelligent AI feedback, personalized learning paths,
            and comprehensive progress tracking
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-primary-600 dark:bg-primary-700 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to improve your coding skills?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students learning to code better with AI assistance
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Start Learning Now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
