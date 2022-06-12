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
import { AccountMessage } from '../types/message';
import { IAccount, AccountRole } from '../types/account';
import { SetRoleDto } from '../dtos/account/set-role.dto';
import { SearchDto } from '../dtos/account/search.dto';

@JsonController('/account')
@Service()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/search')
  @Authorized(AccountRole.Admin)
  async getAccounts(
    @QueryParams() searchParams: SearchDto
  ): Promise<IResponse<IAccount[]>> {
    const accounts: IAccount[] = await this.accountService.getAccounts(
      searchParams
    );

    return {
      data: accounts,
    };
  }

  @Patch('/activate')
  @Authorized(AccountRole.Admin)
  async activateAccount(
    @Body({ required: true }) activateAccountBody: ActivateDto
  ): Promise<IResponseNoData> {
    await this.accountService.updateAccount(activateAccountBody.email, {
      activated: true,
    });

    return {
      success: true,
      message: AccountMessage.AccountSuccessfullyActivated,
    };
  }

  @Patch('/set-role')
  @Authorized(AccountRole.Admin)
  async setAccountRole(
    @Body({ required: true }) setRoleBody: SetRoleDto
  ): Promise<IResponseNoData> {
    await this.accountService.updateAccount(setRoleBody.email, {
      role: setRoleBody.role,
    });

    return {
      success: true,
      message: AccountMessage.AccountRoleSuccessfullyChanged,
    };
  }
}
