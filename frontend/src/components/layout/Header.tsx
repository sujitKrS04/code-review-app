import { Link } from 'react-router-dom';
import { Code2, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';

export const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              AI Code Review
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated && currentUser && (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  <span>{currentUser.name}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                    {currentUser.level}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
