import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ReorderWatchlistDto, WatchlistItemDto } from './dto/update-watchlist.dto';
import { WatchlistService } from './watchlist.service';

@ApiTags('Watchlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  getWatchlist(@CurrentUser() user: AuthenticatedUser) {
    return this.watchlistService.getWatchlist(user.sub);
  }

  @UseGuards(CsrfGuard)
  @Post()
  addItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: WatchlistItemDto) {
    return this.watchlistService.addItem(user.sub, dto);
  }

  @UseGuards(CsrfGuard)
  @Post('reorder')
  reorder(@CurrentUser() user: AuthenticatedUser, @Body() dto: ReorderWatchlistDto) {
    return this.watchlistService.reorder(user.sub, dto);
  }

  @UseGuards(CsrfGuard)
  @Delete()
  removeItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: WatchlistItemDto) {
    return this.watchlistService.removeItem(user.sub, dto);
  }
}
