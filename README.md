# Sequelize vs TypeORM

A continuación se presentan ejemplos prácticos que ilustran las diferencias entre Sequelize
y TypeORM, tomando como base las rúbricas evaluadas durante el laboratorio.

> [!NOTE]
> Si se desea ver el análisis textual del laboratorio, haz [click aquí](./docs/Laboratorio_TypeORM.pdf)

---

### Instalación y Configuración

**Sequelize**
```ts
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});
```

**TypeORM**
```ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/models/*.ts'],
  migrations: ['src/migrations/*.ts'],
});
```

> Diferencia clave: TypeORM integra migraciones directamente en su DataSource.

## Creación de Modelos / Entidades

**Sequelize**
```ts
export const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  } 
}, {
  paranoid: true,
  timestamps: true
});
```

**TypeORM**
```ts
@Entity()
export abstract class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  password: string;
}
```

> En TypeORM las entidades están basadas en clases y decoradores, favoreciendo el tipado estático.

## Asociación de Entidades

**Sequelize**
```ts
User.hasMany(Token);
Token.belongsTo(User);
```

**TypeORM**
```ts
@OneToMany(() => Token, token => token.user)
tokens: Token[];

@ManyToOne(() => User, user => user.tokens)
user: User;
```

> En TypeORM las relaciones viven dentro de la entidad y se definen a nivel de propiedad.

## Consultas a la Entidad

**Sequelize**
```ts
const user = await User.findOne({
  where: { email },
  include: [Token],
});
```

**TypeORM**
```ts
const user = await dataSource.getRepository(User).findOne({
  where: { email },
  relations: ['tokens'],
});
```

> TypeORM es más verboso sin DI, pero más explícito y predecible.

## Dependency Injection (DI)

**Sequelize (wrapper manual)**
```ts
export class UserService {
  constructor(private readonly userModel = User) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }
}
```

**TypeORM (repositorio inyectado)**
```ts
export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
```

> TypeORM está diseñado para trabajar naturalmente con DI, Sequelize no.

## Type-Safety

**Sequelize**
```ts
const user = await User.findOne();
user.nonExistentProp; // no error en compile-time
```

**TypeORM**
```ts
const user = await userRepository.findOne();
user.nonExistentProp; // error de TypeScript
```

> TypeORM ofrece tipado fuerte sin hacks adicionales.

## Migraciones

**Sequelize**
```bash
npx sequelize-cli migration:generate --name add-column
```

```js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'age', {
      type: Sequelize.INTEGER,
    });
  },
};
```

**TypeORM**
```bash
npx typeorm-ts-node-esm migration:generate -d src/config/database.ts add-column
```

```ts
export class AddColumn1680000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "age" int`);
  }
}
```

> TypeORM integra migraciones al core del ORM y soporta ESM nativamente.

## Testing (Vitest)

**Sequelize**
```ts
vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);
```

**TypeORM**
```ts
const repo = {
  findOne: vi.fn().mockResolvedValue(mockUser),
} as unknown as Respository<User>;

const service = new UserService(repo);
```

> Ambos son testeables, pero TypeORM favorece mocks desacoplados y tipados.