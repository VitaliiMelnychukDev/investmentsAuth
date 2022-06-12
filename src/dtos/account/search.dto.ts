import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountRole, accountRoles } from '../../types/account';
import { PaginationDto } from '../base/pagination.dto';

export class SearchDto extends PaginationDto {
  @IsOptional()
  @IsEnum(accountRoles)
  role: AccountRole;

  @IsOptional()
  @IsString()
  searchTerm: string;
}
