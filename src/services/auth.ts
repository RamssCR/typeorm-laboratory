import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
} from '#config/environment';
import { tokenDecoder, tokenEncoder } from '#helpers/tokenEncoder';
import type { Auth } from '#schemas/user';
import { InjectService } from '#decorators/injectService';
import { Service } from '#decorators/service';
import type { SignOptions } from 'jsonwebtoken';
import { TokenService } from './token';
import type { User } from '#models/user';
import { UserService } from './user';
import { compareValue } from '#libs/bcrypt';
import { createToken } from '#libs/jwt';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

@Service()
export class AuthService {
  @InjectService(UserService)
  private readonly userService: UserService;
  @InjectService(TokenService)
  private readonly tokenService: TokenService;

  /**
   * Handles user login by validating credentials and generating tokens.
   * @param data - The authentication data containing email and password.
   * @returns An object containing the authenticated user and JWT tokens.
   */
  public async login(data: Auth): Promise<{ user: User; tokens: Tokens }> {
    const user = await this.userService.findByEmail(data.email);
    if (!user || !(await compareValue(data.password, user.password)))
      throw new Error('Invalid email or password');

    return { user, tokens: await this.generateTokens({ id: user.id }) };
  }

  /**
   * Handles user registration by creating a new user and generating tokens.
   * @param data - The authentication data for the new user.
   * @returns An object containing the newly created user and JWT tokens.
   */
  public async register(data: Auth): Promise<{ user: User; tokens: Tokens }> {
    const storedUser = await this.userService.findByEmail(data.email);
    if (storedUser) throw new Error('Email already in use');

    const user = await this.userService.create(data);
    return { user, tokens: await this.generateTokens({ id: user.id }) };
  }

  /**
   * Retrieves the profile of a user by their ID.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the User object.
   */
  public async profile(userId: number): Promise<User> {
    return await this.userService.findOne(userId);
  }

  /**
   * Handles user logout by revoking the refresh token.
   * @param token - The refresh token to revoke.
   * @returns A promise that resolves when the token is revoked.
   */
  public async logout(token: string): Promise<void> {
    const decoded = tokenDecoder(token);
    if (!decoded?.id) throw new Error('Invalid token');

    await this.tokenService.revoke(decoded.id);
  }

  /**
   * Refreshes JWT tokens using a valid refresh token.
   * @param token - The refresh token.
   * @param userId - The ID of the user.
   * @returns An object containing new accessToken and refreshToken.
   */
  public async refresh(token: string, userId: number): Promise<Tokens> {
    const decoded = tokenDecoder(token);
    if (!decoded?.id) throw new Error('Invalid token');

    const storedToken = await this.tokenService.findOne(decoded.id);
    if (storedToken.revoked) {
      await this.tokenService.revokeAll(userId);
      throw new Error('Token has been revoked');
    }

    return await this.generateTokens({ id: userId });
  }

  /**
   * Generates access and refresh JWT tokens for a given payload.
   * @param payload - The payload to include in the tokens.
   * @returns An object containing the accessToken and refreshToken.
   */
  private async generateTokens(payload: { id: number }): Promise<Tokens> {
    const [accessToken, refreshToken] = (await Promise.all([
      createToken(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
      }),
      createToken(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
      }),
    ])) as [string, string];

    const { id } = await this.tokenService.create(payload.id, refreshToken);
    return { accessToken, refreshToken: tokenEncoder({ id, refreshToken }) };
  }
}
