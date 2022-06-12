import { Service } from 'typedi';
import { Account } from '../entity/Account';
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
    const accountRepository = AppDataSource.getRepository(Account);
    let account: Account | null = null;

    try {
      account = await accountRepository.findOneBy({ email: loginData.email });
    } catch {
      throw new UnauthorizedError(AuthError.LoginAccountFail);
    }

    if (!account || !account.activated) {
      throw new UnauthorizedError(AuthError.LoginAccountFail);
    }

    const passwordIsValid: boolean = await this.hashService.isMatch(
      loginData.password,
      account.password
    );

    if (!passwordIsValid) {
      throw new UnauthorizedError(AuthError.LoginAccountFail);
    }

    try {
      return await this.generateTokens(account);
    } catch (e) {
      throw new UnauthorizedError(AuthError.LoginAccountFail);
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

    return this.generateTokens(token.account);
  }

  async logout(refreshToken: string, account: ITokenPayload): Promise<void> {
    const token: Token = await this.getRefreshToken(
      refreshToken,
      AuthError.RefreshTokenFail
    );

    if (token.account.id !== account.accountId) {
      throw new BadRequestError(AuthError.LogoutFail);
    }

    await this.deleteToken(refreshToken, AuthError.LogoutFail);
  }

  private async generateTokens(account: Account): Promise<ITokens> {
    const tokenRepository = AppDataSource.getRepository(Token);

    const newToken = new Token();
    newToken.accountId = account.id;
    newToken.refreshToken = this.tokenService.generateRefreshToken();
    newToken.expireAt = this.tokenService.getRefreshTokenExpiration();

    await tokenRepository.save(newToken);

    const accessToken = this.tokenService.generateAccessToken({
      accountId: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
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
          account: true,
        },
      });
    } catch {
      throw new BadRequestError(errorMessage);
    }

    if (!token || !token.account?.activated) {
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
