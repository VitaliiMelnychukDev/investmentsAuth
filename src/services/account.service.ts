import { Service } from 'typedi';
import { RegisterDto } from '../dtos/auth/register.dto';
import { User } from '../entity/User';
import { IUpdateUser, IUser, UserRole } from '../types/user';
import AppDataSource from '../data-source';
import { HashService } from './hash.service';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { UserError } from '../types/error';
import { SearchDto } from '../dtos/account/search.dto';
import { FindOptionsWhere, Like } from 'typeorm';
import { PaginationService } from './pagination.service';

@Service()
export class AccountService {
  constructor(
    private hashService: HashService,
    private paginationService: PaginationService
  ) {}

  async create(user: RegisterDto): Promise<void> {
    const existedUser: User | null = await this.getUser(
      user.email,
      UserError.CreateUserFail
    );

    if (existedUser) {
      throw new BadRequestError(UserError.UserEmailExists);
    }

    const newUser = new User();
    newUser.role = user.role || UserRole.User;
    newUser.email = user.email;
    newUser.name = user.name;
    newUser.activated = false;
    newUser.password = await this.hashService.hashString(user.password);

    await this.saveUser(newUser, UserError.CreateUserFail);
  }

  async getUsers(searchParams: SearchDto): Promise<IUser[]> {
    const userRepository = AppDataSource.getRepository(User);

    const sharedWhereOptions: FindOptionsWhere<User> = {};
    if (searchParams.role) {
      sharedWhereOptions.role = searchParams.role;
    }

    let whereOptions: FindOptionsWhere<User> | FindOptionsWhere<User>[] = {};
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
      return await userRepository.find({
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
      throw new BadRequestError(UserError.GetUsersFail);
    }
  }

  async updateUser(userEmail: string, userFields: IUpdateUser): Promise<void> {
    const user: User | null = await this.getUser(
      userEmail,
      UserError.ActivateUserFail
    );

    if (!user) {
      throw new NotFoundError(UserError.ActivateUserFail);
    }

    if (userFields.activated) user.activated = userFields.activated;
    if (userFields.password) user.password = userFields.password;
    if (userFields.name) user.name = userFields.name;
    if (userFields.role) user.role = userFields.role;
    if (userFields.email) user.email = userFields.email;

    await this.saveUser(user, UserError.ActivateUserFail);
  }

  async activateUser(userEmail: string): Promise<void> {
    const user: User | null = await this.getUser(
      userEmail,
      UserError.ActivateUserFail
    );

    if (!user) {
      throw new NotFoundError(UserError.ActivateUserFail);
    }

    user.activated = true;

    await this.saveUser(user, UserError.ActivateUserFail);
  }

  async setUserRole(userEmail: string, newRole: UserRole): Promise<void> {
    const user: User | null = await this.getUser(
      userEmail,
      UserError.SetUserRoleFail
    );

    if (!user) {
      throw new NotFoundError(UserError.SetUserRoleFail);
    }

    if (user.role === newRole) return;

    user.role = newRole;

    await this.saveUser(user, UserError.SetUserRoleFail);
  }

  private async getUser(email: string, errorMessage: UserError): Promise<User> {
    if (!email) {
      throw new BadRequestError(errorMessage);
    }

    try {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOneBy({ email });
    } catch {
      throw new BadRequestError(errorMessage);
    }
  }

  private async saveUser(user: User, errorMessage: UserError): Promise<void> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      await userRepository.save(user);
    } catch {
      throw new BadRequestError(errorMessage);
    }
  }
}
