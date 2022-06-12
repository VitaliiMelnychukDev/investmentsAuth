import { IsEmail, IsEnum } from 'class-validator';
import { AccountRole, accountRoles } from '../../types/account';

export class SetRoleDto {
  @IsEmail()
  email: string;

  @IsEnum(accountRoles)
  role: AccountRole;
}
