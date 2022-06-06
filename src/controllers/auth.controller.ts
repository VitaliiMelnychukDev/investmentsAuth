import {
  Authorized,
  Body,
  JsonController,
  Post,
  Req,
} from 'routing-controllers';
import { RegisterDto } from '../dtos/auth/register.dto';
import { Service } from 'typedi';
import { AccountService } from '../services/account.service';
import { IResponse, IResponseNoData } from '../types/general';
import { LoginDto } from '../dtos/auth/login.dto';
import { AuthService } from '../services/auth.service';
import { ITokens } from '../types/token';
import { AuthMessage, UserMessage } from '../types/message';
import { ValidateDto } from '../dtos/auth/validate.dto';
import { IValidate } from '../types/auth';
import { TokenService } from '../services/token.service';
import { RefreshDto } from '../dtos/auth/refresh.dto';
import { AuthorizedRequest } from '../types/request';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  @Post('/register')
  async register(
    @Body({ required: true }) registerBody: RegisterDto
  ): Promise<IResponseNoData> {
    await this.accountService.create(registerBody);

    return {
      success: true,
      message: UserMessage.UserSuccessfullyRegistered,
    };
  }

  @Post('/login')
  async login(
    @Body({ required: true }) loginBody: LoginDto
  ): Promise<IResponse<ITokens>> {
    const tokens = await this.authService.login(loginBody);

    return {
      data: tokens,
    };
  }

  @Post('/validate')
  validate(
    @Body({ required: true }) validateBody: ValidateDto
  ): IResponse<IValidate> {
    const response: IResponse<IValidate> = {
      data: {
        tokenValid: false,
      },
    };

    try {
      new TokenService().verifyAndGetAccessTokenData(validateBody.token);

      response.data.tokenValid = true;
      // eslint-disable-next-line no-empty
    } catch {}

    return response;
  }

  @Post('/refresh')
  async refresh(
    @Body({ required: true }) refreshBody: RefreshDto
  ): Promise<IResponse<ITokens>> {
    const tokens: ITokens = await this.authService.refreshTokens(
      refreshBody.refreshToken
    );

    return {
      data: tokens,
    };
  }

  @Post('/logout')
  @Authorized()
  async logout(
    @Body({ required: true }) logoutBody: RefreshDto,
    @Req() request: AuthorizedRequest
  ): Promise<IResponseNoData> {
    await this.authService.logout(logoutBody.refreshToken, request.user);

    return {
      success: true,
      message: AuthMessage.UserSuccessfullyLogout,
    };
  }
}
