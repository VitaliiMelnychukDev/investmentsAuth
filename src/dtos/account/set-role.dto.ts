import { IsEmail, IsEnum } from 'class-validator';
import { UserRole, userRoles } from '../../types/user';

export class SetRoleDto {
  @IsEmail()
  email: string;

  @IsEnum(userRoles)
  role: UserRole;
}
