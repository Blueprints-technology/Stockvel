import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Public()
  @Get('overview')
  overview() {
    return this.dashboardService.overview();
  }

  @Public()
  @Get('insights')
  insights() {
    return this.dashboardService.insights();
  }
}
