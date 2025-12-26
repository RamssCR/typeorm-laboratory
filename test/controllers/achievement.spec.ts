import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  createAchievement,
  deleteAchievement,
  getAchievementById,
  getAchievements,
  updateAchievement,
} from '#controllers/achievement';
import { createRequest, createResponse } from 'node-mocks-http';
import type { Achievement } from '#models/achievement';
import { AchievementService } from '#services/achievement';
import type { Pagination } from '#types/pagination';

vi.mock('#services/achievement');

describe('Achievement Controller', () => {
  let achievementService: AchievementService;

  beforeEach(() => {
    achievementService = new AchievementService();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('getAchievements - should retrieve achievements successfully', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/achievements',
      user: { id: 1 },
      query: { page: '1', limit: '10', offset: '0' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockAchievements = {
      items: [
        {
          id: 1,
          title: 'Achievement 1',
          description: 'Description 1',
          userToAchievements: [{ id: 1 }],
        },
        {
          id: 2,
          title: 'Achievement 2',
          description: 'Description 2',
          userToAchievements: [{ id: 1 }],
        },
      ],
      page: 1,
      pages: 10,
      total: 2,
    } as Pagination<Achievement>;

    vi.spyOn(achievementService, 'findAll').mockResolvedValue(mockAchievements);

    const handler = getAchievements(achievementService);
    await handler(req, res, next);

    expect(achievementService.findAll).toHaveBeenCalledWith(1, {
      page: 1,
      limit: 10,
      offset: 0,
    });
    expect(res._getStatusCode()).toBe(200);
  });

  test('getAchievementById - should retrieve an achievement successfully', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/achievements/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockAchievement = {
      id: 1,
      title: 'Achievement 1',
      description: 'Description 1',
      userToAchievements: [{ id: 1 }],
    } as Achievement;

    vi.spyOn(achievementService, 'findOne').mockResolvedValue(mockAchievement);

    const handler = getAchievementById(achievementService);
    await handler(req, res, next);

    expect(achievementService.findOne).toHaveBeenCalledWith(1);
    expect(res._getStatusCode()).toBe(200);
  });

  test('createAchievement - should create an achievement successfully', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/achievements',
      user: { id: 1 },
      body: {
        title: 'New Achievement',
        description: 'New Description',
        points: 100,
      },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockAchievement = {
      id: 1,
      title: 'New Achievement',
      description: 'New Description',
      points: 100,
      userToAchievements: [{ id: 1 }],
    } as Achievement;

    vi.spyOn(achievementService, 'create').mockResolvedValue(mockAchievement);

    const handler = createAchievement(achievementService);
    await handler(req, res, next);

    expect(achievementService.create).toHaveBeenCalledWith(
      { title: 'New Achievement', description: 'New Description', points: 100 },
      1,
    );
    expect(res._getStatusCode()).toBe(201);
  });

  test('updateAchievement - should update an achievement successfully', async () => {
    const req = createRequest({
      method: 'PUT',
      url: '/achievements/1',
      params: { id: '1' },
      body: { title: 'Updated Achievement' },
    });
    const res = createResponse();
    const next = vi.fn();

    const mockAchievement = {
      id: 1,
      title: 'Updated Achievement',
      description: 'Description 1',
      points: 100,
      userToAchievements: [{ id: 1 }],
    } as Achievement;

    vi.spyOn(achievementService, 'update').mockResolvedValue(mockAchievement);

    const handler = updateAchievement(achievementService);
    await handler(req, res, next);

    expect(achievementService.update).toHaveBeenCalledWith(1, {
      title: 'Updated Achievement',
    });
    expect(res._getStatusCode()).toBe(200);
  });

  test('deleteAchievement - should delete an achievement successfully', async () => {
    const req = createRequest({
      method: 'DELETE',
      url: '/achievements/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(achievementService, 'delete').mockResolvedValue(true);

    const handler = deleteAchievement(achievementService);
    await handler(req, res, next);

    expect(achievementService.delete).toHaveBeenCalledWith(1);
    expect(res._getStatusCode()).toBe(200);
  });
});

describe('Achievement Controller Error Handling', () => {
  let achievementService: AchievementService;

  beforeEach(() => {
    achievementService = new AchievementService();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('getAchievements - should handle errors', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/achievements',
      user: { id: 1 },
      query: { page: '1', limit: '10', offset: '0' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(achievementService, 'findAll').mockRejectedValue(
      new Error('Database error'),
    );

    const handler = getAchievements(achievementService);
    await handler(req, res, next);

    expect(achievementService.findAll).toHaveBeenCalledWith(1, {
      page: 1,
      limit: 10,
      offset: 0,
    });
    expect(next).toHaveBeenCalled();
  });

  test('getAchievementById - should handle errors', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/achievements/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(achievementService, 'findOne').mockRejectedValue(
      new Error('Achievement not found'),
    );

    const handler = getAchievementById(achievementService);
    await handler(req, res, next);

    expect(achievementService.findOne).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalled();
  });

  test('createAchievement - should handle errors', async () => {
    const req = createRequest({
      method: 'POST',
      url: '/achievements',
      user: { id: 1 },
      body: {
        title: 'New Achievement',
        description: 'New Description',
        points: 100,
      },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(achievementService, 'create').mockRejectedValue(
      new Error('Creation failed'),
    );

    const handler = createAchievement(achievementService);
    await handler(req, res, next);

    expect(achievementService.create).toHaveBeenCalledWith(
      { title: 'New Achievement', description: 'New Description', points: 100 },
      1,
    );
    expect(next).toHaveBeenCalled();
  });

  test('updateAchievement - should handle errors', async () => {
    const req = createRequest({
      method: 'PUT',
      url: '/achievements/1',
      params: { id: '1' },
      body: { title: 'Updated Achievement' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(achievementService, 'update').mockRejectedValue(
      new Error('Update failed'),
    );

    const handler = updateAchievement(achievementService);
    await handler(req, res, next);

    expect(achievementService.update).toHaveBeenCalledWith(1, {
      title: 'Updated Achievement',
    });
    expect(next).toHaveBeenCalled();
  });

  test('deleteAchievement - should handle errors', async () => {
    const req = createRequest({
      method: 'DELETE',
      url: '/achievements/1',
      params: { id: '1' },
    });
    const res = createResponse();
    const next = vi.fn();

    vi.spyOn(achievementService, 'delete').mockRejectedValue(
      new Error('Deletion failed'),
    );

    const handler = deleteAchievement(achievementService);
    await handler(req, res, next);

    expect(achievementService.delete).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalled();
  });
});
