import * as jwt from 'jsonwebtoken';
import { TokenError } from '../types/error';
import { Service } from 'typedi';
import { ITokenPayload } from '../types/token';
import { generate } from 'rand-token';
import { UnauthorizedError } from 'routing-controllers';

@Service()
export class TokenService {
  private readonly accessTokenExpiration = '600s';
  private readonly refreshTokenExpirationDays = 1;
  private readonly secret = 'Test';
  private readonly jwtAlgorithm = 'HS256';

  public generateRefreshToken(): string {
    return generate(256);
  }

  public getRefreshTokenExpiration(): number {
    const date = new Date();
    date.setDate(date.getDate() + this.refreshTokenExpirationDays);

    return date.getTime();
  }

  public verifyAndGetAccessTokenData(token: string): ITokenPayload {
    try {
      return jwt.verify(token, this.secret, {
        algorithms: [this.jwtAlgorithm],
      }) as ITokenPayload;
    } catch (e) {
      throw new UnauthorizedError(TokenError.TokenIsNotValid);
    }
  }

  public generateAccessToken(data: ITokenPayload): string {
    return jwt.sign(data, this.secret, {
      expiresIn: this.accessTokenExpiration,
      algorithm: this.jwtAlgorithm,
    });
  }
}
