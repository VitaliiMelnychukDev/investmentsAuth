import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole, userRoles } from '../../types/user';
import { PaginationDto } from '../base/pagination.dto';

export class SearchDto extends PaginationDto {
  @IsOptional()
  @IsEnum(userRoles)
  role: UserRole;

  @IsOptional()
  @IsString()
  searchTerm: string;
}
