import { describe, expect, expectTypeOf, test } from 'vitest';
import { type AchievementSchema, achievement } from '#schemas/achievement';

describe('Achievement Schema', () => {
  test('valid achievement passes validation', () => {
    const validAchievement: AchievementSchema = {
      title: 'First Steps',
      description: 'Completed the first level of the game.',
      points: 100,
    };
    expect(() => achievement.parse(validAchievement)).not.toThrow();
  });

  test('invalid achievement fails validation', () => {
    const invalidAchievement = {
      title: 'A',
      description: 'Too short',
      points: 1500,
    };
    expect(() => achievement.parse(invalidAchievement)).toThrow();
  });

  test('AchievementSchema type matches expected structure', () => {
    expectTypeOf<AchievementSchema>().toEqualTypeOf<AchievementSchema>();
  });
});
