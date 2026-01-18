import { prisma } from '../config/database';
import { AppError } from '../utils/helpers';

export class ProgressService {
  async getUserProgress(userId: string) {
    const [progress, submissions, achievements, user] = await Promise.all([
      prisma.progress.findMany({
        where: { userId },
      }),
      prisma.submission.count({
        where: { userId },
      }),
      prisma.achievement.findMany({
        where: { userId },
        orderBy: { earnedAt: 'desc' },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          currentStreak: true,
          longestStreak: true,
          lastSubmissionDate: true,
        },
      }),
    ]);

    // Calculate overall level
    const avgLevel = progress.length > 0
      ? progress.reduce((sum, p) => sum + p.skillLevel, 0) / progress.length
      : 0;

    // Determine trend for each skill
    const skillsWithTrend = progress.map(skill => ({
      category: skill.skillCategory,
      level: skill.skillLevel,
      submissionsCount: skill.submissionsCount,
      trend: this.calculateTrend(skill.skillLevel),
    }));

    return {
      userId,
      skills: skillsWithTrend,
      overallLevel: avgLevel,
      submissionsCount: submissions,
      achievements,
      streak: {
        current: user?.currentStreak || 0,
        longest: user?.longestStreak || 0,
        lastSubmission: user?.lastSubmissionDate,
      },
    };
  }

  async updateProgress(userId: string, skillCategories: string[], scoreIncrement: number) {
    // Update streak
    await this.updateStreak(userId);

    const updates = skillCategories.map(category =>
      prisma.progress.upsert({
        where: {
          userId_skillCategory: {
            userId,
            skillCategory: category,
          },
        },
        update: {
          skillLevel: {
            increment: scoreIncrement,
          },
          submissionsCount: {
            increment: 1,
          },
        },
        create: {
          userId,
          skillCategory: category,
          skillLevel: scoreIncrement,
          submissionsCount: 1,
        },
      })
    );

    await Promise.all(updates);

    // Check for achievements
    await this.checkAndAwardAchievements(userId);
  }

  private async updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true,
        longestStreak: true,
        lastSubmissionDate: true,
      },
    });

    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (!user.lastSubmissionDate) {
      // First submission ever
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: 1,
          longestStreak: 1,
          lastSubmissionDate: now,
        },
      });
      return;
    }

    const lastSubmission = new Date(user.lastSubmissionDate);
    const lastSubmissionDay = new Date(
      lastSubmission.getFullYear(),
      lastSubmission.getMonth(),
      lastSubmission.getDate()
    );

    const daysDiff = Math.floor(
      (today.getTime() - lastSubmissionDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = user.currentStreak;
    
    if (daysDiff === 0) {
      // Same day submission - no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day - increment streak
      newStreak = user.currentStreak + 1;
    } else {
      // Streak broken - reset to 1
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, user.longestStreak);

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastSubmissionDate: now,
      },
    });
  }

  private async checkAndAwardAchievements(userId: string) {
    const [submissions, progress, user] = await Promise.all([
      prisma.submission.count({ where: { userId } }),
      prisma.progress.findMany({ where: { userId } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { currentStreak: true, longestStreak: true },
      }),
    ]);

    const achievements = [];

    // First submission achievement
    if (submissions === 1) {
      achievements.push({
        userId,
        type: 'first-submission',
        title: 'First Steps',
        description: 'Submitted your first code for review',
      });
    }

    // 10 submissions achievement
    if (submissions === 10) {
      achievements.push({
        userId,
        type: 'dedicated-learner',
        title: 'Dedicated Learner',
        description: 'Submitted 10 code reviews',
      });
    }

    // Streak achievements
    if (user) {
      // 7-day streak
      if (user.currentStreak === 7) {
        achievements.push({
          userId,
          type: 'week-warrior',
          title: 'Week Warrior',
          description: 'Maintained a 7-day coding streak',
        });
      }

      // 30-day streak
      if (user.currentStreak === 30) {
        achievements.push({
          userId,
          type: 'monthly-master',
          title: 'Monthly Master',
          description: 'Maintained a 30-day coding streak',
        });
      }

      // 100-day streak
      if (user.currentStreak === 100) {
        achievements.push({
          userId,
          type: 'century-coder',
          title: 'Century Coder',
          description: 'Maintained a 100-day coding streak',
        });
      }
    }

    // Master a skill achievement (level >= 80)
    const masteredSkills = progress.filter(p => p.skillLevel >= 80);
    if (masteredSkills.length > 0) {
      for (const skill of masteredSkills) {
        const exists = await prisma.achievement.findFirst({
          where: {
            userId,
            type: `master-${skill.skillCategory}`,
          },
        });

        if (!exists) {
          achievements.push({
            userId,
            type: `master-${skill.skillCategory}`,
            title: `${skill.skillCategory} Master`,
            description: `Achieved mastery in ${skill.skillCategory}`,
          });
        }
      }
    }

    // Create achievements
    if (achievements.length > 0) {
      await prisma.achievement.createMany({
        data: achievements,
        skipDuplicates: true,
      });
    }
  }

  private calculateTrend(level: number): 'up' | 'down' | 'stable' {
    // Simplified trend calculation
    if (level >= 70) return 'up';
    if (level < 50) return 'down';
    return 'stable';
  }

  async getSkillBreakdown(userId: string) {
    const progress = await prisma.progress.findMany({
      where: { userId },
      orderBy: { skillLevel: 'desc' },
    });

    return progress;
  }
}

export const progressService = new ProgressService();
