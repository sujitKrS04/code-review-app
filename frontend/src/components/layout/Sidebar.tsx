import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code, 
  TrendingUp, 
  BookOpen,
  FileCode,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Submit Code', href: '/submit', icon: Code },
  { name: 'My Submissions', href: '/submissions', icon: FileCode },
  { name: 'Progress', href: '/progress', icon: TrendingUp },
  { name: 'Practice', href: '/practice', icon: BookOpen },
];

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const { progress } = useProgress(currentUser?.id);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 7) return 'text-orange-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800 fixed left-0 top-16 bottom-0 z-10">
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-gray-900 dark:hover:text-gray-100'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Streak Display at Bottom */}
      {progress?.streak && (
        <div className="p-4 border-t border-gray-200 dark:border-dark-800">
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Daily Streak
              </span>
              <Flame className={`h-4 w-4 ${getStreakColor(progress.streak.current)}`} />
            </div>
            <div className={`text-3xl font-bold ${getStreakColor(progress.streak.current)}`}>
              {progress.streak.current}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {progress.streak.current === 1 ? 'day' : 'days'} • Best: {progress.streak.longest}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
