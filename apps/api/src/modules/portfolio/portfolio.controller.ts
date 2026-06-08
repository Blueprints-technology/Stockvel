import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpsertPortfolioAssetDto } from './dto/upsert-portfolio-asset.dto';
import { PortfolioService } from './portfolio.service';

@ApiTags('Portfolio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  getPortfolio(@CurrentUser() user: AuthenticatedUser) {
    return this.portfolioService.getPortfolio(user.sub);
  }

  @UseGuards(CsrfGuard)
  @Post('add')
  addAsset(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpsertPortfolioAssetDto) {
    return this.portfolioService.addAsset(user.sub, dto);
  }

  @UseGuards(CsrfGuard)
  @Delete('remove/:id')
  removeAsset(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.portfolioService.removeAsset(user.sub, id);
  }
}
