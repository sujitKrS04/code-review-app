import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Zap, BookOpen, Target, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  starterCode: string;
  testCases: string[];
}

export const Practice = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProblem, setGeneratedProblem] = useState<PracticeProblem | null>(null);

  const practiceCategories = [
    {
      id: 'algorithms',
      title: 'Algorithms',
      description: 'Practice sorting, searching, and algorithm optimization',
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      problems: 24,
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      description: 'Master arrays, trees, graphs, and more',
      icon: <Code className="h-6 w-6 text-green-600" />,
      problems: 18,
    },
    {
      id: 'design-patterns',
      title: 'Design Patterns',
      description: 'Learn common software design patterns',
      icon: <BookOpen className="h-6 w-6 text-purple-600" />,
      problems: 12,
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      description: 'Code quality, readability, and maintainability',
      icon: <Target className="h-6 w-6 text-orange-600" />,
      problems: 15,
    },
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  const handleGenerateProblem = async () => {
    setIsGenerating(true);
    try {
      const { data } = await api.post('/practice/generate', {
        weakAreas: ['algorithms'],
        difficulty: selectedDifficulty.toUpperCase(),
        language: 'javascript',
      });
      setGeneratedProblem(data.data);
      toast.success('Practice problem generated!');
    } catch (error) {
      console.error('Failed to generate problem:', error);
      toast.error('Failed to generate problem. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartPractice = (category: string) => {
    toast.success(`Loading ${category} problems...`);
    navigate('/submit', { state: { category, difficulty: selectedDifficulty, isPractice: true } });
  };

  const handleSolveProblem = () => {
    if (generatedProblem) {
      navigate('/submit', { 
        state: { 
          problem: generatedProblem,
          isPractice: true,
          starterCode: generatedProblem.starterCode
        } 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Practice Problems</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Improve your coding skills with curated practice problems
        </p>
      </div>

      {/* Difficulty Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty Level:
            </span>
            <div className="flex space-x-2">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className="capitalize"
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practiceCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {category.icon}
                  <CardTitle>{category.title}</CardTitle>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category.problems} problems
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>
              <Button 
                className="w-full"
                onClick={() => handleStartPractice(category.title)}
              >
                Start Practicing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI-Generated Problem Section */}
      <Card className="border-2 border-primary-200 dark:border-primary-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary-600" />
            AI-Generated Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get a personalized practice problem generated by AI based on your selected difficulty level.
          </p>
          <div className="flex space-x-4 mb-6">
            <Button 
              size="lg"
              onClick={handleGenerateProblem}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Problem
                </>
              )}
            </Button>
          </div>

          {/* Generated Problem Display */}
          {generatedProblem && (
            <div className="mt-6 p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {generatedProblem.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  generatedProblem.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : generatedProblem.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {generatedProblem.difficulty}
                </span>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description:</h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {generatedProblem.description}
                </p>
              </div>

              {generatedProblem.testCases && generatedProblem.testCases.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Test Cases:</h4>
                  <div className="space-y-2">
                    {generatedProblem.testCases.slice(0, 3).map((testCase, idx) => (
                      <div key={idx} className="bg-white dark:bg-dark-800 p-2 rounded text-sm font-mono">
                        {testCase}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                size="lg" 
                className="w-full mt-4"
                onClick={handleSolveProblem}
              >
                <Code className="mr-2 h-4 w-4" />
                Solve This Problem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <Code className="mx-auto h-12 w-12 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              More Practice Problems Coming Soon!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We're working on adding more practice problems and interactive coding challenges.
              Check back soon for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
