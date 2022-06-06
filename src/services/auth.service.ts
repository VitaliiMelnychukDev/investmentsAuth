import { Service } from 'typedi';
import { User } from '../entity/User';
import { HashService } from './hash.service';
import AppDataSource from '../data-source';
import { BadRequestError, UnauthorizedError } from 'routing-controllers';
import { AuthError } from '../types/error';
import { LoginDto } from '../dtos/auth/login.dto';
import { Token } from '../entity/Token';
import { ITokenPayload, ITokens } from '../types/token';
import { TokenService } from './token.service';

@Service()
export class AuthService {
  constructor(
    private hashService: HashService,
    private tokenService: TokenService
  ) {}

  async login(loginData: LoginDto): Promise<ITokens> {
    const userRepository = AppDataSource.getRepository(User);
    let user: User | null = null;

    try {
      user = await userRepository.findOneBy({ email: loginData.email });
    } catch {
      throw new UnauthorizedError(AuthError.LoginUserFail);
    }

    if (!user || !user.activated) {
      throw new UnauthorizedError(AuthError.LoginUserFail);
    }

    const passwordIsValid: boolean = await this.hashService.isMatch(
      loginData.password,
      user.password
    );

    if (!passwordIsValid) {
      throw new UnauthorizedError(AuthError.LoginUserFail);
    }

    try {
      return await this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedError(AuthError.LoginUserFail);
    }
  }

  async refreshTokens(refreshToken: string): Promise<ITokens> {
    const token: Token = await this.getRefreshToken(
      refreshToken,
      AuthError.RefreshTokenFail
    );

    if (token.expireAt < new Date().getTime()) {
      throw new BadRequestError(AuthError.RefreshTokenFail);
    }

    await this.deleteToken(refreshToken, AuthError.RefreshTokenFail);

    return this.generateTokens(token.user);
  }

  async logout(refreshToken: string, user: ITokenPayload): Promise<void> {
    const token: Token = await this.getRefreshToken(
      refreshToken,
      AuthError.RefreshTokenFail
    );

    if (token.user.id !== user.userId) {
      throw new BadRequestError(AuthError.LogoutFail);
    }

    await this.deleteToken(refreshToken, AuthError.LogoutFail);
  }

  private async generateTokens(user: User): Promise<ITokens> {
    const tokenRepository = AppDataSource.getRepository(Token);

    const newToken = new Token();
    newToken.userId = user.id;
    newToken.refreshToken = this.tokenService.generateRefreshToken();
    newToken.expireAt = this.tokenService.getRefreshTokenExpiration();

    await tokenRepository.save(newToken);

    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken: newToken.refreshToken,
    };
  }

  private async getRefreshToken(
    refreshToken: string,
    errorMessage: AuthError
  ): Promise<Token | null> {
    let token: Token | null = null;
    try {
      const tokenRepository = AppDataSource.getRepository(Token);

      token = await tokenRepository.findOne({
        where: {
          refreshToken,
        },
        relations: {
          user: true,
        },
      });
    } catch {
      throw new BadRequestError(errorMessage);
    }

    if (!token || !token.user?.activated) {
      throw new BadRequestError(errorMessage);
    }

    return token;
  }

  private async deleteToken(
    refreshToken: string,
    errorMessage: AuthError
  ): Promise<void> {
    try {
      const tokenRepository = AppDataSource.getRepository(Token);

      await tokenRepository.delete({
        refreshToken,
      });
    } catch {
      throw new BadRequestError(errorMessage);
    }
  }
}
