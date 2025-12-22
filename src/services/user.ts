import type { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import type { Auth } from '#schemas/user';
import { InjectRepository } from '#decorators/injectRepository';
import type { Pagination } from '#types/pagination';
import type { Pagination as PaginationParams } from '#schemas/pagination';
import { Service } from '#decorators/service';
import { User } from '#models/user';

@Service()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  /**
   * Retrieves a paginated list of users.
   * @param params - Pagination parameters.
   * @param options - TypeORM find options.
   * @returns A promise that resolves to a Pagination object containing users.
   */
  public async findAll(
    { page = 1, limit = 10, offset = 0 }: Partial<PaginationParams> = {},
    options: FindManyOptions<User> = {},
  ): Promise<Pagination<User>> {
    const [items, total] = await this.userRepository.findAndCount({
      ...options,
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      page,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Retrieves a single user by ID.
   * @param id - The ID of the user to retrieve.
   * @param options - Additional find options.
   * @returns A promise that resolves to the User or null if not found.
   */
  public async findOne(
    id: number,
    options: FindOneOptions<User> = {},
  ): Promise<User> {
    return await this.userRepository.findOneOrFail({
      ...options,
      where: { ...options.where, id },
    });
  }

  /**
   * Finds a user by email.
   * @param email - The email of the user to find.
   * @param options - Additional find options.
   * @returns A promise that resolves to the User or null if not found.
   */
  public async findByEmail(
    email: string,
    options: FindOneOptions<User> = {},
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      ...options,
      where: { ...options.where, email },
    });
  }

  /**
   * Creates a new user.
   * @param dto - The user data transfer object.
   * @returns A promise that resolves to the created User.
   */
  public async create(dto: Auth): Promise<User> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  /**
   * Updates an existing user.
   * @param id - The ID of the user to update.
   * @param dto - The partial user data to update.
   * @returns A promise that resolves to the updated User.
   */
  public async update(id: number, dto: Partial<Auth>): Promise<User> {
    await this.userRepository.update(id, dto);
    return await this.findOne(id);
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to true if deletion was successful, false otherwise.
   */
  public async delete(id: number): Promise<boolean> {
    const { affected } = await this.userRepository.softDelete(id);
    return affected !== 0;
  }
}
