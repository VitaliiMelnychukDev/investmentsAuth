import {
  Authorized,
  Body,
  Get,
  JsonController,
  Patch,
  QueryParams,
} from 'routing-controllers';
import { ActivateDto } from '../dtos/account/activate.dto';
import { IResponse, IResponseNoData } from '../types/general';
import { Service } from 'typedi';
import { AccountService } from '../services/account.service';
import { UserMessage } from '../types/message';
import { IUser, UserRole } from '../types/user';
import { SetRoleDto } from '../dtos/account/set-role.dto';
import { SearchDto } from '../dtos/account/search.dto';

@JsonController('/account')
@Service()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/search')
  @Authorized(UserRole.Admin)
  async getUsers(
    @QueryParams() searchParams: SearchDto
  ): Promise<IResponse<IUser[]>> {
    const users: IUser[] = await this.accountService.getUsers(searchParams);

    return {
      data: users,
    };
  }

  @Patch('/activate')
  @Authorized(UserRole.Admin)
  async activateUser(
    @Body({ required: true }) activateUserBody: ActivateDto
  ): Promise<IResponseNoData> {
    await this.accountService.updateUser(activateUserBody.email, {
      activated: true,
    });

    return {
      success: true,
      message: UserMessage.UserSuccessfullyActivated,
    };
  }

  @Patch('/set-role')
  @Authorized(UserRole.Admin)
  async setUserRole(
    @Body({ required: true }) setRoleBody: SetRoleDto
  ): Promise<IResponseNoData> {
    await this.accountService.updateUser(setRoleBody.email, {
      role: setRoleBody.role,
    });

    return {
      success: true,
      message: UserMessage.UserRoleSuccessfullyChanged,
    };
  }
}
