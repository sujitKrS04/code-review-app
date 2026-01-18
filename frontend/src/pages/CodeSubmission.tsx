import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/code-editor/CodeEditor';
import { LanguageSelector } from '@/components/code-editor/LanguageSelector';
import { useCodeReview } from '@/hooks/useCodeReview';
import { Language } from '@/types/code.types';
import { Send, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export const CodeSubmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitCode, analyzeCode, isSubmitting, isAnalyzing } = useCodeReview();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [assignmentName, setAssignmentName] = useState('');

  // Handle practice problem from navigation state
  useEffect(() => {
    const state = location.state as any;
    if (state?.problem) {
      setAssignmentName(state.problem.title || 'Practice Problem');
      if (state.problem.starterCode) {
        setCode(state.problem.starterCode);
      }
    } else if (state?.category) {
      setAssignmentName(`${state.category} Practice - ${state.difficulty}`);
    }
  }, [location.state]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code');
      return;
    }
    if (!assignmentName.trim()) {
      toast.error('Please enter an assignment name');
      return;
    }

    try {
      // First submit the code
      const submission = await submitCode({ code, language, assignmentName });
      
      // Then analyze it
      if (submission) {
        await analyzeCode(submission.id);
        
        // Navigate to review page
        navigate(`/review/${submission.id}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit code. Please try again.');
    }
  };

  const exampleCode: Record<Language, string> = {
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`,
    javascript: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

console.log(fibonacci(10));`,
    typescript: `function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

console.log(fibonacci(10));`,
    java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`,
    cpp: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    cout << fibonacci(10) << endl;
    return 0;
}`,
  };

  const loadExample = () => {
    setCode(exampleCode[language]);
    toast.success('Example code loaded');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submit Code for Review</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Get AI-powered feedback on your code
        </p>
      </div>

      {/* Practice Problem Info */}
      {location.state?.problem && (
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Practice Problem: {location.state.problem.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {location.state.problem.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Code Editor</CardTitle>
                <div className="flex items-center space-x-2">
                  <LanguageSelector value={language} onChange={setLanguage} />
                  <Button variant="outline" size="sm" onClick={loadExample}>
                    Load Example
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                height="600px"
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignment Name
                </label>
                <input
                  type="text"
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  placeholder="e.g., Fibonacci Recursive"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={language}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lines of Code
                </label>
                <input
                  type="text"
                  value={code.split('\n').length}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-700 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full"
                isLoading={isSubmitting || isAnalyzing}
                disabled={!code.trim() || !assignmentName.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : isAnalyzing ? 'Analyzing...' : 'Submit & Analyze'}
              </Button>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-2">💡 Tips:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Write clean, readable code</li>
                  <li>Add comments to explain logic</li>
                  <li>Follow language conventions</li>
                  <li>Consider edge cases</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
