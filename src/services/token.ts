import type { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '#decorators/injectRepository';
import type { Pagination } from '#types/pagination';
import type { Pagination as PaginationParams } from '#schemas/pagination';
import { Service } from '#decorators/service';
import { Token } from '#models/token';
import { hashValue } from '#libs/bcrypt';

@Service()
export class TokenService {
  @InjectRepository(Token)
  private readonly tokenRepository: Repository<Token>;

  /**
   * Finds all tokens for a specific user with pagination.
   * @param userId - ID of the user whose tokens are to be retrieved.
   * @param params - Pagination parameters.
   * @param options - Additional TypeORM find options.
   * @returns A promise that resolves to a paginated list of tokens.
   */
  public async findAll(
    userId: number,
    { page = 1, limit = 10, offset = 0 }: Partial<PaginationParams>,
    options: FindManyOptions<Token> = {},
  ): Promise<Pagination<Token>> {
    const [items, total] = await this.tokenRepository.findAndCount({
      ...options,
      where: { ...options.where, user: { id: userId } },
      skip: offset,
      take: limit,
    });

    return {
      items,
      page,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Finds a single token by its ID.
   * @param id - ID of the token to retrieve.
   * @param options - Additional TypeORM find options.
   * @returns - A promise that resolves to the found token.
   */
  public async findOne(
    id: number,
    options: FindOneOptions<Token> = {},
  ): Promise<Token> {
    return this.tokenRepository.findOneOrFail({
      ...options,
      where: { ...options.where, id },
    });
  }

  /**
   * Creates a new token for a user.
   * @param userId - ID of the user for whom the token is to be created.
   * @param rawToken - The raw token string to be hashed and stored.
   * @returns A promise that resolves to the created token.
   */
  public async create(userId: number, rawToken: string): Promise<Token> {
    const hashedToken = await hashValue(rawToken);

    const token = this.tokenRepository.create({
      user: { id: userId },
      token: hashedToken,
    });
    return await this.tokenRepository.save(token);
  }

  /**
   * Revokes a token by its ID.
   * @param id - ID of the token to revoke.
   * @returns A promise that resolves when the token is revoked.
   */
  public async revoke(id: number): Promise<void> {
    await this.tokenRepository.update(id, { revoked: true });
  }

  /**
   * Revokes all tokens for a specific user.
   * @param userId - ID of the user whose tokens are to be revoked.
   * @returns A promise that resolves when all tokens are revoked.
   */
  public async revokeAll(userId: number): Promise<void> {
    await this.tokenRepository.update(
      { user: { id: userId } },
      { revoked: true },
    );
  }
}
