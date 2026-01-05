import type { Repository, UpdateResult } from 'typeorm';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Token } from '#models/token';
import { TokenService } from '#services/token';
import { container } from '#config/container';
import { hashValue } from '#libs/bcrypt';

vi.mock('#libs/bcrypt', () => ({
  hashValue: vi.fn(),
}));

describe('Services - Token', () => {
  let service: TokenService;
  let repository: Repository<Token>;

  beforeEach(() => {
    repository = {
      findAndCount: vi.fn(),
      findOneOrFail: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    } as unknown as Repository<Token>;

    vi.spyOn(container, 'getRepository').mockReturnValue(repository);
    service = new TokenService();
  });

  test('findAll should return paginated tokens for a user', async () => {
    const mockTokens = [{ id: 1 }, { id: 2 }] as Token[];
    vi.spyOn(repository, 'findAndCount').mockResolvedValue([mockTokens, 2]);

    const result = await service.findAll(1, { page: 1, limit: 10 });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: { user: { id: 1 } },
      skip: 0,
      take: 10,
    });
    expect(result).toEqual({
      items: mockTokens,
      page: 1,
      total: 2,
      pages: 1,
    });
  });

  test('findOne should return a token by ID', async () => {
    const mockToken = { id: 1 } as Token;
    vi.spyOn(repository, 'findOneOrFail').mockResolvedValue(mockToken);

    const result = await service.findOne(1);

    expect(repository.findOneOrFail).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockToken);
  });

  test('create should hash the token and save it', async () => {
    const userId = 1;
    const rawToken = 'raw-token';
    const hashedToken = 'hashed-token';
    const mockTokenEntity = {
      id: 1,
      token: hashedToken,
      user: { id: userId },
    } as Token;

    vi.mocked(hashValue).mockResolvedValue(hashedToken);
    vi.spyOn(repository, 'create').mockReturnValue(mockTokenEntity);
    vi.spyOn(repository, 'save').mockResolvedValue(mockTokenEntity);

    const result = await service.create(userId, rawToken);

    expect(hashValue).toHaveBeenCalledWith(rawToken);
    expect(repository.create).toHaveBeenCalledWith({
      user: { id: userId },
      token: hashedToken,
    });
    expect(repository.save).toHaveBeenCalledWith(mockTokenEntity);
    expect(result).toEqual(mockTokenEntity);
  });

  test('revoke should delete a token by ID', async () => {
    const tokenId = 1;
    vi.spyOn(repository, 'update').mockResolvedValue({
      affected: 1,
    } as UpdateResult);

    await service.revoke(tokenId);
    expect(repository.update).toHaveBeenCalledWith(tokenId, { revoked: true });
  });

  test('revokes all tokens for a user', async () => {
    const userId = 1;
    vi.spyOn(repository, 'update').mockResolvedValue({
      affected: 3,
    } as UpdateResult);

    await service.revokeAll(userId);
    expect(repository.update).toHaveBeenCalledWith(
      { user: { id: userId } },
      { revoked: true },
    );
  });
});
