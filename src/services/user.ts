import type { FindOneOptions, Repository } from 'typeorm';
import type { Pagination, PaginationParams } from '#types/pagination';
import { InjectRepository } from '#decorators/injectRepository';
import { Service } from '#decorators/service';
import { User } from '#models/user';
import type { UserSchema } from '#schemas/user';

@Service()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  public async findAll({
    page = 1,
    limit = 10,
    offset = 0,
  }: Partial<PaginationParams>): Promise<Pagination<User>> {
    const [items, total] = await this.userRepository.findAndCount({
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

  public async findOne(
    id: number,
    options: FindOneOptions<User> = {},
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      ...options,
      where: { ...options.where, id },
    });
  }

  public async findByEmail(
    email: string,
    options: FindOneOptions<User> = {},
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      ...options,
      where: { ...options.where, email },
    });
  }

  public async create(dto: UserSchema): Promise<User> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  public async update(id: number, dto: Partial<UserSchema>): Promise<User> {
    await this.userRepository.update(id, dto);
    return await this.userRepository.findOneByOrFail({ id });
  }

  public async delete(id: number): Promise<boolean> {
    const { affected } = await this.userRepository.delete(id);
    return affected !== 0;
  }
}
