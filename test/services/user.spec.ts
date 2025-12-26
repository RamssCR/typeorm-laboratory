import type { Repository, UpdateResult } from 'typeorm';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { User } from '#models/user';
import { UserService } from '#services/user';
import { container } from '#config/container';
import { hashValue } from '#libs/bcrypt';

vi.mock('#libs/bcrypt', () => ({
  hashValue: vi.fn(),
}));

describe('Services - User', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(() => {
    repository = {
      findAndCount: vi.fn(),
      findOneOrFail: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      softDelete: vi.fn(),
    } as unknown as Repository<User>;

    vi.spyOn(container, 'getRepository').mockReturnValue(repository);
    service = new UserService();
  });

  test('findAll should return paginated users', async () => {
    const mockUsers = [{ id: 1 }, { id: 2 }] as User[];
    vi.spyOn(repository, 'findAndCount').mockResolvedValue([mockUsers, 2]);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: { createdAt: 'DESC' },
    });
    expect(result).toEqual({
      items: mockUsers,
      page: 1,
      total: 2,
      pages: 1,
    });
  });

  test('findOne should return a user by ID', async () => {
    const mockUser = { id: 1 } as User;
    vi.spyOn(repository, 'findOneOrFail').mockResolvedValue(mockUser);

    const result = await service.findOne(1);

    expect(repository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockUser);
  });

  test('findByEmail should return a user by email', async () => {
    const mockUser = { id: 1, email: 'test@example.com' } as User;
    vi.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

    const result = await service.findByEmail('test@example.com');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(result).toEqual(mockUser);
  });

  test('findByEmail should return null if user not found', async () => {
    vi.spyOn(repository, 'findOne').mockResolvedValue(null);
    const result = await service.findByEmail('test@example.com');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(result).toBeNull();
  });

  test('creates a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    } as Omit<User, 'id'>;
    const mockUser = { id: 1, ...userData } as User;

    vi.mocked(hashValue).mockResolvedValue('hashedPassword');
    vi.spyOn(repository, 'create').mockReturnValue(mockUser);
    vi.spyOn(repository, 'save').mockResolvedValue(mockUser);

    const result = await service.create(userData);

    expect(repository.create).toHaveBeenCalledWith({
      ...userData,
      password: 'hashedPassword',
    });
    expect(repository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  test('updates an existing user', async () => {
    const userId = 1;
    const updateData = { email: 'updated@example.com' } as Partial<User>;
    const mockUser = { id: userId, email: 'updated@example.com' } as User;

    vi.spyOn(repository, 'findOneOrFail').mockResolvedValue(mockUser);
    vi.spyOn(repository, 'save').mockResolvedValue(mockUser);

    const result = await service.update(userId, updateData);

    expect(repository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(repository.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  test('soft-deletes a user', async () => {
    const userId = 1;
    vi.spyOn(repository, 'softDelete').mockResolvedValue({
      affected: 1,
    } as UpdateResult);

    const result = await service.delete(userId);

    expect(repository.softDelete).toHaveBeenCalledWith(userId);
    expect(result).toBe(true);
  });
});
