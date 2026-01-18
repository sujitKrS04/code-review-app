import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: hashedPassword,
      name: 'Demo Student',
      role: 'STUDENT',
      level: 'BEGINNER',
    },
  });
  console.log('Created student user:', student.email);

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      email: 'instructor@example.com',
      password: hashedPassword,
      name: 'Demo Instructor',
      role: 'INSTRUCTOR',
      level: 'ADVANCED',
    },
  });
  console.log('Created instructor user:', instructor.email);

  // Create sample practice problems
  const problems = [
    {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'EASY' as const,
      category: 'algorithms',
      language: 'python',
      hints: JSON.stringify([
        'Think about using a hash map',
        'You can solve this in O(n) time',
        'Store complements as you iterate',
      ]),
      testCases: JSON.stringify([
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', hidden: false },
        { input: '[3,2,4], 6', expectedOutput: '[1,2]', hidden: false },
        { input: '[3,3], 6', expectedOutput: '[0,1]', hidden: true },
      ]),
      solution: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
    },
    {
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters.',
      difficulty: 'EASY' as const,
      category: 'algorithms',
      language: 'javascript',
      hints: JSON.stringify([
        'You can use two pointers',
        'Swap characters from both ends',
        'Continue until pointers meet',
      ]),
      testCases: JSON.stringify([
        { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', hidden: false },
        { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', hidden: false },
      ]),
    },
    {
      title: 'Valid Parentheses',
      description: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      difficulty: 'MEDIUM' as const,
      category: 'data-structures',
      language: 'python',
      hints: JSON.stringify([
        'Think about using a stack data structure',
        'Push opening brackets, pop when you see closing',
        'Check if brackets match when popping',
      ]),
      testCases: JSON.stringify([
        { input: '"()"', expectedOutput: 'true', hidden: false },
        { input: '"()[]{}"', expectedOutput: 'true', hidden: false },
        { input: '"(]"', expectedOutput: 'false', hidden: false },
        { input: '"{[]}"', expectedOutput: 'true', hidden: true },
      ]),
    },
  ];

  for (const problem of problems) {
    await prisma.practiceProblem.create({
      data: problem,
    });
  }

  console.log('Seeding completed!');
  console.log('Demo credentials:');
  console.log('Student - Email: student@example.com, Password: password123');
  console.log('Instructor - Email: instructor@example.com, Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
