import type { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Achievement } from '#models/achievement';
import type { AchievementSchema } from '#schemas/achievement';
import { InjectRepository } from '#decorators/injectRepository';
import type { Pagination } from '#types/pagination';
import type { Pagination as PaginationParams } from '#schemas/pagination';
import { Service } from '#decorators/service';

@Service()
export class AchievementService {
  @InjectRepository(Achievement)
  private readonly achievementRepository: Repository<Achievement>;

  /**
   * Finds all achievements with pagination.
   * @param params - Pagination parameters.
   * @param options - TypeORM find options.
   * @returns A promise that resolves to a paginated list of achievements.
   */
  public async findAll(
    userId: number,
    { page = 1, limit = 10, offset = 0 }: Partial<PaginationParams> = {},
    options: FindManyOptions<Achievement> = {},
  ): Promise<Pagination<Achievement>> {
    const [achievements, total] = await this.achievementRepository.findAndCount(
      {
        ...options,
        where: { ...options.where, userToAchievements: { id: userId } },
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' },
      },
    );

    return {
      items: achievements,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Finds a single achievement by its ID.
   * @param id - The ID of the achievement.
   * @param options - TypeORM find options.
   * @returns A promise that resolves to the found achievement.
   */
  public async findOne(
    id: number,
    options: FindOneOptions<Achievement> = {},
  ): Promise<Achievement> {
    return this.achievementRepository.findOneOrFail({
      ...options,
      where: { ...options.where, id },
    });
  }

  /**
   * Creates a new achievement.
   * @param dto - The achievement data transfer object.
   * @returns A promise that resolves to the created achievement.
   */
  public async create(
    dto: AchievementSchema,
    userId: number,
  ): Promise<Achievement> {
    const achievement = this.achievementRepository.create({
      ...dto,
      userToAchievements: [{ id: userId }],
    });
    return this.achievementRepository.save(achievement);
  }

  /**
   * Updates an existing achievement.
   * @param id - The ID of the achievement to update.
   * @param dto - The partial achievement data to update.
   * @returns A promise that resolves to the updated achievement.
   */
  public async update(
    id: number,
    dto: Partial<AchievementSchema>,
  ): Promise<Achievement> {
    await this.achievementRepository.update(id, dto);
    return this.findOne(id);
  }

  /**
   * Deletes an achievement by its ID.
   * @param id - The ID of the achievement to delete.
   * @returns A promise that resolves to a boolean indicating success.
   */
  public async delete(id: number): Promise<boolean> {
    const { affected } = await this.achievementRepository.softDelete(id);
    return affected !== 0;
  }
}
