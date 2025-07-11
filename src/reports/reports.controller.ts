import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('reports')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiResponse({ status: 200, description: 'Percentage of deleted products' })
  @Get('deleted-percentage')
  getDeletedPercentage() {
    return this.reportsService.getDeletedPercentage();
  }

  @ApiResponse({
    status: 200,
    description: 'Percentage of non-deleted products',
  })
  @Get('non-deleted-percentage')
  getNonDeletedPercentage(
    @Query('withPrice') withPrice?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.reportsService.getNonDeletedPercentage({
      withPrice: withPrice === 'true',
      dateFrom,
      dateTo,
    });
  }
  @ApiResponse({
    status: 200,
    description: 'Average price of non-deleted products',
  })
  @Get('average-price')
  getAveragePrice() {
    return this.reportsService.getAveragePrice();
  }
}
