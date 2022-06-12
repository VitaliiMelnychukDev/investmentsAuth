import { Service } from 'typedi';
import { RegisterDto } from '../dtos/auth/register.dto';
import { Account } from '../entity/Account';
import { IUpdateAccount, IAccount, AccountRole } from '../types/account';
import AppDataSource from '../data-source';
import { HashService } from './hash.service';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { AccountError } from '../types/error';
import { SearchDto } from '../dtos/account/search.dto';
import { FindOptionsWhere, Like } from 'typeorm';
import { PaginationService } from './pagination.service';

@Service()
export class AccountService {
  constructor(
    private hashService: HashService,
    private paginationService: PaginationService
  ) {}

  async create(account: RegisterDto): Promise<void> {
    const existedAccount: Account | null = await this.getAccount(
      account.email,
      AccountError.CreateAccountFail
    );

    if (existedAccount) {
      throw new BadRequestError(AccountError.AccountEmailExists);
    }

    const newAccount = new Account();
    newAccount.role = account.role || AccountRole.User;
    newAccount.email = account.email;
    newAccount.name = account.name;
    newAccount.activated = false;
    newAccount.password = await this.hashService.hashString(account.password);

    await this.saveAccount(newAccount, AccountError.CreateAccountFail);
  }

  async getAccounts(searchParams: SearchDto): Promise<IAccount[]> {
    const accountRepository = AppDataSource.getRepository(Account);

    const sharedWhereOptions: FindOptionsWhere<Account> = {};
    if (searchParams.role) {
      sharedWhereOptions.role = searchParams.role;
    }

    let whereOptions: FindOptionsWhere<Account> | FindOptionsWhere<Account>[] =
      {};
    if (!searchParams.searchTerm) {
      whereOptions = sharedWhereOptions;
    } else {
      whereOptions = [
        {
          email: Like(`%${searchParams.searchTerm}%`),
          ...sharedWhereOptions,
        },
        {
          name: Like(`%${searchParams.searchTerm}%`),
          ...sharedWhereOptions,
        },
      ];
    }

    try {
      return await accountRepository.find({
        ...this.paginationService.getPaginationParams(searchParams),
        where: whereOptions,
        select: {
          email: true,
          name: true,
          role: true,
          activated: true,
          id: true,
        },
      });
    } catch {
      throw new BadRequestError(AccountError.GetAccountsFail);
    }
  }

  async updateAccount(
    accountEmail: string,
    accountFields: IUpdateAccount
  ): Promise<void> {
    const account: Account | null = await this.getAccount(
      accountEmail,
      AccountError.ActivateAccountFail
    );

    if (!account) {
      throw new NotFoundError(AccountError.ActivateAccountFail);
    }

    if (accountFields.activated) account.activated = accountFields.activated;
    if (accountFields.password) account.password = accountFields.password;
    if (accountFields.name) account.name = accountFields.name;
    if (accountFields.role) account.role = accountFields.role;
    if (accountFields.email) account.email = accountFields.email;

    await this.saveAccount(account, AccountError.ActivateAccountFail);
  }

  private async getAccount(
    email: string,
    errorMessage: AccountError
  ): Promise<Account> {
    if (!email) {
      throw new BadRequestError(errorMessage);
    }

    try {
      const accountRepository = AppDataSource.getRepository(Account);
      return await accountRepository.findOneBy({ email });
    } catch {
      throw new BadRequestError(errorMessage);
    }
  }

  private async saveAccount(
    account: Account,
    errorMessage: AccountError
  ): Promise<void> {
    try {
      const accountRepository = AppDataSource.getRepository(Account);
      await accountRepository.save(account);
    } catch {
      throw new BadRequestError(errorMessage);
    }
  }
}
