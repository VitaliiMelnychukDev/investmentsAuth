import { UserRole } from '../../types/user';
import { IsEmail, IsIn, IsOptional, Length } from 'class-validator';

const allowedRegisterRoles = [UserRole.User, UserRole.Company, UserRole.Bank];

export class RegisterDto {
  @IsEmail()
  email: string;

  @Length(2, 100)
  name: string;

  @Length(8, 20)
  password: string;

  @IsOptional()
  @IsIn(allowedRegisterRoles)
  role: UserRole;
}
