import { PaginationDto } from '../dtos/base/pagination.dto';
import { IPagination } from '../types/pagination';
import { Service } from 'typedi';

@Service()
export class PaginationService {
  private maxCountPerPage = 20;

  getPaginationParams(basePaginationDto: PaginationDto): IPagination {
    let limit = Number(basePaginationDto.limit) || this.maxCountPerPage;
    if (limit > this.maxCountPerPage) {
      limit = this.maxCountPerPage;
    }

    const skip: number = basePaginationDto.page
      ? (basePaginationDto.page - 1) * limit
      : 0;

    return {
      take: limit,
      skip,
    };
  }
}
