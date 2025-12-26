import type { Repository, UpdateResult } from 'typeorm';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Achievement } from '#models/achievement';
import type { AchievementSchema } from '#schemas/achievement';
import { AchievementService } from '#services/achievement';
import { container } from '#config/container';

describe('Services - Achievement', () => {
  let service: AchievementService;
  let repository: Repository<Achievement>;

  beforeEach(() => {
    repository = {
      findAndCount: vi.fn(),
      findOneOrFail: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    } as unknown as Repository<Achievement>;

    vi.spyOn(container, 'getRepository').mockReturnValue(repository);
    service = new AchievementService();
  });

  test('findAll should return paginated achievements for a user', async () => {
    const mockAchievements = [{ id: 1 }, { id: 2 }] as Achievement[];
    vi.spyOn(repository, 'findAndCount').mockResolvedValue([
      mockAchievements,
      2,
    ]);

    const result = await service.findAll(1, { page: 1, limit: 10 });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: { userToAchievements: { id: 1 } },
      skip: 0,
      take: 10,
      order: { createdAt: 'DESC' },
    });
    expect(result).toEqual({
      items: mockAchievements,
      page: 1,
      total: 2,
      pages: 1,
    });
  });

  test('findOne should return an achievement by ID', async () => {
    const mockAchievement = { id: 1 } as Achievement;
    vi.spyOn(repository, 'findOneOrFail').mockResolvedValue(mockAchievement);

    const result = await service.findOne(1);

    expect(repository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockAchievement);
  });

  test('create should create and save a new achievement', async () => {
    const achievementData = {
      title: 'New Achievement',
      description: 'Description of the achievement',
    } as AchievementSchema;
    const mockAchievement = { id: 1, ...achievementData } as Achievement;

    vi.spyOn(repository, 'create').mockReturnValue(mockAchievement);
    vi.spyOn(repository, 'save').mockResolvedValue(mockAchievement);

    const result = await service.create(achievementData, 1);
    expect(repository.create).toHaveBeenCalledWith({
      ...achievementData,
      userToAchievements: [{ id: 1 }],
    });
    expect(repository.save).toHaveBeenCalledWith(mockAchievement);
    expect(result).toEqual(mockAchievement);
  });

  test('update should update an existing achievement', async () => {
    const achievementId = 1;
    const updateData = { title: 'Updated Title' } as Partial<AchievementSchema>;
    const mockUpdatedAchievement = {
      id: achievementId,
      ...updateData,
    } as Achievement;

    vi.spyOn(repository, 'update').mockResolvedValue({
      affected: 1,
    } as UpdateResult);
    vi.spyOn(repository, 'findOneOrFail').mockResolvedValue(
      mockUpdatedAchievement,
    );

    const result = await service.update(achievementId, updateData);

    expect(repository.update).toHaveBeenCalledWith(achievementId, updateData);
    expect(repository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: achievementId },
    });
    expect(result).toEqual(mockUpdatedAchievement);
  });

  test('delete should soft delete an achievement by ID', async () => {
    const achievementId = 1;
    vi.spyOn(repository, 'softDelete').mockResolvedValue({
      affected: 1,
    } as UpdateResult);

    const result = await service.delete(achievementId);

    expect(repository.softDelete).toHaveBeenCalledWith(achievementId);
    expect(result).toBe(true);
  });
});

/*
  - PRs
  - Correccion PR
  - Correccion Pruebas

  - Hablar con Alex para contexto de carrito abandonado
*/
